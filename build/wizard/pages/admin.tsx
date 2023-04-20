import type { NextPage } from 'next';

import StaderCommandField from '../components/StaderCommandField'
import DownloadBackup from '../components/DownloadBackup';

const AdminPage: NextPage = () => {
    return (
        <>
            <StaderCommandField />
            <DownloadBackup />
        </>
    )
}

export default AdminPage;
