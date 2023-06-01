import { Fragment, useEffect, useState } from 'react'
import type { NextPage } from 'next';
import {
    MapIcon,
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
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

const Header = () => {

    const { nodeSyncProgressStatus } = useStaderStatus()
    const { network } = useNetwork()
    const { bcClient } = useBeaconChainClientAndValidator()
    const { ecClient } = useExecutionClient()

    const title = "Avado Stader"

    type LinkProps = {
        children: JSX.Element
    }

    const EcClientLink = ({ children }: LinkProps) => {
        if (ecClient)
            return <a href={ecClient.url}>{children || ecClient.name}</a>
        else
            return <div className="bg-red-200 text-red-700">Missing execution client</div>
    }

    const BcClientLink = ({ children }: LinkProps) => {
        if (bcClient)
            return <a href={bcClient.url}>{children || bcClient.name}</a>
        else
            return <div className="bg-red-200 text-red-700">Missing beacon client</div>
    }

    return (
        <header>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* https://tailwindui.com/components/application-ui/headings/page-headings */}
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            <Link href="/"><h1>{title}</h1></Link>
                        </h1>
                        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                            {/* <div className="mt-2 flex items-center text-sm text-gray-500">
                                <ServerIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                {ecClientLink()},{bcClientLink()}
                            </div> */}
                            {/* <div className="mt-2 flex items-center text-sm text-gray-500">
                                <AdjustmentsHorizontalIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <a href="http://my.ava.do/#/Packages/stader.avado.dnp.dappnode.eth/detail" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                    Logs
                                </a>
                            </div> */}
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <MapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <Link
                                    className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                                    href="/admin">API
                                </Link>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <NetworkBanner />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-items-end">
                        <div className="min-w-0 flex-1">
                            {/* <span className="hidden sm:block">
                                <ConnectButton />
                            </span> */}
                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                <span className="hidden sm:block">
                                    <EcClientLink>
                                        <SyncStatusTag clientStatus={nodeSyncProgressStatus.ecStatus.primaryEcStatus} label={ecClient?.name ?? "execution client"} />
                                    </EcClientLink>
                                </span>

                                <span className="ml-3 hidden sm:block">
                                    <BcClientLink>
                                        <SyncStatusTag clientStatus={nodeSyncProgressStatus.bcStatus.primaryEcStatus} label={bcClient?.name ?? "beacon client"} />
                                    </BcClientLink>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
