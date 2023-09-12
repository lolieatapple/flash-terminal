'use client';
import {MatrixEffect} from './MatrixEffect';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <MatrixEffect />

      <div className="absolute z-20 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold text-green-500">Flash Terminal</h1>
        <br />
        <button className="bg-green-500 hover:bg-green-600 px-12 py-2 text-xl text-white font-bold rounded-full transform transition hover:scale-105"
          onClick={()=>router.push('/terminal')}
        >
          Enter
        </button>
        <p className="text-green-500 text-sm">* One time terminal of 4-core CPU, 1GB RAM, 3GB HDD machine with network.</p>
      </div>
    </div>
  )
}
