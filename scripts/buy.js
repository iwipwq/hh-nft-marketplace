const { ethers, network } = require("hardhat");
const { moveBlock, sleep } = require("../utils/move-blocks");

const TOKEN_ID = 1;

async function buy() {
  const nftMarketpalce = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");
  const listing = await nftMarketpalce.getListing(basicNft.address, TOKEN_ID) //getListing(address nftAddress, uint256 tokenId)
  const price = listing.price.toString();
  const tx = await nftMarketpalce.buyItem(basicNft.address, TOKEN_ID, {value: price}); //function buyItem(address nftAddress, uint256 tokenId)
  await tx.wait(1);
  console.log("아이템이 구매되었습니다.");
  if (network.config.chainId == 31337) {
    await moveBlock(2, (sleepAmount = 1000));
  }
}

buy()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
