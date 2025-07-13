'use client';

import { useEffect, useState } from 'react';

export default function Sentiment({ text }: { text: string }) {
    const [sentiment, setSentiment] = useState<string | null>(null);

    useEffect(() => {
        const analyze = async () => {
            try {
                console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                });

                const data = await res.json();
                setSentiment(data.meaning);
            } catch (error) {
                console.error('Sentiment analysis failed:', error);
                setSentiment('Error');
            }
        };

        analyze();
    }, [text]);

    return (
        <span className="font-semibold text-purple-700 letterspace-wide">
            {sentiment ?? 'Analyzing...'}
        </span>
    );
}
