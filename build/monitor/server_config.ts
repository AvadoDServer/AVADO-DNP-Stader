import { readFileSync } from "fs";

const localdev = process.env.LOCALDEV || false;

const network = () => {
    var env_network = process.env.NETWORK ?? "mainnet" // use goerli by default
    if (env_network === "prater") env_network = "goerli" // use goerli if env variable is set to prater
    return env_network
}

const packageName = () => {
    switch (network()) {
        case "mainnet":
            return "stader.avado.dappnode.eth"
        default:
            return "stader-goerli.avado.dappnode.eth"
    }
}

export const server_config = {
    network: network(),
    name: "stader",
    https_options: localdev ? {} : {
        key: readFileSync('/etc/nginx/my.ava.do.key'),
        certificate: readFileSync('/etc/nginx/my.ava.do.crt')
    },
    packageName: packageName()
}