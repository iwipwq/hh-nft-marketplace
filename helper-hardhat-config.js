const { ethers } = require("hardhat");

const networkConfig = {
    4: {
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        entranceFee: ethers.utils.parseEther("0.01"),
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "7276",
        callbackGasLimit: "500000", // 500,000
        interval: "30",
        mintFee: ethers.utils.parseEther("0.01"),
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        entranceFee: ethers.utils.parseEther("0.01"),
        keyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30gwei keyHash
        subscriptionId: "7276",
        callbackGasLimit: "500000",
        interval: "30",
        mintFee: ethers.utils.parseEther("0.01"),
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "localhost",
        entranceFee: ethers.utils.parseEther("0.01"),
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", //모의계약이기때문에 뭐가와도 상관없음(비어있어도 돌아감)
        callbackGasLimit: "500000", // 500,000
        interval: "30",
        mintFee: ethers.utils.parseEther("0.01")
    }
}

const developmentChains = ["hardhat","localhost"];

module.exports = {
    networkConfig,
    developmentChains,
}