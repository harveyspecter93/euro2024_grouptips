const axios = require('axios');
const cheerio = require('cheerio');

const fetchRankingPage = async (url) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        const $ = cheerio.load(data);
        const rankings = [];

        $('.rankingList__item').each((index, element) => {
            const rank = $(element).find('.rankingItem__rank').text().trim();
            const name = $(element).find('.rankingItem__name .rankingItem__link').text().trim();
            const globalPoints = $(element).find('.rankingItem__globalPoints').text().trim();
            const groupPoints = $(element).find('.rankingItem__points').text().trim();

            rankings.push({
                rank,
                name,
                globalPoints,
                groupPoints
            });
        });

        return rankings;
    } catch (error) {
        console.error('Error fetching the ranking:', error);
        return [];
    }
};

const fetchRanking = async () => {
    const url1 = 'https://emtippspiel.srf.ch/communities/29431?page=1';
    const url2 = 'https://emtippspiel.srf.ch/communities/29431?page=2';

    const rankingsPage1 = await fetchRankingPage(url1);
    const rankingsPage2 = await fetchRankingPage(url2);

    return [...rankingsPage1, ...rankingsPage2];
};

module.exports = fetchRanking;
