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
        "operatorRewardInETH": "0",
        "depositedSdCollateral": "0",
        "sdCollateralWorthValidators": 0,
        "optedInForSocializingPool": false,
        "operatorELRewardsAddress": "",
        "socializingPoolAddress": "",
        "registered": false,
        "unclaimedSocializingPoolMerkles": [],
        "accountBalances": {
            "eth": "0",
            "sd": "0",
            "ethx": "0"
        },
        "validatorInfos": [],
    },
    fetchNodeStatus: async () => set({ nodeStatus: await staderCommand("node status") })
})