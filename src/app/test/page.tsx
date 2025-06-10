'use client';

import { useEffect } from 'react';
import { firebaseConfig } from '@/firebase/config';

export default function TestPage() {
  useEffect(() => {
    console.log('Firebase Config in component:', firebaseConfig);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Config Test</h1>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        {JSON.stringify(firebaseConfig, null, 2)}
      </pre>
    </div>
  );
}
