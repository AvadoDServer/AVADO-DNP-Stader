import { create } from 'zustand'
import { createNodeSyncProgressSlice, NodeSyncProgressSlice } from './slices/createNodeSyncStatusSlice'
import { createNodeStatusSlice, NodeStatusSlice } from './slices/createNodeStatusSlice'
import { createWalletStatusSlice, WalletStatusSlice } from './slices/createWalletStatusSlice'

type StatusState = NodeSyncProgressSlice & NodeStatusSlice & WalletStatusSlice

export const useStaderStatus = create<StatusState>()((...a) => ({
    ...createNodeSyncProgressSlice(...a),
    ...createNodeStatusSlice(...a),
    ...createWalletStatusSlice(...a),
}))