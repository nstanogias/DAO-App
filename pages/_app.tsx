import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainId } from '@thirdweb-dev/sdk';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ChakraProvider } from '@chakra-ui/provider';
import MainLayout from '../components/MainLayout';
import ApiProvider from '../context/ApiContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <ApiProvider>
        <ChakraProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ChakraProvider>
      </ApiProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
