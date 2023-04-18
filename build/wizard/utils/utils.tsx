import React from 'react';
import web3 from "web3";
import { networkType } from '../types';

export function etherscanTransactionUrl(network: networkType, txHash: string, text: string) {
    return <a target="_blank" rel="noopener noreferrer" href={etherscanBaseUrl(network) + "/tx/" + txHash}>{text ? text : txHash}</a>;
}

export function displayAsETH(num: string | bigint, fractionDigits?: number) {
    if (!num)
        return 0;
    const result = web3.utils.fromWei(num.toString(), 'ether');
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


export const beaconchainUrl = (network: networkType, validatorPubkey: string, text?: string) => {
    return <a target="_blank" rel="noopener noreferrer" href={beaconChainBaseUrl(network) + "/validator/" + validatorPubkey + "#rocketpool"}>{text ? text : validatorPubkey}</a>;
}

const beaconChainBaseUrl = (network: networkType) => ({
    "prater": "https://prater.beaconcha.in",
    "mainnet": "https://beaconcha.in",
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