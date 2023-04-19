import { server_config } from "../server_config";

interface Props {
    description ?: string
}

const DownloadBackup = ({ description } : Props) => {

    const downloadBackup = () => {
        window.location.href = `${server_config.monitor_url}/stader-backup.zip`;
    }

    return (
        <button
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={downloadBackup}>{description || "Download Stader Backup"}</button>
    );

}


export default DownloadBackup;