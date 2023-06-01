import { StateCreator } from "zustand";
import { walletStatusType } from "../../types";
import { staderCommand } from "../staderDaemon"

export interface WalletStatusSlice {
    walletStatus: walletStatusType;
    fetchWalletStatus: () => void;
}

export const createWalletStatusSlice: StateCreator<WalletStatusSlice> = (set) => ({
    walletStatus: {
        status: "success",
        error: "",
        passwordSet: false,
        walletInitialized: false,
        accountAddress: "0x0000000000000000000000000000000000000000"
    },
    fetchWalletStatus: async () => set({ walletStatus: await staderCommand("wallet status") })
})

