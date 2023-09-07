import { StateCreator } from "zustand";
import { canClaimRewardsType } from "../../types";
import { staderCommand } from "../staderDaemon"

export interface CanClaimRewardsSlice {
    canClaimRewards: canClaimRewardsType;
    fetchCanClaimRewards: () => void;
}

export const createCanClaimRewardsSlice: StateCreator<CanClaimRewardsSlice> = (set) => ({
    canClaimRewards: {
        status: "success",
        error: "",
        noRewards: true,
        gasInfo: {
          estGasLimit: 0,
          safeGasLimit: 0
        }

    },
    fetchCanClaimRewards: async () => set({ canClaimRewards: await staderCommand("node can-claim-rewards") })
})

