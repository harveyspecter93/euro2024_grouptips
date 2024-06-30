import fetchTips from "@/lib/Tips";

export default async function handler(req, res) {
    const tips = await fetchTips().catch((error) => {
        console.log('in catch of fetchTips');
        res.status(500).json({ error: error.message });
        return;
    });
    res.status(200).json(tips);
}
