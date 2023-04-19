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
import NavBar from '../components/NavBar';
import AddValidator from '../components/AddValidator';
import { beaconchainUrl } from "../utils/utils"
import { useNetwork } from '../hooks/useNetwork';

const Home: NextPage = () => {

    const { nodeStatus } = useStaderStatus()
    const { network } = useNetwork()

    const decodeKey = (encodedString: string) => Buffer.from(encodedString, 'base64').toString('hex')

    const validatorsTable = () => {
        return (
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Validators</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all your Stader validators.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <AddValidator />
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                            <a href="#" className="group inline-flex">
                                                PubKey
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex">
                                                Status
                                                <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-0">
                                            <span className="sr-only">Link</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {nodeStatus.validatorInfos.map((validator) => (
                                        <tr key={validator.Pubkey}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                {decodeKey(validator.Pubkey)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{validator.Status}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                                                {beaconchainUrl(network, decodeKey(validator.Pubkey), "Link")}
                                                {/* <a href={beaconchainUrl(network, validator.Pubkey, "Link") } className="text-indigo-600 hover:text-indigo-900">
                                                    Edit<span className="sr-only">, {person.name}</span>
                                                </a> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <>
            {nodeStatus.validatorInfos.length > 0 ? (
                <>
                    {validatorsTable()}
                </>
            ) : (
                <>
                    <p>No validators yet</p>
                </>
            )}
        </>
    )
}

export default Home;
