import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { walletStatusType } from "../types";
import { useStaderStatus } from "../lib/status";
import { staderCommandRaw, staderCommand } from "../lib/staderDaemon"
import DownloadBackup from "./DownloadBackup";
import ApproveSD from "./ApproveSD";
import StakeSD from "./StakeSD";
import DepositETH from "./DepositETH";

interface Props {

}

const AddValidator = ({ }: Props) => {

    return <>
        <ApproveSD />
        <StakeSD />
        <DepositETH />
    </>
}

export default AddValidator