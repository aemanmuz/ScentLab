// ScentLab MY: plain JavaScript, with no frameworks or external databases.
// Start learning here: 1. data 2. renderCards 3. filterCatalog 4. events.
import {perfumes, brandDirectory} from './data.js';

// An object remembers the visitor's selections while the page is open.
const state = {compare:[], search:'', brand:'', family:'', budget:'', sort:'name'};
const STORAGE_KEY='scentlab-my-user-v1';

// localStorage saves this visitor's own ratings and wishlist in their browser.
function loadUserData(){
  try { const data=JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {wishlist:Array.isArray(data?.wishlist)?data.wishlist:[],ratings:data?.ratings && typeof data.ratings==='object'?data.ratings:{}};
  } catch { return {wishlist:[],ratings:{}}; }
}
let userData=loadUserData();
function saveUserData(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(userData));}catch{notify('Could not save in this browser.');}}
const $ = selector => document.querySelector(selector);
const money = price => price==null?'Price unverified':`RM${price.toFixed(2)}`;
function safe(text){return String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function notify(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),2700);}
function perfumeById(id){return perfumes.find(p=>p.id===id);}
function updateCounters(){$('#wishlist-count').textContent=userData.wishlist.length;$('#compare-count').textContent=state.compare.length;$('#hero-products').textContent=perfumes.length;}

// A template creates the same reusable HTML card for every fragrance object.
function perfumeCard(p,index){
 const isSaved=userData.wishlist.includes(p.id),selected=state.compare.includes(p.id),rating=userData.ratings[p.id];
 return `<article class="perfume-card"><div class="card-art" style="--bottle-bg:${p.color}"><span class="card-number">Nº ${String(index+1).padStart(2,'0')}</span><div class="card-bottle"><span>${safe(p.brand)}<br>✳<br>${safe(p.name)}</span></div></div>
 <div class="card-content"><span class="card-brand">${safe(p.brand)}</span><h3>${safe(p.name)}</h3><div class="card-meta"><span>${safe(p.family)}</span><span>${rating?`★ ${rating}/5 · My rating`:'Not yet rated'}</span></div>
 <div class="card-accords">${p.accords.map(a=>`<span class="pill">${safe(a)}</span>`).join('')}</div>
 <div class="card-bottom"><strong class="price">${money(p.price)}</strong><div class="card-actions"><button class="icon-btn ${isSaved?'active':''}" data-action="wishlist" data-id="${p.id}" aria-label="${isSaved?'Remove from':'Add to'} wishlist" title="Wishlist">${isSaved?'♥':'♡'}</button><button class="icon-btn ${selected?'active':''}" data-action="compare" data-id="${p.id}" aria-label="${selected?'Remove from':'Add to'} comparison" title="Compare">⚖</button><button class="view-btn" data-action="details" data-id="${p.id}">Details ↗</button></div></div></div></article>`;
}

function filteredPerfumes(){
 const query=state.search.toLowerCase();
 return perfumes.filter(p=>{
   const words=[p.name,p.brand,p.family,...p.accords,...p.notes.top,...p.notes.heart,...p.notes.base].join(' ').toLowerCase();
   return (!query||words.includes(query)) && (!state.brand||p.brand===state.brand) && (!state.family||p.family===state.family) && (!state.budget||(p.price!=null && p.price<=Number(state.budget)));
 }).sort((a,b)=>state.sort==='price-low'?(a.price??Infinity)-(b.price??Infinity):state.sort==='price-high'?(b.price??-Infinity)-(a.price??-Infinity):state.sort==='rating'?(userData.ratings[b.id]||0)-(userData.ratings[a.id]||0):a.name.localeCompare(b.name));
}
function renderCards(){const items=filteredPerfumes();$('#catalogue').innerHTML=items.map(perfumeCard).join('');$('#no-results').classList.toggle('hidden',items.length!==0);$('#result-count').textContent=`${items.length} fragrance${items.length===1?'':'s'}`;updateCounters();}
function renderBrands(){$('#brands-grid').innerHTML=brandDirectory.map(b=>`<article class="brand-card"><div><span class="small-mark">✳</span><h3>${safe(b.name)}</h3><p>${safe(b.status)}</p></div><a href="${safe(b.url)}" target="_blank" rel="noopener noreferrer">Official website ↗</a></article>`).join('');}
function populateFilters(){[...new Set(perfumes.map(p=>p.brand))].sort().forEach(name=>$('#brand-filter').add(new Option(name,name)));[...new Set(perfumes.map(p=>p.family))].sort().forEach(name=>$('#family-filter').add(new Option(name,name)));}
function changeCompare(id){if(state.compare.includes(id)){state.compare=state.compare.filter(x=>x!==id);}else if(state.compare.length<3){state.compare.push(id);}else{notify('Compare up to 3 fragrances.');return;}renderCards();renderCompare();}
function renderCompare(){const slots=state.compare.map(id=>perfumeById(id)).filter(Boolean);$('#compare-grid').innerHTML=[...slots,...Array(3-slots.length).fill(null)].map((p,i)=>p?`<div class="compare-slot selected"><span class="tiny">BOTTLE ${i+1}</span><h3>${safe(p.name)}</h3><p>${safe(p.brand)} · ${money(p.price)} · ${safe(p.size)}</p><p><span class="label">Family:</span> ${safe(p.family)}</p><p><span class="label">Accords:</span> ${safe(p.accords.join(', '))}</p><p><span class="label">Top:</span> ${safe(p.notes.top.join(', ')||'Unverified')}</p><p><span class="label">Heart:</span> ${safe(p.notes.heart.join(', ')||'Unverified')}</p><p><span class="label">Base:</span> ${safe(p.notes.base.join(', ')||'Unverified')}</p><p><span class="label">My rating:</span> ${userData.ratings[p.id]?`${userData.ratings[p.id]}/5`:'Not rated'}</p><button data-action="compare" data-id="${p.id}">Remove ×</button></div>`:`<div class="compare-slot empty-slot"><span style="font-size:35px">＋</span><strong>Open slot ${i+1}</strong><p>Tap ⚖ on a fragrance to compare</p></div>`).join('');}
function toggleWishlist(id){userData.wishlist=userData.wishlist.includes(id)?userData.wishlist.filter(x=>x!==id):[...userData.wishlist,id];saveUserData();renderCards();renderWishlist();notify(userData.wishlist.includes(id)?'Added to your saved scents':'Removed from saved scents');}
function renderWishlist(){const items=userData.wishlist.map(perfumeById).filter(Boolean);$('#wishlist-content').innerHTML=items.length?items.map(p=>`<div class="saved-item"><div><strong>${safe(p.name)}</strong><small>${safe(p.brand)} · ${money(p.price)}</small></div><button class="view-btn" data-action="details" data-id="${p.id}">View ↗</button><button class="icon-btn" data-action="wishlist" data-id="${p.id}" aria-label="Remove saved perfume">×</button></div>`).join(''):'<p class="muted">No saved perfumes yet. Tap ♡ on any fragrance to add one.</p>';updateCounters();}
function showDetails(id){const p=perfumeById(id);if(!p)return;const isSaved=userData.wishlist.includes(id),rating=userData.ratings[id]||0;
 $('#detail-content').innerHTML=`<div class="modal-top"><span class="eyebrow olive">FRAGRANCE PROFILE · VERIFIED ${safe(p.verified)}</span><button class="close-btn" data-close="detail-dialog" aria-label="Close details">✕</button></div><div class="detail-header"><div class="detail-art" style="--bottle-bg:${p.color}"><span>✳</span></div><div><span class="card-brand">${safe(p.brand)}</span><h2 style="font-size:38px;letter-spacing:-1.5px;margin:4px 0">${safe(p.name)}</h2><p class="muted">${safe(p.family)} · ${safe(p.size)} · ${money(p.price)}</p><p class="detail-description">${safe(p.description)}</p><div class="card-accords">${p.accords.map(a=>`<span class="pill">${safe(a)}</span>`).join('')}</div></div></div><h3>Fragrance note pyramid</h3><div class="details-grid">${[['Top',p.notes.top],['Heart',p.notes.heart],['Base',p.notes.base]].map(([title,notes])=>`<div class="note-column"><h4>${title} notes</h4><p>${notes.length?safe(notes.join(' · ')):'Not verified yet'}</p></div>`).join('')}</div><div class="rating-row"><label for="rating-select">My personal rating</label><select id="rating-select"><option value="0">Not rated</option>${[1,2,3,4,5].map(n=>`<option value="${n}" ${rating===n?'selected':''}>${n} / 5 stars</option>`).join('')}</select><span class="muted" style="font-size:11px">Private · saved on this device</span></div><div class="detail-footer"><button class="btn primary" data-action="wishlist" data-id="${p.id}">${isSaved?'♥ Saved — remove':'♡ Add to wishlist'}</button><button class="btn ghost" data-action="compare" data-id="${p.id}">⚖ Compare</button><a class="source-link" href="${safe(p.source)}" rel="noopener noreferrer" target="_blank">View official source ↗</a></div><p class="data-note">Prices are dated observations, not live offers. Scent family and accords are editorial groupings for discovery, not community-voted scores. Product images are illustrative.</p>`;
 if(!$('#detail-dialog').open)$('#detail-dialog').showModal();$('#rating-select').addEventListener('change',event=>{const value=Number(event.target.value);if(value)userData.ratings[id]=value;else delete userData.ratings[id];saveUserData();renderCards();renderCompare();notify(value?`Saved your ${value}-star rating`:'Rating cleared');});}

// The finder has no AI: it gives points to scents that match the selected preferences.
function findMatches(){const budget=Number($('#finder-budget').value),family=$('#finder-family').value;
 const matches=perfumes.filter(p=>p.price!=null&&p.price<=budget).map(p=>{
  let score=30; // Every perfume within budget starts with 30 points.
  if(p.family===family)score+=50; // Exact scent-family match.
  if(p.accords.includes(family))score+=20; // Similar accord match.
  if(family==='Fresh'&&p.accords.includes('Citrus'))score+=10;
  if(family==='Floral'&&p.accords.includes('Fruity'))score+=10;
  return {...p,score:Math.min(score,100)};
 }).sort((a,b)=>b.score-a.score||a.price-b.price).slice(0,3);
 $('#finder-results').innerHTML=matches.length?`<p class="eyebrow gold">YOUR TOP MATCHES · RULE-BASED</p>${matches.map((p,i)=>`<div class="match-card"><div class="match-symbol" style="--match-color:${p.color}">✳</div><div><h4>${i+1}. ${safe(p.name)}</h4><p>${safe(p.brand)} · ${money(p.price)} · ${safe(p.family)}</p></div><strong>${p.score}%</strong></div>`).join('')}<p class="match-explain">These are preference-match scores, not product ratings or performance measurements. +50 for family, +20 for accord, within your chosen budget.</p>`:'<div class="finder-placeholder"><strong>No matches in this budget.</strong><p>Try increasing the maximum price.</p></div>';
}

// Event delegation: a single listener handles every dynamic button.
document.addEventListener('click',event=>{
 const close=event.target.closest('[data-close]');if(close){document.getElementById(close.dataset.close).close();return;}
 const action=event.target.closest('[data-action]');if(!action)return;
 const {action:kind,id}=action.dataset;
 if(kind==='wishlist'){toggleWishlist(id);if($('#detail-dialog').open)showDetails(id);}
 if(kind==='compare'){changeCompare(id);if($('#detail-dialog').open)showDetails(id);}
 if(kind==='details'){$('#wishlist-dialog').close();showDetails(id);}
});
$('#search').addEventListener('input',event=>{state.search=event.target.value.trim();renderCards();});
for(const [selector,key] of [['#brand-filter','brand'],['#family-filter','family'],['#budget-filter','budget'],['#sort','sort']]){ $(selector).addEventListener('change',event=>{state[key]=event.target.value;renderCards();}); }
$('#clear-compare').addEventListener('click',()=>{state.compare=[];renderCards();renderCompare();});
$('#find-button').addEventListener('click',findMatches);
$('#wishlist-button').addEventListener('click',()=>{renderWishlist();$('#wishlist-dialog').showModal();});
// Clicking the dark overlay closes dialogs, but clicking inside the modal does not.
for(const dialog of document.querySelectorAll('dialog')){dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});}

// Startup: these functions draw the page as soon as the browser loads the script.
populateFilters();renderBrands();renderCards();renderCompare();renderWishlist();
