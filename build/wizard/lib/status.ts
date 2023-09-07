import { create } from 'zustand'
import { createNodeSyncProgressSlice, NodeSyncProgressSlice } from './slices/createNodeSyncStatusSlice'
import { createNodeStatusSlice, NodeStatusSlice } from './slices/createNodeStatusSlice'
import { createWalletStatusSlice, WalletStatusSlice } from './slices/createWalletStatusSlice'
import { createContractsInfoSlice, ContractsInfoSlice } from './slices/createContractsInfoSlice'
import { createAllowanceSlice, AllowanceSlice } from './slices/createAllowanceSlice'
import { createCanClaimSpRewardsSlice,CanClaimSpRewardsSlice } from './slices/createCanClaimSpRewardsSlice'
import { createCanClaimRewardsSlice,CanClaimRewardsSlice } from './slices/createCanClaimRewardsSlice'

type StatusState = NodeSyncProgressSlice & NodeStatusSlice & WalletStatusSlice & ContractsInfoSlice & AllowanceSlice & CanClaimSpRewardsSlice & CanClaimRewardsSlice

export const useStaderStatus = create<StatusState>()((...a) => ({
    ...createNodeSyncProgressSlice(...a),
    ...createNodeStatusSlice(...a),
    ...createWalletStatusSlice(...a),
    ...createContractsInfoSlice(...a),
    ...createAllowanceSlice(...a),
    ...createCanClaimSpRewardsSlice(...a),
    ...createCanClaimRewardsSlice(...a),
}))
