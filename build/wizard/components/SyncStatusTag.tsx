import React from "react";

interface Props {
    progress: number, // progress: a number between 0 and 1
    label?: string
}

const SyncStatusTag = ({ progress, label }: Props) => {
    const className = progress === 1 ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"

    return (
        <div className={`ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ${className} rounded-full`}>
               {(label ? `${label} ` : "") + (Math.floor(progress * 100 * 100) / 100).toFixed(2) + "% synced"}
            </div>
    );
};

export default SyncStatusTag


