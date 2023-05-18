
import { useStaderStatus } from "../lib/status";
import { useAccount } from "wagmi";
import { useNetwork } from "../hooks/useServerInfo";

export default function AddToken() {
    const { address } = useAccount();

    const { walletStatus, contractInfo, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const SD_TOKEN_CONTRACT = contractInfo.sdToken;


    const onWatchAssetClick = async () => {
        const result = await window.ethereum?.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: SD_TOKEN_CONTRACT,
                    decimals: 18,
                    name: "Stader",
                    symbol: "SD"
                }
            }
        });
        console.log({ result });
    };

    return (
        <button
            onClick={onWatchAssetClick}
            className="appearance-none text-blue-500 hover:underline"
        >
            {`Import SD Token`}
        </button>
    );
}
