import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import 'hardhat-abi-exporter';
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1500,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
        url: "https://polygon-rpc.com/",
        accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygontest: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    avalanchetest: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fantom: {
      url: "https://rpc.ftm.tools/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fantomtest: {
      url: "https://rpc.testnet.fantom.network/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    harmonytest: {
      url: `https://api.s0.b.hmny.io`,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
    harmony: {
      url: `https://api.harmony.one`,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
    hecotest: {
      url: `https://http-testnet.hecochain.com`,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [`${process.env.PRIVATE_KEY}`] : [],
    },
    heco: {
      url: `https://http-mainnet.hecochain.com`,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [`${process.env.PRIVATE_KEY}`] : [],
    },
    celotest: {
      url: `https://alfajores-forno.celo-testnet.org`,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [`${process.env.PRIVATE_KEY}`] : [],
    },
    celo: {
      url: `https://forno.celo.org`,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [`${process.env.PRIVATE_KEY}`] : [],
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
