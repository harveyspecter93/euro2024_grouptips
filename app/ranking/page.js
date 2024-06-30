'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

export default function Ranking() {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/ranking');

                if (res.ok) {
                    const data = await res.json();
                    console.log('Fetched data:', data);
                    const mappedData = data.map((entry) => {
                        const rank = parseInt(entry.rank.replace('#', ''));
                        return { ...entry, rank };
                    });

                    setRanking(mappedData);
                } else {
                    console.error('Failed to fetch ranking:', res.status);
                }
            } catch (error) {
                console.error('Error fetching ranking:', error);
            }
        };

        fetchData();
    }, []);

    const getImageSrc = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            const filename = `${parts[0].substring(0, 2).toLowerCase()}${parts[1].substring(0, 1).toLowerCase()}.png`;
            return `${filename}`;
        }
        return 'default.png';
    };

    const renderPodium = (rank, users, borderColor, bgColor) => (
        <div className="flex flex-col items-center relative mb-6" key={rank}>
            {users.map((user, index) => (
                <div key={index} className="flex flex-col items-center mb-2">
                    <img src={getImageSrc(user.name)} alt={user.name} className={`${rank === 1 ? `h-40 w-40` : ( rank === 2 ? `h-24 w-24` : `h-16 w-16` ) } rounded-full border-4 ${borderColor} object-cover z-10`} />
                    <div className="mt-2 text-center z-10">
                        <div className="font-bold">{user.name}</div>
                        <div>{user.groupPoints}</div>
                    </div>
                </div>
            ))}
            <div className={`${bgColor} text-black p-2 rounded-t-lg shadow-lg h-16 w-24 flex items-center justify-center text-lg font-bold z-0`}>
                #{rank}
            </div>
        </div>
    );

    const topThree = ranking.filter((entry) => entry.rank <= 3);
    const remaining = ranking.filter((entry) => entry.rank > 3);

    console.log('Top three:', topThree);
    console.log('Remaining:', remaining);

    const rank1 = topThree.filter((entry) => entry.rank === 1);
    const rank2 = topThree.filter((entry) => entry.rank === 2);
    const rank3 = topThree.filter((entry) => entry.rank === 3);

    return (
        <Layout>
            <div className="min-h-screen bg-base-200 flex flex-col items-center">
                <h1 className="text-4xl font-bold mt-10">Ranking</h1>
                <div className="mt-6 w-full max-w-4xl flex flex-col items-center">
                    {ranking.length > 0 ? (
                        <>
                            <div className="flex justify-around items-end w-full mb-10">
                                {rank2.length > 0 && renderPodium(2, rank2, 'border-gray-300', 'bg-gray-300')}
                                {rank1.length > 0 && renderPodium(1, rank1, 'border-yellow-300', 'bg-yellow-300')}
                                {rank3.length > 0 && renderPodium(3, rank3, 'border-orange-700', 'bg-orange-700')}
                            </div>
                            <div className="w-full">
                                {remaining.map((entry, index) => (
                                    <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold">{entry.rank} {entry.name}</span>
                                        </div>
                                        <div className="text-lg font-bold">{entry.groupPoints}</div>
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
