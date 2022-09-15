import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const HelloWorld: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hello World</title>
      </Head>
      <main>
        <div id="app">Hello World</div>
      </main>
    </>
  );
};

export { HelloWorld };
