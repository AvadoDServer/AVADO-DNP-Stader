import ClickToCopy from "./ClickToCopy";
import React, { useEffect, useState } from "react";
import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanAddressUrl } from "../utils/utils"
import { useNetwork, useSDPrice } from "../hooks/useServerInfo";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SendEth from "./SendEth";
import SendSD from "./SendSd";
import {
    useAccount,
} from 'wagmi'

interface Props {
    onFinished: () => void
}

const FundWallet = ({ onFinished }: Props) => {

    const { nodeStatus, walletStatus, fetchWalletStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()
    const { isConnected } = useAccount()
    const { sdPrice } = useSDPrice();
    const [enableContinue, setEnableContinue] = React.useState(false);

    const ethBalance = BigInt(nodeStatus.accountBalances.eth)
    const sdBalance = BigInt(nodeStatus.accountBalances.sd)

    const ethStake = 4000000000000000000n
    const gasMoney = 300000000000000000n
    const [sdStake, setSdStake] = useState<bigint>(1000000000000000000000n);
    const [sdStakeMargin, setSdStakeMargin] = useState<bigint>(1000000000000000000n);

    // in this step - update status every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNodeStatus();
        }, 5000);
        return (() => {
            clearInterval(interval);
        })
    });

    // recalculate SD needed to fund
    useEffect(() => {
        if (sdPrice && sdPrice > 0) {
            const sdPrice_b = BigInt(Math.ceil(1 / sdPrice * 0.4));
            console.log(`You need ${sdPrice_b} SD tokens`);
            setSdStake(sdPrice_b * 1000000000000000000n);
            setSdStakeMargin(sdPrice_b * 100000000000000000n); // 10% margin
        }
    }, [
        sdPrice
    ]);

    useEffect(() => {
        if (!nodeStatus) {
            return;
        }
        setEnableContinue(
            ethBalance >= (ethStake + gasMoney) &&
            sdBalance >= (sdStake)
        )
    }, [
        nodeStatus, ethBalance, sdBalance, ethStake, gasMoney, sdStake
    ]);

    const badge = (success: boolean, text: string) => (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${success ? `bg-green-50 text-green-700 ring-green-600/20` : `bg-yellow-50 text-yellow-800 ring-yellow-600/20"`}`}>
            {text}
        </span>
    )

    return (
        <>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <p className="text-5xl pb-5">
                        Now you need to fund your hot wallet.
                    </p>

                    {(!isConnected) && (
                        <>
                            <p className="pb-1">
                                Please connect to your wallet first.
                            </p>
                            <div className="pb-4">
                                <ConnectButton />
                            </div>
                        </>
                    )}

                    <p className="pb-1">
                        Your stader hot wallet address that will receive the funds:
                    </p>
                    <p className="pb-4"><ClickToCopy text={nodeStatus.accountAddress}>{etherscanAddressUrl(network, nodeStatus.accountAddress)}</ClickToCopy></p>
                    <div className="pb-5">
                        <div className="flex space-x-6">
                            <div className="w-32 h-8"></div>
                            <div className="w-40 h-8">ETH</div>
                            <div className="w-40 h-8">SD</div>
                        </div>
                        <div className="flex space-x-6">
                            <div className="w-32 h-10">Required</div>
                            <div className="w-40 h-10">{`${displayAsETH((ethStake + gasMoney).toString())}`}</div>
                            <div className="w-40 h-10">{`${displayAsETH((sdStake + sdStakeMargin).toString())}`}</div>
                        </div>
                        <div className="flex space-x-6">
                            <div className="w-32 h-10"></div>
                            <div className="w-40 h-10 text-sm">{`=${displayAsETH((ethStake).toString(), 0)} ETH + ${displayAsETH((gasMoney).toString(), 0)} for gas`}</div>
                            <div className="w-40 h-10 text-sm">{`=${displayAsETH((sdStake).toString(), 0)} SD + ${displayAsETH((sdStakeMargin).toString(), 0)} margin`}</div>
                        </div>
                        <div className="flex space-x-6">
                            <div className="w-32 h-10">Current Balance</div>
                            <div className="w-40 h-10">{badge(ethBalance >= ethStake, `${displayAsETH(ethBalance.toString())}`)}</div>
                            <div className="w-40 h-10">{badge(sdBalance >= sdStake, `${displayAsETH(sdBalance.toString())}`)}</div>
                            <div className="w-32 h-10">
                                <button className="appearance-none text-blue-500 hover:underline"
                                    onClick={fetchNodeStatus}>Refresh</button>
                            </div>
                        </div>

                        <div className="flex space-x-6">
                            <div className="w-32 h-10"></div>
                            <div className="w-40 h-10">
                                {(ethStake + gasMoney - ethBalance) > 0 && (
                                    <SendEth onSuccess={fetchNodeStatus} />
                                    // <SendEth amount={ethStake + gasMoney - ethBalance} onSuccess={fetchNodeStatus} />
                                    )}
                            </div>
                            <div className="w-40 h-35">
                                {(sdStake + sdStakeMargin - sdBalance) > 0 && (
                                    <SendSD onSuccess={fetchNodeStatus} />
                                    // <SendSD amount={sdStake + sdStakeMargin - sdBalance} onSuccess={fetchNodeStatus} />
                                    )}
                            </div>
                            <div className="w-32 h-35">
                                {/* <AddToken /> */}
                            </div>

                        </div>

                    </div>


                    <hr className="pb-5" />



                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div className=" flex items-center">
                            <div className="relative flex gap-x-3">
                                {(!enableContinue) ? (
                                    <div className="text-sm leading-6">
                                        <label className="font-medium">
                                            You can go to the next step once you have funded your wallet sufficiently.
                                        </label>
                                    </div>
                                ) : (
                                    <div className="text-sm leading-6">
                                        <label className="font-medium">
                                            Your hot-wallet has been funded!
                                        </label>
                                    </div>

                                )}
                            </div>
                        </div>
                        <div className="">
                            {enableContinue ? (
                                <button
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={() => { onFinished(); }}
                                >
                                    continue to next step
                                </button>

                            ) : (
                                <button
                                    className="cursor-not-allowed opacity-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={() => { onFinished(); }}
                                >
                                    continue to next step
                                </button>

                            )}
                        </div>

                    </div>
                </div>
            </div >
        </>
    );
};

export default FundWallet