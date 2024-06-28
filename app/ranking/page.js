'use client';

import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function Ranking() {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/ranking');

                if (res.ok) {
                    const data = await res.json();
                    setRanking(data);
                } else {
                    console.error('Failed to fetch ranking:', res.status);
                }
            } catch (error) {
                console.error('Error fetching ranking:', error);
            }
        };

        fetchData();
    }, []);

    const topThree = ranking.slice(0, 3);
    const remaining = ranking.slice(3);

    const getImageSrc = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            const filename = `${parts[0].substring(0, 2).toLowerCase()}${parts[1].substring(0, 1).toLowerCase()}.png`;
            return `${filename}`;
        }
        return '/images/default.png';
    };

    return (
        <Layout>
            <div className="min-h-screen bg-base-200 flex flex-col items-center">
            <h1 className="text-4xl font-bold mt-10">Ranking</h1>
                <div className="mt-6 w-full max-w-4xl flex flex-col items-center">
                    {ranking.length > 0 ? (
                        <>
                            <div className="flex justify-around items-end w-full mb-10">
                                {topThree[1] && (
                                    <div className="flex flex-col items-center relative mb-6">
                                        <img src={getImageSrc(topThree[1].name)} alt={topThree[1].name} className="h-24 w-24 rounded-full border-4 border-gray-300 object-cover z-10" />
                                        <div className="mt-5 mb-5 text-center z-10">
                                            <div className="font-bold">{topThree[1].name}</div>
                                            <div>{topThree[1].groupPoints}.</div>
                                        </div>
                                        <div className="bg-gray-300 text-black p-2 rounded-t-lg shadow-lg h-16 w-24 flex items-center justify-center text-lg font-bold z-0">
                                            #2
                                        </div>
                                        
                                    </div>
                                )}
                                {topThree[0] && (
                                    <div className="flex flex-col items-center relative mb-6">
                                        <img src={getImageSrc(topThree[0].name)} alt={topThree[0].name} className="h-32 w-32 rounded-full border-4 border-yellow-300 object-cover z-10" />
                                        
                                        <div className="mt-5 mb-5 text-center z-10">
                                            <div className="font-bold">{topThree[0].name}</div>
                                            <div>{topThree[0].groupPoints}.</div>
                                        </div>
                                        <div className="bg-yellow-300 text-black p-2 rounded-t-lg shadow-lg h-20 w-32 flex items-center justify-center text-lg font-bold z-0">
                                            #1
                                        </div>
                                    </div>
                                )}
                                {topThree[2] && (
                                    <div className="flex flex-col items-center relative mb-6">
                                        <img src={getImageSrc(topThree[2].name)} alt={topThree[2].name} className="h-20 w-20 rounded-full border-4 border-orange-700 object-cover z-10" />
                                        
                                        <div className="mt-5 mb-5 text-center z-10">
                                            <div className="font-bold">{topThree[2].name}</div>
                                            <div>{topThree[2].groupPoints}.</div>
                                        </div>
                                        <div className="bg-orange-700 text-black p-2 rounded-t-lg shadow-lg h-12 w-20 flex items-center justify-center text-lg font-bold z-0">
                                            #3
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-full">
                                {remaining.map((entry, index) => (
                                    <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold">{entry.rank} {entry.name}</span>
                                            
                                        </div>
                                        <div className="text-lg font-bold">{entry.groupPoints}.</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center">Loading...</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
