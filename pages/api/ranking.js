import fetchRanking from "@/lib/Ranking";

 export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const ranking = await fetchRanking();
    console.log("MD: ranking", ranking);
    res.status(200).json(ranking);
}