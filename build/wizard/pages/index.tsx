import type { NextPage } from 'next';
import NodeComponent from '../components/NodeComponent';
import Validators from '../components/Validators';

const Home: NextPage = () => {
    return (
        <>
            <NodeComponent />
            <hr />
            <Validators />
        </>
    )
}

export default Home;
