const { ethers, network } = require("hardhat");
const { moveBlock, sleep} = require("../utils/move-blocks")


async function mintAndList() {
  const PRICE = ethers.utils.parseEther("0.1");
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");
  console.log("발행중...");
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  console.log(mintTxReceipt);
  const mintGasUsed = mintTxReceipt.gasUsed
  const mintGasPrice = mintTxReceipt.effectiveGasPrice
  console.log(mintTxReceipt.gasUsed.toString());
  console.log(mintTxReceipt.effectiveGasPrice.toString());
  console.log("민팅가스요금",mintGasPrice.mul(mintGasUsed).toString());
  const tokenId = mintTxReceipt.events[0].args.tokenId;
  console.log("NFT 승인중...");

  const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approvalTx.wait(1);
  console.log("NFT 마켓에 등록중...");
  const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);
  const txReceipt = await tx.wait(1);
  console.log(txReceipt);
  const gasUsed = txReceipt.gasUsed
  const gasPrice = txReceipt.effectiveGasPrice
  console.log(gasUsed.toString())
  console.log(gasPrice.toString())
  console.log("리스팅가스요금",(gasUsed.mul(gasPrice)).toString())
  console.log("등록되었습니다.");

  if (network.config.chainId == "31337") {
    await moveBlock(1, (sleepAmount = 1000))
  }
}

mintAndList()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
