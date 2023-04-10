import { StateCreator } from "zustand";
import { nodeSyncProgressResponseType } from "../../types";
import { staderCommand } from "../staderDaemon"

export interface NodeSyncProgressSlice {
    nodeSyncProgressStatus: nodeSyncProgressResponseType;
    fetchNodeSyncProgressStatus: () => void;
}

export const createNodeSyncProgressSlice: StateCreator<NodeSyncProgressSlice> = (set) => ({
    nodeSyncProgressStatus: {
        status: "success",
        error: "",
        ecStatus: {
            primaryEcStatus: {
                isWorking: true,
                isSynced: true,
                syncProgress: 1,
                networkId: 1,
                error: ""
            },
            fallbackEnabled: false,
            fallbackEcStatus: {
                isWorking: false,
                isSynced: false,
                syncProgress: 0,
                networkId: 0,
                error: ""
            }
        },
        bcStatus: {
            primaryEcStatus:
            {
                isWorking: true,
                isSynced: true,
                syncProgress: 1,
                networkId: 0,
                error: ""
            },
            fallbackEnabled: false,
            fallbackEcStatus:
            {
                isWorking: false,
                isSynced: false,
                syncProgress: 0,
                networkId: 0,
                error: ""
            }
        }
    },

    fetchNodeSyncProgressStatus: async () => set({ nodeSyncProgressStatus: await staderCommand("node sync") })
})