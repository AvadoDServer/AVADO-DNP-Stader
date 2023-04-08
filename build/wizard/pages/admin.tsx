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

const Home: NextPage = () => {
    return (
        <StaderCommandField />
    )
}

export default Home;
