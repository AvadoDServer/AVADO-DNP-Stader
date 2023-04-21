import useSWR from "swr";
import { server_config } from "../server_config"
import { bcClientType, ecClientType, networkType } from "../types";

const get = (api_url: string) => {
    const fetcher = async (url: string) => await fetch(url).then((res) => res.json());
    return useSWR(api_url, fetcher);
}

export function useNetwork() {
    const api_url: string = `${server_config.monitor_url}/network`;
    const { data, error } = get(api_url)
    const network: networkType = data?.replace("goerli", "prater") ?? "mainnet"
    return { network, error };
}

export function useBeaconChainClientAndValidator() {
    const api_url: string = `${server_config.monitor_url}/bc-clients`;
    const { data, error } = get(api_url)
    const bcClient = (data ? data[0] : []) as bcClientType
    return { bcClient, error };
}

export function useExecutionClient() {
    const api_url: string = `${server_config.monitor_url}/ec-clients`;
    const { data, error } = get(api_url)
    const ecClient = (data ? data[0] : []) as ecClientType
    return { ecClient, error };
}

export type runningValidatorInfosType = {
    pubkey: string,
    data: {
        "index": string,
        "balance": string,
        "status": string,
        "validator": {
            "pubkey": string,
            "withdrawal_credentials": string,
            "effective_balance": string,
            "slashed": false,
            "activation_eligibility_epoch": string,
            "activation_epoch": string,
            "exit_epoch": string,
            "withdrawable_epoch": string
        }
    },
    recipient: {
        ethaddress: string
    }
}

export function useRunningValidatorInfos() {
    const api_url: string = `${server_config.monitor_url}/runningValidatorInfos`;
    const { data, error, mutate } = get(api_url)

    const refetch = () => mutate()

    return { validatorInfos: data as runningValidatorInfosType[], refetch, error };
}
