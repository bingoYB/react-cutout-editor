'use client';
import dynamic from 'next/dynamic';
import Head from 'next/head';
const Demo = dynamic(() => import('@/components/demo'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>React Cutout Editor Demo</title>
      </Head>
      <Demo />
    </>
  );
}
