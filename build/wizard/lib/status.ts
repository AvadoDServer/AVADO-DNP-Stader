import { create } from 'zustand'
import { createNodeSyncProgressSlice, NodeSyncProgressSlice } from './slices/createNodeSyncStatusSlice'
import { createNodeStatusSlice, NodeStatusSlice } from './slices/createNodeStatusSlice'

type StatusState = NodeSyncProgressSlice & NodeStatusSlice

export const useStaderStatus = create<StatusState>()((...a) => ({
    ...createNodeSyncProgressSlice(...a),
    ...createNodeStatusSlice(...a),
}))