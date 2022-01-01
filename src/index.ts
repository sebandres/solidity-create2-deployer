import assert from 'assert'
import { Contract, ethers, Signer } from 'ethers'
import { Provider, TransactionReceipt } from '@ethersproject/providers'

import {
  buildCreate2Address,
  buildBytecode,
  parseEvents,
  saltToHex,
} from './utils'

/**
 * Deploy contract using create2.
 *
 * Deploy an arbitrary contract using a create2 factory. Can be used with an ethers provider on any network.
 *
 */
export async function deployContract({
  salt,
  factory,
  contractBytecode,
  constructorTypes = [] as string[],
  constructorArgs = [] as any[],
  signer,
}: {
  salt: string | number
  factory: Contract
  contractBytecode: string
  constructorTypes?: string[]
  constructorArgs?: any[]
  signer: Signer
}) {
  const saltHex = saltToHex(salt)

  const bytecode = buildBytecode(
    constructorTypes,
    constructorArgs,
    contractBytecode,
  )

  const result = await (await factory.deploy(bytecode, saltHex)).wait()

  const computedAddr = buildCreate2Address(factory.address, saltHex, bytecode)

  const logs = parseEvents(result, factory.interface, 'Deployed')

  const addr = logs[0].args.addr.toLowerCase()
  assert.strictEqual(addr, computedAddr)

  return {
    txHash: result.transactionHash as string,
    address: addr as string,
    receipt: result as TransactionReceipt,
  }
}

/**
 * Calculate create2 address of a contract.
 *
 * Calculates deterministic create2 address locally.
 *
 */
export function getCreate2Address({
  salt,
  factoryAddress,
  contractBytecode,
  constructorTypes = [] as string[],
  constructorArgs = [] as any[],
}: {
  salt: string | number
  factoryAddress: string
  contractBytecode: string
  constructorTypes?: string[]
  constructorArgs?: any[]
}) {
  return buildCreate2Address(
    factoryAddress,
    saltToHex(salt),
    buildBytecode(constructorTypes, constructorArgs, contractBytecode),
  )
}

/**
 * Determine if a given contract is deployed.
 *
 * Determines if a given contract is deployed at the address provided.
 *
 */
export async function isDeployed(address: string, provider: Provider) {
  const code = await provider.getCode(address)
  return code.slice(2).length > 0
}