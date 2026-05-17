document
.getElementById('loginForm')

.onsubmit = function(e){

 e.preventDefault();

 const email =
 document.getElementById('email').value;

 const password =
 document.getElementById('password').value;

 console.log(email,password);

 window.location.href =
 'dashboard.html';

};