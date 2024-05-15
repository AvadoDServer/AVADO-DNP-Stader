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
import { staderCommand } from "../lib/staderDaemon"
import { staderCommandRaw } from "../lib/staderDaemon"

const ClaimRewards = () => {
    const [feedback, setFeedback] = useState<string>("");
    const [commandRunning, setCommandRunning] = useState<boolean>(false);
    // const { avadoParams } = useParams();
    const { canClaimRewards, nodeStatus, fetchNodeStatus, fetchCanClaimRewards } = useStaderStatus()

    useEffect(() => {
        fetchNodeStatus();
        fetchCanClaimRewards();
    }, []);

    const claimRewardsCmd = async () => {

        const command = `node claim-rewards`;

        console.log(command);
        setFeedback('claiming rewards');
        setCommandRunning(true);

        staderCommand(command).then((data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
                setCommandRunning(false);
                return;
            }
            setCommandRunning(false);
            setFeedback('rewards claimed');
            fetchNodeStatus();
            fetchCanClaimRewards();
        })
    }

    if (nodeStatus.optedInForSocializingPool) {
        return <>
            <h2>Execution + Consensus Layer Rewards</h2>
            <div>Your Execution Layer rewards will be paid out when claiming the SD rewards automatically.</div>
        </>
    }

    if (!canClaimRewards) return null;

    if (canClaimRewards.noRewards) {
        return <>
            <h2>Execution + Consensus Layer Rewards</h2>
            <div>You have no rewards that can be claimed at this moment.</div>
        </>
    }

    // debugger;

    // console.log(JSON.stringify(canClaimRewards));
    return (
        <>
            <h2>Execution + Consensus Layer Rewards</h2>
            <button
                disabled={commandRunning}
                className={`${commandRunning && "opacity-50 cursor-not-allowed"} button-small ml-4 rounded-md bg-indigo-600 px-3 py-2 mb-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >Claim EL rewards</button>
            <br />
            {feedback}
        </>

    )



}

export default ClaimRewards;
