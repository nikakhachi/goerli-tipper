import { ethers } from "hardhat";

async function main() {
  const TipContract = await ethers.getContractFactory("Tip");
  const tipContract = await TipContract.deploy();

  await tipContract.deployed();

  console.log(`\n\nTip Contract deployed to ${tipContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
