import { StateCreator } from "zustand";
import { canClaimSpRewardsType } from "../../types";
import { staderCommand } from "../staderDaemon"

export interface CanClaimSpRewardsSlice {
    canClaimSpRewards: canClaimSpRewardsType;
    fetchCanClaimSpRewards: () => void;
}

export const createCanClaimSpRewardsSlice: StateCreator<CanClaimSpRewardsSlice> = (set) => ({
    canClaimSpRewards: {
        status: "success",
        error: "",
        socializingPoolContractPaused: false,
        claimedCycles: [],
        unclaimedCycles: [],
        cyclesToDownload: [] 

    },
    fetchCanClaimSpRewards: async () => set({ canClaimSpRewards: await staderCommand("node can-claim-sp-rewards") })
})

