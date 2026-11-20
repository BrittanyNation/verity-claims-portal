// Verity — Help page: searchable glossary, FAQ accordions (one open at a time
// via <details> management), hours table with today highlighted, validated
// callback form, and a duplicate-aware letter signup. Commented as study code.
const $=id=>document.getElementById(id);
const GLOSSARY=[
 {term:"Allowed amount",def:"The plan rate for a service. If a provider bills more, the difference is not yours to pay when the provider is in network."},
 {term:"Appeal",def:"A written request for a second review of a denied or partly paid claim, with any added notes or records."},
 {term:"Billed amount",def:"What the provider charged before the plan rate was applied. It is a starting number, not your balance."},
 {term:"Coinsurance",def:"Your share of the allowed amount, written as a percent. Twenty percent coinsurance on a $100 allowed amount is $20."},
 {term:"Copay",def:"A flat amount you pay at the visit, such as $25 for an office visit. Copays do not change with the billed amount."},
 {term:"Deductible",def:"What you pay first each year for covered care before the plan starts paying its share."},
 {term:"Explanation of benefits",def:"The summary that follows a claim decision. It is not a bill. It shows billed, allowed, paid, and what you may owe."},
 {term:"Prior authorization",def:"Plan approval asked for before a service happens, so coverage is settled ahead of time."}
];
const FAQS=[
 {q:"I got a bill that is higher than this portal shows. What do I do?",a:"Compare the bill date and amount with the claim here. Providers sometimes bill before the plan finishes. If the numbers still do not match after the claim shows Paid, ask about that claim from the Ask or Appeal page and name the bill amount."},
 {q:"How long does an appeal take?",a:"Most appeals in this demo plan are decided within 30 days of receipt. Your reference shows Received right away, and the decision arrives in writing either way."},
 {q:"What does Pending Info mean?",a:"The plan asked the provider for a short note or record. You do not need to do anything unless the claim detail names something only you can send."},
 {q:"Can I send a document without an appeal?",a:"Yes. Choose Send a document on the Ask or Appeal page, name the claim number, and say in one line what the document is."},
 {q:"Is the amount under You may owe final?",a:"It is the allowed amount minus what the plan paid. A payment you made at the visit can lower it. If a provider bills you more, ask before paying the difference."},
 {q:"Why was my lab test denied?",a:"The most common reason is that the visit notes did not show why that test was needed on that date. An appeal that adds the ordering note usually settles it."}
];
const HOURS=[["Monday","8 AM to 6 PM CT","9 AM to 5 PM CT"],["Tuesday","8 AM to 6 PM CT","9 AM to 5 PM CT"],["Wednesday","8 AM to 6 PM CT","9 AM to 5 PM CT"],["Thursday","8 AM to 6 PM CT","9 AM to 5 PM CT"],["Friday","8 AM to 6 PM CT","9 AM to 5 PM CT"],["Saturday","9 AM to 1 PM CT","9 AM to 1 PM CT"],["Sunday","Closed","Closed"]];
function renderGloss(){
  const q=($("glossSearch").value||"").toLowerCase().trim();
  const list=GLOSSARY.filter(g=>!q||(g.term+" "+g.def).toLowerCase().includes(q));
  $("glossCount").textContent=list.length+" of "+GLOSSARY.length+" words";
  $("glossEmpty").classList.toggle("hidden",list.length>0);
  $("glossList").innerHTML=list.map(g=>`<article class="card" style="margin-bottom:10px"><h3 style="margin-top:0">${g.term}</h3><p>${g.def}</p></article>`).join("");
}
$("glossSearch").addEventListener("input",renderGloss); renderGloss();
$("faqList").innerHTML=FAQS.map(f=>`<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("");
// Accordions: opening one closes the others, so the page never becomes a wall.
document.querySelectorAll("#faqList details").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)document.querySelectorAll("#faqList details").forEach(o=>{if(o!==d)o.open=false;});}));
const todayIdx=(new Date().getDay()+6)%7; // Monday = 0
$("hoursTable").innerHTML="<tr><th>Day</th><th>Written replies</th><th>Callbacks</th></tr>"+HOURS.map((h,i)=>`<tr${i===todayIdx?' style="background:#FDE8C8;font-weight:700"':""}><td>${h[0]}${i===todayIdx?" (today)":""}</td><td>${h[1]}</td><td>${h[2]}</td></tr>`).join("");
$("cbForm").addEventListener("submit",e=>{
  e.preventDefault(); let ok=true;
  const name=$("cbName").value.trim(), phone=$("cbPhone").value.replace(/\D/g,"");
  $("eCbName").textContent=name.length>=2?"":"Please enter your full name."; if(name.length<2)ok=false;
  $("eCbPhone").textContent=phone.length===10?"":"Please enter a 10 digit phone number."; if(phone.length!==10)ok=false;
  if(!ok)return;
  const ref="VC-C-"+Math.random().toString(36).slice(2,7).toUpperCase();
  $("cbConfirm").classList.remove("hidden");
  $("cbConfirm").innerHTML=`<strong>Callback booked. Your reference is ${ref}.</strong><br>We will call ${name} at the number given, ${$("cbWhen").value.toLowerCase()}. This demo stores nothing outside your browser.`;
  e.target.reset();
});
$("letterForm").addEventListener("submit",e=>{
  e.preventDefault();
  const email=$("letterEmail").value.trim().toLowerCase();
  const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $("eLetter").textContent=ok?"":"Please enter a valid email address."; if(!ok)return;
  let subs=[]; try{subs=JSON.parse(localStorage.getItem("verity_letter"))||[]}catch(err){subs=[]}
  if(subs.includes(email)){$("letterNote").textContent="That email is already on the list. You are all set.";return;}
  subs.push(email); localStorage.setItem("verity_letter",JSON.stringify(subs));
  $("letterNote").textContent="You are on the list. The next Verity Letter arrives at the start of the month.";
  e.target.reset();
});
