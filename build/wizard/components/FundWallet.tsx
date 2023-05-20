import ClickToCopy from "./ClickToCopy";
import React, { useEffect } from "react";
import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanAddressUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SendEth from "./SendEth";
import SendSD from "./SendSd";
// import AddToken from "./AddToken"
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
    const [enableContinue, setEnableContinue] = React.useState(false);

    const ethBalance = BigInt(nodeStatus.accountBalances.eth)
    const sdBalance = BigInt(nodeStatus.accountBalances.sd)

    const ethStake = 4000000000000000000n
    const gasMoney = 300000000000000000n
    const sdStake = 1000000000000000000000n
    // const ethStake = 400000000000000000n
    // const gasMoney = 30000000000000000n
    // const sdStake = 1000000000000000000n

    // in this step - update status every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNodeStatus();
        }, 5000);
        return (() => {
            clearInterval(interval);
        })
    });

    useEffect(() => {
        if (!nodeStatus) {
            return;
        }
        setEnableContinue(
            ethBalance >= (ethStake + gasMoney) &&
            sdBalance >= sdStake
        )
    }, [
        nodeStatus, ethBalance, sdBalance, ethStake, gasMoney, sdStake
    ]);

    // useEffect(() => {
    //     if (nodeStatus && ethBalance >= ethStake && sdBalance >= sdStake)
    //         onFinished()
    // }, [nodeStatus]);

    const badge = (success: boolean, text: string) => (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${success ? `bg-green-50 text-green-700 ring-green-600/20` : `bg-yellow-50 text-yellow-800 ring-yellow-600/20"`}`}>
            {text}
        </span>
    )

    return (
        <>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Fund wallet</h2> */}

                    <p className="text-5xl pb-5">
                        Now you need to fund your hot wallet.
                    </p>

                    {(!isConnected) && (
                        <p className="pb-1">
                            Please connect to your wallet first.
                        </p>
                    )}
                    <div className="pb-4">
                        <ConnectButton />
                    </div>

                    <p className="pb-1">
                        This is the hot wallet address to receive the funds:
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
                            <div className="w-40 h-10">{`${displayAsETH((sdStake).toString())}`}</div>
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
                                    <SendEth amount={ethStake + gasMoney - ethBalance} onSuccess={fetchNodeStatus} />
                                )}
                            </div>
                            <div className="w-40 h-35">
                                {(sdStake - sdBalance) > 0 && (
                                    <SendSD amount={sdStake - sdBalance} onSuccess={fetchNodeStatus} />
                                )}
                            </div>
                            <div className="w-32 h-35">
                                {/* <AddToken /> */}
                            </div>

                        </div>

                    </div>


                    {/* <p>Send a minimum of {displayAsETH(sdStake)} SD to <ClickToCopy text={nodeStatus.accountAddress}>{etherscanAddressUrl(network, nodeStatus.accountAddress)}</ClickToCopy> */}
                    {/* <br />(maximum allowed stake is {maxSDStake} SD - the more you stake, the more you will earn. More details on the <a target="_blank" rel="noreferrer" href="https://docs.ava.do/packages/stader">Avado Stader Docs</a> ) */}
                    {/* </p> */}


                    {/* 

                    <p>Current Wallet balances:</p>
                    <ul>
                        <li>
                            <b>ETH: </b>{badge(ethBalance >= ethStake, `${displayAsETH(ethBalance.toString())} ETH`)}
                        </li>

                        <li>
                            <b>SD: </b>{badge(sdBalance >= sdStake, `${displayAsETH(sdBalance.toString())} SD`)}
                        </li>
                    </ul>

                    <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={fetchNodeStatus}>Refresh balances</button>
                    <br />
                    <br /> */}

                    <hr className="pb-5" />



                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div className=" flex items-center">
                            <div className="relative flex gap-x-3">
                                {/* <div className="flex h-6 items-center">
                                    <input
                                        id="comments"
                                        name="comments"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setEnableContinue(e.target.checked);
                                        }}
                                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                                    />
                                </div> */}
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

                    {/* <p>You can go to the next step once you have funded your wallet sufficiently.</p> */}

                </div>
            </div >
        </>
    );
};

export default FundWallet