import Spinner from "./Spinner";
import web3 from "web3";
import { useStaderStatus } from "../lib/status";
import { displayAsETH, etherscanTransactionUrl, wsProvider } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { useEffect, useState } from "react";
import { staderCommand } from "../lib/staderDaemon";

interface Props {
    amount: bigint
}

const StakeSD = ({ amount }: Props) => {
    const { nodeStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const [sdStakeButtonDisabled, setSdStakeButtonDisabled] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [txHash, setTxHash] = useState();
    const [waitingForTx, setWaitingForTx] = useState(false);

    const sdBalanceInWallet = BigInt(nodeStatus.accountBalances.sd)
    const sdMin = BigInt("1000000000000000000000")
    const stakedSDBalance = BigInt(nodeStatus.depositedSdCollateral)

    useEffect(() => {
        setSdStakeButtonDisabled(true); //set default

        if (waitingForTx)
            return;

        if (nodeStatus) {
            if (sdBalanceInWallet > 0n) {
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
    }, [nodeStatus, waitingForTx]);

    const stakeSD = (amount: bigint) => {
        staderCommand(`node deposit-sd ${amount}`).then((data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            } else {
                setTxHash(data.stakeTxHash);
                setWaitingForTx(true);
            }
        })
    }

    useEffect(() => {
        if (waitingForTx && txHash) {
            staderCommand(`wait ${txHash}`).then((data: any) => {
                // const w3 = new web3(wsProvider(network));
                // w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                //     console.log(receipt);
                    setWaitingForTx(false);
                    fetchNodeStatus();
                // });
            });
        }
    }, [waitingForTx, txHash]);

    return (
        <div>
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => stakeSD(amount)}
                disabled={sdStakeButtonDisabled}>
                Deposit {displayAsETH(amount)} SD {waitingForTx ? <Spinner /> : ""}
            </button>
            <br />
            {txHash && (
                <>
                    <p>{etherscanTransactionUrl(network, txHash, "Transaction details on Etherscan")}</p>
                    <br />
                </>
            )}
        </div>);
}


export default StakeSD