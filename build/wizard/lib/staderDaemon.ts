import { server_config } from "../server_config";

export const staderCommandRaw = async (command: string) => {
    const response = await window.fetch(`${server_config.monitor_url}/rpd`, {
        method: 'POST',
        headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ command }),
    })
    const result = await response.json()

    // wrap bignumbers in quotes
    var json = result.replace(/([\[:])?(\d{9,})([,\}\]])/g, "$1\"$2\"$3");
    console.log(command, json)

    return json
}

export const staderCommand = async (command: string) => {
    return JSON.parse(await staderCommandRaw(command))
}