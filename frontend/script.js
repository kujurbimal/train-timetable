// Small country list - full list can be added
const COUNTRIES = [
{ code: 'IN', name: 'India' },
{ code: 'US', name: 'United States' },
{ code: 'DE', name: 'Germany' },
{ code: 'JP', name: 'Japan' },
{ code: 'UK', name: 'United Kingdom' },
{ code: 'AU', name: 'Australia' }
];


function $(id){return document.getElementById(id)}


function init(){
const country = $('country');
COUNTRIES.forEach(c=>{
const opt = document.createElement('option'); opt.value=c.code; opt.textContent = c.name; country.appendChild(opt);
});


// swap
$('swapBtn').addEventListener('click', ()=>{
const a=$('from').value, b=$('to').value; $('from').value=b; $('to').value=a; $('from').focus();
});


// attach simple autocomplete using backend stations endpoint
attachAutocomplete('from'); attachAutocomplete('to');


$('searchBtn').addEventListener('click', onSearch);
}


async function attachAutocomplete(id){
const input = $(id);
let timer;
const list = document.createElement('div'); list.style.position='relative';
input.parentNode.appendChild(list);


input.addEventListener('input', ()=>{
clearTimeout(timer); timer=setTimeout(async ()=>{
const q = input.value.trim(); if(q.length<2) return;
const country = $('country').value; if(!country) return;
try{
const res = await fetch(`/api/stations/search?country=${encodeURIComponent(country)}&q=${encodeURIComponent(q)}`);
if(!res.ok) return;
const json = await res.json();
list.innerHTML = ''; json.stations.slice(0,8).forEach(s=>{
const el = document.createElement('div'); el.textContent = s.name + (s.code?` (${s.code})`: ''); el.style.padding='8px'; el.style.cursor='pointer'; el.style.borderBottom='1px solid #eee';
el.onclick = ()=>{ input.value = s.name; list.innerHTML=''; };
list.appendChild(el);
});
}catch(e){/* ignore */}
}, 250);
});
}


async function onSearch(){
const country = $('country').value, from=$('from').value.trim(), to=$('to').value.trim(), date=$('date').value, indiaKey=$('indiaKey').value.trim();
const result = $('result');
if(!country||!from||!to||!date){ result.style.display='block'; result.textContent='Please fill all fields'; return; }
result.style.display='block'; result.textContent='Loading...';


try{
const resp = await fetch('/api/train/search', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({country, from_station:from, to_station:to, date, extras:{indiaKey}})});
if(!resp.ok){ result.textContent = 'Error: ' + resp.status; return; }
const data = await resp.json();
if(!data.trains||data.trains.length===0){ result.innerHTML=`No trains found — provider: ${data.provider} (${data.provider_status})`; return; }
result.innerHTML = `<strong>Provider:</strong> ${data.provider} (${data.provider_status})<br><table style='width:100%;margin-top:8px'><tr><th>Train</th><th>Depart</th><th>Arrive</th><th>Dur</th></tr>${data.trains.map(t=>`<tr><td>${t.train}</td><td>${t.depart}</td><td>${t.arrive}</td><td>${t.duration||''}</td></tr>`).join('')}</table>`;
}catch(e){ result.textContent = 'Network error: ' + e.message; }
}


window.addEventListener('load', init);
