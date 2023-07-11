import { readFileSync } from "fs";

const localdev = process.env.LOCALDEV || false;

const network = () => {
    var env_network = process.env.NETWORK ?? "mainnet" // use goerli by default
    if (env_network === "prater") env_network = "goerli" // use goerli if env variable is set to prater
    return env_network
}

export const server_config = {
    network: network(),
    name: "stader",
    https_options: localdev ? {} : {
        key: readFileSync('/etc/nginx/my.ava.do.key'),
        certificate: readFileSync('/etc/nginx/my.ava.do.crt')
    },
    packageName: "stader.avado.dappnode.eth"
}