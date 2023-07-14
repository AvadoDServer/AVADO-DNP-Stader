import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { walletStatusType } from "../types";
import { useStaderStatus } from "../lib/status";
import { staderCommand } from "../lib/staderDaemon"
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
    const [enableContinue, setEnableContinue] = React.useState(false);

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
    },[]);

    useEffect(() => {
        if (!initialWalletStatus)
            setInitialWalletStatus(walletStatus);
    }, [walletStatus, initialWalletStatus]);

    // Future improvement: allow recovery (`wallet recover mnemonic`)
    const initWallet = async () => {
        debugger;
        if (!walletStatus.passwordSet) {
            const data1 = await staderCommand(`wallet set-password ${JSON.stringify(password)}`)
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
            const data3 = await staderCommand(`wallet recover "${data2.mnemonic}" --skip-validator-key-recovery`)
            if (data3.status === "error") {
                setPasswordFeedback(data3.error);
            }
            setButtonDisabled(true);
            fetchWalletStatus();
            fetchNodeStatus();
        }
    }

    const initWalletForm = () => <>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
                <label className="text-5xl">
                    Let&apos;s create a hot-wallet for your node.
                </label>
                <p className="mt-3 text-sm leading-6 text-gray-600">Choose a password to encrypt your Stader wallet - minimum length is 12 characters.</p>
                <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                            type={passwordFieldType}
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            onChange={(e) => { setPassword(e.target.value); }} />
                        <button
                            onClick={toggleViewPassword}
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <FontAwesomeIcon
                                className="icon is-small is-right avadoiconpadding"
                                icon={passwordFieldIcon} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pb-5">
            <div className="sm:col-span-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                    Verify Password
                </label>
                <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                            type={passwordFieldType}
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            onChange={(e) => { setVerifyPassword(e.target.value); }} />
                    </div>
                </div>
                {password && (
                    <p className="text-red-700">{passwordFeedback}</p>
                )}
            </div>
        </div>

        <hr className="pb-5" />

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={initWallet}
                disabled={buttonDisabled}>
                Init Wallet
            </button>
        </div>
    </>;
    const walletResult = <div>
        <p className="text-5xl pb-5">Your Stader hot-wallet has been created.</p>
        <p className="text-base">Its address is {walletStatus.accountAddress}</p>
        <br />
        <div className="columns">
            <div className="column is-two-thirds">
                <article className="message is-warning ">
                    {/* <div className="message-header">
                        <p>Download backup</p>
                    </div> */}
                    <div className="message-body">
                        {/* <p>Please download a backup of your hot wallet before continuing!</p><br /> */}
                        <DownloadBackup description="Download backup of my wallet" /><br /><br />
                    </div>
                </article>
            </div>
        </div>

        <hr className="pb-5" />

        <div className="grid max-w-2xl grid-cols-1 sm:grid-cols-2 md:col-span-2">
            <div className="sm:col-span-1 flex items-center">
                <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                        <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            onChange={(e) => {
                                setEnableContinue(e.target.checked);
                            }}
                            className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                        />
                    </div>
                    <div className="text-sm leading-6">
                        <label className="font-medium">
                            I downloaded a backup of my wallet
                        </label>
                    </div>
                </div>
            </div>
            <div className="sm:col-span-1">
                {enableContinue ? (
                    <button
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => { onFinished(); }}
                    >
                        continue to next step
                    </button>

                ) : (
                    <button
                        className="cursor-not-allowed opacity-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => { onFinished(); }}
                    >
                        continue to next step
                    </button>

                )}
            </div>

        </div>








    </div>;
    return (
        <div>
            {/* <h1 className="text-base font-semibold leading-7 text-gray-900">Init walletzz</h1> */}
            {initialWalletStatus && (
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">

                        {(!walletStatus.accountAddress || walletStatus.accountAddress === "0x0000000000000000000000000000000000000000") ? (
                            initWalletForm()
                        ) : (
                            walletResult
                        )}
                    </div>
                </div>

            )}
        </div>

    );
};

export default InitWallet