import Spinner from "./Spinner";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DownloadBackup from "./DownloadBackup";
import { useStaderStatus } from "../lib/status";
import { displayAsPercentage, etherscanBaseUrl, etherscanTransactionUrl, wsProvider } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { utils } from 'ethers'
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
} from 'wagmi'
import { useEffect, useState } from "react";
import { staderCommand } from "../lib/staderDaemon"


interface Props {
}

const DepositETH = ({ }: Props) => {
    const { nodeStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const [ethButtonDisabled, setEthButtonDisabled] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [txHash, setTxHash] = useState();
    const [waitingForTx, setWaitingForTx] = useState(false);

    const ETHDepositAmount: bigint = 4000000000000000000n

    const salt = "0"
    const numValidators = 1
    const submit = true

    useEffect(() => {
        if (waitingForTx)
            return;

        setEthButtonDisabled(true); //set default
        if (nodeStatus) {

            if ((BigInt(nodeStatus.accountBalances.eth) / 1000000000000000000n) < 4n) {
                setFeedback("There is not enough ETH in your wallet. You need at least 4 ETH + gas.")
            } else {
                staderCommand(`node can-deposit ${ETHDepositAmount} ${salt} ${numValidators} ${submit}`).then((data: any) => {
                    if (data.status === "error") {
                        setFeedback(data.error);
                    } else {
                        setFeedback("");
                    }
                    setEthButtonDisabled(false);
                });
            }

        }
    }, [nodeStatus, waitingForTx]);


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

    const depositEth = () => {
        staderCommand(`node deposit ${ETHDepositAmount} ${salt} ${numValidators} ${submit}`).then((data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            }
            setWaitingForTx(true);
            setTxHash(data.txHash);
        })
    }

    if (!nodeStatus) {
        return null;
    }

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">3. Deposit 4 ETH</h4>

            <>
                <div className="field">
                    <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={depositEth} disabled={ethButtonDisabled}>Deposit 4 ETH {waitingForTx ? <Spinner /> : ""}</button>
                </div>
                {feedback && (
                    <p className="help is-danger">{feedback}</p>
                )}
                <br />
            </>

            {txHash && !waitingForTx && (
                <>
                    <br />
                    <p>Your MiniPool has been successfully created! Click the button below to go to the status page.</p>
                    <p>{etherscanTransactionUrl(network, txHash, "Transaction details on Etherscan")}</p>
                    <br />
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <article className="message is-warning ">
                                <div className="message-header">
                                    <p>Download backup</p>
                                </div>
                                <div className="message-body">
                                    <p>Please download a backup of your whole minipool configuration now!</p>
                                    <DownloadBackup />
                                </div>
                            </article>
                        </div>
                    </div>
                    <br />
                    <p>
                        <button className="button" onClick={() => {
                            fetchNodeStatus();
                        }} >Go to the status page</button>
                    </p>
                    <br />
                </>
            )}
        </div>);
}


export default DepositETH