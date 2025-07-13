'use client';

import { useEffect, useState } from 'react';

export default function WordCount({ text }: { text: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const moduleFactory = (await import('@/wasm/wordcount.js')).default;
        const wasmModule = await moduleFactory() as {
          ccall: (
            ident: string,
            returnType: string,
            argTypes: string[],
            args: string[]
          ) => number;
        };

        const result = wasmModule.ccall(
          'countWords',
          'number',
          ['string'],
          [text]
        );

        setCount(result);
      } catch (err) {
        console.error('Failed to load WASM module:', err);
      }
    };

    loadWasm();
  }, [text]);

  return (
    <span className="font-semibold text-purple-700">
      {count !== null ? count : 'Calculating...'}
    </span>
  );
}
