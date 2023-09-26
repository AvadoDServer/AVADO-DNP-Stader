import type { NextPage } from 'next';
import NodeComponent from '../components/NodeComponent';
import Validators from '../components/Validators';
import { useStaderStatus } from "../lib/status"

const Home: NextPage = () => {
    const { nodeSyncProgressStatus } = useStaderStatus();
    const progressEC = Math.floor((nodeSyncProgressStatus?.ecStatus?.primaryEcStatus?.syncProgress || 0) * 100 * 100) / 100;
    const progressBC = Math.floor((nodeSyncProgressStatus?.bcStatus?.primaryEcStatus?.syncProgress || 0) * 100 * 100) / 100;


    if (progressBC < 100 || progressEC < 100) {
        return (<>
            <div className="flex items-center justify-center h-screen">
            <p className="text-xl">Please wait until the blockchain is synced</p>
            </div>
        </>)
    }

    return (
        <>
            <NodeComponent />
            <Validators />
        </>
    )
}

export default Home;
