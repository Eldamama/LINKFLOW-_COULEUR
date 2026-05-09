// Chargement des traductions
let translations = {};
let currentLang = 'fr';
let victoryLinkGenerated = false;
let userData = {};
let timerSeconds = 180;
let timerInterval = null;
let videoWatched = false;

// Charger un fichier JSON de langue
async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        translations = await response.json();
        updateAllTexts();
    } catch (error) {
        console.error('Erreur chargement langue:', error);
    }
}

// Traduction
function t(key, params = {}) {
    let text = translations[key] || key;
    for (let [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

// Mettre à jour tous les textes
function updateAllTexts() {
    document.getElementById('popup-title').innerText = t('popup_title');
    document.getElementById('popup-text').innerText = t('popup_text');
    document.querySelector('#close-persuasion').innerText = t('close_popup');
    document.querySelector('#watch-video-btn').innerHTML = t('watch_btn');
    document.querySelector('#get-victory-link').innerHTML = t('victory_btn');
    document.getElementById('victory-title').innerText = t('victory_title');
    document.getElementById('form-title').innerText = t('form_title');
    document.querySelector('#register-form button').innerText = t('register_btn');
    document.getElementById('don-title').innerText = t('don_title');
    document.getElementById('don-instructions').innerText = t('don_instructions');
    document.querySelector('#verify-payment').innerText = t('verify_btn');
    document.getElementById('gen-title').innerText = t('gen_title');
    document.querySelector('#generate-linkflow').innerText = t('generate_btn');
    document.getElementById('followme-info').innerHTML = t('followme_msg');
    document.getElementById('opp-title').innerText = t('opp_title');
    document.getElementById('victory-link-input').placeholder = t('victory_link_placeholder');
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Sélecteur langue
    document.querySelectorAll('#language-selector button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.getAttribute('data-lang');
            loadLanguage(currentLang);
        });
    });
    
    // Charger français par défaut
    loadLanguage('fr');
    
    // Popup persuasion
    const popup = document.getElementById('popup-persuasion');
    const videoSection = document.getElementById('video-section');
    document.getElementById('close-persuasion').onclick = () => {
        popup.classList.remove('active');
        popup.style.display = 'none';
        videoSection.style.display = 'block';
    };
    
    // Bouton regarder vidéo
    const watchBtn = document.getElementById('watch-video-btn');
    const timerDisplay = document.getElementById('timer-display');
    const getVictoryBtn = document.getElementById('get-victory-link');
    
    watchBtn.onclick = () => {
        if (videoWatched) return;
        videoWatched = true;
        watchBtn.disabled = true;
        watchBtn.style.opacity = '0.5';
        
        timerInterval = setInterval(() => {
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerDisplay.innerText = t('timer_text', { s: 0 });
                getVictoryBtn.style.display = 'inline-block';
                getVictoryBtn.disabled = false;
            } else {
                timerSeconds--;
                timerDisplay.innerText = t('timer_text', { s: timerSeconds });
            }
        }, 1000);
    };
    
    // Obtention lien Victory
    getVictoryBtn.onclick = () => {
        if (!victoryLinkGenerated) {
            const fakeVictoryLink = `https://victory-auto.com/${Math.random().toString(36).substr(2, 8)}`;
            document.getElementById('victory-link-display').value = fakeVictoryLink;
            document.getElementById('victory-section').style.display = 'block';
            document.getElementById('inscription-section').style.display = 'block';
            victoryLinkGenerated = true;
        }
    };
    
    // Copier lien Victory
    document.getElementById('copy-victory-link').onclick = () => {
        const linkInput = document.getElementById('victory-link-display');
        linkInput.select();
        document.execCommand('copy');
        alert(t('copied'));
    };
    
    // Formulaire inscription
    document.getElementById('register-form').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const parrain = document.getElementById('parrain-code').value;
        const wallet = document.getElementById('wallet-bsc').value;
        const receiving = document.getElementById('receiving-wallet').value;
        
        if (!wallet.startsWith('0x') || wallet.length < 30) {
            document.getElementById('register-message').innerText = t('invalid_wallet');
            return;
        }
        
        userData = { email, parrain, wallet, receiving };
        document.getElementById('register-message').innerText = t('success_reg');
        
        setTimeout(() => {
            document.getElementById('inscription-section').style.display = 'none';
            document.getElementById('don-section').style.display = 'block';
        }, 1500);
    };
    
    // Vérification paiement
    document.getElementById('verify-payment').onclick = () => {
        const userWallet = document.getElementById('user-wallet-don').value;
        const hash = document.getElementById('transaction-hash').value;
        
        if (!hash.startsWith('0x') || hash.length < 10) {
            document.getElementById('payment-message').innerText = t('invalid_hash');
            return;
        }
        
        document.getElementById('payment-message').innerHTML = '✅ ' + t('valid_hash');
        
        setTimeout(() => {
            document.getElementById('don-section').style.display = 'none';
            document.getElementById('generation-section').style.display = 'block';
        }, 1500);
    };
    
    // Génération lien LinkFlow
    document.getElementById('generate-linkflow').onclick = async () => {
        const victoryInput = document.getElementById('victory-link-input').value;
        if (!victoryInput.includes('victory-auto.com')) {
            document.getElementById('gen-error').innerText = t('invalid_victory_link');
            return;
        }
        
        const parrainCode = userData.parrain;
        
        // Vérification backend (simulée)
        try {
            const response = await fetch('http://localhost:3000/verify-sponsor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sponsorCode: parrainCode || 'root' })
            });
            const result = await response.json();
            
            if (!result.valid) {
                document.getElementById('gen-error').innerText = t('parrain_not_in_tree');
                return;
            }
        } catch (error) {
            // Mode offline : vérification simplifiée
            const allowedSponsors = ['root', 'sponsor1', 'sponsor2', ''];
            if (parrainCode && !allowedSponsors.includes(parrainCode)) {
                document.getElementById('gen-error').innerText = t('parrain_not_in_tree');
                return;
            }
        }
        
        const generatedLink = `https://linkflow.io/ref/${Math.random().toString(36).substr(2, 6)}?invite=${parrainCode || 'root'}`;
        document.getElementById('linkflow-final-link').value = generatedLink;
        document.getElementById('generated-link-container').style.display = 'block';
        document.getElementById('gen-error').innerText = '';
        document.getElementById('opportunites-section').style.display = 'block';
    };
    
    // Copier lien LinkFlow
    document.getElementById('copy-linkflow').onclick = () => {
        const linkInput = document.getElementById('linkflow-final-link');
        linkInput.select();
        document.execCommand('copy');
        alert(t('copied'));
    };
});
