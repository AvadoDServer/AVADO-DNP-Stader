import {
    ChevronDownIcon
} from '@heroicons/react/20/solid'
import { server_config } from '../server_config';
import { useEffect, useState } from "react";
import { useStaderStatus } from "../lib/status"
import AddValidator from './AddValidator';
import { abbreviatePublicKey, beaconchainUrl, displayAsETH } from "../utils/utils"
import { useBeaconChainClientAndValidator, useNetwork, useRunningValidatorInfos, useParams } from '../hooks/useServerInfo';
import { ValidatorStates } from '../types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSatelliteDish } from "@fortawesome/free-solid-svg-icons";
import { staderCommand } from "../lib/staderDaemon"

import { staderCommandRaw } from "../lib/staderDaemon"

const ClaimSpReward = () => {
    const [feedback, setFeedback] = useState<string>("");
    const [commandRunning, setCommandRunning] = useState<boolean>(false);

    const { canClaimSpRewards, fetchCanClaimSpRewards, nodeStatus, fetchNodeStatus } = useStaderStatus()

    useEffect(() => {
        fetchCanClaimSpRewards();
        fetchNodeStatus();
    }, []);

    if (!canClaimSpRewards || nodeStatus.unclaimedSocializingPoolMerkles?.length < 1) {
        return <>
            <h2>SD Rewards</h2>
            <div>You have no rewards that can be claimed at this moment.</div>
        </>
    }

    const claimCycles = async (cycles: number[]) => {

        const command = `node claim-sp-rewards ${cycles.join(",")}`;

        console.log(command);
        setFeedback('claiming rewards');
        setCommandRunning(true);

        staderCommand(command).then((data: any) => {
            if (data.status === "error") {
                setFeedback(data.error);
                setCommandRunning(false);
            } else {
                setCommandRunning(false);
                setFeedback('rewards claimed');
                fetchNodeStatus();
                fetchCanClaimSpRewards();
            }
        })
    }

    if (nodeStatus.unclaimedSocializingPoolMerkles?.length > 0) {
        return (
            <>
                <h2>SD Rewards</h2>
                <ul>
                    {nodeStatus.unclaimedSocializingPoolMerkles.map((m, i) => {
                        return (
                            <li key={i}>
                                Cycle {m.cycle} - {displayAsETH(m.eth,5)} ETH , {displayAsETH(m.sd,5)} SD
                                <button
                                    disabled={commandRunning}
                                    className={`${commandRunning && "opacity-50 cursor-not-allowed"} button-small ml-4 rounded-md bg-indigo-600 px-3 py-2 mb-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                    onClick={async () => {
                                        await claimCycles([m.cycle])
                                    }}>Claim rewards for cycle {m.cycle}</button>
                            </li>
                        )
                    })}
                </ul>
                <br />
                <button
                    disabled={commandRunning}
                    className={`${commandRunning && "opacity-50 cursor-not-allowed"} rounded-md bg-indigo-600 px-3 py-2 mb-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    onClick={async () => { claimCycles(nodeStatus.unclaimedSocializingPoolMerkles.map(m => m.cycle)) }}
                >Claim rewards for all cycles</button>
                {nodeStatus.optedInForSocializingPool && (
                    <>
                        <br />
                        <div>You are opted in for the socializing pool. Your ETH rewards will be paid out when you claim rewards for one or more cycles</div>
                    </>
                )}
                <div>{feedback}</div>
            </>
        )
    } else {
        return <>
            <h2>SD Rewards</h2>
            <div>You have no rewards that can be claimed at this moment.</div>
        </>

    }


}

export default ClaimSpReward;
