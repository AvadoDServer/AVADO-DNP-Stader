import { server_config } from "../server_config";

export const staderCommandRaw = async (command: string) => {
    const response = await window.fetch(`${server_config.monitor_url}/stader-any`, {
        method: 'POST',
        headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ command }),
    })
    const result = await response.json()

    const json = enquoteBigNumbers(result)
    try {
        console.log(command, JSON.stringify(JSON.parse(json), null, 2));
    } catch {
        console.log(command, json);
    }
    return json
}
// function that implements desired criteria to separate *big numbers* from *small* ones
const isBigNumber = (num: string | number) => !Number.isSafeInteger(+num)

// https://stackoverflow.com/questions/69644298/how-to-make-json-parse-to-treat-all-the-numbers-as-bigint
// function that enquotes *big numbers* matching desired criteria into double quotes inside JSON string
const enquoteBigNumbers = (jsonString: string) =>
    jsonString
        .replaceAll(
            /([:\s\[,]*)(\d+)([\s,\]]*)/g,
            (matchingSubstr, prefix, bigNum, suffix) =>
                isBigNumber(bigNum) ? `${prefix}"${bigNum}"${suffix}` : matchingSubstr
        )

export const staderCommand = async (command: string) => {
    const json = await staderCommandRaw(` api ${command}`)
    try {
        return JSON.parse(json);
    } catch (e) {
        return ({
            status: "error",
            "error": json
        })
    }

    // return JSON.parse(await staderCommandRaw(command),
    //     (key, value) => !isNaN(value) && isBigNumber(value) ? BigInt(value) : value
    // )
}