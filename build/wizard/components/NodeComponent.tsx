import { Fragment, useEffect, useState } from 'react'
import type { NextPage } from 'next';
import {
    PlayIcon,
    AdjustmentsHorizontalIcon,
    ServerIcon,
    PencilIcon,
    LinkIcon,
    CheckIcon,
    ChevronDownIcon
} from '@heroicons/react/20/solid'
import InitWallet from './InitWallet';
import FundWallet from './FundWallet';
import RegisterNode from './RegisterNode';
import { useStaderStatus } from '../lib/status';
import { displayAsETH, etherscanAddressUrl } from '../utils/utils';
import StakeSD from './StakeSD';
import SendSD from './SendSd';
import SendEth from './SendEth';
import { useAccount, useBalance } from 'wagmi';
import truncateEthAddress from 'truncate-eth-address'
import ClickToCopy from "./ClickToCopy";
import { useNetwork } from "../hooks/useServerInfo";
// import ApproveSD from './ApproveSD';

const NodeComponent = () => {

    type step = {
        id: number,
        name: string
    }

    const steps: step[] = [
        { id: 1, name: 'Create hot-wallet' },
        { id: 2, name: 'Fund hot-wallet' },
        { id: 3, name: 'Register node' },
    ]

    const INIT = steps[0]
    const FUND = steps[1]
    const REGISTER = steps[2]
    const FINISHED = { id: 4, name: 'Finished' }

    const [currentStep, setCurrentStep] = useState<step>(INIT);
    const { network } = useNetwork();

    const getStatus = (step: step) => {
        if (step.id === currentStep.id)
            return "current"
        if (step.id > currentStep.id)
            return "upcoming"
        return "complete"
    }

    const { nodeStatus, contractInfo, allowanceStatus } = useStaderStatus()


    // Get amount of SD tokens in user wallletl
    const { address } = useAccount()
    const { data: sdBalance } = useBalance({
        address: address,
        token: contractInfo.sdToken
    })

    // useEffect(() => {
    //     if (nodeStatus && nodeStatus.registered)
    //         setCurrentStep(FINISHED)
    // }, [nodeStatus]);

    const showButtons = true

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            {currentStep.id !== FINISHED.id && (
                                <nav className="pb-5" aria-label="Progress">
                                    <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
                                        {steps.map((step, stepIdx) => (
                                            <li key={step.name} className="relative md:flex md:flex-1">
                                                {getStatus(step) === 'complete' ? (
                                                    <div className="group flex w-full items-center">
                                                        <span className="flex items-center px-6 py-4 text-sm font-medium">
                                                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                                                                <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                                            </span>
                                                            <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                                                        </span>
                                                    </div>
                                                ) : getStatus(step) === 'current' ? (
                                                    <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                                                            <span className="text-indigo-600">{step.id}</span>
                                                        </span>
                                                        <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="group flex items-center">
                                                        <span className="flex items-center px-6 py-4 text-sm font-medium">
                                                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                                                                <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                                                            </span>
                                                            <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                                                        </span>
                                                    </div>
                                                )}

                                                {stepIdx !== steps.length - 1 ? (
                                                    <>
                                                        {/* Arrow separator for lg screens and up */}
                                                        <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                                                            <svg
                                                                className="h-full w-full text-gray-300"
                                                                viewBox="0 0 22 80"
                                                                fill="none"
                                                                preserveAspectRatio="none"
                                                            >
                                                                <path
                                                                    d="M0 -2L20 40L0 82"
                                                                    vectorEffect="non-scaling-stroke"
                                                                    stroke="currentcolor"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </>
                                                ) : null}
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            )}
                            {currentStep.id !== FINISHED.id && (
                                <div>
                                    {currentStep.id === INIT.id && (
                                        <InitWallet onFinished={() => setCurrentStep(FUND)} />
                                    )}
                                    {currentStep.id === FUND.id && (
                                        <FundWallet onFinished={() => setCurrentStep(REGISTER)} />
                                    )}
                                    {currentStep.id === REGISTER.id && (
                                        <RegisterNode onFinished={() => setCurrentStep(FINISHED)} />
                                    )}
                                </div>
                            )}
                            {currentStep.id === FINISHED.id && (
                                <>


                                    <div className="text-5xl pb-5">{nodeStatus.operatorName}</div>

                                    <dl className="mb-5 border mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-3">
                                        {[
                                            {
                                                name: "Hot wallet address", value:
                                                    (
                                                        <>
                                                            {etherscanAddressUrl(network, (nodeStatus.accountAddressFormatted || nodeStatus.accountAddress), truncateEthAddress(nodeStatus.accountAddressFormatted || nodeStatus.accountAddress))}
                                                            <span className="text-sm">
                                                                <ClickToCopy text={nodeStatus.accountAddressFormatted || nodeStatus.accountAddress}><></></ClickToCopy>
                                                            </span>
                                                        </>)

                                            },
                                            { name: "Node id", value: nodeStatus.operatorId },
                                            {
                                                name: "Reward address", value:


                                                    (
                                                        <>
                                                            {etherscanAddressUrl(network, (nodeStatus.operatorRewardAddress), truncateEthAddress(nodeStatus.operatorRewardAddress))}
                                                            <span className="text-sm">
                                                                <ClickToCopy text={nodeStatus.operatorRewardAddress}><></></ClickToCopy>
                                                            </span>
                                                        </>)
                                            }]
                                            .map((stat) => (
                                                <div
                                                    key={stat.name}
                                                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
                                                >
                                                    <dt className="text-sm  font-medium leading-6 text-gray-500">{stat.name}</dt>
                                                    <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                                                        {stat.value}
                                                    </dd>
                                                </div>
                                            ))}
                                    </dl>

                                    <div className="text-1xl pb-5">Hot wallet</div>


                                    <dl className="mb-5 border mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-2">
                                        <div

                                            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
                                        >
                                            <dt className="text-sm font-medium leading-6 text-gray-500">ETH balance</dt>
                                            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                                                {displayAsETH(nodeStatus.accountBalances.eth.toString(), 4)}
                                                {showButtons && <SendEth amount={4000000000000000000n} />}
                                                {showButtons && <SendEth amount={100000000000000000n} />}

                                            </dd>
                                        </div>
                                        <div
                                            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
                                        >
                                            <dt className="text-sm font-medium leading-6 text-gray-500">SD balance</dt>
                                            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                                                {displayAsETH(nodeStatus.accountBalances.sd.toString(), 4)}
                                                {showButtons && <SendSD />}
                                                {showButtons && (sdBalance?.value?.toBigInt() ?? 0n) > 0 && <SendSD amount={(sdBalance?.value?.toBigInt() ?? 0n)} />}
                                                {showButtons && allowanceStatus?.allowance > 0 && BigInt(nodeStatus.accountBalances.sd) > 0 && <StakeSD amount={BigInt(nodeStatus.accountBalances.sd)} />}
                                            </dd>
                                        </div>
                                    </dl>



                                    <hr />

{/* 
                                    <div className="sm:flex sm:items-center">
                                        <div className="sm:flex-auto">
                                            <h1 className="text-base font-semibold leading-6 text-gray-900">Stader Node</h1>
                                            <p className="mt-2 text-sm text-gray-700">
                                                Node information
                                            </p>
                                        </div>
                                    </div>
                                    <div className="sm:flex sm:items-center">
                                        <div className="sm:flex-auto">
                                            <ul className="list-disc">
                                                <li>
                                                    Node name: {nodeStatus.operatorName}
                                                </li>
                                                <li>
                                                    Node address: {nodeStatus.accountAddressFormatted || nodeStatus.accountAddress}
                                                </li>
                                                <li>
                                                    Node id: {nodeStatus.operatorId}
                                                </li>
                                                <li>
                                                    Node reward address: {nodeStatus.operatorRewardAddress}
                                                </li>
                                                <li>
                                                    Wallet: {displayAsETH(nodeStatus.accountBalances.eth.toString(), 4)} ETH
                                                    {showButtons && <SendEth amount={4000000000000000000n} />}
                                                    {showButtons && <SendEth amount={100000000000000000n} />}
                                                </li>
                                                <li>
                                                    Wallet: {displayAsETH(nodeStatus.accountBalances.sd.toString(), 4)} SD
                                                    {showButtons && <SendSD />}
                                                    {showButtons && (sdBalance?.value?.toBigInt() ?? 0n) > 0 && <SendSD amount={(sdBalance?.value?.toBigInt() ?? 0n)} />}
                                                    {showButtons && BigInt(nodeStatus.accountBalances.sd) > 0 && <StakeSD amount={BigInt(nodeStatus.accountBalances.sd)} />}
                                                </li>
                                            </ul>
                                        </div>
                                    </div> */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export default NodeComponent;