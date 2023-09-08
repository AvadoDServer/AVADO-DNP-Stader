import type { NextPage } from 'next';

import StaderCommandField from '../components/StaderCommandField'
import DownloadBackup from '../components/DownloadBackup';
import RestoreBackup from '../components/RestoreBackup';
import { server_config } from "../server_config"
import { useEffect, useState } from 'react';
import { etherscanAddressUrl, etherscanTransactionUrl } from '../utils/utils';
import { useNetwork } from '../hooks/useServerInfo';
import Link from 'next/link';
import ClaimSpRewards from "../components/ClaimSpRewards"
import ClaimElRewards from "../components/ClaimElRewards"
import { useStaderStatus } from "../lib/status"

const AdminPage: NextPage = () => {


    // const { avadoParams } = useParams();
    const { nodeStatus, fetchNodeStatus } = useStaderStatus()

    useEffect(() => {
        fetchNodeStatus();
    }, []);

    console.log("---");
    console.log(nodeStatus);

    return (
        <>

            <br />
            <br />
            <ClaimSpRewards />
            <br />
            <br />
            <ClaimElRewards />


        </>
    )
}

export default AdminPage;
