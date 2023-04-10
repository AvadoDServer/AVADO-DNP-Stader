export type networkType = "prater" | "mainnet"

export type consusClientType = "teku" | "prysm"

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/minipool.go
export type minipoolStatusType = {
  "status": "success" | "error",
  "error": string,
  "minipools": MinipoolDetailsType[],
  "latestDelegate": string,
  "isAtlasDeployed": boolean
}

export type MinipoolDetailsType = {
  "address": string,
  "validatorPubkey": string,
  "status": minipoolStatusDetailsType,
  "depositType": string,
  "node": NodeDetailsType,
  "user": UserDetailsType,
  "balances": balancesDetailType,
  "validator": validatorDetailsType,
  "canStake": boolean,
  // queue
  "refundAvailable": boolean,
  "withdrawalAvailable": boolean,
  "closeAvailable": boolean,
  "finalised": boolean,
  "useLatestDelegate": boolean,
  "delegate": string,
  "previousDelegate": string,
  "effectiveDelegate": string,
  "timeUntilDissolve": number,
  "penalties": number,
  "reduceBondTime": any,
  "reduceBondCancelled": boolean
}
export type minipoolStatusDetailsType = {
  "status": string,
  "statusBlock": number,
  "statusTime": string
}
export type NodeDetailsType = {
  "address": string,
  "fee": number,
  "depositBalance": number,
  "refundBalance": number,
  "depositAssigned": boolean
}
export type UserDetailsType = {
  "depositBalance": number,
  "depositAssigned": boolean,
  "depositAssignedTime": string
}
export type balancesDetailType = {
  "eth": number,
  "reth": number,
  "rpl": number,
  "fixedSupplyRpl": number
}
export type validatorDetailsType = {
  "exists": boolean,
  "active": boolean,
  "index": number,
  "balance": number,
  "nodeBalance": number
}

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
  "operatorRewardInETH": BigInt,
  "depositedSdCollateral": BigInt,
  "sdCollateralWorthValidators": BigInt,
  "registered": boolean,
  "accountBalances": {
    "eth": BigInt,
    "sd": BigInt,
    "ethx": BigInt
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
  "OperatorId": BigInt,
  "InitialBondEth": BigInt,
  "DepositTime": BigInt,
  "WithdrawnTime": BigInt
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

// https://github.com/rocket-pool/smartnode/blob/master/shared/types/api/network.go#L18
export type rplPriceDataType = {
  "status": string,
  "error": string,
  "rplPrice": bigint,
  "rplPriceBlock": number
  "minPer8EthMinipoolRplStake": bigint,
  "maxPer8EthMinipoolRplStake": bigint,
  "minPer16EthMinipoolRplStake": bigint,
  "maxPer16EthMinipoolRplStake": bigint
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