const { moveBlock } = require("../utils/move-blocks");

//default 2 , 1000
const amount = 2;
const sleepAmount = 1000;

async function mine() {
      console.log(`이동할 블럭 수: ${amount} 대기시간: ${sleepAmount} ms`)
      await moveBlock(amount, sleepAmount);
      console.log(`새 블럭을 캤어요`);
}

mine()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
