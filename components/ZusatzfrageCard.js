import React from 'react';

const ZusatzfrageCard = ({ question, answers }) => {
    return (
        <div className="card bg-base-100 shadow-xl mb-4 w-full max-w-2xl">
            <div className="card-body">
                <h2 className="card-title text-center">{question}</h2>
                <div className="grid grid-cols-2 text-center mt-4">
                    <div className="font-bold text-left">Gewählte Antwort</div>
                    <div className="font-bold text-left">User</div>
                    {Object.entries(answers).map(([answer, users], index) => (
                        <React.Fragment key={index}>
                            <div className="border-t py-2 text-left">{answer}</div>
                            <div className="border-t py-2">
                                {users.map((user, userIndex) => (
                                    <div key={userIndex} className="text-left">
                                        - {user}
                                    </div>
                                ))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ZusatzfrageCard;
