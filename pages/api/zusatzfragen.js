import fetchZusatzfragen from "@/lib/Zusatzfragen";

export default async function handler(req, res) {
    const zusatzfragen = await fetchZusatzfragen();
    res.status(200).json(zusatzfragen);
}
