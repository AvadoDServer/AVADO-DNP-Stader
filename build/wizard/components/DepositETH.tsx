import Spinner from "./Spinner";
import web3 from "web3";
import DownloadBackup from "./DownloadBackup";
import { useStaderStatus } from "../lib/status";
import { etherscanTransactionUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { useEffect, useState } from "react";
import { staderCommand } from "../lib/staderDaemon"
import ButtonSpinner from "./ButtonSpinner";
import { clearInterval } from "timers";

interface Props {
    currentNumberOfValidators: number
    numValidators: number,
    onFinish?: () => void
}

const DepositETH = ({ currentNumberOfValidators, numValidators,  onFinish }: Props) => {
    const { nodeStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const [ethButtonDisabled, setEthButtonDisabled] = useState(true);
    const [feedback, setFeedback] = useState<string>("");
    const [txHash, setTxHash] = useState<string>();
    const [waitingForTx, setWaitingForTx] = useState(false);

    const ETHDepositAmount: bigint = 4000000000000000000n

    // stader command arguments to add an extra validator
    const salt = "0"
    const reloadKeys = false

    useEffect(() => {
        if (waitingForTx)
            return;

        setEthButtonDisabled(false); //set default
        if (nodeStatus) {
            staderCommand(`validator can-deposit ${ETHDepositAmount.toString()} ${numValidators} ${reloadKeys}`).then((data: any) => {
                if (data.status === "error") {
                    setFeedback(data.error);
                } else {
                    setFeedback("");
                    setEthButtonDisabled(false);
                }
            });
        }
    }, [nodeStatus, waitingForTx, ETHDepositAmount, reloadKeys]);

    useEffect(() => {
        if (waitingForTx && txHash) {
            staderCommand(`wait ${txHash}`).then((data: any) => {
                // const w3 = new web3(wsProvider(network));
                // w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                //     console.log(receipt);
                    setWaitingForTx(false);
                    fetchNodeStatus();
                    onFinish?.()
                // });
            });
        }
    }, [waitingForTx, txHash, fetchNodeStatus, network, onFinish]);

    const depositEth = () => {
        staderCommand(`validator deposit ${ETHDepositAmount.toString()} ${numValidators} ${reloadKeys}`).then((data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            } else {
                setWaitingForTx(true);
                setTxHash(data.txHash);
            }
        })
    }

    return (
        <div className="">
            {nodeStatus && nodeStatus.sdCollateralWorthValidators > currentNumberOfValidators && (
                <>
                    <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={depositEth} disabled={ethButtonDisabled}>
                        {waitingForTx ? <ButtonSpinner text={`Adding validators...`} /> : `Add ${numValidators} stader validator(s)`}
                    </button>
                </>
            )}
            <br />
            {feedback && (
                <p className="text-red-700">{feedback}</p>
            )}
            {txHash && !waitingForTx && (
                <>
                    {etherscanTransactionUrl(network, txHash, "Transaction details on Etherscan")}
                </>
            )}
        </div>);
}


export default DepositETH