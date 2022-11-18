import dynamic from 'next/dynamic';
import SprClientSdk from '@sprinklrjs/app-sdk';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

//types
import type { NextPage } from 'next';

const Todo = dynamic(() => import('../components/todo'), { ssr: false });

const TodoPage: NextPage = () => {
  const [isClientInitialized, setIsClientInitialzed] = useState<boolean>(false);
  const sprClientRef = useRef<SprClientSdk>();

  if (!sprClientRef.current) {
    const sprClient = new SprClientSdk();
    sprClientRef.current = sprClient;
  }

  // //Initialize SDK
  // useEffect(() => {
  //   const initSdk = async () => {
  //     if (!sprClientRef.current) {
  //       const sprClient = new SprClientSdk();
  //       sprClientRef.current = sprClient;
  //       setIsClientInitialzed(true);
  //     }
  //   };
  //   initSdk();
  // }, []);

  return {
    <>
      <Head>
        <title>Todo List</title>
      </Head>
      <main>
        <Todo />
      </main>
    </>
  }
};

export default TodoPage;
