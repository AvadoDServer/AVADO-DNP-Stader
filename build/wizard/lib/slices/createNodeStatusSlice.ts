import { StateCreator } from "zustand";
import { nodeStatusType } from "../../types";
import { staderCommand } from "../staderDaemon"
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
        "operatorRewardInETH": 0n,
        "depositedSdCollateral": 0n,
        "sdCollateralWorthValidators": 0n,
        "registered": false,
        "accountBalances": {
            "eth": 0n,
            "sd": 0n,
            "ethx": 0n
        },
        "validatorInfos": [],
    },
    fetchNodeStatus: async () => set({ nodeStatus: await staderCommand("node status") })
})