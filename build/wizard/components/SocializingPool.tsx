import {
    ChevronDownIcon
} from '@heroicons/react/20/solid'
import { server_config } from '../server_config';
import { useEffect,useState } from "react";
import { useStaderStatus } from "../lib/status"
import AddValidator from './AddValidator';
import { abbreviatePublicKey, beaconchainUrl } from "../utils/utils"
import { useBeaconChainClientAndValidator, useNetwork, useRunningValidatorInfos, useParams } from '../hooks/useServerInfo';
import { ValidatorStates } from '../types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSatelliteDish } from "@fortawesome/free-solid-svg-icons";
import { staderCommand } from "../lib/staderDaemon"

import { staderCommandRaw } from "../lib/staderDaemon"

const SocializingPool = ({ }) => {
    const { nodeStatus, nodeSyncProgressStatus } = useStaderStatus()
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const setSocPool = (status: boolean) => {
debugger;
        console.log(nodeSyncProgressStatus);
        setLoading(true);
        staderCommand(`node can-update-socialize-el ${JSON.stringify(status)}`).then((data: any) => {
            if (data.status === "error") {
                setError(`Cannot set socialize pool to ${JSON.stringify(status)} : ${data.error}`);
                setLoading(false);
                return;
            }
            if (data.isPermissionlessNodeRegistryPaused) {
                setError("Socializing pool is currently paused");
                setLoading(false);
                return;
            }
            if (data.inCooldown === true) {
                setError("Your node is in cooldown to opt in or out - please try again later.");
                setLoading(false);
                return;
            }
            setError(undefined);

            // update soc pool
            staderCommand(`node update-socialize-el ${JSON.stringify(status)}`).then((data: any) => {
                if (data.status === "error") {
                    setError(`Cannot set socialize pool to ${JSON.stringify(status)} : ${data.error}`);
                    return;
                }
            });
            setLoading(false);
        });

        console.log(`Set SocPool to ${JSON.stringify(status)}`);

    }

    return (
        <>
        <div className="text-sm font-medium leading-6 text-gray-500">Socializing pool</div>
            {nodeStatus.optedInForSocializingPool ? (
                <>
                    <div>Opted in</div>
                    <button disabled={loading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { setSocPool(false) }}>Opt out</button>
                </>
            ) : (
                <>
                    <div>Opted out</div>
                    <button disabled={loading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { setSocPool(true) }}>Opt in</button>
                </>

            )}
            {error && (<p className="help is-danger">{error}</p>)}

        </>
    )



}

export default SocializingPool;
