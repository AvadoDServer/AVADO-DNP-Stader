import { server_config } from "../server_config";

export const staderCommandRaw = async (command: string) => {
    const response = await window.fetch(`${server_config.monitor_url}/stader-any`, {
        method: 'POST',
        headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ command }),
    })
    const result = await response.json()

    // const json = enquoteBigNumbers(result)
    // try {
    //     console.log(command, JSON.stringify(JSON.parse(json), null, 2));
    // } catch {
    //     console.log(command, json);
    // }
    return result
}
// function that implements desired criteria to separate *big numbers* from *small* ones
// const isBigNumber = (num: string | number) => !Number.isSafeInteger(+num)

// https://stackoverflow.com/questions/69644298/how-to-make-json-parse-to-treat-all-the-numbers-as-bigint
// function that enquotes *big numbers* matching desired criteria into double quotes inside JSON string
// const enquoteBigNumbers = (jsonString: string) =>
//     jsonString
//         .replaceAll(
//             /([:\s\[,]*)(\d+)([\s,\]]*)/g,
//             (matchingSubstr, prefix, bigNum, suffix) =>
//                 isBigNumber(bigNum) ? `${prefix}"${bigNum}"${suffix}` : matchingSubstr
//         )

const JSONParse = (json : string) => {
    /*
      Big numbers are found and marked using Regex with this condition:
      Number's length is bigger than 16 || Number's length is 16 and any numerical digit of the number is greater than that of the Number.MAX_SAFE_INTEGER
    */
    const numbersBiggerThanMaxInt =
      /([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g;
    const serializedData = json.replace(numbersBiggerThanMaxInt, '$1"$2n"$3');
  
    return JSON.parse(serializedData, (_, value) => {
      const isCustomFormatBigInt =
        typeof value === "string" && value.match(/^\d+n$/);
  
      if (isCustomFormatBigInt)
        return BigInt(value.substring(0, value.length - 1));
  
      return value;
    });
  };

export const staderCommand = async (command: string) => {
    const json = await staderCommandRaw(` api ${command}`)
    try {
        return JSONParse(json);
    } catch (e: unknown) {
        debugger;
        if (e instanceof Error) {
            return ({
                status: "error",
                message: e.message,
                "error": json
            })
        } else {
            return ({
                status: "error",
                "error": json
            })
        }
    }

    // return JSON.parse(await staderCommandRaw(command),
    //     (key, value) => !isNaN(value) && isBigNumber(value) ? BigInt(value) : value
    // )
}