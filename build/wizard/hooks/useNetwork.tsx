import useSWR from "swr";
import { server_config } from "../server_config"
import { networkType } from "../types";

const get = (api_url: string) => {
    const fetcher = async (url: string) => await fetch(url).then((res) => res.json());
    return useSWR(api_url, fetcher);
}

export function useNetwork() {
    const api_url: string = `${server_config.monitor_url}/network`;
    const { data, error } = get(api_url)
    const network: networkType = data?.replace("goerli","prater") ?? "mainnet"
    return { network, error };
}
