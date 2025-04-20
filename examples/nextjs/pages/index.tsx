'use client';
import dynamic from 'next/dynamic';
const Demo = dynamic(() => import('@/components/demo'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return <Demo />;
}
