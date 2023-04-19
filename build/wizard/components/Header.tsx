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
import NetworkBanner from '../components/NetworkBanner';
import SyncStatusTag from '../components/SyncStatusTag';
import { useStaderStatus } from "../lib/status"
import { useBeaconChainClientAndValidator, useExecutionClient, useNetwork } from '../hooks/useServerInfo';

const Header = () => {

    const { nodeSyncProgressStatus } = useStaderStatus()
    const { network } = useNetwork()
    const { bcClient } = useBeaconChainClientAndValidator()
    const { ecClient } = useExecutionClient()

    const title = "Avado Stader"

    return (
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
                                <a href={ecClient?.url}>{ecClient?.name}</a>,<a href={bcClient?.url}>{bcClient?.name}</a>
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
                            <SyncStatusTag progress={nodeSyncProgressStatus.ecStatus.primaryEcStatus.syncProgress} label={ecClient?.name} />
                        </span>

                        <span className="ml-3 hidden sm:block">
                            <SyncStatusTag progress={nodeSyncProgressStatus.bcStatus.primaryEcStatus.syncProgress} label={bcClient?.name} />
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
