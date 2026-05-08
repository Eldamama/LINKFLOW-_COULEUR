import { loadOpportunities } from './opportunities.js';

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("opportunities");
  container.textContent = "Chargement des opportunités...";
});
