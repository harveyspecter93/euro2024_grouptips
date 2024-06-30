const axios = require('axios');
const cheerio = require('cheerio');

const users = [
    'Z2E5q', 'ngxM4', 'b6Mko', 'DjgOz', 'RAD4x', 'r3n6G', 'rgAzP', 'eLlGR', 'bAl7J', 'rb73', '7kpjq', 'aLll3'
];

const rounds = [
    1, 2, 3, 4, 5, 6, 7
];

const MAX_CONCURRENT_REQUESTS = 5;

function fetchTips() {
    return new Promise( async (resolve, reject) => {
    try {
        let games = {};
        let userPoints = {};

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
                    score: betData.final_results ?? '?',
                    round: betData.round
                };

                
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

        for (const gameId in games) {
            games[gameId].user_tips.sort((a, b) => {
            if (a.betScore === b.betScore) {
                if (typeof a.betScoreTeam1 === 'undefined') {
                    return 1;
                } else if (typeof b.betScoreTeam1 === 'undefined') {
                    return -1;
                } else {
                    return b.betScoreTeam1 - a.betScoreTeam1;
                }
            }
            return b.betScore - a.betScore;
            });
        }

        // Convert games object to array and sort by date descending
        const sortedGames = Object.values(games).sort((a, b) => new Date(b.date) - new Date(a.date));

        resolve({ games: sortedGames });
    } catch (error) {
        //console.error('MD: Error fetching the tips:', error);
        reject(error);
    }
    });
}

module.exports = fetchTips;
