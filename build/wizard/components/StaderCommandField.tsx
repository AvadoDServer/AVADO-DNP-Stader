import React from "react";
import { staderCommandRaw } from "../lib/staderDaemon"

const StaderCommandField = () => {

    const [command, setCommand] = React.useState<string>();
    const [runButtonEnabled, setRunButtonEnabled] = React.useState<boolean>(true);
    const [result, setResult] = React.useState<string>();

    const runCommand = async () => {
        if (command) {
            setRunButtonEnabled(false)

            const result = await staderCommandRaw(command)
            try {
                setResult(JSON.stringify(JSON.parse(result), null, 2))
            } catch {
                setResult(result)
            }
            setRunButtonEnabled(true)
        }
    }

    const handleKeypress = (e: any) => {
        //it triggers by pressing the enter key
        if (["Enter", "NumpadEnter"].includes(e.code)) {
            runCommand();
        }
    };

    return (
        <>
            <h2 className="title is-3 has-text-white">Run a manual Stader command</h2>
            <div className="w-full max-w-sm">
                <div className="flex items-center py-2">
                    <label className="label">Stader command:</label>
                    <input className="appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2"
                        type="text"
                        placeholder="Type command (e.g. &quot;api node status&quot;)"
                        aria-label="stader command"
                        onChange={(e) => { setCommand(e.target.value) }}
                        onKeyDown={handleKeypress}
                    />
                    <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                        type="button"
                        disabled={!runButtonEnabled}
                        onClick={runCommand}
                    >
                        Run
                    </button>
                </div>
                {result && (
                    <>
                        {/* <div className="container"> */}
                        <pre className="transcript">
                            {result.replace(/\\n/g, "\n")}
                        </pre>
                        {/* </div> */}
                    </>
                )}
            </div>
        </>
    );
}


export default StaderCommandField