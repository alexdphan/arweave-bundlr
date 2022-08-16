import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createClient } from 'wagmi';
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from 'connectkit';
import { MainContext } from '../context';
import { useState, useRef } from 'react';
import { providers, utils, ethers } from 'ethers';
import { WebBundlr } from '@bundlr-network/client';

// const alchemyId = process.env.ALCHEMY_ID;

// const client = createClient(
//   getDefaultClient({
//     appName: 'arweave-bundler',
//     alchemyId,
//   })
// );
    

function MyApp({ Component, pageProps }: AppProps) {
  const [bundlrInstance, setBundlrInstance] = useState();
  const [balance, setBalance] = useState<string | undefined>();
  const bundlrRef: any = useRef();

  const initialize = async () => {
    await (window as any).ethereum.enable();
    const provider = new providers.Web3Provider((window as any).ethereum);
    await provider._ready();

    const bundlr: any = new WebBundlr(
      'https://node1.bundlr.network',
      'ethereum',
      provider
    );
    await bundlr.ready();

    setBundlrInstance(bundlr);
    bundlrRef.current = bundlr;
    getBalance();
  };

  const getBalance = async () => {
    const bal = await bundlrRef.current.getLoadedBalance();
    console.log('bal: ', utils.formatEther(bal.toString()));
    setBalance(utils.formatEther(bal.toString()));
  };

  return (
    <MainContext.Provider
      value={{
        initialize,
        getBalance,
        balance,
        bundlrInstance,
      }}
    >
      {/* <WagmiConfig client={client}>
        <ConnectKitProvider theme="rounded"> */}
          <h1>Arweave/Bundlr</h1>
          {/* <ConnectKitButton /> */}
          <Component {...pageProps} />
        {/* </ConnectKitProvider>{' '}
      </WagmiConfig> */}
    </MainContext.Provider>
  );
}

export default MyApp;
