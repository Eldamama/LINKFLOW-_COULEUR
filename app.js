// ⚡ Configuration Supabase
const supabaseUrl = "https://xyfnhxxgvqjinfmlgduz.supabase.co";
const supabaseKey = "sb_publishable_lt7g7MVXBUSpDUvYtifwDw_a4us-Yiq";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fonction de connexion
async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert("Erreur de connexion : " + error.message);
  } else {
    alert("Connexion réussie !");
  }
}

// ⚡ Fonction mot de passe oublié
async function forgotPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://eldamama.github.io/LINKFLOW-_COULEUR/reset.html"
  });

  if (error) {
    alert("Erreur : " + error.message);
  } else {
    alert("Un email de réinitialisation a été envoyé !");
  }
}

// Exemple d’utilisation avec boutons HTML
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});

document.getElementById("forgot-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  forgotPassword(email);
});
