import ClickToCopy from "./ClickToCopy";
import { rplPriceDataType, nodeStatusType } from "../types"
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { walletStatusType } from "../types";
import { useStaderStatus } from "../lib/status";
import { staderCommand } from "../lib/staderDaemon"
import { displayAsETH, etherscanAddressUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useNetwork";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Send4Eth from "./Send4Eth";
import SendSD from "./SendSd";

interface Props {
    onFinished: () => void
}

const FundWallet = ({ onFinished }: Props) => {

    const { nodeStatus, walletStatus, fetchWalletStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const ethBalance = BigInt(nodeStatus.accountBalances.eth)
    const sdBalance = BigInt(nodeStatus.accountBalances.sd)

    const minSDStakeWei: bigint = BigInt("640000000000000000000")
    const maxSDStakeWei: bigint = minSDStakeWei
    const minSDStake = 640
    const maxSDStake = 640

    return (
        <>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Fund wallet</h2>


                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Now you need to fund your Stader hot wallet.
                    </p>

                    <ConnectButton />
                    <Send4Eth />


                    <p>Send 16.4 ETH to <ClickToCopy text={nodeStatus.accountAddress}>{etherscanAddressUrl(network, nodeStatus.accountAddress)}</ClickToCopy> (16 ETH + 0.4 ETH gas money)
                        <br />(0.4 is a safe margin to create everything. The remaining gas can be withdrawn from this wallet later)
                    </p>

                    <SendSD />

                    <p>Send a minimum of {minSDStake} SD to <ClickToCopy text={nodeStatus.accountAddress}>{etherscanAddressUrl(network, nodeStatus.accountAddress)}</ClickToCopy>
                        <br />(maximum allowed stake is {maxSDStake} SD - the more you stake, the more you will earn. More details on the <a target="_blank" href="https://wiki.ava.do/en/tutorials/rocketpool">Avado Rocket Pool Wiki page</a> )
                        <br />(All SD sent to this wallet will be used as your stake later - so please send exactly the desired stake amount)
                    </p>


                    <p>Current Wallet balances:</p>
                    <ul>
                        <li><b>ETH: </b>{(ethBalance < BigInt("16000000000000000000")) ?
                            (<span className="tag is-danger ">{displayAsETH(ethBalance.toString())} ETH</span>)
                            :
                            (<span className="tag is-success ">{displayAsETH(ethBalance.toString())} ETH</span>)
                        }
                        </li>

                        <li><b>SD: </b>{(sdBalance < minSDStake) ?
                            (<span className="tag is-danger ">{displayAsETH(sdBalance.toString())} RPL</span>)
                            :
                            (<span className="tag is-success ">{displayAsETH(sdBalance.toString())} RPL</span>)
                        }
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