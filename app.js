const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- 1. INSCRIPTION & MOT DE PASSE OUBLIÉ ---
app.post('/api/register', async (req, res) => {
    const { email, password, sponsorCode } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase.from('users').insert({
        email, 
        password_hash: hash, 
        sponsor_code: sponsorCode,
        current_step: 1
    }).select().single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, user: data });
});

// --- 2. DÉMARRAGE DU TIMER (SÉCURISÉ CÔTÉ SERVEUR) ---
app.post('/api/video/start', async (req, res) => {
    const { userId } = req.body;
    
    // On enregistre l'heure précise du serveur
    const { data, error } = await supabase.from('video_sessions').insert({
        user_id: userId,
        started_at: new Date().toISOString()
    });

    res.json({ success: true, message: "Timer démarré sur le serveur" });
});

// --- 3. VALIDATION DU TIMER (SANS API YOUTUBE) ---
app.post('/api/video/verify', async (req, res) => {
    const { userId } = req.body;

    const { data: session } = await supabase
        .from('video_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(1).single();

    if (!session) return res.status(400).json({ error: "Aucune session démarrée" });

    const startTime = new Date(session.started_at).getTime();
    const now = Date.now();
    const diffSeconds = Math.floor((now - startTime) / 1000);

    // VERROUILLAGE : 180 secondes minimum
    if (diffSeconds < 180) {
        const restant = 180 - diffSeconds;
        return res.status(403).json({ 
            success: false, 
            message: `Trop tôt ! Revenez dans ${restant} secondes.` 
        });
    }

    // Si OK, on valide l'étape
    await supabase.from('users').update({ current_step: 3 }).eq('id', userId);
    await supabase.from('video_sessions').update({ is_verified: true }).eq('id', session.id);

    res.json({ success: true, message: "Étape vidéo validée" });
});

// --- 4. VÉRIFICATION PAIEMENT (BSCSCAN) ---
app.post('/api/payment/verify', async (req, res) => {
    const { userId, txHash, targetAddress } = req.body;

    // Unicité du Hash
    const { data: checkHash } = await supabase.from('donations').select('*').eq('tx_hash', txHash).single();
    if (checkHash) return res.status(400).json({ error: "Ce paiement a déjà été utilisé." });

    try {
        const bscRes = await axios.get(`https://api.bscscan.com/api`, {
            params: {
                module: 'proxy', action: 'eth_getTransactionByHash',
                txhash: txHash, apikey: process.env.BSCSCAN_API_KEY
            }
        });

        const tx = bscRes.data.result;
        if (!tx) return res.status(404).json({ error: "Transaction introuvable" });

        // Vérification Adresse Cible + Montant (2.03 USDT)
        const amount = parseInt(tx.value, 16) / 1e18;
        if (tx.to.toLowerCase() !== targetAddress.toLowerCase()) return res.status(400).json({ error: "Mauvaise adresse cible" });
        if (amount < 2.03) return res.status(400).json({ error: "Montant insuffisant" });

        await supabase.from('users').update({ current_step: 6 }).eq('id', userId);
        await supabase.from('donations').insert({ user_id: userId, tx_hash: txHash, verified: true });

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Erreur Blockchain" });
    }
});

app.listen(3000);

