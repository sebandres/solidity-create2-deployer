// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { factoryAbi, factoryBytecode } from "../../src/factory";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let wallet = new Wallet(process.env.PRIVATE_KEY as any, ethers.provider);

  console.log("Deployer:", wallet.address);
  var proxy = new ethers.ContractFactory(factoryAbi, factoryBytecode, wallet);
  var deployedProxy = await proxy.deploy();
  // Wait for the transaction to be mined so we can get the actual contract that was created
  await deployedProxy.deployTransaction.wait();
  var transaction = await ethers.provider.getTransactionReceipt(deployedProxy.deployTransaction.hash);
  console.log('Create2 Deployer address:',  transaction.contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
