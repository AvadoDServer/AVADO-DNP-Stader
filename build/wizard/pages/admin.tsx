import type { NextPage } from 'next';

import StaderCommandField from '../components/StaderCommandField'
import DownloadBackup from '../components/DownloadBackup';
import { server_config } from "../server_config"


const AdminPage: NextPage = () => {
    const restartStader = () => {
        fetch(`${server_config.monitor_url}/service/restart`, { method: 'POST' })
    }

    return (
        <>
            <StaderCommandField />
            <DownloadBackup />
            <button onClick={restartStader}>
                Restart
            </button>
        </>
    )
}

export default AdminPage;
