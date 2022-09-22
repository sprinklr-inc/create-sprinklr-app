import type { NextPage } from 'next';
import SprClientSdk from '@sprinklrjs/app-sdk';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

const HelloWorld: NextPage = () => {
  const [isClientInitialized, setIsClientInitialzed] = useState<boolean>(false);
  const sprClientRef = useRef<SprClientSdk>();

  //Initialize SDK
  useEffect(() => {
    const initSdk = async () => {
      if (!sprClientRef.current) {
        const sprClient = new SprClientSdk();
        sprClientRef.current = sprClient;
        setIsClientInitialzed(true);
      }
    };
    initSdk();
  }, []);

  return (
    <>
      <Head>
        <title>Hello World</title>
      </Head>
      <main>
        <div id="app">{isClientInitialized ? 'Hello World' : 'Loading...'}</div>
      </main>
    </>
  );
};

export { HelloWorld };
