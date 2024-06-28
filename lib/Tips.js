const axios = require('axios');
const cheerio = require('cheerio');

const users = [
    'Z2E5q', 'ngxM4', 'b6Mko', 'DjgOz', 'RAD4x', 'r3n6G', 'rgAzP', 'eLlGR', 'bAl7J', 'rb73', '7kpjq', 'aLll3'
];

const rounds = [
    1, 2, 3, 4, 5, 6, 7
];

const MAX_CONCURRENT_REQUESTS = 5;

async function fetchTips() {
    try {
        let games = {};
        let userPoints = {}, bOutput = true;

        const queue = [];
        for (const user of users) {
            for (const round of rounds) {
                queue.push({ user, round });
            }
        }

        const fetchPage = async ({ user, round }) => {
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
                        score: betData.final_results ? betData.final_results[i] : '?'
                    })),
                    score: betData.final_results ?? '?'
                };

                
                if(bOutput && betData.total_score > 0) {
                console.log('MD betData:', betData); 
                bOutput = false;  
                }

                if (!games[gameId]) {
                    games[gameId] = { ...game, user_tips: [], tipsAvailable: false };
                }

                let userTip = {
                    user: username,
                    betScoreTeam1: betData.picks ? betData.picks[0] : '?',
                    betScoreTeam2: betData.picks ? betData.picks[1] : '?',
                    betScore: betData.total_score ?? null,
                };

                games[gameId].user_tips.push(userTip);

                if (betData.picks && betData.picks.length > 0) {
                    games[gameId].tipsAvailable = true;
                }
            });
        };

        const asyncPool = async (poolLimit, array, iteratorFn) => {
            const ret = [];
            const executing = [];
            for (const item of array) {
                const p = Promise.resolve().then(() => iteratorFn(item));
                ret.push(p);

                if (poolLimit <= array.length) {
                    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
                    executing.push(e);
                    if (executing.length >= poolLimit) {
                        await Promise.race(executing);
                    }
                }
            }
            return Promise.all(ret);
        };

        await asyncPool(MAX_CONCURRENT_REQUESTS, queue, fetchPage);

        // Delete all games where the tips are not available
        for (const gameId in games) {
            if (!games[gameId].tipsAvailable) {
                delete games[gameId];
            }
        }

        // Calculate cumulative points after all promises are done
        for (const gameId in games) {
            games[gameId].user_tips.forEach(userTip => {
                if (!userPoints[userTip.user]) {
                    userPoints[userTip.user] = 0;
                }
                userPoints[userTip.user] += userTip.betScore || 0;
                userTip.cumulativePoints = userPoints[userTip.user];
            });
        }

        // Sort the user_tips by betScore
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
