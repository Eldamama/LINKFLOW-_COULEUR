const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques (HTML, manifest, service worker, icônes)
app.use(express.static(path.join(__dirname, "public")));

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Exemple d’API dynamique (si tu veux connecter Supabase ou autre)
app.get("/api/hello", (req, res) => {
  res.json({ message: "Bonjour Aimé, ton PWA est dynamique !" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
