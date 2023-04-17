import React from 'react';
import web3 from "web3";
import { networkType } from '../types';
// class Utils {
//     network: "prater" | "mainnet";
//     beaconChainBaseUrl : string;
//     etherscanBaseUrl: string;

//     constructor(network: "prater" | "mainnet") {
//         this.network = network;
//         this.beaconChainBaseUrl = ({
//             "prater": "https://prater.beaconcha.in",
//             "mainnet": "https://beaconcha.in",
//         })[this.network];

//         this.etherscanBaseUrl = ({
//             "prater": "https://goerli.etherscan.io",
//             "mainnet": "https://etherscan.io",
//         })[this.network];
//     }

//     beaconchainUrl(validatorPubkey:string, text:string) {
//         return <a target="_blank" rel="noopener noreferrer" href={this.beaconChainBaseUrl + "/validator/" + validatorPubkey + "#rocketpool"}>{text ? text : validatorPubkey}</a>;
//     }

//     

export function etherscanTransactionUrl(network: networkType, txHash: string, text: string) {
    return <a target="_blank" rel="noopener noreferrer" href={etherscanBaseUrl(network) + "/tx/" + txHash}>{text ? text : txHash}</a>;
}

export function displayAsETH(number: string, fractionDigits?: number) {
    if (!number)
        return 0;
    const result = web3.utils.fromWei(number, 'ether');
    if (fractionDigits)
        return parseFloat(result).toFixed(fractionDigits)
    return result
}

export function displayAsPercentage(number: string) {
    if (!number)
        return "- %";
    return parseFloat(number).toFixed(2) + "%";
}

export const etherscanBaseUrl = (network: networkType) => ({
    "prater": "https://goerli.etherscan.io",
    "mainnet": "https://etherscan.io",
})[network];

export function wsProvider(network: networkType) {
    return ({
        "prater": 'ws://goerli-geth.my.ava.do:8546',
        "mainnet": 'ws://ethchain-geth.my.ava.do:8546',
    })[network]
}

export function etherscanAddressUrl(network: networkType, address: string, text?: string) {
    return <a target="_blank" rel="noopener noreferrer" href={etherscanBaseUrl(network) + "/address/" + address}>{text ? text : address}</a>;
}