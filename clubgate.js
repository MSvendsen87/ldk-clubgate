(function () {

console.log("[CLUBGATE v7] LOADED");

/* ------------------------------------------------ */
/* KONFIG */
/* ------------------------------------------------ */

var ALLOWED_PATH = "/sider/klubbkveld-lyngdal-dart";

var ALLOWED_GROUPS = [
  "dartklubb",
  "frisbeeklubb",
  "ansatte"
];

var MEMBER_API =
"https://script.google.com/macros/s/AKfycbxyYoTy-hpG9n2ZUqhoNgvkTW5r6vyGdD_OLTxNpOp_dvDPNelg3IN42fL8uAPV5xTX/exec";

var PRODUCT_ID = "1322";
var PRODUCT_SETS = "1318";
var EVENT_ID = "9847005";

var API_BASE = "https://cold-shadow-36dc.post-cd6.workers.dev/products/";

var API_PRODUCT = API_BASE + PRODUCT_ID;

var LOGIN_URL = "/customer/login";

var CART_URL = "/cart/index";

var CONTACT_EMAIL = "post@golfkongen.no";

/* ------------------------------------------------ */
/* HJELPEFUNKSJONER */
/* ------------------------------------------------ */

function normalize(str){
return String(str||"")
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.trim();
}

function fetchText(url){
return fetch(url,{credentials:"same-origin"})
.then(function(r){return r.text();});
}

/* ------------------------------------------------ */
/* FINN NAVN FRA QUICKBUTIK */
/* ------------------------------------------------ */

function getCustomerName(){

var paths = [
"/customer/details",
"/customer/account",
"/customer/index"
];

var i=0;

function next(){

if(i>=paths.length){
return Promise.resolve("");
}

var path = paths[i++];

return fetchText(path)
.then(function(html){

var match = html.match(/customer-nav-name">([^<]+)/i);

if(match && match[1]){

var name = match[1].trim();

console.log("[CLUBGATE] name found:",name);

return name;

}

return next();

})
.catch(function(){
return next();
});

}

return next();

}

/* ------------------------------------------------ */
/* HENT MEDLEMSLISTE */
/* ------------------------------------------------ */

function fetchMembers(){

return fetch(MEMBER_API)
.then(function(r){return r.json();})

}

/* ------------------------------------------------ */
/* SJEKK TILGANG */
/* ------------------------------------------------ */

function hasAccess(name,members){

var nameNorm = normalize(name);

for(var i=0;i<members.length;i++){

var m = members[i];

if(!m.active) continue;

var memberName = normalize(m.name);

if(memberName!==nameNorm) continue;

var groups = m.groups||[];

for(var g=0;g<groups.length;g++){

var group = String(groups[g]).toLowerCase();

if(ALLOWED_GROUPS.includes(group)){

return true;

}

}

}

return false;

}

/* ------------------------------------------------ */
/* UI */
/* ------------------------------------------------ */

function render(html){

var root = document.querySelector("#content") || document.body;

root.innerHTML = html;

}

function renderLogin(){

render(
"<h2>Logg inn</h2>"+
"<p>Du må være innlogget for å delta på klubbkveld.</p>"+
"<a href='"+LOGIN_URL+"'>Logg inn</a>"
);

}

function renderNoAccess(){

render(
"<h2>Ingen tilgang</h2>"+
"<p>Du er ikke registrert som aktivt medlem.</p>"+
"<p>Kontakt oss: "+CONTACT_EMAIL+"</p>"
);

}

/* ------------------------------------------------ */
/* LOAD PRODUKT */
/* ------------------------------------------------ */

function loadProduct(){

fetch(API_PRODUCT)
.then(function(r){return r.json();})
.then(function(product){

console.log("[CLUBGATE] product loaded",product);

});

}

/* ------------------------------------------------ */
/* START */
/* ------------------------------------------------ */

if(location.pathname!==ALLOWED_PATH){
return;
}

getCustomerName()
.then(function(name){

if(!name){

console.log("[CLUBGATE] no name found");

renderLogin();

return;

}

console.log("[CLUBGATE] logged in:",name);

fetchMembers()
.then(function(members){

console.log("[CLUBGATE] members loaded:",members.length);

if(!hasAccess(name,members)){

renderNoAccess();

return;

}

console.log("[CLUBGATE] access granted");

loadProduct();

});

});

})();
