import { readFileSync } from "fs";

const localdev = false;

export const server_config = {
    network: localdev ? "goerli" : process.env.NETWORK ?? "goerli", // either "goerli" or "mainnet"
    name: "stader",
    https_options: localdev ? {} : {
        key: readFileSync('/etc/nginx/my.ava.do.key'),
        certificate: readFileSync('/etc/nginx/my.ava.do.crt')
    },
    packageName: "stader.avado.dappnode.eth"
}