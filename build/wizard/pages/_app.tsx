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

function MyApp({ Component, pageProps }: AppProps) {
  const [wagmiConfig, setWagmiConfig] = useState<any>();
  const [chains, setChains] = useState<any>();

  useEffect(() => {
    const setupClient = async () => {

      const { chains, publicClient } = configureChains(
        [goerli, mainnet],
        [
          jsonRpcProvider({
            rpc: (chain) => {
              switch (chain.name) {
                case "goerli":
                  return {
                    http: `http://goerli-geth.my.ava.do:8545`,
                    webSocket: `ws://goerli-geth.my.ava.do:8546`
                  }
                default:
                  return {
                    http: `http://ethchain-geth.my.ava.do:8545`,
                    webSocket: `ws://ethchain-geth.my.ava.do:8546`
                  }

              }
            }
          }),
          alchemyProvider({
            // https://dashboard.alchemyapi.io
            apiKey: "8kMhSrpLGyIlRYBtAtT9IAVWeVK8hiOZ",
          }),
          publicProvider(),
        ]
      )

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

    setupClient()
  }, []);


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
