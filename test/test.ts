import { ethers } from 'hardhat'
import { Contract, ContractFactory, Signer } from 'ethers'
import { assert } from 'chai'

import {
  deployContract,
  getCreate2Address,
  isDeployed,
} from '../src/index'
import { factoryAbi, factoryBytecode } from '../src/factory'

describe('Happy Path', function () {
  let signer: Signer
  let accountContractFactory: ContractFactory
  let factoryContract: Contract

  before(async () => {
    signer = (await ethers.getSigners())[0];
    accountContractFactory = await ethers.getContractFactory('Account');

    var proxy = new ethers.ContractFactory(factoryAbi, factoryBytecode, signer);
    factoryContract = await proxy.deploy();
    // Wait for the transaction to be mined so we can get the actual contract that was created
    await factoryContract.deployTransaction.wait();
  })

  it('should deploy factory', async function () {
    var proxy = new ethers.ContractFactory(factoryAbi, factoryBytecode, signer);
    var deployedProxy = await proxy.deploy();
    // Wait for the transaction to be mined so we can get the actual contract that was created
    await deployedProxy.deployTransaction.wait();
  })

  it('should deploy a working contract', async function () {    
    const salt = 'owner'

    const result = await deployContract({
      salt,
      factory: factoryContract,
      contractBytecode: accountContractFactory.bytecode,
      constructorTypes: ['address'],
      constructorArgs: ['0x303de46de694cC75A2F66dA93Ac86c6a6EeE607e']
    });

    const accountContract = accountContractFactory.attach(result.address);
    assert(
      (await accountContract.owner()) === '0x303de46de694cC75A2F66dA93Ac86c6a6EeE607e',
      'Owner is not the expcted one'
    );

  })

  it('should deploy with string salt', async function () {
    const salt = 'hello'

    const computedAddr = getCreate2Address({      
      salt,
      factoryAddress: factoryContract.address,
      contractBytecode: accountContractFactory.bytecode,
      constructorTypes: ['address'],
      constructorArgs: ['0x303de46de694cc75a2f66da93ac86c6a6eee607e'],
    });

    assert(
      !(await isDeployed(computedAddr, ethers.provider)),
      'contract already deployed at this address',
    );

    const result = await deployContract({
      salt,
      factory: factoryContract,
      contractBytecode: accountContractFactory.bytecode,
      constructorTypes: ['address'],
      constructorArgs: ['0x303de46de694cc75a2f66da93ac86c6a6eee607e']
    });

    assert(
      await isDeployed(computedAddr, ethers.provider),
      'contract not deployed at this address',
    );
  })

  it('should deploy with number salt', async function () {
    const salt = 1234

    const computedAddr = getCreate2Address({
      salt,
      factoryAddress: factoryContract.address,
      contractBytecode: accountContractFactory.bytecode,
      constructorTypes: ['address'],
      constructorArgs: ['0x303de46de694cc75a2f66da93ac86c6a6eee607e'],
    });

    assert(
      !(await isDeployed(computedAddr, ethers.provider)),
      'contract already deployed at this address',
    );

    const result = await deployContract({
      salt,
      factory: factoryContract,
      contractBytecode: accountContractFactory.bytecode,
      constructorTypes: ['address'],
      constructorArgs: ['0x303de46de694cc75a2f66da93ac86c6a6eee607e']
    });
    assert(
        result.receipt.status === 1,
        'Deployment wasn\'t successful'
    );
    assert(
      await isDeployed(computedAddr, ethers.provider),
      'contract not deployed at this address',
    );
  })
})
