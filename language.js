const lang = localStorage.getItem('language') || 'fr';

fetch(`lang/${lang}.json`)
.then(res => res.json())
.then(data => {
 console.log(data);
});