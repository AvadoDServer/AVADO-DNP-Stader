import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanBaseUrl } from "../utils/utils"
import ButtonSpinner from "./ButtonSpinner";
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
    useBalance,
    useAccount
} from 'wagmi'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline'

const SLIDER_DENOMINATOR = 100;

interface Props {
    onSuccess?: Function
}

const SendEth = ({ onSuccess }: Props) => {

    const { walletStatus, fetchNodeStatus } = useStaderStatus()
    const { address, isConnected } = useAccount();
    const [availableBalanceInEth, setAvailableBalanceInEth] = useState<number>(0);

    const [amount, setAmount] = useState<number>(0);
    const [sliderAmount, setSliderAmount] = useState<number>(0);
    const { data: ETHBalance } = useBalance({
        address: address,
    })
    const [showModal, setShowModal] = useState<boolean>(false);
    const [debouncer, setDebouncer] = useState<any>();
    
    const { config, error: prepareError, isError: isPrepareError } = usePrepareSendTransaction({
        to: walletStatus.accountAddress ,
        value: BigInt(Math.floor(amount*SLIDER_DENOMINATOR)) * 10000000000000000n
    })
    const { data, sendTransaction, error, isError } = useSendTransaction(config)

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (amount > 0) {
    //             sendTransaction?.();
    //         }
    //     }, 200)
    // }, [amount]);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    useEffect(() => {
        if (ETHBalance?.value) {
            setAvailableBalanceInEth(Number.parseFloat((ETHBalance.value / 10000000000000000n).toString())/SLIDER_DENOMINATOR)
        }
    }, [ETHBalance]);

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

    if (!isConnected || (ETHBalance && (ETHBalance?.value || 0n) < amount)) {
        return (
            <>
                <button
                    className="cursor-not-allowed opacity-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={true}>
                    {`Send ${amount} ETH to hot wallet`}
                </button>
                {ETHBalance && (
                    <span className="text-red-500 text-xs">
                        You only have {displayAsETH(ETHBalance.value.toString())} ETH in your wallet
                    </span>
                )}
            </>
        )
    }


    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSliderAmount(parseFloat(event.target.value)/SLIDER_DENOMINATOR);
        if (debouncer){
            clearTimeout(debouncer);
        }
        const t = setTimeout(()=>{
            console.log("amount set");
            setAmount(parseFloat(event.target.value)/SLIDER_DENOMINATOR)
            setDebouncer(null);
        },100);
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
                                                    Add ETH to hot wallet
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
                                                    max={availableBalanceInEth*10}
                                                    value={sliderAmount*SLIDER_DENOMINATOR}
                                                    onChange={handleSliderChange}
                                                    className="w-full h-2 bg-gray-200 rounded-md appearance-none focus:outline-none focus:bg-gray-300"
                                                />
                                                <div className="mt-2 text-center">{sliderAmount} ETH</div>
                                            </div>

                                            <div className="px-4 py-5 sm:p-6">
                                                <button
                                                    onClick={() => {
                                                        sendTransaction?.();
                                                    }}
                                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    disabled={sliderAmount === 0 || !walletStatus.accountAddress}>

                                                    {isLoading ? (
                                                        <ButtonSpinner text={`Sending...`} />
                                                    ) : (<>
                                                        {`Add ${sliderAmount} ETH to hot wallet`}
                                                    </>)}


                                                </button>

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

                Add ETH to hot wallet
            </button>
        </>
    )
}

export default SendEth