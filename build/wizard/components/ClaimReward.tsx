import {
    ChevronDownIcon
} from '@heroicons/react/20/solid'
import { server_config } from '../server_config';
import { useEffect } from "react";
import { useStaderStatus } from "../lib/status"
import AddValidator from './AddValidator';
import { abbreviatePublicKey, beaconchainUrl } from "../utils/utils"
import { useBeaconChainClientAndValidator, useNetwork, useRunningValidatorInfos, useParams } from '../hooks/useServerInfo';
import { ValidatorStates } from '../types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSatelliteDish } from "@fortawesome/free-solid-svg-icons";

import { staderCommandRaw } from "../lib/staderDaemon"

const ClaimReward = ({ pubKey }: { pubKey: string}) => {

    const { avadoParams } = useParams();

    useEffect(() => {
        console.log("avadoParams", avadoParams);

    }, [avadoParams]);

    const mkClaim = async (pubKey: string) => {
        const co = {
            pubkey: pubKey,
            nodeId: avadoParams.nodeid
            // add hot-wallet address here !
        };
        const claimStr = JSON.stringify(co);
        const res: any = await staderCommandRaw(`api node sign-message '${claimStr}'`);
        const resJSON = JSON.parse(res);
        const retVal =  {
            claimdata: co,
            signature: resJSON?.signedData
        };
        console.log(JSON.stringify(retVal,null,2));
        return retVal;
    }

    if (!avadoParams) return null;

    return (
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={async () => { alert(JSON.stringify((await mkClaim(pubKey)), null, 2)) }}>Claim reward</button>
    )



}

export default ClaimReward;
