import { Fragment, useEffect, useState } from 'react'
import type { NextPage } from 'next';
import {
    PlayIcon,
    AdjustmentsHorizontalIcon,
    ServerIcon,
    PencilIcon,
    LinkIcon,
    CheckIcon,
    ChevronDownIcon
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import axios from "axios";
import { server_config } from '../server_config';
import NetworkBanner from '../components/NetworkBanner';
import SyncStatusTag from '../components/SyncStatusTag';
import StaderCommandField from '../components/StaderCommandField'

import { useStaderStatus } from "../lib/status"

const Home: NextPage = () => {

    const [ecClient, setEcClient] = useState<string>();
    const [bcClient, setBcClient] = useState<string>();
    const [network, setNetwork] = useState<"goerli" | "mainnet" | "gnosis">();

    const { nodeSyncProgressStatus, fetchNodeSyncProgressStatus, nodeStatus, fetchNodeStatus } = useStaderStatus()

    const title = "Avado Stader"

    useEffect(() => {
        axios.get(`${server_config.monitor_url}/clients`)
            .then((res) => {
                setBcClient(res.data[0])
            });
        axios.get(`${server_config.monitor_url}/executionclients`)
            .then((res) => {
                setEcClient(res.data[0].name)
            });
        axios.get(`${server_config.monitor_url}/network`)
            .then((res) => {
                setNetwork(res.data)
            });
    }, []);

    useEffect(() => {
        fetchNodeSyncProgressStatus();
        fetchNodeStatus();

        const interval = setInterval(() => {
            fetchNodeSyncProgressStatus();
        }, 60 * 1000); // 60 seconds refresh
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="py-10 bg-white">
            <header>
                {network && <NetworkBanner network={network} />}
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* https://tailwindui.com/components/application-ui/headings/page-headings */}
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                {title}
                            </h1>
                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <ServerIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    {ecClient},{bcClient}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <AdjustmentsHorizontalIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    <a href="http://my.ava.do/#/Packages/stader.avado.dnp.dappnode.eth/detail" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                        Logs
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 flex">
                            <span className="hidden sm:block">
                                <SyncStatusTag progress={nodeSyncProgressStatus.ecStatus.primaryEcStatus.syncProgress} label={ecClient} />
                            </span>

                            <span className="ml-3 hidden sm:block">
                                <SyncStatusTag progress={nodeSyncProgressStatus.bcStatus.primaryEcStatus.syncProgress} label={bcClient} />
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="bg-white">
                <>
                    <p>

                        Node status: {nodeStatus.accountAddress}
                    </p>

                    <StaderCommandField />
                </>
            </main>
            <footer className="bg-white">
                <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                    <p className="mt-10 text-center text-xs leading-5 text-gray-500">
                        <a href="https://ava.do" target="_blank" rel="noopener noreferrer">
                            &copy; Made with ❤️ by your frens at Avado
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home;
