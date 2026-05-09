const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Arbre généalogique des parrains autorisés (racine + filleuls)
const genealogyTree = new Set([
    'root',           // racine par défaut
    'sponsorAlpha',
    'sponsorBeta',
    'victory_master',
    'linkflow_ambassador'
]);

app.post('/verify-sponsor', (req, res) => {
    const { sponsorCode } = req.body;
    
    if (!sponsorCode || sponsorCode === '' || genealogyTree.has(sponsorCode)) {
        res.json({ valid: true, message: 'Parrain valide' });
    } else {
        res.json({ valid: false, message: 'Parrain non présent dans la généalogie racine' });
    }
});

app.listen(3000, () => {
    console.log('✅ Backend LinkFlow actif sur http://localhost:3000');
    console.log('Généalogie autorisée:', Array.from(genealogyTree));
});
