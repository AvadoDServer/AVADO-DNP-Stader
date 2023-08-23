import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import '@fontsource/exo-2';

import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig, Chain } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { goerli, mainnet } from 'wagmi/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { server_config } from '../server_config'
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useStaderStatus } from '../lib/status';
import { useExecutionClient } from '../hooks/useServerInfo';
import { useNetwork } from "../hooks/useServerInfo";

function MyApp({ Component, pageProps }: AppProps) {
  const [wagmiConfig, setWagmiConfig] = useState<any>();
  const [chains, setChains] = useState<any>();
  const { ecClient } = useExecutionClient();
  const { network } = useNetwork()
  useEffect(() => {
    const setupClient = async () => {

      const { chains, publicClient } =
        (network === "prater") ?
          configureChains(
            [goerli],
            [
              jsonRpcProvider({
                rpc: () => {
                  return {
                    http: ecClient.api,
                  }
                }
              })
            ]
          ) :
          configureChains(
            [mainnet],
            [
              jsonRpcProvider({
                rpc: () => {
                  return {
                    http: ecClient.api,
                  }
                }
              })
            ]
          );


      const { connectors } = getDefaultWallets({
        appName: 'Avado Stader',
        projectId: "b5371f3f7bd2de6a26493f22901da531",
        chains,
      });

      const wagmiConfig = createConfig({
        autoConnect: true,
        connectors,
        publicClient
      })

      setWagmiConfig(wagmiConfig)
      setChains(chains)
    }
    if (ecClient?.api) {
      setupClient()
    }
  }, [ecClient, network]);


  // Trigger initial fetch of all stader info + refresh sync info very 60 seconds
  const { fetchNodeSyncProgressStatus, fetchContractsInfo, fetchNodeStatus, fetchAllowance } = useStaderStatus()
  useEffect(() => {
    fetchNodeSyncProgressStatus()
    fetchNodeStatus()
    fetchContractsInfo()
    fetchAllowance()
    const interval = setInterval(() => {
      fetchNodeSyncProgressStatus();
    }, 60 * 1000); // 60 seconds refresh
    return () => clearInterval(interval);
  }, [fetchContractsInfo, fetchNodeStatus, fetchNodeSyncProgressStatus]);

  return <>
    {wagmiConfig ? (
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    ) : (
      <>Connecting to Ethereum clients... Please wait</>
    )}
  </>

  async function getClientRpcs(): Promise<string[]> {
    try {
      const data = JSON.parse(await (await fetch(`${server_config.monitor_url}/ec-clients`)).text()).data;
      const clientRpcs = data ? data.map((c: any) => c.api) : [];
      return clientRpcs;
    } catch (e) {
      return []
    }
  }
}

export default MyApp;
