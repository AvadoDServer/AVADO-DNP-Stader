import web3 from "web3";
import { useEffect, useState } from "react";
import { useStaderStatus } from "../lib/status";
import { staderCommand } from "../lib/staderDaemon"
import { etherscanTransactionUrl, wsProvider } from "../utils/utils"
import { useNetwork } from "../hooks/useServerInfo";
import { useAccount } from "wagmi";
import ButtonSpinner from "./ButtonSpinner";

interface Props {
    onFinished: () => void
}

const RegisterNode = ({ onFinished }: Props) => {
    const { nodeStatus, fetchWalletStatus, fetchNodeStatus } = useStaderStatus()
    const { network } = useNetwork()
    const { address: accountAddress } = useAccount();


    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [txHash, setTxHash] = useState<string>();
    const [waitingForTx, setWaitingForTx] = useState(false);
    const [error, setError] = useState<string>();
    const [gasInfo, setGasInfo] = useState();

    const [name, setName] = useState<string>();

    useEffect(() => {
        setButtonDisabled(true); //set default
        if (waitingForTx)
            return;
        if (nodeStatus && !nodeStatus.registered && BigInt(nodeStatus.accountBalances.eth) > BigInt(0)) {

            staderCommand(`node can-register "${name}" "${accountAddress}" true`).then((data: any) => {
                if (data.status === "error") {
                    setError("Error running can-register: " + data.error + (data.registrationDisabled ? " Node registrations are currently disabled." : ""));
                    return;
                }
                if (data.alreadyRegistered) {
                    setError("Already registered");
                    return;
                }
                if (data.operatorNameTooLong) {
                    setError("Operator name too long");
                    return;
                }
                if (data.operatorRewardAddressZero) {
                    setError("Invalid operator Address");
                    return;
                }
                if (data.registrationPaused) {
                    setError("Registration is currently paused");
                    return;
                }
                setError(undefined);
                setButtonDisabled(false);
                setGasInfo(data.gasInfo);
            });
        }
    }, [nodeStatus, name, accountAddress]);

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

    }, [waitingForTx]);

    const registerNode = () => {
        staderCommand(`node register "${name}" "${accountAddress}" true}`).then((data: any) => {
            // "data": "{\"status\":\"success\",\"error\":\"\",\"txHash\":\"0x0691e410226264f411ee7a66285a78ec5c5776352cd038f66fb651ba10365381\"}\n",
            if (data.status === "error") {
                setError(data.error)
                setTxHash("");
                setWaitingForTx(false);
                setButtonDisabled(false);
            } else {
                setError("")
                fetchNodeStatus();
                setTxHash(data.txHash);
                setWaitingForTx(true);
                setButtonDisabled(true);
            }
        }).catch(e => {
            console.log(e)
        })

    }

    return (
        <div>
            <div className="text-5xl pb-5">Choose a name for your node.</div>
            {nodeStatus && !nodeStatus.registered && (
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                             {"emoji's are allowed 😎"}
                        </label>
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </div>

                        <hr className="mt-10 pt-5 " />

                        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <button
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={registerNode}
                                disabled={name == "" || buttonDisabled}>
                                {waitingForTx ? (                                
                                <ButtonSpinner text={`Registering node`} />
                                ) : "Register Node"}
                            </button>
                        </div>
                        {error && (<p className="help is-danger">{error}</p>)}
                        {txHash && (
                            <p>{etherscanTransactionUrl(network, txHash, "Transaction details on Etherscan")}</p>
                        )}
                    </div>
                </div>

            )}
        </div>

    )
};

export default RegisterNode