'use client';
import { useEffect, useState } from 'react';

export default function KeywordExtractor({ text }: { text: string }) {
    const [keywords, setKeywords] = useState<string>('');

    useEffect(() => {
        const loadWasm = async () => {
            try {
                const moduleFactory = (await import('@/wasm/keywords.js')).default;
                const wasmModule = await moduleFactory() as {
                    ccall: (
                        ident: string,
                        returnType: string,
                        argTypes: string[],
                        args: string[]
                    ) => string;
                };

                const result = wasmModule.ccall(
                    'extractKeywords',
                    'string',
                    ['string'],
                    [text]
                );

                setKeywords(result);
            } catch (err) {
                console.error('Failed to load WASM module:', err);
            }
        };

        loadWasm();
    }, [text]);


    return (
        <span className="font-semibold text-purple-700 letterspace-wide">
            {keywords !== '' ? keywords : 'Generating...'}
        </span>
    );
}