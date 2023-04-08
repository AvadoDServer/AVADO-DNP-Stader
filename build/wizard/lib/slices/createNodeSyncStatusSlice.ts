import { StateCreator } from "zustand";
import { nodeSyncProgressResponseType } from "../../types";
import { server_config } from "../../server_config";

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

    fetchNodeSyncProgressStatus: async () => {
        const response = await window.fetch(`${server_config.monitor_url}/rpd`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                command: "node sync"
            }),
        })

        const result = await response.json()
        console.log("result", result)

        set({ nodeSyncProgressStatus: JSON.parse(result) })

    },
})