import Spinner from "./Spinner";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanTransactionUrl, wsProvider } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { utils } from 'ethers'
import { useEffect, useState } from "react";
import { staderCommand } from "../lib/staderDaemon";
import SendSD from "./SendSd";

interface Props {
    currentNumberOfValidators: number
}

const StakeSD = ({ currentNumberOfValidators }: Props) => {
    const { nodeStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const [sdStakeButtonDisabled, setSdStakeButtonDisabled] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [txHash, setTxHash] = useState();
    const [waitingForTx, setWaitingForTx] = useState(false);

    const sdBalanceInWallet = BigInt(nodeStatus.accountBalances.sd)
    const sdMin = BigInt("640000000000000000000")
    const stakedSDBalance = BigInt(nodeStatus.depositedSdCollateral)

    const requiredSDStake = (sdMin * BigInt(currentNumberOfValidators + 1))

    useEffect(() => {

        setSdStakeButtonDisabled(true); //set default

        if (waitingForTx)
            return;

        if (nodeStatus) {
            // first deposit only allowed if bigger than minium.
            // If there is a minipool already, more deposits are allowed.
            if (sdBalanceInWallet < sdMin) {
                setFeedback(`Not enough SD in your wallet (${displayAsETH(sdBalanceInWallet, 4)} SD). Must be more than ${displayAsETH(sdMin, 4)} SD before you can stake`);
            } else {
                console.log("Staked SD", stakedSDBalance.toString())
                if (sdBalanceInWallet > 0n) {
                    console.log(`node can-node-deposit-sd ${sdBalanceInWallet.toString()}`);
                    staderCommand(`node can-node-deposit-sd ${sdBalanceInWallet.toString()}`).then((data: any) => {
                        if (data.status === "error") {
                            if (sdBalanceInWallet > 0n) {
                                setFeedback(data.error);
                            }
                        } else {
                            // stader says that I can stake - if I have enough in my wallet, enable button
                            setFeedback("");
                            setSdStakeButtonDisabled(false);
                        }
                    });
                }
            }
        }
    }, [nodeStatus, waitingForTx]);

    const stakeSD = (amount: bigint) => {
        staderCommand(`node deposit-sd ${amount}`).then((data: any) => {
            //{"status":"success","error":"","stakeTxHash":"0x41a93be5b4fb06e819975acc0cdb91c1084e4c1943d625a3a5f96d823842d0e8"}
            if (data.status === "error") {
                setFeedback(data.error);
            }
            setTxHash(data.stakeTxHash);
            setWaitingForTx(true);
        })
    }

    useEffect(() => {
        if (waitingForTx && txHash) {
            staderCommand(`wait ${txHash}`).then((data: any) => {
                const w3 = new web3(wsProvider(network));
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setWaitingForTx(false);
                    fetchNodeStatus();
                });
            });
        }
    }, [waitingForTx, txHash, utils]);

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">2. Stake SD</h4>
            {stakedSDBalance < requiredSDStake && (
                <>
                    {nodeStatus && (sdBalanceInWallet < requiredSDStake) &&
                        <>
                            <p>To add a validator you need {displayAsETH(sdMin)} SD in your wallet.</p>
                            <SendSD amount={requiredSDStake - sdBalanceInWallet} />
                        </>
                    }
                    <div className="field">
                        <button
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => stakeSD(requiredSDStake - stakedSDBalance)}
                            disabled={sdStakeButtonDisabled}>
                            Stake {displayAsETH(requiredSDStake - stakedSDBalance)} SD {waitingForTx ? <Spinner /> : ""}
                        </button>
                        <br />
                        {feedback && (
                            <>
                                <p className="help is-danger">{feedback}</p>
                                <br />
                            </>
                        )}
                    </div>
                </>
            )}
            {stakedSDBalance >= requiredSDStake && (
                <span className="tag is-success">Staked <span><FontAwesomeIcon className="icon" icon={faCheck} /></span></span>
            )}
            {txHash && (
                <>
                    <p>{etherscanTransactionUrl(network, txHash, "Transaction details on Etherscan")}</p>
                    <br />
                </>
            )}

        </div>);
}


export default StakeSD