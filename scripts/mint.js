const { ethers, network } = require("hardhat");
const { moveBlock } = require("../utils/move-blocks");

async function mint() {
    const basicNft = await ethers.getContract("BasicNft");
    // function mintNft() public returns (uint256) {
    //     _safeMint(msg.sender, s_tokenCounter);
    //     emit FlyMinted(s_tokenCounter);
    //     s_tokenCounter = s_tokenCounter + 1;
    //     return s_tokenCounter;
    // }
    console.log("민팅중 ... ")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log("Token ID: ", tokenId.toString());
    console.log("NFT Address:", basicNft.address)
    console.log("민팅이 완료되었습니다.")

    if(network.config.chainId == "31337") {
        moveBlock(2, sleepAmount = 1000);
    }
}

mint()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
