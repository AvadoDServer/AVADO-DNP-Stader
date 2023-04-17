import { useStaderStatus } from "../lib/status";
import { etherscanBaseUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useNetwork";
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
}

const SendSD = ({ }: Props) => {

    const { walletStatus, contractInfo } = useStaderStatus()
    const { network } = useNetwork()

    const amount = 640


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
        args: [walletStatus.accountAddress, utils.parseEther(amount.toString())
        ],

    })
    const { data, error, isError, write } = useContractWrite(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    return (
        <div>
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                disabled={!write || isLoading} onClick={() => write!()}>
                {isLoading ? 'Sending...' : `Send ${amount} SD`}
            </button>
            {isSuccess && (
                <div>
                    Successfully sent {amount} SD to {walletStatus.accountAddress}
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