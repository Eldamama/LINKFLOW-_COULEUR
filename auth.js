document.addEventListener('DOMContentLoaded', function() {
    // ---------- INSCRIPTION AVEC CONFIRMATION ----------
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm-password').value;

            if (!email.includes('@')) {
                showMessage('Email invalide', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage('Le mot de passe doit faire au moins 6 caractères', 'error');
                return;
            }
            if (password !== confirm) {
                showMessage('Les mots de passe ne correspondent pas', 'error');
                return;
            }

            // Simuler inscription réussie
            showMessage(`Inscription réussie pour ${email} ! Vous pouvez vous connecter.`, 'success');
            signupForm.reset();
        });
    }

    // ---------- RÉCUPÉRATION DE MOT DE PASSE (OUPS) ----------
    const forgotLink = document.getElementById('forgot-password-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            if (!email) {
                showMessage('Veuillez entrer votre adresse email dans le champ de connexion', 'error');
                return;
            }
            // Simuler l'envoi d'un lien de réinitialisation
            showMessage(`Un lien de réinitialisation a été envoyé à ${email} (simulation).`, 'success');
            // Ici vous feriez un appel fetch vers /api/forgot-password
        });
    }

    // ---------- CONNEXION (optionnel) ----------
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            // Simulation (vérification côté front non sécurisée, à remplacer par appel backend)
            showMessage(`Tentative de connexion pour ${email} (mot de passe: ${'*'.repeat(password.length)})`, 'info');
        });
    }

    // Fonction utilitaire pour afficher un message
    function showMessage(msg, type) {
        const area = document.getElementById('message-area');
        area.textContent = msg;
        area.style.color = type === 'error' ? 'red' : (type === 'success' ? 'green' : 'black');
        setTimeout(() => area.textContent = '', 5000);
    }
});
