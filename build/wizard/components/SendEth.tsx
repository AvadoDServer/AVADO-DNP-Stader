import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanBaseUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { utils } from 'ethers'
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
} from 'wagmi'
import { useEffect } from "react";

interface Props {
    amount: bigint
}


const SendEth = ({ amount }: Props) => {

    const { walletStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()


    const { config, error: prepareError, isError: isPrepareError } = usePrepareSendTransaction({
        request: {
            to: walletStatus.accountAddress,
            value: amount.toString()
        },
    })
    const { data, sendTransaction, error, isError } = useSendTransaction(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    // refresh node after deposit
    useEffect(() => {
        fetchNodeStatus()
    }, [isSuccess]);


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                sendTransaction?.()
            }}
        >
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isLoading || !sendTransaction || !walletStatus.accountAddress}>
                {isLoading ? 'Sending...' : `Send ${displayAsETH(amount)} ETH to wallet`}
            </button>
            {isSuccess && (
                <div>
                    Successfully sent {displayAsETH(amount)} ETH to {walletStatus.accountAddress}
                    <div>
                        <a href={`${etherscanBaseUrl(network)}/tx/${data?.hash}`}>Etherscan</a>
                    </div>
                </div>
            )}
            {(isPrepareError || isError) && (
                <div>Error: {(prepareError || error)?.message}</div>
            )}
        </form>
    )
}

export default SendEth