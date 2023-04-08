import { StateCreator } from "zustand";
import { nodeStatusType } from "../../types";
import { server_config } from "../../server_config";

export interface NodeStatusSlice {
    nodeStatus: nodeStatusType;
    fetchNodeStatus: () => void;
}

export const createNodeStatusSlice: StateCreator<NodeStatusSlice> = (set) => ({
    nodeStatus: {
        "status": "success",
        "error": "",
        "numberOfValidatorsRegistered": 0,
        "accountAddress": "",
        "accountAddressFormatted": "",
        "operatorId": 0,
        "operatorName": "",
        "operatorRewardAddress": "",
        "operatorRewardInETH": BigInt(0),
        "depositedSdCollateral": BigInt(0),
        "sdCollateralWorthValidators": BigInt(0),
        "registered": false,
        "accountBalances": {
            "eth": BigInt(0),
            "sd": BigInt(0),
            "ethx": BigInt(0)
        },
        "validatorInfos": [],
    }
    ,
    fetchNodeStatus: async () => {
        console.log("Fetching node status")
        const response = await window.fetch(`${server_config.monitor_url}/rpd`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                command: "node status"
            }),
        })
        const result = await response.json()

        set({ nodeStatus: JSON.parse(result) })
    },
})