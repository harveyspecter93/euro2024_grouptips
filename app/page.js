'use client';

import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';

export default function Home() {
    const [tips, setTips] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/tips');

                if (res.ok) {
                    const data = await res.json();
                    setTips(data.games);
                } else {
                    console.error('Failed to fetch tips:', res.status);
                }
            } catch (error) {
                console.error('Error fetching tips:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center">
            <h1 className="text-4xl font-bold mt-10">Tippgruppe Heute Bierli😎🍻</h1>
            <div id="tips-container" className="mt-6 w-full max-w-2xl">
                {tips.length > 0 ? (
                    tips.map((tip, index) => (
                        <GameCard
                            key={index}
                            date={tip.date}
                            location={tip.location}
                            team1={tip.teams[0]}
                            team2={tip.teams[1]}
                            userTips={tip.user_tips}
                        />
                    ))
                ) : (
                    <p className="text-center">Loading...</p>
                )}
            </div>
        </div>
    );
}
