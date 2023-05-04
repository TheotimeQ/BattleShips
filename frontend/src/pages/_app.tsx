import '@/styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';

import Script from 'next/script';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Adsense
        client_id="ca-pub-4238647462189874"
      />

      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>);
}

function Adsense(props: any) {
  const { client_id } = props;

  return (
    <Script
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client_id}`}
      crossOrigin="anonymous"
    />
  );
}
