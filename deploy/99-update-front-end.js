const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractsFile =
  "../nextjs-nft-marketplace/constants/networkMapping.json";
const frontEndAbi = "../nextjs-nft-marketplace/constants/";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("프론트엔드를 업데이트 하고 있습니다 ...");
    await updateContractAddresses();
    await updateAbi();
  }
};

async function updateAbi() {
  const nftMarketpalce = await ethers.getContract("NftMarketplace");
  fs.writeFileSync(
    `${frontEndAbi}NftMarketplace.json`,
    nftMarketpalce.interface.format(ethers.utils.FormatTypes.json)
  );
  const basicNft = await ethers.getContract("BasicNft");
  fs.writeFileSync(
    `${frontEndAbi}BasicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const chainId = network.config.chainId;
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["nftMarketplace"].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]["nftMarketplace"].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = { nftMarketplace: [nftMarketplace.address] };
  }
  fs.writeFileSync(
    frontEndContractsFile,
    JSON.stringify(contractAddresses, "utf8")
  );
}

module.exports.tags = ["all", "frontend"];
