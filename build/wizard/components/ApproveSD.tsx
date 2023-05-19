import { wsProvider, etherscanTransactionUrl } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";

import { useEffect, useState } from "react";
import { staderCommand } from "../lib/staderDaemon"
import web3 from "web3";
import { } from "../utils/utils"
import Spinner from "./Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ButtonSpinner from "./ButtonSpinner";

interface Props {
}

const ApproveSD = ({ }: Props) => {
    const [sdApproveButtonDisabled, setSdApproveButtonDisabled] = useState(true);
    const [txHash, setTxHash] = useState();
    const [waitingForTx, setWaitingForTx] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [sdlAllowanceOK, setSdAllowanceOK] = useState(false);

    useEffect(() => {
        checkAllowance();
    }, []);

    const { network } = useNetwork()


    const checkAllowance = () => {
        setSdApproveButtonDisabled(false);

        staderCommand(`node deposit-sd-allowance`).then((data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            } else {
                const allowance: bigint = BigInt(data.allowance)
                if (allowance > 0) {
                    setSdApproveButtonDisabled(true);
                    setSdAllowanceOK(true);
                } else {
                    setSdApproveButtonDisabled(false);
                    setSdAllowanceOK(false);
                }
            }
        });
    }

    const approveSD = () => {
        const maxApproval = ((BigInt(2) ** BigInt(256)) - BigInt(1)).toString()

        staderCommand(`node deposit-sd-approve-sd ${maxApproval}`).then((data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
            }
            setTxHash(data.approveTxHash);
            setWaitingForTx(true);
            setSdApproveButtonDisabled(true);
        })
    }

    useEffect(() => {
        if (waitingForTx && txHash) {
            staderCommand(`wait ${txHash}`).then((data: any) => {
                const w3 = new web3(wsProvider(network));
                w3.eth.getTransactionReceipt(txHash).then((receipt) => {
                    console.log(receipt);
                    setWaitingForTx(false);
                    checkAllowance();
                });
            });
        }
    }, [waitingForTx, txHash, network]);

    return (
        <div className="">
            <h4 className="title is-4 has-text-white">1. Approve SD</h4>
            {!sdlAllowanceOK && (
                <>
                    <p>Approve the staking contract to use the SD in your hot-wallet.</p>
                    <br />
                    <div className="field">
                        <button
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={approveSD}
                            disabled={sdApproveButtonDisabled}>
                            {waitingForTx ? <ButtonSpinner text={`Approving...`} /> : "Approve"}
                        </button>
                    </div>
                </>
            )}
            {feedback && (
                <p className="help is-danger">{feedback}</p>
            )}
            {sdlAllowanceOK && (
                <span className="tag is-success">Approved <span><FontAwesomeIcon className="icon" icon={faCheck} /></span></span>
            )}
            {txHash && (
                <p>{etherscanTransactionUrl(network, txHash, "Transaction details on Etherscan")}</p>
            )}
        </div>);
}


export default ApproveSD