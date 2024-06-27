const axios = require('axios');
const cheerio = require('cheerio');

const users = [
    'Z2E5q', 'ngxM4', 'b6Mko', 'DjgOz', 'RAD4x', 'r3n6G', 'rgAzP', 'eLlGR', 'bAl7J', 'rb73', '7kpjq', 'aLll3'
];

const rounds = [
    1, 2, 3, 4, 5, 6, 7
];

async function fetchTips() {
    try {
        let games = {};

        for (const user of users) {
            for (const round of rounds) {
                const url = `https://emtippspiel.srf.ch/users/${user}/round/${round}`;
                const response = await axios.get(url);
                const data = response.data;

                const $ = cheerio.load(data);

                const username = $('.pageTitle__title').text().trim().replace('Tipps von ', '');

                $('div[data-react-class="ScoreBet"]').each((index, element) => {
                    const betData = JSON.parse($(element).attr('data-react-props')).bet;
                    const gameId = betData.bet_id;
                    const game = {
                        location: betData.meta_location,
                        date: betData.event_date,
                        teams: betData.teams.map((team, i) => ({
                            name: team.name,
                            img: team.image,
                            score: !!betData.final_results ? betData.final_results[i] : '?'
                        })),
                        score: betData.final_results ?? '?'
                    };

                    if (!games[gameId]) {
                        games[gameId] = { ...game, user_tips: [] };
                    }

                    games[gameId].user_tips.push({
                        user: username,
                        betScoreTeam1: !!betData.picks ? betData.picks[0] : '?',
                        betScoreTeam2: !!betData.picks ? betData.picks[1] : '?',
                        betScore: betData.total_score ?? null
                    });
                });
            }
        }

        //delete all games where the score is not yet known
        for (const gameId in games) {
            if (games[gameId].score.includes('?')) {
                delete games[gameId];
            }
        }

        //sort the user_tips by betScore    
        for (const gameId in games) {
            games[gameId].user_tips.sort((a, b) => b.betScore - a.betScore);
        }
        
        // Convert games object to array and sort by date descending
        const sortedGames = Object.values(games).sort((a, b) => new Date(b.date) - new Date(a.date));

        return { games: sortedGames };
    } catch (error) {
        console.error('Error fetching the tips:', error);
        return { games: [] };
    }
}

module.exports = fetchTips;