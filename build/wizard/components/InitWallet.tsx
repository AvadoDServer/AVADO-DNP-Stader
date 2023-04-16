import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { walletStatusType } from "../types";
import { useStaderStatus } from "../lib/status";
import { staderCommandRaw, staderCommand } from "../lib/staderDaemon"
import DownloadBackup from "./DownloadBackup";

interface Props {
    onFinished: () => void
}

const InitWallet = ({ onFinished }: Props) => {

    const [password, setPassword] = React.useState("");
    const [verifyPassword, setVerifyPassword] = React.useState("");
    const [passwordFeedback, setPasswordFeedback] = React.useState("");
    const [passwordFieldType, setPasswordFieldType] = React.useState("password");
    const [passwordFieldIcon, setPasswordFieldIcon] = React.useState(faEyeSlash);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [walletMnemonic, setWalletMnemonic] = React.useState("");
    const [walletAddress, setWalletAddress] = React.useState("");
    const [initialWalletStatus, setInitialWalletStatus] = React.useState<walletStatusType>();

    const { walletStatus, fetchWalletStatus, fetchNodeStatus } = useStaderStatus()

    const toggleViewPassword = () => {
        const currentType = passwordFieldType;
        setPasswordFieldType(currentType === "password" ? "text" : "password");
        setPasswordFieldIcon(currentType === "password" ? faEye : faEyeSlash);
    }

    useEffect(() => {
        //{"status":"error","error":"Invalid wallet password 'test' - must be at least 12 characters long"}
        if (password.length < 12) {
            setPasswordFeedback("Invalid wallet password - must be at least 12 characters long");
            setButtonDisabled(true);
        } else if (password !== verifyPassword) {
            setPasswordFeedback("Invalid wallet password - passwords do not match");
            setButtonDisabled(true);
        } else {
            setPasswordFeedback("");
            setButtonDisabled(false);
        }
    }, [password, verifyPassword]);

    useEffect(() => {
        fetchWalletStatus()
    }, []);

    useEffect(() => {
        if (!initialWalletStatus)
            setInitialWalletStatus(walletStatus);
    }, [walletStatus, initialWalletStatus]);

    // Future improvement: allow recovery (`wallet recover mnemonic`)
    const initWallet = async () => {
        if (!walletStatus.passwordSet) {
            const data1 = await staderCommand("wallet set-password \"" + password + "\"")
            if (data1.status === "error") {
                setPasswordFeedback(data1.error);
                return;
            }

            const data2 = await staderCommand("wallet init")
            if (data2.status === "error") {
                setPasswordFeedback(data2.error);
            }
            setWalletAddress(data2.accountAddress);
            setWalletMnemonic(data2.mnemonic);

            // Do a recover to save the wallet
            const data3 = await staderCommand(`wallet recover "${data2.mnemonic}"`)
            if (data3.status === "error") {
                setPasswordFeedback(data3.error);
            }
            setButtonDisabled(true);
            fetchWalletStatus();
            fetchNodeStatus();
        }
    }

    return (
        <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">Init wallet</h1>
            {initialWalletStatus && !initialWalletStatus.walletInitialized && (
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">

                        {(!walletStatus.accountAddress || walletStatus.accountAddress === "0x0000000000000000000000000000000000000000") ? (
                            <>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    We will create a hot wallet that you will use for your minipool.
                                </p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Rocket pool node password
                                        </label>
                                        <p className="mt-3 text-sm leading-6 text-gray-600">This is the password that will encrypt your Rocket Pool (hot) wallet - minimum length  =  12 characters.</p>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input
                                                    type={passwordFieldType}
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                    onChange={(e) => { setPassword(e.target.value) }}
                                                />
                                                <button
                                                    onClick={toggleViewPassword}
                                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                >
                                                    <FontAwesomeIcon
                                                        className="icon is-small is-right avadoiconpadding"
                                                        icon={passwordFieldIcon}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Verify Password
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input
                                                    type={passwordFieldType}
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                    onChange={(e) => { setVerifyPassword(e.target.value) }}
                                                />
                                            </div>
                                        </div>
                                        {password && (
                                            <p className="text-red-700">{passwordFeedback}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <button
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={initWallet}
                                        disabled={buttonDisabled}>
                                        Init Wallet
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div>
                                <p>Your Stader hot-wallet has been created and its address is {walletStatus.accountAddress}</p>
                                <br />
                                <div className="columns">
                                    <div className="column is-two-thirds">
                                        <article className="message is-warning ">
                                            <div className="message-header">
                                                <p>Download backup</p>
                                            </div>
                                            <div className="message-body">
                                                <p>Please download a backup of your hot wallet before continuing!</p><br />
                                                <DownloadBackup description="Download backup of my wallet" /><br /><br />
                                            </div>
                                        </article>
                                    </div>
                                </div>
                                <button
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={() => { onFinished() }}
                                >
                                    I downloaded a backup of my wallet - continue to next step
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            )}
        </div>

    );
};

export default InitWallet