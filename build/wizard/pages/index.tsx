import type { NextPage } from 'next';
import NodeComponent from '../components/NodeComponent';
import Validators from '../components/Validators';

const Home: NextPage = () => {
    return (
        <>
            <NodeComponent />
            <Validators />
        </>
    )
}

export default Home;
