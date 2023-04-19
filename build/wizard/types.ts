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
  "operatorRewardInETH": bigint,
  "depositedSdCollateral": bigint,
  "sdCollateralWorthValidators": bigint,
  "registered": boolean,
  "accountBalances": {
    "eth": bigint,
    "sd": bigint,
    "ethx": bigint
  },
  "validatorInfos": ValidatorInfoType[],
}


// https://github.com/stader-labs/stader-node-v1.1/blob/beta/shared/utils/stdr/validator-state.go
// ValidatorState =  map[uint8]string{
// 	0: "Initialized",
// 	1: "Invalid Signature",
// 	2: "Front Run",
// 	3: "Pre Deposit",
// 	4: "Deposited",
// 	5: "In Activation Queue",
// 	6: "Active",
// 	7: "In Exit Queue",
// 	8: "Exited",
// 	9: "Withdrawn",
// }

export type ValidatorInfoType = {
  "Status": number,
  "Pubkey": string,
  "PreDepositSignature": string,
  "DepositSignature": string,
  "WithdrawVaultAddress": string,
  "OperatorId": bigint,
  "InitialBondEth": bigint,
  "DepositTime": bigint,
  "WithdrawnTime": bigint
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