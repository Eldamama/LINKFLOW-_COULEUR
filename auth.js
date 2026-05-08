// auth.js
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Validation simple
            if (!email.includes('@') || email.length < 5) {
                showMessage('Email invalide', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
                return;
            }

            // Exemple d’envoi vers un backend
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    showMessage(`Inscription réussie pour ${email}. Vérifiez votre boîte mail.`, 'success');
                    signupForm.reset();
                } else {
                    const error = await response.json();
                    showMessage(error.message || 'Erreur lors de l’inscription', 'error');
                }
            } catch (err) {
                showMessage('Problème réseau', 'error');
                console.error(err);
            }
        });
    }

    function showMessage(msg, type) {
        // Crée ou remplit un élément <div class="message"> 
        let msgDiv = document.querySelector('.form-message');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'form-message';
            signupForm.prepend(msgDiv);
        }
        msgDiv.textContent = msg;
        msgDiv.style.color = type === 'error' ? 'red' : 'green';
        setTimeout(() => msgDiv.textContent = '', 5000);
    }
});
