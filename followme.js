const ROOT_CODE = 'ABCD1000';

const REQUIRED_AMOUNT = 2.03;

const BSCSCAN_API_KEY = 'VOTRE_API_KEY';

async function verifyBSCTransaction(hash,targetWallet){

 try{

   const response = await fetch(
   `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${BSCSCAN_API_KEY}`
   );

   const data = await response.json();

   if(!data.result){
      return false;
   }

   const tx = data.result;

   if(!tx.to){
      return false;
   }

   if(tx.to.toLowerCase() !== targetWallet.toLowerCase()){
      return false;
   }

   return true;

 }catch(error){

   console.log(error);

   return false;
 }

}

function generateInvitationCode(){

 const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 const nums = '0123456789';

 let result = '';

 for(let i=0;i<4;i++){
   result += chars[Math.floor(Math.random()*26)];
 }

 for(let i=0;i<4;i++){
   result += nums[Math.floor(Math.random()*10)];
 }

 return result;
}

function validateMLMLink(link){

 return (
 link.includes('victoryautomatic.com')
 ||
 link.includes('victoryworld.club')
 );

}

async function submitLink(){

 const targetWallet = document.getElementById('targetWallet').value;
 const paymentHash = document.getElementById('paymentHash').value;
 const mlmLink = document.getElementById('mlmLink').value;
 const message = document.getElementById('message');

 if(!targetWallet){
   message.innerHTML = 'Adresse cible obligatoire';
   return;
 }

 if(!paymentHash){
   message.innerHTML = 'Hash transaction obligatoire';
   return;
 }

 if(!validateMLMLink(mlmLink)){
   message.innerHTML = 'Lien MLM invalide';
   return;
 }

 message.innerHTML = 'Vérification blockchain en cours...';

 const verified = await verifyBSCTransaction(
 paymentHash,
 targetWallet
 );

 if(!verified){
   message.innerHTML = 'Transaction non valide';
   return;
 }

 const invitationCode = generateInvitationCode();

 const sponsor =
 localStorage.getItem('ref')
 ||
 ROOT_CODE;

 const personalLink =
 `https://pointfocal.app/register?ref=${invitationCode}`;

 localStorage.setItem('myInvitationCode',invitationCode);
 localStorage.setItem('myPointFocalLink',personalLink);
 localStorage.setItem('myMLMLink',mlmLink);

 message.innerHTML = `

 Activation validée.<br><br>

 Sponsor : ${sponsor}<br><br>

 Code invitation : ${invitationCode}<br><br>

 Partagez maintenant votre lien personnel :<br><br>

 ${personalLink}

 `;

 setTimeout(()=>{
   window.location.href='dashboard.html';
 },5000);

}