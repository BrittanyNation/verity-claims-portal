// Verity Claims Portal — claims dashboard
// Course pattern (post-course combined skills): data-driven rendering,
// derived state (filtered/sorted list and all totals computed, never stored twice),
// and localStorage persistence for the ask/appeal handoff.
// Brittany: study notes are in the comments — read the filter pipeline top to bottom.

const CLAIMS = [
 {id:"VC-2026-1842",provider:"Riverbend Clinic",service:"Office visit, established patient",date:"2026-11-02",billed:185,allowed:132,paid:105,owe:27,status:"Paid",cat:"Medical"},
 {id:"VC-2026-1837",provider:"Clarksville Imaging",service:"MRI, knee without contrast",date:"2026-10-28",billed:1450,allowed:890,paid:712,owe:178,status:"Paid",cat:"Imaging"},
 {id:"VC-2026-1851",provider:"Northgate Dental",service:"Crown, porcelain",date:"2026-11-10",billed:1200,allowed:840,paid:420,owe:420,status:"In Review",cat:"Dental"},
 {id:"VC-2026-1790",provider:"Summit Lab Services",service:"Blood panel, comprehensive",date:"2026-10-12",billed:320,allowed:148,paid:148,owe:0,status:"Paid",cat:"Lab"},
 {id:"VC-2026-1860",provider:"Willow Physical Therapy",service:"Therapy session, 45 minutes",date:"2026-11-14",billed:140,allowed:98,paid:0,owe:98,status:"Pending Info",cat:"Therapy"},
 {id:"VC-2026-1755",provider:"Riverbend Clinic",service:"Flu vaccine and administration",date:"2026-09-30",billed:65,allowed:48,paid:48,owe:0,status:"Paid",cat:"Preventive"},
 {id:"VC-2026-1848",provider:"Brightpath Vision",service:"Eye exam and refraction",date:"2026-11-06",billed:210,allowed:150,paid:90,owe:60,status:"In Review",cat:"Vision"},
 {id:"VC-2026-1698",provider:"County General Hospital",service:"Emergency visit, level 3",date:"2026-09-14",billed:2850,allowed:1960,paid:1568,owe:392,status:"Denied",cat:"Hospital"},
 {id:"VC-2026-1820",provider:"Harmony Counseling",service:"Counseling session, 60 minutes",date:"2026-10-22",billed:175,allowed:125,paid:100,owe:25,status:"Paid",cat:"Behavioral Health"},
 {id:"VC-2026-1855",provider:"Summit Lab Services",service:"Vitamin D test",date:"2026-11-12",billed:145,allowed:62,paid:0,owe:62,status:"Denied",cat:"Lab"},
 {id:"VC-2026-1863",provider:"Willow Physical Therapy",service:"Therapy evaluation",date:"2026-11-16",billed:220,allowed:165,paid:132,owe:33,status:"Paid",cat:"Therapy"},
 {id:"VC-2026-1866",provider:"Clarksville Imaging",service:"X-ray, wrist, 3 views",date:"2026-11-18",billed:280,allowed:176,paid:0,owe:176,status:"Pending Info",cat:"Imaging"}
];
const STATUSES=["All","Paid","In Review","Denied","Pending Info"];
let activeStatus="All", currentClaim=null;
const $=id=>document.getElementById(id);
const money=n=>"$"+n.toLocaleString("en-US",{minimumFractionDigits:0});
// Derived totals: computed from CLAIMS every render, never stored separately.
function renderStats(){
  $("statTotal").textContent=CLAIMS.length;
  $("statPaid").textContent=money(CLAIMS.reduce((s,c)=>s+c.paid,0));
  $("statOwe").textContent=money(CLAIMS.reduce((s,c)=>s+c.owe,0));
  $("statOpen").textContent=CLAIMS.filter(c=>c.status!=="Paid").length;
}
function badgeClass(s){return s==="Paid"?"b-paid":s==="In Review"?"b-review":s==="Denied"?"b-denied":"b-pending";}
// Filter pipeline: status chip, then search text, then sort — one derived list.
function getVisible(){
  const q=($("searchInput").value||"").toLowerCase().trim();
  let list=CLAIMS.filter(c=>(activeStatus==="All"||c.status===activeStatus)&&(!q||(c.provider+" "+c.service+" "+c.id+" "+c.cat).toLowerCase().includes(q)));
  const sort=$("sortSelect").value;
  if(sort==="newest")list.sort((a,b)=>b.date.localeCompare(a.date));
  if(sort==="oldest")list.sort((a,b)=>a.date.localeCompare(b.date));
  if(sort==="amountHigh")list.sort((a,b)=>b.billed-a.billed);
  if(sort==="oweHigh")list.sort((a,b)=>b.owe-a.owe);
  return list;
}
function render(){
  renderStats();
  const list=getVisible();
  $("resultCount").textContent=list.length+" of "+CLAIMS.length+" claims";
  $("emptyState").classList.toggle("hidden",list.length>0);
  $("claimGrid").innerHTML=list.map(c=>`<article class="card"><span class="badge ${badgeClass(c.status)}">${c.status}</span><h3>${c.service}</h3><p class="meta">${c.provider} · ${c.date}<br>Claim ${c.id} · ${c.cat}</p><div class="money"><span>Billed ${money(c.billed)}</span><span>You may owe ${money(c.owe)}</span></div><p style="margin-top:12px"><button class="btn" data-open="${c.id}">View claim</button></p></article>`).join("");
  document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openDetail(b.dataset.open)));
}
function renderChips(){
  $("statusChips").innerHTML=STATUSES.map(s=>`<button class="chip${s===activeStatus?" active":""}" data-status="${s}">${s}</button>`).join("");
  document.querySelectorAll("[data-status]").forEach(b=>b.addEventListener("click",()=>{activeStatus=b.dataset.status;renderChips();render();}));
}
function timelineFor(c){
  const steps=["Received from provider","Checked against your plan","Decision made"];
  const done=c.status==="Paid"||c.status==="Denied"?3:c.status==="In Review"?2:1;
  return `<ol class="timeline">${steps.map((s,i)=>`<li class="${i<done?"done":""}">${s}${i<done?" ✓":""}</li>`).join("")}</ol>`;
}
function openDetail(id){
  currentClaim=CLAIMS.find(c=>c.id===id); if(!currentClaim)return;
  const c=currentClaim, pct=c.allowed?Math.round(c.paid/c.allowed*100):0;
  $("detailTitle").textContent=c.service;
  $("detailMeta").textContent=`${c.provider} · ${c.date} · Claim ${c.id} · ${c.status}`;
  $("detailBody").innerHTML=`<table><tr><th>Amount billed</th><td>${money(c.billed)}</td></tr><tr><th>Plan allowed amount</th><td>${money(c.allowed)}</td></tr><tr><th>Plan paid</th><td>${money(c.paid)}</td></tr><tr><th>You may owe</th><td>${money(c.owe)}</td></tr></table><p class="meta" style="margin-top:12px">Plan paid ${pct}% of the allowed amount</p><div class="bar"><i style="width:${pct}%"></i></div><h3>Where this claim stands</h3>${timelineFor(c)}${c.status==="Denied"?'<p><strong>Why denied:</strong> the notes on file did not show medical necessity for this service on this date. An appeal can add notes from your provider. Use Ask About This Claim to start one.</p>':""}${c.status==="Pending Info"?'<p><strong>What is needed:</strong> a short note from the provider about the visit. Once it arrives, review restarts without a new claim.</p>':""}`;
  $("detailModal").classList.add("open");
}
// Handoff: store the claim number so the Ask or Appeal page opens prefilled.
$("askBtn").addEventListener("click",()=>{if(currentClaim){localStorage.setItem("verity_prefill_claim",currentClaim.id);location.href="submit.html";}});
$("detailClose").addEventListener("click",()=>$("detailModal").classList.remove("open"));
$("detailModal").addEventListener("click",e=>{if(e.target===$("detailModal"))$("detailModal").classList.remove("open");});
$("searchInput").addEventListener("input",render);
$("sortSelect").addEventListener("change",render);
$("heroSearchBtn").addEventListener("click",()=>{$("searchInput").value=$("heroSearch").value;render();$("searchInput").scrollIntoView({behavior:"smooth"});});
renderChips(); render();
