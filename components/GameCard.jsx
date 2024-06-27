import React from 'react';

const GameCard = ({ date, location, team1, team2, userTips }) => {
    return (
        <div className="card bg-base-100 shadow-xl mb-4 w-full max-w-2xl">
            <div className="card-body">
                <div className="flex justify-between text-gray-600">
                    <span>{new Date(date).toLocaleString('de-DE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{location}</span>
                </div>
                <div className="flex justify-around items-center mt-4">
                    <div className="flex flex-col items-center">
                        <img src={team1.img} alt={team1.name} className="w-16 h-16 rounded-full mb-2"/>
                        <span>{team1.name}</span>
                    </div>
                    <div className="text-4xl font-bold text-center">
                        {team1.score} : {team2.score}
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={team2.img} alt={team2.name} className="w-16 h-16 rounded-full mb-2"/>
                        <span>{team2.name}</span>
                    </div>
                </div>
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
