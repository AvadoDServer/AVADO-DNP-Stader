import ClickToCopy from "./ClickToCopy";
import React, { useEffect } from "react";
import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanAddressUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SendEth from "./SendEth";
import SendSD from "./SendSd";

interface Props {
    onFinished: () => void
}

const FundWallet = ({ onFinished }: Props) => {

    const { nodeStatus, walletStatus, fetchWalletStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const ethBalance = BigInt(nodeStatus.accountBalances.eth)
    const sdBalance = BigInt(nodeStatus.accountBalances.sd)

    const ethStake = 4000000000000000000n
    const gasMoney = 300000000000000000n
    const sdStake = 1000000000000000000000n

    useEffect(() => {
        if (nodeStatus && ethBalance >= ethStake && sdBalance >= sdStake)
            onFinished()
    }, [nodeStatus]);

    const badge = (success: boolean, text: string) => (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${success ? `bg-green-50 text-green-700 ring-green-600/20` : `bg-yellow-50 text-yellow-800 ring-yellow-600/20"`}`}>
            {text}
        </span>
    )

    return (
        <>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Fund wallet</h2>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Now you need to fund your Stader hot wallet.
                    </p>

                    <ConnectButton />

                    <p>Send {displayAsETH(ethStake + gasMoney)} ETH to <ClickToCopy text={nodeStatus.accountAddress}>{etherscanAddressUrl(network, nodeStatus.accountAddress)}</ClickToCopy> ({displayAsETH(ethStake)} ETH + {displayAsETH(gasMoney)} ETH gas money)
                        <br />({displayAsETH(gasMoney)} is a safe margin to create everything. The remaining gas can be withdrawn from this wallet later)
                    </p>
                    <SendEth amount={ethStake + gasMoney} />


                    <p>Send a minimum of {displayAsETH(sdStake)} SD to <ClickToCopy text={nodeStatus.accountAddress}>{etherscanAddressUrl(network, nodeStatus.accountAddress)}</ClickToCopy>
                        {/* <br />(maximum allowed stake is {maxSDStake} SD - the more you stake, the more you will earn. More details on the <a target="_blank" rel="noreferrer" href="https://docs.ava.do/packages/stader">Avado Stader Docs</a> ) */}
                    </p>
                    <SendSD />


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
                    <br />
                    <p>You will go to the next step once you have funded your wallet sufficiently.</p>

                </div>
            </div>
        </>
    );
};

export default FundWallet