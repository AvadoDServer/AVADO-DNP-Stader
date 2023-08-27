import { useNetwork } from "../hooks/useServerInfo";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { server_config } from "../server_config";

interface Props {
    onFinish?: () => void
}

const RestoreBackup = ({ onFinish }: Props) => {
    const { network } = useNetwork()

    const [feedback, setFeedback] = useState<string | undefined>("");
    const [showDropzone, setShowDropzone] = useState(true);
    const [backupFile, setBackupFile] = useState<any>();

    const restoreBackup = async () => {
        try {
            const formData = new FormData();
            formData.append('backupFile', backupFile);

            const response = await fetch(`${server_config.monitor_url}/restore-backup`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setFeedback((await response.json()).message || "Backup restored");
            } else {
                setFeedback(response.statusText)
            }
        } catch (error) {
            setFeedback(JSON.stringify(error));
        }
    }

    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles.forEach((file: any) => {
            if (file.type == "application/zip") {
                setShowDropzone(false);
                setBackupFile(file)
                setFeedback(undefined)
            } else {
                setFeedback("Please upload a valid backup (zip) file")
            }
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div className="">
            {!showDropzone ? (
                <div className="border border-dashed border-green-500 bg-slate-200 w-full mb-2">
                    <div className="py-6 font-medium">{backupFile!.name}</div>
                </div>
            ) : (
                <>
                    <div><b>Drop your backup file here:</b></div>
                    <br />
                    <div
                        className="border border-dashed border-gray-500 bg-slate-200 w-full mb-2 p-2"
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <div className="">
                                <button className="btn btn-primary disabled my-2">
                                    Click to select file
                                </button>
                                <div>drop now</div>
                            </div>
                        ) : (
                            <div>
                                <button className="btn bg-gradient-to-r from-frens-blue to-frens-teal text-white no-animation my-2">
                                    Click to select file
                                </button>
                                <div>or simply drop it here</div>
                                {feedback && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        <strong className="font-bold">{feedback}</strong>
                                    </div>
                                )
                                }
                            </div>
                        )}
                    </div>
                </>
            )}
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={!backupFile}
                onClick={restoreBackup}>Restore backup</button>
            {feedback && (
                <p className="text-red-700">{feedback}</p>
            )}
        </div>);
}


export default RestoreBackup