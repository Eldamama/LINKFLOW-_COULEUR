// auth.js
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form'); // ou le sélecteur de votre formulaire
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche l'envoi réel
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            alert(`Inscription simulée pour ${email}. Vous pourrez bientôt vous connecter !`);
            console.log('Email:', email, 'Mot de passe:', password);
            // Efface ou redirige si vous voulez
            signupForm.reset();
        });
    }
});
