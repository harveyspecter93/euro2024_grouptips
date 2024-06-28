'use client';

import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ZusatzfrageCard from '../../components/ZusatzfrageCard';

export default function Zusatzfragen() {
    const [zusatzfragen, setZusatzfragen] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/zusatzfragen');

                if (res.ok) {
                    const data = await res.json();
                    setZusatzfragen(data.zusatzfragen);
                } else {
                    console.error('Failed to fetch zusatzfragen:', res.status);
                }
            } catch (error) {
                console.error('Error fetching zusatzfragen:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-base-200 flex flex-col items-center">
                <h1 className="text-4xl font-bold mt-10">Zusatzfragen</h1>
                <div id="zusatzfragen-container" className="mt-6 w-full max-w-2xl">
                    {Object.entries(zusatzfragen).length > 0 ? (
                        Object.entries(zusatzfragen).map(([question, answers], index) => (
                            <ZusatzfrageCard key={index} question={question} answers={answers} />
                        ))
                    ) : (
                        <p className="text-center">Loading...</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
