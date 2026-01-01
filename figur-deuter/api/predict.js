export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Nur POST erlaubt' });
    }

    const { shape } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'API Key fehlt' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Du bist ein mystisches Orakel für Wachsgießen. Deute die Figur des Nutzers kreativ, kurz und humorvoll. Gib auch eine kurze Zukunftsprognose (Liebe, Glück oder Geld)."
                    },
                    { role: "user", content: `Ich habe folgende Form gegossen: ${shape}` }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content;

        return res.status(200).json({ text });

    } catch (error) {
        return res.status(500).json({ error: 'Fehler bei OpenAI' });
    }
}