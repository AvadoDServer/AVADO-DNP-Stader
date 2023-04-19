import { useStaderStatus } from "../lib/status";
import { etherscanBaseUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useNetwork";
import { utils } from 'ethers'
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
} from 'wagmi'
import { useEffect } from "react";


interface Props {
}

const Send4Eth = ({ }: Props) => {

    const { walletStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const amount = 4.2

    const { config, error: prepareError, isError: isPrepareError } = usePrepareSendTransaction({
        request: {
            to: walletStatus.accountAddress,
            value: utils.parseEther(amount.toString())
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
                {isLoading ? 'Sending...' : `Send ${amount} ETH to wallet`}
            </button>
            {isSuccess && (
                <div>
                    Successfully sent {amount} ether to {walletStatus.accountAddress}
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

export default Send4Eth