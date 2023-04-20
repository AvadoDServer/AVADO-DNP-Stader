import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanBaseUrl, etherscanTransactionUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { utils } from 'ethers'
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
    usePrepareContractWrite,
    useContractWrite,
} from 'wagmi'
import { useEffect } from "react";
import abi_json from "../lib/sd_token.json"

interface Props {
    amount?: bigint
}

const SendSD = ({ amount = 640000000000000000000n }: Props) => {

    const { walletStatus, contractInfo, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    // https://goerli.etherscan.io/address/0x0406f539f24be69baa8b88ed6eabedb7b3cfdc60#code
    const SD_TOKEN_CONTRACT = contractInfo.sdToken;

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: SD_TOKEN_CONTRACT,
        abi: abi_json,
        functionName: 'transfer',
        args: [walletStatus.accountAddress, amount.toString()
        ],

    })
    const { data, error, isError, write } = useContractWrite(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    // refresh node after deposit
    useEffect(() => {
        fetchNodeStatus()
    }, [isSuccess]);

    return (
        <div>
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                disabled={!write || isLoading} onClick={() => write!()}>
                {isLoading ? 'Sending...' : `Send ${displayAsETH(amount)} SD`}
            </button>
            {data?.hash && (
                <>
                    <p>{etherscanTransactionUrl(network, data?.hash, "Transaction details on Etherscan")}</p>
                    <br />
                </>
            )}
            {isSuccess && (
                <div>
                    Successfully sent {displayAsETH(amount)} SD to {walletStatus.accountAddress}
                    <div>
                        <a href={`${etherscanBaseUrl(network)}/tx/${data?.hash}`}>Etherscan</a>
                    </div>
                </div>
            )}
            {(isPrepareError || isError) && (
                <div>Error: {(prepareError || error)?.message}</div>
            )}
        </div>
    )
}

export default SendSD