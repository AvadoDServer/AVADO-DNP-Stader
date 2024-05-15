import { StateCreator } from "zustand";
import { allowanceStatusType } from "../../types";
import { staderCommand } from "../staderDaemon"

export interface AllowanceSlice {
    allowanceStatus: allowanceStatusType;
    fetchAllowance: () => void;
}

export const createAllowanceSlice: StateCreator<AllowanceSlice> = (set) => ({
    allowanceStatus: {
        error: "",
        allowance: "0"
    },
    // fetchAllowance: async () => set({ allowanceStatus: await staderCommand("node deposit-sd-allowance") })
    fetchAllowance: async () => set({ allowanceStatus: { error: "", allowance: "0"} })
})