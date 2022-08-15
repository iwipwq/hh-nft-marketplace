const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({deployments, getNamedAccounts}) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [];
    const nftMarketPlace = await deploy("NftMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`${network.name} 체인에 배포되었습니다.`)
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(nftMarketPlace.address, args);
    }
}

module.exports.tags = ["all", "nftmarketplace"];