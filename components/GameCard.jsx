import React from 'react';

const GameCard = ({ date, location, team1, team2, userTips }) => {
    const hallOfFame = userTips.filter(userTip => userTip.betScore === 10);

    const getImageSrc = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            const filename = `${parts[0].substring(0, 2).toLowerCase()}${parts[1].substring(0, 1).toLowerCase()}.png`;
            return `${filename}`;
        }
        return '/images/default.png';
    };

    return (
        <div className="card bg-base-100 shadow-xl mb-4 w-full max-w-2xl">
            <div className="card-body">
                <div className="flex justify-between">
                    <span>{new Date(date).toLocaleString('de-DE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{location}</span>
                </div>
                <div className="flex justify-around items-center mt-4">
                    <div className="flex flex-col items-center">
                        <img src={team1.img} alt={team1.name} className="w-10 h-10 mb-2 rounded-full"/>
                        <span>{team1.name}</span>
                    </div>
                    <div className="text-4xl font-bold">{team1.score} : {team2.score}</div>
                    <div className="flex flex-col items-center">
                        <img src={team2.img} alt={team2.name} className="w-10 h-10 mb-2 rounded-full"/>
                        <span>{team2.name}</span>
                    </div>
                </div>
                {hallOfFame.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-bold text-center mb-2">Hall of Fame</h3>
                        <div className="flex justify-center">
                            {hallOfFame.map((userTip, index) => (
                                <div key={index} className="flex flex-col items-center mx-2">
                                    <img src={getImageSrc(userTip.user)} alt={userTip.user} className="w-10 h-10 rounded-full border-2 border-yellow-500 object-cover"/>
                                    <span className="text-sm mt-1">{userTip.user}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mt-4 text-center">
                    <div className="grid grid-cols-3 text-lg border-t pt-4">
                        <div className="font-bold text-left pl-4">User</div>
                        <div className="font-bold">Tipp</div>
                        <div className="font-bold text-right pr-4">Punkte</div>
                    </div>
                    {userTips.map((userTip, index) => (
                        <div key={index} className="grid grid-cols-3 items-center py-2 border-b">
                            <div className="text-left pl-4">{userTip.user}</div>
                            <div className="text-lg">{userTip.betScoreTeam1} : {userTip.betScoreTeam2}</div>
                            <div className="text-right pr-4">{userTip.betScore}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GameCard;
