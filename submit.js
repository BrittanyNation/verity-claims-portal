// Verity — Ask or Appeal page
// Validated form ending in a generated reference, submissions persisted in
// localStorage, lookup by reference/claim/word, and withdraw. Commented as study code.
const $=id=>document.getElementById(id);
const KEY="verity_submissions";
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
function save(list){localStorage.setItem(KEY,JSON.stringify(list))}
function genRef(){return "VC-A-"+Math.random().toString(36).slice(2,7).toUpperCase();}
// Prefill from the claims dashboard handoff (Ask About This Claim button).
const prefill=localStorage.getItem("verity_prefill_claim");
if(prefill){$("fClaim").value=prefill;localStorage.removeItem("verity_prefill_claim");}
function validate(){
  let ok=true;
  const name=$("fName").value.trim(), email=$("fEmail").value.trim(), claim=$("fClaim").value.trim(), date=$("fDate").value, msg=$("fMsg").value.trim();
  $("eName").textContent=name.length>=2?"":"Please enter your full name."; if(name.length<2)ok=false;
  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $("eEmail").textContent=emailOk?"":"Please enter a valid email address."; if(!emailOk)ok=false;
  const claimOk=/^VC-\d{4}-\d{4}$/.test(claim);
  $("eClaim").textContent=claimOk?"":"Use the format VC-2026-0000, exactly as it appears on the claim."; if(!claimOk)ok=false;
  let dateErr="";
  if(!date)dateErr="Please choose the date of service.";
  else if(new Date(date+"T12:00:00")>new Date())dateErr="The date of service cannot be in the future.";
  $("eDate").textContent=dateErr; if(dateErr)ok=false;
  $("eMsg").textContent=msg.length>=20?"":"Please write at least 20 characters so the reviewer has enough to work with."; if(msg.length<20)ok=false;
  return ok?{name,email,claim,date,msg,type:$("fType").value}:null;
}
$("askForm").addEventListener("submit",e=>{
  e.preventDefault();
  const v=validate(); if(!v)return;
  const ref=genRef();
  const list=load();
  list.unshift({ref,...v,status:"Received",sent:new Date().toISOString().slice(0,10)});
  save(list); renderSubs();
  $("confirmBox").classList.remove("hidden");
  $("confirmBox").innerHTML=`<strong>Sent. Your reference is ${ref}.</strong><br>Your ${v.type.toLowerCase()} about claim ${v.claim} is marked Received. A written reply goes to ${v.email}. Keep the reference to look it up below.`;
  e.target.reset();
});
function renderSubs(){
  const q=($("lookupInput").value||"").toLowerCase().trim();
  const list=load().filter(s=>!q||(s.ref+" "+s.claim+" "+s.msg+" "+s.type).toLowerCase().includes(q));
  $("subCount").textContent=list.length+" shown";
  $("subEmpty").classList.toggle("hidden",load().length>0);
  $("subList").innerHTML=list.map(s=>`<article class="card" style="margin-bottom:12px"><span class="badge b-review">${s.status}</span><h3>${s.type} · ${s.ref}</h3><p class="meta">Claim ${s.claim} · Service date ${s.date} · Sent ${s.sent}</p><p>${s.msg}</p>${s.status==="Received"?`<button class="btn secondary" data-withdraw="${s.ref}">Withdraw</button>`:""}</article>`).join("");
  document.querySelectorAll("[data-withdraw]").forEach(b=>b.addEventListener("click",()=>{
    const all=load(); const item=all.find(x=>x.ref===b.dataset.withdraw);
    if(item){item.status="Withdrawn"; save(all); renderSubs();}
  }));
}
$("lookupInput").addEventListener("input",renderSubs);
renderSubs();
