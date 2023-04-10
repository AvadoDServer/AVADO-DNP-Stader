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
    },
    fetchNodeStatus: async () => set({ nodeStatus: await staderCommand("node status") })
})