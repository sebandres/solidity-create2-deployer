![GitHub Workflow Status](https://img.shields.io/github/workflow/status/thegostep/solidity-create2-deployer/CI)
![npm](https://img.shields.io/npm/v/solidity-create2-deployer)
![node-current](https://img.shields.io/node/v/solidity-create2-deployer)
![GitHub last commit](https://img.shields.io/github/last-commit/thegostep/solidity-create2-deployer)
![npm](https://img.shields.io/npm/dw/solidity-create2-deployer)
![NPM](https://img.shields.io/npm/l/solidity-create2-deployer)

# Solidity `CREATE2` Deployer

This library is a minimal utility for deploying ethereum contracts at detereministic addresss using `CREATE2`. It allows for contracts to be deployed at the same address on all networks.

[`CREATE2`](https://github.com/ethereum/EIPs/pull/1014) opcode was released in the [Constantinople](https://github.com/paritytech/parity-ethereum/issues/8427) update for Ethereum.

## Deployments

This contract has now been deployed to `0x1E4A178a4B0B24C69ff9D4c5AC81bDdfe2AcF235` in the following networks:

### Mainnets

* Polygon Mainnet

### Testnets

* Ethereum Ropsten
* Polygon Mumbai Testnet
* Avalanche Fuji Testnet
* Binance Smart Chain Testnet
* Fantom Testnet
* Harmony Testnet (Shard 0)
* Huobi ECO Testnet

More will follow.

## Donations welcome!

If you're using any of the deployments, and feel like giving back, donations are accepted in any token on any mainnet to:

```
0x9D3da7768eFCD70b7350018DC3bf1636C5589fC0
```

## Caveats

Contracts deployed using this library need to follow these guidelines:

- `msg.sender` *cannot* be used in the constructor or initializer functions as it will refer to the factory contract.
- `tx.origin` should not bee used in the constructor as the deploy transaction can be front-run.
- In order to produce a deterministic address on all networks, **the salt**, **constructor parameters** and **create2 contract address** must be the same.

## API Documentation

```js
/**
 * Deploy contract using create2.
 *
 * Deploy an arbitrary contract using a create2 factory. Can be used with an ethers provider on any network.
 *
 * @param {Object} args
 * @param {String} args.salt                Salt used to calculate deterministic create2 address.
 * @param {String} args.factory             The pre-deployed create2 contract.
 * @param {String} args.contractBytecode    Compiled bytecode of the contract.
 * @param {Object} args.signer              Ethers.js signer of the account from which to deploy the contract.
 * @param {Array}  [args.constructorTypes]  Array of solidity types of the contract constructor.
 * @param {Array}  [args.constructorArgs]   Array of arguments of the contract constructor.
 *
 * @return {Object} Returns object with `txHash`, `address` and `receipt` from the deployed contract.
 */

/**
 * Calculate create2 address of a contract.
 *
 * Calculates deterministic create2 address locally.
 *
 * @param {Object} args
 * @param {String} args.salt                Salt used to calculate deterministic create2 address.
 * @param {String} args.factoryAddress      The address of the pre-deployed create2 factory.
 * @param {String} args.contractBytecode    Compiled bytecode of the contract.
 * @param {Array}  [args.constructorTypes]  Array of solidity types of the contract constructor.
 * @param {Array}  [args.constructorArgs]   Array of arguments of the contract constructor.
 *
 * @return {String} Returns the address of the create2 contract.
 */

/**
 * Determine if a given contract is deployed.
 *
 * Determines if a given contract is deployed at the address provided.
 *
 * @param {String} address  Address to query.
 * @param {Object} provider Ethers.js provider.
 *
 * @return {Boolean} Returns true if address is a deployed contract.
 */
```

## Development

Install dependencies:

```bash
yarn
```

Test contracts:

```bash
npx hardhart test
```

## Deployment

The Create2 contract can be deployed to any network using the following command line:
```
PRIVATE_KEY=abcd1234... npx hardhat run scripts/migration/0000_deploy_create2_proxy.ts --network xxxx
```
Where network is one of the networks listed in the [hardhat.config.ts](./hardhat.config.ts)

### Tests

Tests can be found [here](./test/).

# Usage



```js
// import
const {
  ethers,
  deployContract,
  getCreate2Address,
  isDeployed
} = require("solidity-create2-deployer");

// declare deployment parameters
const salt = "hello";
const bytecode = "0x...";
const privateKey = "0x...";
const constructorTypes = ["address", "uint256", "..."];
const constructorArgs = ["0x...", "123...", "..."];
const provider = ethers.getDefaultProvider();
const signer = new ethers.Wallet(privateKey, provider);
const factory = new ethers.ContractFactory(factoryAbi, factoryBytecode, signer);
const factoryContract = factory.attach("0x...");

// Calculate contract address
const computedAddress = getCreate2Address({
  salt: salt,
  factoryAddress: factoryContract.address,
  contractBytecode: bytecode,
  constructorTypes: constructorTypes,
  constructorArgs: constructorArgs
});

// Deploy contract
const { txHash, address, receipt } = await deployContract({
  salt: salt,
  factory: factoryContract,
  contractBytecode: bytecode,
  constructorTypes: constructorTypes,
  constructorArgs: constructorArgs,
  signer: signer
});

// Query if contract deployed at address
const success = await isDeployed(address, provider);
```

## Resources

- [EIP 1014: Skinny CREATE2](https://eips.ethereum.org/EIPS/eip-1014)

## Credits

- [@stanislaw-glogowski](https://github.com/stanislaw-glogowski/CREATE2) for initial implementation example
- [@miguelmota](https://github.com/miguelmota/solidity-create2-example) for factory implementation example with web3
- [@thegostep](https://github.com/thegostep/solidity-create2-deployer) several improvements

## License

[MIT](LICENSE)
