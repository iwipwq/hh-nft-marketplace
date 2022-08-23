const { ethers } = require("hardhat");

async function getter() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicNft = await ethers.getContract("BasicNft");
    const TOKEN_ID = 0;
    console.log("basicNft 주소",basicNft.address)
    console.log("nftMarketplace 주소",nftMarketplace.address)
    const listing0 = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
    const listing1 = await nftMarketplace.getListing(basicNft.address, 1);
    const listing2 = await nftMarketplace.getListing(basicNft.address, 2);
    const listing3 = await nftMarketplace.getListing(basicNft.address, 3);
    console.log(listing0.toString());
    console.log(listing1.toString());
    console.log(listing2.toString());
    console.log(listing3.toString());
}

getter()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
