import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanBaseUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import ButtonSpinner from "./ButtonSpinner";

import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
    useBalance,
    useAccount
} from 'wagmi'
import { useEffect } from "react";

interface Props {
    amount: bigint,
    onSuccess?: Function
}


const SendEth = ({ amount, onSuccess }: Props) => {

    const { walletStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()
    const { address, isConnected } = useAccount();

    const { data: ETHBalance } = useBalance({
        address: address,
    })

    const { config, error: prepareError, isError: isPrepareError } = usePrepareSendTransaction({
        to: walletStatus.accountAddress,
        value: amount
    })
    const { data, sendTransaction, error, isError } = useSendTransaction(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    // refresh node after deposit
    useEffect(() => {
        fetchNodeStatus();
        if (isSuccess && onSuccess) onSuccess();
    }, [isSuccess]);


    useEffect(() => {
        if (error || prepareError) {
            console.log(error, prepareError);
            debugger;
        }
    }, [error, prepareError])

    if (!isConnected || (ETHBalance && (ETHBalance?.value || 0n) < amount)) {
        return (
            <>
                <button
                    className="cursor-not-allowed opacity-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={true}>
                    {`Send ${displayAsETH(amount)} ETH to hot wallet`}
                </button>
                {ETHBalance && (
                    <span className="text-red-500 text-xs">
                        You only have {displayAsETH(ETHBalance.value.toString())} ETH in your wallet
                    </span>
                )}
            </>
        )
    }

    console.log("=====", JSON.stringify(walletStatus));

    return (
        // <form
        //     onSubmit={(e) => {
        //         e.preventDefault()
        //         debugger;
        //         sendTransaction?.()
        //     }}
        // >
        <>

            <button
                onClick={() => {
                    debugger;

                    sendTransaction?.()
                }}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isLoading || !walletStatus.accountAddress}>

                {isLoading ? (
                    <ButtonSpinner text={`Sending...`} />
                ) : (<>
                    {`Add ${displayAsETH(amount)} ETH to hot wallet`}

                </>)}
            </button>
        </>
        // </form>
    )
}

export default SendEth