import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanBaseUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { utils } from 'ethers';
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
    const { address } = useAccount();


    const { data: ETHBalance } = useBalance({
        address: address,
    })

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
        fetchNodeStatus();
        if (isSuccess && onSuccess) onSuccess();
    }, [isSuccess]);


    if (ETHBalance?.value.lt(amount)) {
        return (
            <>
                <button
                    className="cursor-not-allowed opacity-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={true}>
                    {`Send ${displayAsETH(amount)} ETH to hot wallet`}
                </button>
                Not enough ETH in wallet {displayAsETH(ETHBalance.value.toString())}
            </>
        )
    }


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
               
                {isLoading ? (
                    <ButtonSpinner text={`Sending...`} />
                ) : (<>
                    {`Send ${displayAsETH(amount)} ETH`}
                </>)}
            </button>
            {/* {isSuccess && (
                <div>
                    Successfully sent {displayAsETH(amount)} ETH to {walletStatus.accountAddress}
                    <div>
                        <a href={`${etherscanBaseUrl(network)}/tx/${data?.hash}`}>Etherscan</a>
                    </div>
                </div>
            )} */}
            {/* {(isPrepareError || isError) && (
                <div>Error: {(prepareError || error)?.message}</div>
            )} */}
        </form>
    )
}

export default SendEth