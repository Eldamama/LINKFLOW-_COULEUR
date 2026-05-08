import { supabase } from './supabase.js';

export async function loadOpportunities(userId) {
  const { data: opportunities, error } = await supabase.from('opportunities').select('*');
  if (error) {
    console.error(error);
    return [];
  }

  const { data: validations } = await supabase
    .from('validations')
    .select('opportunity_id, verified')
    .eq('user_id', userId);

  return opportunities.map(op => {
    const validation = validations?.find(v => v.opportunity_id === op.id);
    return {
      ...op,
      status: validation?.verified ? "validée" : "verrouillée"
    };
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("opportunities");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    container.textContent = "Veuillez vous connecter.";
    return;
  }

  const opportunities = await loadOpportunities(user.id);
  opportunities.forEach(op => {
    const div = document.createElement("div");
    div.textContent = `${op.name} → ${op.status === "validée" ? "✅ Active" : "🔒 Verrouillée"}`;
    container.appendChild(div);
  });
});
