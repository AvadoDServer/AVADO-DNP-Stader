import { Address } from "wagmi"

export type networkType = "prater" | "mainnet"

export type consusClientType = "teku" | "prysm"

// https://github.com/stader-labs/stader-node-v1.1/blob/beta/shared/types/api/node.go
export type nodeStatusType = {
  "status": "success" | "error",
  "error": string,
  "numberOfValidatorsRegistered": number,
  "accountAddress": string,
  "accountAddressFormatted": string,
  "operatorId": number,
  "operatorName": string,
  "operatorRewardAddress": string,
  "operatorRewardInETH": string, //bigint
  "depositedSdCollateral": string, //bigint
  "sdCollateralWorthValidators": number,
  "registered": boolean,
  "accountBalances": {
    "eth": string, //bigint
    "sd": string, //bigint
    "ethx": string, //bigint
  },
  "validatorInfos": ValidatorInfoType[],
}


// https://github.com/stader-labs/stader-node-v1.1/blob/beta/shared/utils/stdr/validator-state.go
export const ValidatorStates = [
  "Initialized", //0
  "Invalid Signature", //1
  "Front Run", //2
  "Pre Deposit",
  "Deposited",
  "In Activation Queue",
  "Active",
  "In Exit Queue",
  "Exited",
  "Withdrawn", //9
]

export type ValidatorInfoType = {
  "Status": number,
  "Pubkey": string,
  "PreDepositSignature": string,
  "DepositSignature": string,
  "WithdrawVaultAddress": string,
  "OperatorId": string, //bigint
  "InitialBondEth": string, //bigint
  "DepositTime": string, //bigint
  "WithdrawnTime": string, //bigint
}

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/node.go#L278
export interface nodeSyncProgressResponseType {
  "status": "success" | "error",
  "error": string,
  "ecStatus": ClientManagerStatusType,
  "bcStatus": ClientManagerStatusType
}
export interface ClientManagerStatusType {
  "primaryEcStatus": ClientStatusType,
  "fallbackEnabled": boolean,
  "fallbackEcStatus": ClientStatusType
}
export interface ClientStatusType {
  "isWorking": boolean
  "isSynced": boolean
  "syncProgress": number,
  "networkId": number
  "error": string
}

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/network.go#L9
export type nodeFeeType = {
  "status": string,
  "error": string,
  "nodeFee": number
  "minNodeFee": number
  "targetNodeFee": number
  "maxNodeFee": number
}

// https://github.com/stader-labs/stader-node-v1.1/blob/beta/shared/types/api/wallet.go
export interface walletStatusType {
  status: "success" | "error",
  error: string,
  passwordSet: boolean,
  walletInitialized: boolean,
  accountAddress: string
}

export interface contractsInfoType {
  status: "success" | "error",
  error: string,
  network: number,
  beaconDepositContract: Address,
  beaconNetwork: number,
  permissionlessNodeRegistry: Address,
  vaultFactory: Address,
  ethxToken: Address,
  sdToken: Address,
  sdCollateralContract: Address
}

export type ecClientType = { name: string, url: string }
export type bcClientType = { name: string, url: string, api: string }

export interface serverStatusType {
  ecClients: ecClientType[],
  bcClients: bcClientType[],
  network: networkType
}