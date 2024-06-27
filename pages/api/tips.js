import fetchTips from "@/lib/Tips";

export default async function handler(req, res) {
    const tips = await fetchTips();
    res.status(200).json(tips);
}
