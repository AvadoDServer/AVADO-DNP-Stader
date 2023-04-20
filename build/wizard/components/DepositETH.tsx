import Spinner from "./Spinner";
import web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DownloadBackup from "./DownloadBackup";
import { useStaderStatus } from "../lib/status";
import { displayAsETH, displayAsPercentage, etherscanBaseUrl, etherscanTransactionUrl, wsProvider } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { utils } from 'ethers'
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useWaitForTransaction,
} from 'wagmi'
import { useEffect, useState } from "react";
import { staderCommand } from "../lib/staderDaemon"
import SendEth from "./SendEth";


interface Props {
    currentNumberOfValidators: number
    onFinish?: () => void
}

const DepositETH = ({ currentNumberOfValidators, onFinish }: Props) => {
    const { nodeStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const [ethButtonDisabled, setEthButtonDisabled] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [txHash, setTxHash] = useState();
    const [waitingForTx, setWaitingForTx] = useState(false);

    const ETHDepositAmount: bigint = 4000000000000000000n
    const ethBalanceInWallet = BigInt(nodeStatus.accountBalances.eth)


    // stader command arguments to add an extra validator
    const salt = "0"
    const numValidators = 1
    const submit = true

    useEffect(() => {
        if (waitingForTx)
            return;

        setEthButtonDisabled(true); //set default
        if (nodeStatus) {

            if (ethBalanceInWallet < ETHDepositAmount) {
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

    const finish = () => {
        fetchNodeStatus()
        onFinish?.()
    }

    if (!nodeStatus) {
        return null;
    }

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">3. Deposit 4 ETH</h4>

            {nodeStatus && ethBalanceInWallet < ETHDepositAmount && (
                <>
                    <p>To add a validator you need {displayAsETH(ETHDepositAmount)} ETH in your wallet.</p>
                    <SendEth amount={ETHDepositAmount} />
                </>
            )}

            {nodeStatus && nodeStatus.sdCollateralWorthValidators > currentNumberOfValidators && (
                <>
                    <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={depositEth} disabled={ethButtonDisabled}>Deposit 4 ETH {waitingForTx ? <Spinner /> : ""}
                    </button>
                </>
            )}
            {feedback && (
                <p className="help is-danger">{feedback}</p>
            )}

            {txHash && !waitingForTx && (
                <>
                    {etherscanTransactionUrl(network, txHash, "Transaction details on Etherscan")}

                    <p>Please download a backup of your whole Stader configuration now!</p>
                    <DownloadBackup />

                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={finish}
                    >
                        Close
                    </button>

                </>
            )}
        </div>);
}


export default DepositETH