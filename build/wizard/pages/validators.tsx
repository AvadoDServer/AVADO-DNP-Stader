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

const Home: NextPage = () => {
    return (
        <>
            <p>
                List of validators
            </p>
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Add validator</button>

            <AddValidator />
        </>
    )
}

export default Home;
