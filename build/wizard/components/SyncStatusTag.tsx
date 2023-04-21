import React from "react";
import { ClientStatusType } from "../types";

interface Props {
    clientStatus: ClientStatusType,
    label?: string
}

const SyncStatusTag = ({ clientStatus, label }: Props) => {
    const progress = clientStatus.syncProgress

    var message = ""
    var className = "";

    if (clientStatus.isWorking == false) {
        className = "bg-red-200 text-red-700"
        message = `${(label ? `${label} ` : "")}not connected`
    } else {
        className = progress === 1 ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"
        message = (label ? `${label} ` : "") + (Math.floor(progress * 100 * 100) / 100).toFixed(2) + "% synced"
    }


    return (
        <div className={`ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ${className} rounded-full`}>
            {message}
        </div>
    );
};

export default SyncStatusTag


