import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { TransactionReceipt, Provider } from '@ethersproject/providers'

export const buildBytecode = (
  constructorTypes: any[],
  constructorArgs: any[],
  contractBytecode: string,
) =>
  `${contractBytecode}${encodeParams(constructorTypes, constructorArgs).slice(
    2,
  )}`

export const buildCreate2Address = (factoryAddress: string, saltHex: string, byteCode: string) => {
  return `0x${ethers.utils
    .keccak256(
      `0x${['ff', factoryAddress, saltHex, ethers.utils.keccak256(byteCode)]
        .map((x) => x.replace(/0x/, ''))
        .join('')}`,
    )
    .slice(-40)}`.toLowerCase()
}

export const numberToUint256 = (value: number) => {
  const hex = value.toString(16)
  return `0x${'0'.repeat(64 - hex.length)}${hex}`
}

export const saltToHex = (salt: string | number) =>
  ethers.utils.id(salt.toString())

export const encodeParam = (dataType: any, data: any) => {
  const abiCoder = ethers.utils.defaultAbiCoder
  return abiCoder.encode([dataType], [data])
}

export const encodeParams = (dataTypes: any[], data: any[]) => {
  const abiCoder = ethers.utils.defaultAbiCoder
  return abiCoder.encode(dataTypes, data)
}

export const isContract = async (address: string, provider: Provider) => {
  const code = await provider.getCode(address)
  return code.slice(2).length > 0
}

export const parseEvents = (
  receipt: TransactionReceipt,
  contractInterface: Interface,
  eventName: string,
) =>
  receipt.logs
    .map((log) => contractInterface.parseLog(log))
    .filter((log) => log.name === eventName)
