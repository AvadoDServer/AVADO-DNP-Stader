import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { walletStatusType } from "../types";
import { useStaderStatus } from "../lib/status";
import { staderCommand } from "../lib/staderDaemon"
import DownloadBackup from "./DownloadBackup";
import ApproveSD from "./ApproveSD";
import StakeSD from "./StakeSD";
import DepositETH from "./DepositETH";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { displayAsETH, etherscanTransactionUrl, wsProvider } from "../utils/utils"
import { useNetwork, useSDPrice } from "../hooks/useServerInfo";
import SendSD from "./SendSd";
import SendEth from "./SendEth";

interface Props {
}

const AddValidator = ({ }: Props) => {
    const [showAddValidator, setShowAddValidator] = useState(false);
    const { nodeStatus, fetchNodeStatus, allowanceStatus, fetchAllowance } = useStaderStatus()

    const [ready, setReady] = useState(false)

    const currentNumberOfValidators = nodeStatus?.validatorInfos?.length || 0;
    const [amountOfValidatorsToAdd, setAmountOfValidatorsToAdd] = useState(1);
    const stakedSDBalance = BigInt(nodeStatus.depositedSdCollateral)

    const ETHDepositAmount: bigint = 4000000000000000000n
    const ethBalanceInWallet = BigInt(nodeStatus.accountBalances.eth)

    const ethWorthValidators = Math.floor(Number.parseFloat((ethBalanceInWallet / ETHDepositAmount).toString()));

    const validatorsICanAdd = Math.min(ethWorthValidators, nodeStatus.sdCollateralWorthValidators);

    // console.log(`I can add ${validatorsICanAdd} vali's`);

    const onFinish = () => {
        debugger;
        setReady(true)
        fetchNodeStatus()
        fetchAllowance()
    }

    const validatorAmountSelect = () => {
        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setAmountOfValidatorsToAdd(parseInt(event.target.value));
        };
        if (validatorsICanAdd === 0) return null;

        return (
            <select
                className="border border-gray-300 px-2 py-1 rounded-md"
                value={amountOfValidatorsToAdd} onChange={handleChange}>
                {Array.from({ length: validatorsICanAdd }, (_, index) => index + 1).map((number) => (
                    <option key={number} value={number}>{number}</option>
                ))}
            </select>
        );
    }

    const content = () => {
        return (
            <div>
                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Add validators
                        </h2>
                    </div>

                    <div className="px-4 py-5 sm:p-6">
                        {!ready &&
                            <>
                                <p>You can add up to {validatorsICanAdd} validators</p>
                                <div className="pb-5">
                                    <p>
                                        ✅ Deposited SD balance: {`${displayAsETH(stakedSDBalance)} SD`}
                                    </p>
                                    <p>
                                        ✅ Hot wallet ETH balance: {`${displayAsETH(ethBalanceInWallet)} SD`}
                                    </p>
                                </div>
                                <div className="pb-5">
                                    <span >How many validators to add &nbsp;</span>
                                    {
                                        validatorAmountSelect()
                                    }
                                </div>



                                {nodeStatus.sdCollateralWorthValidators > currentNumberOfValidators &&
                                    (
                                        <>
                                            <DepositETH numValidators={amountOfValidatorsToAdd} currentNumberOfValidators={currentNumberOfValidators} onFinish={onFinish} />
                                        </>
                                    )
                                }
                            </>
                        }

                        {ready && (
                            <>
                                <p className="pb-2">Please download a backup of your new Stader validator set now!</p>
                                <div className="flex justify-between">
                                    <DownloadBackup />

                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setShowAddValidator(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        )}

                    </div>

                </div>
            </div>
        )
    }

    let errors = [];
    if (nodeStatus?.sdCollateralWorthValidators <= currentNumberOfValidators) {
        errors.push("You don't have enough SD deposited to add a validator");
    }
    if (ethBalanceInWallet < ETHDepositAmount) {
        errors.push("You don't have enough ETH in your hot wallet to add a validator");
    }
    const maxApproval = ((BigInt(2) ** BigInt(256)) - BigInt(1));

    if (allowanceStatus?.allowance != maxApproval.toString()) {
        errors.push("You still need to give approval to spend your SD tokens");
    }

    const canAddValidators = !(errors.length > 0 || validatorsICanAdd < 1);

    return <>
        {!showAddValidator && (
            <>
                {(errors.length > 0) && (
                    <ul>{errors.map((err,i)=>(
                        <li id={`err-${i}`}>{err}</li>
                    ))}</ul>
                )}
                <button
                    disabled={!canAddValidators}
                    className={`${!canAddValidators ? "disabled:opacity-50" : ""} rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    onClick={() => setShowAddValidator(!showAddValidator)}
                >Add validators</button>
            </>
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