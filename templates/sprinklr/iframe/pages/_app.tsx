import '../styles/globals.css';

import hyperspaceLight from '@sprinklrjs/spaceweb-themes/hyperspace/light';
import SpacewebProvider from '@sprinklrjs/spaceweb/spacewebProvider';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SpacewebProvider direction="ltr" theme={hyperspaceLight}>
      <Component {...pageProps} />
    </SpacewebProvider>
  );
}

export default MyApp;
