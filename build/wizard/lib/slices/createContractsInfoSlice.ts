import { StateCreator } from "zustand";
import { contractsInfoType } from "../../types";
import { staderCommand } from "../staderDaemon"

export interface ContractsInfoSlice {
    contractInfo: contractsInfoType;
    fetchContractsInfo: () => void;
}

export const createContractsInfoSlice: StateCreator<ContractsInfoSlice> = (set) => ({
    // contractInfo: {
    //     status: "success",
    //     error: "",
    //     network: 5,
    //     beaconDepositContract: "0xff50ed3d0ec03ac01d4c79aad74928bff48a7b2b",
    //     beaconNetwork: 5,
    //     permissionlessNodeRegistry: "0x0bf620171483e543f7964a6067d9cef3ae130056",
    //     vaultFactory: "0x1e19bed3c9bb53317efb01daa61253281a1dbc08",
    //     ethxToken: "0xe624471812f4fb739dd4ef40a8f9fabd9474ceaa",
    //     sdToken: "0x0406f539f24be69baa8b88ed6eabedb7b3cfdc60",
    //     sdCollateralContract: "0xf06e82fa29976886fdbdcf41be39fde0131fb652"
    // },
    contractInfo: {
        status: "success",
        error: "",
        network: 0,
        beaconDepositContract: "0x0000000000000000000000000000000000000000",
        beaconNetwork: 0,
        permissionlessNodeRegistry: "0x0000000000000000000000000000000000000000",
        vaultFactory: "0x0000000000000000000000000000000000000000",
        ethxToken: "0x0000000000000000000000000000000000000000",
        sdToken: "0x0000000000000000000000000000000000000000",
        sdCollateralContract: "0x0000000000000000000000000000000000000000"
    },
    fetchContractsInfo: async () => set({ contractInfo: await staderCommand("node get-contracts-info") })
})