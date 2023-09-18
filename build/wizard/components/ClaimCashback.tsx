import {
    ChevronDownIcon
} from '@heroicons/react/20/solid'
import { server_config } from '../server_config';
import { useEffect, useState } from "react";
import { useStaderStatus } from "../lib/status"
import AddValidator from './AddValidator';
import { abbreviatePublicKey, beaconchainUrl } from "../utils/utils"
import { useBeaconChainClientAndValidator, useNetwork, useRunningValidatorInfos, useParams } from '../hooks/useServerInfo';
import { ValidatorStates } from '../types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSatelliteDish } from "@fortawesome/free-solid-svg-icons";
import ClaimReward from './ClaimReward';
// const jayson = require('jayson');
import axios from 'axios';

import { staderCommandRaw } from "../lib/staderDaemon"

// TODO replace with settings variable
const callJsonRpc = async (method: string, params: any) => {
    console.log(`calling ${method}`)
    const response = await axios.post('http://localhost:5001/', {
        jsonrpc: '2.0',
        id: 1,  // usually a unique ID per call
        method: method,
        params: params
    });
    console.log(`call to ${method} done`)
    return response.data.result;
}

type Claim = {
    created: Date,
    pubkey: string,
};

const Validators = () => {

    const { nodeStatus } = useStaderStatus();
    const { avadoParams } = useParams();
    const { network } = useNetwork();
    // const { bcClient } = useBeaconChainClientAndValidator()
    const { validatorInfos, refetch } = useRunningValidatorInfos()
    const [sentClaims, setSentClaims] = useState<Claim[]>();

    const decodeKey = (encodedString: string) => "0x" + Buffer.from(encodedString, 'base64').toString('hex')

    const isRunningValidator = (pubkey: string) => validatorInfos.some(i => i.pubkey == pubkey)

    const loadClaims = () => {
        console.log(`Loading claims`);
        if (avadoParams?.nodeid) {
            callJsonRpc('stader.getClaims', { nodeid: avadoParams.nodeid }).then((res) => {
                setSentClaims(res?.claims);
                console.log(res?.claims);
                // debugger;
            }).catch((e) => {
                console.log(e);
            });
        }
    }

    useEffect(() => {
        loadClaims();
    }, [avadoParams])

    // const getExpectedFeeRecipient = () => {
    //     return (nodeStatus.optedInForSocializingPool ? nodeStatus.socializingPoolAddress : nodeStatus.operatorELRewardsAddress).toLowerCase()
    // }

    // const getFeeRecipientFromValidatorClient = (pubkey: string) => (
    //     validatorInfos.find(i => i.pubkey === pubkey)?.recipient.ethaddress.toLowerCase()
    // );
    // const isFeeRecipientAddressCorrect = (pubkey: string) => (
    //     getFeeRecipientFromValidatorClient(pubkey) == getExpectedFeeRecipient()
    // )


    // const statusRunningValidator = (pubkey: string) => validatorInfos.find(i => i.pubkey === pubkey)?.data?.status ?? "pending_initialized"

    const mkClaim = async (pubKey: string) => {
        const co = {
            pubkey: pubKey,
            hotwallet: nodeStatus.accountAddress,
            nodeId: avadoParams.nodeid
        };
        const claimStr = JSON.stringify(co);
        const res: any = await staderCommandRaw(`api node sign-message '${claimStr}'`);
        const resJSON = JSON.parse(res);
        const c = {
            claimdata: co,
            signature: resJSON?.signedData
        }
        console.log(c);


        await callJsonRpc('stader.postClaim', c);

        console.log(`reload claims`);
        // reload data to refresh UI
        loadClaims();
    }

    const isClaimed = (pubkey: string) => {
        if (!sentClaims) return false;
        const claimArray = sentClaims.find((i) => { return i.pubkey.toLowerCase() === pubkey.toLowerCase() });
        if (!claimArray) return false
        return true
    }

    if (!avadoParams) return null;

    const validatorsTable = () => {
        return (
            <div className="">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h2>Validators</h2>
                        <p className="mt-2 text-sm text-gray-700">
                            You can claim a one-time SD reward per running Stader validator.
                            Click <u><a href="#">here</a></u> for more info.
                        </p>
                    </div>
                    {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <AddValidator />
                    </div> */}
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                            <a href="#" className="group inline-flex">
                                                PubKey
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Cashback request for validator
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {nodeStatus.validatorInfos.map((validator, i) => (
                                        <tr key={i}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                {i + 1} {beaconchainUrl(network, decodeKey(validator.Pubkey), <><FontAwesomeIcon className="icon" icon={faSatelliteDish} /> {abbreviatePublicKey(decodeKey(validator.Pubkey))}</>)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {isClaimed(decodeKey(validator.Pubkey)) ? (
                                                    <><div>Request sent</div></>
                                                ) : (
                                                    <>
                                                        {isRunningValidator(decodeKey(validator.Pubkey)) ? (
                                                            <>
                                                                {/* {statusRunningValidator(decodeKey(validator.Pubkey))} */}
                                                                <button
                                                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                                    onClick={() => mkClaim(decodeKey(validator.Pubkey))}>
                                                                    Request SD reward
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div>The validator should be active before you can claim its reward.</div>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    return (
        <>
            {nodeStatus.registered ? (
                <>
                    {validatorsTable()}
                </>
            ) : (
                <>
                    {/* <p>No validators yet</p> */}
                </>
            )}
        </>
    )
}

export default Validators;
