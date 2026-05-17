let hiddenTimerFinished = false;

function showPopup(){

 const popup =
 document.getElementById('popup');

 popup.classList.remove('hidden');

 let time = 10;

 const countdown =
 document.getElementById('countdown');

 countdown.innerText = time;

 const interval = setInterval(()=>{

   time--;

   countdown.innerText = time;

   if(time <= 0){

      clearInterval(interval);

      document
      .getElementById('videoBtn')
      .disabled = false;

   }

 },1000);

}

function startVideo(){

 localStorage.setItem(
 'videoStarted',
 Date.now()
 );

 window.open(
 'https://youtube.com',
 '_blank'
 );

 document
 .getElementById('popup')
 .classList.add('hidden');

 startHidden180Timer();

}

function startHidden180Timer(){

 setTimeout(()=>{

   hiddenTimerFinished = true;

   window.location.href =
   'submit-link.html';

 },180000);

}