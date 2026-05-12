const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- 1. INSCRIPTION ---
app.post('/api/register', async (req, res) => {
    const { email, password, sponsorCode } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    // Génération d'un code temporaire si besoin, ou on attend la fin du processus
    const { data, error } = await supabase.from('users').insert({
        email, 
        password_hash: hash, 
        sponsor_code: sponsorCode,
        current_step: 1
    }).select().single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, user: data });
});

// --- 2. TIMER VIDÉO SÉCURISÉ ---
app.post('/api/video/start', async (req, res) => {
    const { userId } = req.body;
    await supabase.from('video_sessions').insert({
        user_id: userId,
        started_at: new Date().toISOString()
    });
    res.json({ success: true });
});

app.post('/api/video/verify', async (req, res) => {
    const { userId } = req.body;
    const { data: session } = await supabase
        .from('video_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false }).limit(1).single();

    if (!session) return res.status(400).json({ error: "Session non trouvée" });

    const diff = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);

    if (diff < 180) return res.status(403).json({ error: `Attendez encore ${180 - diff}s` });

    await supabase.from('users').update({ current_step: 3 }).eq('id', userId);
    res.json({ success: true });
});

// --- 3. VÉRIFICATION PAIEMENT (BSCSCAN) ---
app.post('/api/payment/verify', async (req, res) => {
    const { userId, txHash, targetAddress } = req.body;

    const { data: check } = await supabase.from('donations').select('*').eq('tx_hash', txHash).single();
    if (check) return res.status(400).json({ error: "Hash déjà utilisé" });

    try {
        const bscRes = await axios.get(`https://api.bscscan.com/api`, {
            params: { module: 'proxy', action: 'eth_getTransactionByHash', txhash: txHash, apikey: process.env.BSCSCAN_API_KEY }
        });
        const tx = bscRes.data.result;
        if (!tx) return res.status(404).json({ error: "Transaction introuvable" });

        const amount = parseInt(tx.value, 16) / 1e18;
        if (tx.to.toLowerCase() !== targetAddress.toLowerCase()) return res.status(400).json({ error: "Adresse cible incorrecte" });
        if (amount < 2.03) return res.status(400).json({ error: "Montant insuffisant" });

        await supabase.from('users').update({ current_step: 6 }).eq('id', userId);
        await supabase.from('donations').insert({ user_id: userId, tx_hash: txHash, verified: true });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Erreur Blockchain" }); }
});

// --- 4. NOUVEAU : GÉNÉRATION DU LIEN FINAL (Vérification Généalogie incluse) ---
app.post('/api/generate-final-link', async (req, res) => {
    const { userId, victoryLink } = req.body;

    // 1. Vérifier si l'utilisateur est à la bonne étape
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
    if (user.current_step < 6) return res.status(403).json({ error: "Paiement non validé" });

    // 2. Appel de la fonction SQL de généalogie (que tu as mise dans Supabase)
    const { data: isLegacy } = await supabase.rpc('verify_genealogy', { 
        target_code: user.sponsor_code, 
        root_code: 'AFEG1000' 
    });

    if (!isLegacy && user.sponsor_code !== null) {
        return res.status(403).json({ error: "Votre parrain n'est pas dans la lignée racine." });
    }

    // 3. Générer le code LinkFlow (4 lettres + 4 chiffres)
    const randomLetters = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const newRefCode = randomLetters + randomNumbers;

    // 4. Mettre à jour l'utilisateur
    await supabase.from('users').update({
        referral_code: newRefCode,
        victory_link: victoryLink,
        current_step: 7
    }).eq('id', userId);

    res.json({ success: true, link: `https://linkflow.app/?ref=${newRefCode}` });
});

app.listen(3000, () => console.log("Serveur LinkFlow démarré !"));
