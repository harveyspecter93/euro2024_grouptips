const axios = require('axios');
const cheerio = require('cheerio');

const users = [
    'Z2E5q', 'ngxM4', 'b6Mko', 'DjgOz', 'RAD4x', 'r3n6G', 'rgAzP', 'eLlGR', 'bAl7J', 'rb73', '7kpjq', 'aLll3'
];

async function fetchZusatzfragen() {
    try {
        let zusatzfragen = {};

        for (const user of users) {
            const url = `https://emtippspiel.srf.ch/users/${user}/round/1`;
            const response = await axios.get(url);
            const data = response.data;

            const $ = cheerio.load(data);
            const username = $('.pageTitle__title').text().trim().replace('Tipps von ', '');

            // Extract "Zusatzfragen"
            $('div[data-react-class="TextSelection"]').each((index, element) => {

                
                const betData = JSON.parse($(element).attr('data-react-props')).bet;
                const question = betData.question;
                const answerId = betData.picks ? betData.picks[0] : null;
                const answer = !answerId ? 'Verkäckt ^^' : betData.answers.find(a => a.id === answerId).name;

                if (!zusatzfragen[question]) {
                    zusatzfragen[question] = {};
                }

                if (!zusatzfragen[question][answer]) {
                    zusatzfragen[question][answer] = [];
                }

                zusatzfragen[question][answer].push(username);
            });
        }

        return { zusatzfragen };
    } catch (error) {
        console.error('Error fetching the zusatzfragen:', error);
        return { zusatzfragen: {} };
    }
}

module.exports = fetchZusatzfragen;