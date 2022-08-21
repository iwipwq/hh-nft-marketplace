const { network } = require("hardhat")

function sleep(timeInMs) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve,timeInMs)
    })
}

async function moveBlock(amount, sleepAmount = 0) {
    console.log("블럭 옮기는 중 ... ")
    for(let i=0; i < amount; i++) {
        await network.provider.request({
            method:"evm_mine",
            params:[],
        })
        if(sleepAmount) {
            console.log(`${sleepAmount} ms 만큼 대기합니다 ...`);
            await sleep(sleepAmount);
        }
    }
}

module.exports = {
    moveBlock,
    sleep
}
