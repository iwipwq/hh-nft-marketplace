const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractsFile = "../nextjs-nft-marketplace/constants/networkMapping.json"

module.exports = async function() {
    if(process.env.UPDATE_FRONT_END) {
        console.log("프론트엔드를 업데이트 하고 있습니다 ...");
        await updateContractAddresses();
    }
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const chainId = network.config.chainId;
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile,"utf8"));
    if(chainId in contractAddresses) {
        if(!contractAddresses[chainId]["nftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["nftMarketplace"].push(nftMarketplace.address);
        }
    } else {
        contractAddresses[chainId] = {"nftMarketplace": [nftMarketplace.address]};
    }
    fs.writeFileSync(frontEndContractsFile,JSON.stringify(contractAddresses,"utf8"));
}

module.exports.tags = ["all", "frontend"];