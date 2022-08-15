const { assert, expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nft Marketplace test", function () {
    let nftMarketplace, basicNft, deployer, user;
    const PRICE = ethers.utils.parseEther("0.1");
    const TOKEN_ID = 0;
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        accounts = await ethers.getSigners();
        // user = (await getNamedAccounts()).user;
        user = accounts[1];
        await deployments.fixture(["all"]);
        nftMarketplace = await ethers.getContract("NftMarketplace");
        basicNft = await ethers.getContract("BasicNft");
        await basicNft.mintNft();
        await basicNft.approve(nftMarketplace.address, TOKEN_ID);
    })

    it("리스트에 등록 후 구매 가능", async function () {
        await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
        const userConnectedNftMarketplace = nftMarketplace.connect(user);
        await userConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {value: PRICE});
        // function buyItem(address nftAddress, uint256 tokenId)
        const newOwner = await basicNft.ownerOf(TOKEN_ID);
        const deployerProceeds = await nftMarketplace.getProceeds(deployer);
        assert(newOwner.toString() == user.address);
        assert(deployerProceeds.toString() == PRICE.toString());
    })
    describe("listItem", function() {
        it("price가 0이거나 0보다 작을때 revert", async function() {
            await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, 0)).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero()");
        })
        it("NFT 소유자가 아닌사람이 등록하려할때 revert", async function() {
            const userConnectedMarketplace = nftMarketplace.connect(user);
            const nonApporvedNftListing = userConnectedMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
            await expect(nonApporvedNftListing).to.be.revertedWith("NftMarketplace__NotOwner()");
        })
        it("거래가 승인(Approve) 되지 않은 NFT일때 revert", async function() {
            // ERC721.sol _burn() 메소드 참조 - 빈주소에 승인해버리기
            const addressZero = ethers.constants.AddressZero;
            await basicNft.approve(addressZero, TOKEN_ID);
            const nonApporvedNftListing = nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
            await expect(nonApporvedNftListing).to.be.revertedWith("NftMarketplace__NotApprovedForMarketplace()");
        })
        it("이미 등록된 NFT일때 notListed 모디파이어에서 NftMarketplace__AlreadyListed(nftAddress, tokenId)와 함께 revert", async function() {
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
            await expect(nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith(`NftMarketplace__AlreadyListed("${basicNft.address}", ${TOKEN_ID})`)
        })
    })
    describe("buyItem", function() {
        it("보내는 금액이 가격보다 적을 경우 revert", async function () {
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
            const userConnectedNftMarketplace = nftMarketplace.connect(user);
            const notEnoughPrice = ethers.utils.parseEther("0.05");
            const sendValueLessThanPrice = userConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {value: notEnoughPrice});
            await expect(sendValueLessThanPrice).to.be.revertedWith(`NftMarketplace__PriceNotMet("${basicNft.address}", ${TOKEN_ID}, ${PRICE})`)
        })
        it("장터에 등록되지 않은 NFT를 사려할때 isListed 모디파이어에서 revert", async function() {
            const userConnectedNftMarketplace = nftMarketplace.connect(user);
            const buyingNonListedItem = userConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID);
            await expect(buyingNonListedItem).to.be.revertedWith(`NftMarketplace__NotListed("${basicNft.address}", ${TOKEN_ID})`)
        })
    })
    describe("cancelListing", function() {
        it("리스트 등록 취소", async function () {
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
            await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
            const {price, seller} = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
            console.log(price.toString());
            console.log(seller.toString());
            console.log(price); // BigNumber { _hex: '0x00', _isBigNumber: true }
            console.log(seller); // 0x0000000000000000000000000000000000000000
            console.log(parseInt(price)); // 0
            console.log(parseInt(seller, 16)); // 0
            console.log(parseInt(seller)); // 0
            assert(price == 0);
            assert(seller == 0);
            assert.equal(price, 0);
            assert.equal(seller, 0);
        })
    })
    describe("updateListing", function() {
        it("Listing.price가 newPrice로 업데이트 됨", async function () {
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
            const {price: startPrice} = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
            assert(startPrice.toString() == PRICE.toString());

            const newPrice = ethers.utils.parseEther("0.2");
            await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice);
            const {price: endingPrice} = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
            assert(endingPrice.toString() == newPrice.toString());
            assert.equal(endingPrice.toString(), newPrice.toString());
        })
    })
    describe("withdrawProceeds", function() {
        it("NFT를 판매한 수익 인출하기", async function () {
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
            const deployerSigner = await ethers.getSigner(deployer);
            const deployerStartingBalance = await deployerSigner.getBalance();
            const buyerConnectedNftMarketpalce = nftMarketplace.connect(user);
            await buyerConnectedNftMarketpalce.buyItem(basicNft.address, TOKEN_ID, {value: PRICE});
            const sellerProceed = await nftMarketplace.getProceeds(deployer);
            console.log(sellerProceed.toString());
            // console.log(sellerProceed);
            // console.log(parseInt(sellerProceed));
            // console.log(parseInt(PRICE));
            assert(parseInt(sellerProceed) == parseInt(PRICE));
            const tx = await nftMarketplace.withdrawProceeds();
            const txReceipt = await tx.wait(1);
            // console.log(txReceipt);
            const { gasUsed,cumulativeGasUsed,effectiveGasPrice} = txReceipt;
            console.log(gasUsed.toString()) // 28747
            console.log(cumulativeGasUsed.toString()) // 28747
            console.log(effectiveGasPrice.toString()) // 1406605605
            // 1406605605 * 28747 = 40435691326935
            const gasPrice = cumulativeGasUsed.mul(effectiveGasPrice);
            expect((await nftMarketplace.getProceeds(deployer)).toString()).to.equal("0")
            const deployerEndingBalance = await deployerSigner.getBalance();
            console.log(deployerStartingBalance.toString());
            assert.equal(deployerEndingBalance.toString(), deployerStartingBalance.add(PRICE).sub(gasPrice).toString());
            // expected '10000093485271577358426' to equal '10000093525707268685361' 
            // gas 0.000040435691028480 ether, 40435691028480 gwei
            //     0.100000000000000000
            // BigNumber로 계산하는것과 자바스크립트 숫자로 계산하는것과 차이가 있음,
            // BigNumber로 계산해야 정확히 나옴
            // 40435691326935(big) : 40435691028480 (js)
        })
        it("수익이 없을때 NftMarketplace__NoProceeds()와 함께 revert", async function() {
            await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith("NftMarketplace__NoProceeds()");
        })
    })
  });
