import type { NextPage } from 'next';

import StaderCommandField from '../components/StaderCommandField'
import DownloadBackup from '../components/DownloadBackup';
import { server_config } from "../server_config"
import { useEffect, useState } from 'react';
import { etherscanAddressUrl, etherscanTransactionUrl } from '../utils/utils';
import { useNetwork } from '../hooks/useServerInfo';


const AdminPage: NextPage = () => {
    const { network } = useNetwork()
    const restartStader = () => {
        fetch(`${server_config.monitor_url}/service/restart`, { method: 'POST' })
    }


    const [transactions, setTransactions] = useState<string[]>([]);

    useEffect(() => {
        const getTransactions = async () => {
            const transactions = await (await fetch(`${server_config.monitor_url}/transactions`)).text()
            return JSON.parse(transactions)
        }
        getTransactions().then(res => {
            setTransactions(res.transactions)
        })
    }, []);

    return (
        <>
            <StaderCommandField />
            <br />
            <br />
            <DownloadBackup />
            <br />
            <br />
            {transactions.length > 0 && (
                <div>
                    <p>Transactions:</p>
                    <ul>
                        {transactions && network && (
                            transactions.map(t => <li key={t} className='font-mono'>{etherscanTransactionUrl(network, t)}</li>)
                        )}
                    </ul>
                </div>
            )}
            <br />
            <br />
            <p>Restart Stader api daemon</p>
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={restartStader}>
                Restart
            </button>
        </>
    )
}

export default AdminPage;
