const { ethers, network } = require("hardhat");
const { moveBlock } = require("../utils/move-blocks");

const TOKEN_ID = 0;

async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicNft = await ethers.getContract("BasicNft");
    const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID) //nftAddress, tokenId
    await tx.wait(1);
    console.log("NFT 판매 취소됨");
    if(network.config.chainId == "31337") {
        await moveBlock(2, sleepAmount = 1000);
    }
}

cancel()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
