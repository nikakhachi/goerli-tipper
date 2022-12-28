import { ethers, waffle } from "hardhat";

const getBalance = async (address: string) => {
  const balanceBigInt = await waffle.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
};

async function main() {
  const [owner, user1, user2] = await ethers.getSigners();

  const TipContract = await ethers.getContractFactory("Tip");
  const tipContract = await TipContract.deploy();

  await tipContract.deployed();

  console.log(`\n\nFaucet Contract deployed to ${tipContract.address}`);

  console.log(`Owner Balance: ${await getBalance(owner.address)}`);
  console.log(`User1 Balance: ${await getBalance(user1.address)}`);
  console.log(`User2 Balance: ${await getBalance(user2.address)}`);
  console.log(`Contract Balance: ${await getBalance(tipContract.address)}`);

  console.log(ethers.utils.parseEther("1"));

  console.log(`Tipping..`);
  await tipContract.connect(user1).giveTip("Here's the tip from user1 :)", { value: ethers.utils.parseEther("1") });
  await tipContract.connect(user2).giveTip("user2 is your best friend", { value: ethers.utils.parseEther("2") });

  console.log(`Owner Balance: ${await getBalance(owner.address)}`);
  console.log(`User1 Balance: ${await getBalance(user1.address)}`);
  console.log(`User2 Balance: ${await getBalance(user2.address)}`);
  console.log(`Contract Balance: ${await getBalance(tipContract.address)}`);

  console.log(`Withdrawing Tips..`);
  await tipContract.withdrawTips();

  console.log(`Owner Balance: ${await getBalance(owner.address)}`);
  console.log(`User1 Balance: ${await getBalance(user1.address)}`);
  console.log(`User2 Balance: ${await getBalance(user2.address)}`);
  console.log(`Contract Balance: ${await getBalance(tipContract.address)}`);

  console.log(`Getting Memos..`);
  const memos = await tipContract.getMemos();
  for (const memo of memos) {
    console.log(`At ${memo.timestamp}, (${memo.from}) Tipped ${ethers.utils.formatEther(memo.amount)} ETH : ${memo.message}`);
  }

  console.log("\n\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
