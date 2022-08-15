const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function({deployments, getNamedAccounts}) {
    const { deploy, log} = deployments;
    const { deployer} = await getNamedAccounts();
    const args = [];
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`${network.name} 에 배포됨`)
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(basicNft.address, args);
    }
}

module.exports.tags = ["all","basicnft"];