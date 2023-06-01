import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { walletStatusType } from "../types";
import { useStaderStatus } from "../lib/status";
import { staderCommandRaw, staderCommand } from "../lib/staderDaemon"
import DownloadBackup from "./DownloadBackup";
import ApproveSD from "./ApproveSD";
import StakeSD from "./StakeSD";
import DepositETH from "./DepositETH";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { displayAsETH, etherscanTransactionUrl, wsProvider } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { utils } from 'ethers'
import SendSD from "./SendSd";
import SendEth from "./SendEth";

interface Props {
    currentNumberOfValidators: number
}

const AddValidator = ({ currentNumberOfValidators }: Props) => {
    const [showAddValidator, setShowAddValidator] = useState(false);
    const { nodeStatus, fetchNodeStatus } = useStaderStatus()

    const [ready, setReady] = useState(false)

    const sdBalanceInWallet = BigInt(nodeStatus.accountBalances.sd)
    const sdMin = BigInt("1000000000000000000000")
    const stakedSDBalance = BigInt(nodeStatus.depositedSdCollateral)
    const requiredSDStake = (sdMin * BigInt(currentNumberOfValidators + 1))

    const ETHDepositAmount: bigint = 4000000000000000000n
    const ethBalanceInWallet = BigInt(nodeStatus.accountBalances.eth)

    const onFinish = () => {
        setReady(true)
        fetchNodeStatus()
    }

    const content = () => {
        return <div>
            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Add validator
                    </h2>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <ApproveSD />
                    <br />
                    <br />
                    <div className="">
                        <h4 className="title is-4 has-text-white">2. Stake SD</h4>
                        {stakedSDBalance < requiredSDStake && (
                            <>
                                {nodeStatus && (stakedSDBalance + sdBalanceInWallet < requiredSDStake) &&
                                    <>
                                        <p>To add a validator you need {displayAsETH(sdMin)} SD in your wallet.</p>
                                        <SendSD amount={requiredSDStake - stakedSDBalance - sdBalanceInWallet} />
                                    </>
                                }
                                {sdBalanceInWallet >= sdMin && (
                                    <StakeSD amount={requiredSDStake - stakedSDBalance} />
                                )}
                            </>
                        )}
                        {stakedSDBalance >= requiredSDStake && (
                            <span className="tag is-success">Staked <span><FontAwesomeIcon className="icon" icon={faCheck} /></span></span>
                        )}
                    </div>
                    <br />
                    <br />
                    <div className="">
                        <h4 className="title is-4 has-text-white">3. Deposit 4 ETH</h4>
                        {!ready && ethBalanceInWallet < ETHDepositAmount && (
                            <div className="pb-3">
                                <p>To add a validator you need {displayAsETH(ETHDepositAmount)} ETH in your wallet.</p>
                                <SendEth amount={ETHDepositAmount} />
                            </div>
                        )}
                        {!ready && nodeStatus.sdCollateralWorthValidators > currentNumberOfValidators && (
                            <>
                                <DepositETH currentNumberOfValidators={currentNumberOfValidators} onFinish={onFinish} />
                            </>
                        )}
                    </div>
                    <br />
                    <br />
                    {ready && (
                        <>
                            <p>Please download a backup of your whole Stader configuration now!</p>

                            <DownloadBackup />

                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setShowAddValidator(false)}
                            >
                                Close
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    }

    return <>
        {!showAddValidator && (
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setShowAddValidator(!showAddValidator)}
            >Add validator</button>
        )}
        {showAddValidator && (
            <>
                <Transition.Root show={showAddValidator} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={setShowAddValidator}>
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
                                                onClick={() => setShowAddValidator(false)}
                                            >
                                                <span className="sr-only">Close</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                        {content()}
                                        {/* <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => setShowAddValidator(false)}
                                            >
                                                Deactivate
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => setShowAddValidator(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div> */}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </>
        )}
    </>
}

export default AddValidator