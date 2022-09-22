import type { NextPage } from 'next';
import SprClient from '@sprinklrjs/app-sdk';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const HelloWorld: NextPage = () => {
  const [sdkClient, setSdkClient] = useState<SprClient>();

  useEffect(() => {
    const initSdk = async () => {
      const sprClient = new SprClient();
      await sprClient.init();
      setSdkClient(sdkClient);
    };
    initSdk();
  }, []);

  return (
    <>
      <Head>
        <title>Hello World</title>
      </Head>
      <main>
        <div id="app">{sdkClient ? 'Hello World' : 'Loading...'}</div>
      </main>
    </>
  );
};

export { HelloWorld };
