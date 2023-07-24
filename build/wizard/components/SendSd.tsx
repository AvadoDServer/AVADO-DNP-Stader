import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanBaseUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import ButtonSpinner from "./ButtonSpinner";
import { etherscanTransactionUrl } from "../utils/utils"
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useBalance,
    useAccount
} from 'wagmi'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline'
import abi_json from "../lib/sd_token.json"

interface Props {
    onSuccess?: Function
}

const SendSd = ({ onSuccess }: Props) => {

    const { walletStatus, contractInfo, fetchNodeStatus } = useStaderStatus()
    const { address, isConnected } = useAccount();
    const [availableBalanceInEth, setAvailableBalance] = useState<number>(0);

    const [amount, setAmount] = useState<number>(0);
    const [sliderAmount, setSliderAmount] = useState<number>(0);
    const [debouncer, setDebouncer] = useState<any>();

    const SD_TOKEN_CONTRACT = contractInfo.sdToken;

    const { data: tokenBalance } = useBalance({
        address: address,
        token: SD_TOKEN_CONTRACT,
    })


    const [showModal, setShowModal] = useState<boolean>(false);

    const { network } = useNetwork()

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: SD_TOKEN_CONTRACT,
        abi: abi_json,
        functionName: 'transfer',
        args: [walletStatus.accountAddress, (BigInt(amount) * 1000000000000000000n).toString()
        ],

    })
    const { data, error, isError, write: sendTransaction } = useContractWrite(config)

    // useEffect(() => {
    //     console.log(sendTransaction);

    // }, [config, data]);



    // useEffect(() => {
    //     if (amount > 0 && sendTransaction) {
    //         sendTransaction();
    //     }
    // }, [amount, sendTransaction]);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    useEffect(() => {
        if (tokenBalance?.value) {
            setAvailableBalance(Number.parseFloat((tokenBalance.value / 1000000000000000000n).toString()))
        }
    }, [tokenBalance]);

    // if user selects another account - reset slider amount to 0
    useEffect(() => {
        setAmount(0);
    }, [address])

    // close modal after successful TX
    // refresh node after deposit
    useEffect(() => {
        fetchNodeStatus();
        setShowModal(false);
        if (isSuccess && onSuccess) onSuccess();
    }, [isSuccess]);

    useEffect(() => {
        if (error || prepareError) {
            console.log(error, prepareError);
        }
    }, [error, prepareError])

    if (!isConnected || (tokenBalance && (tokenBalance?.value || 0n) < amount)) {
        return (
            <>
                <button
                    className="cursor-not-allowed opacity-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={true}>
                    {`Send ${amount} SD to hot wallet`}
                </button>
                {tokenBalance && (
                    <span className="text-red-500 text-xs">
                        You only have {displayAsETH(tokenBalance.value.toString())} SD in your wallet
                    </span>
                )}
            </>
        )
    }

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSliderAmount(parseFloat(event.target.value));
        if (debouncer) {
            clearTimeout(debouncer);
        }
        const t = setTimeout(() => {
            console.log("amount set");
            setAmount(parseFloat(event.target.value))
            setDebouncer(null);
        }, 100);
        setDebouncer(t);
    };

    return (
        <>
            <Transition.Root show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setShowModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    <div>
                                        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                                            <div className="px-4 py-5 sm:px-6">
                                                <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                                    Add SD to hot wallet
                                                </h2>
                                            </div>

                                            <div className="w-64 mx-auto">
                                                <div className="flex justify-between">
                                                    <div>{0}</div>
                                                    <div>{availableBalanceInEth}</div>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={availableBalanceInEth}
                                                    value={sliderAmount}
                                                    onChange={handleSliderChange}
                                                    className="w-full h-2 bg-gray-200 rounded-md appearance-none focus:outline-none focus:bg-gray-300"
                                                />
                                                <div className="mt-2 text-center">{sliderAmount} SD</div>
                                            </div>

                                            <div className="px-4 py-5 sm:p-6">
                                                <button
                                                    onClick={() => {
                                                        // setAmount(sliderAmount);
                                                        sendTransaction?.();
                                                    }}
                                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    disabled={sliderAmount === 0}>

                                                    {isLoading ? (
                                                        <ButtonSpinner text={`Sending...`} />
                                                    ) : (<>
                                                        {`Add ${sliderAmount} SD to hot wallet`}
                                                    </>)}

                                                </button>
                                                {data && data.hash && (
                                                    <p>{etherscanTransactionUrl(network, data.hash, "Transaction details on Etherscan")}</p>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <button
                onClick={() => {
                    setShowModal(true)
                }}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={showModal || !walletStatus.accountAddress}>

                Add SD to hot wallet
            </button>
        </>
        // </form>
    )
}

export default SendSd