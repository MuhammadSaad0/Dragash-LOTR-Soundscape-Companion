(function () {
  'use strict';
  const maps=window.POC_ATLAS_MAPS,keys=Object.keys(maps),svg=document.getElementById('atlas-map');
  const select=document.getElementById('atlas-region'),nav=document.querySelector('.atlas-regions');
  const search=document.getElementById('atlas-search'),results=document.getElementById('atlas-results');
  const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'');
  let region='';
  const view=window.POC_ATLAS_NAVIGATOR(svg,s=>{
    document.querySelector('[data-action="out"]').disabled=s.minimum;
    document.querySelector('[data-action="in"]').disabled=s.maximum;
    document.getElementById('atlas-zoom').textContent=Math.round(s.zoom*100)+'%';
  });
  keys.forEach((key,i)=>{
    const option=document.createElement('option');option.value=key;option.textContent=String(i+1).padStart(2,'0')+' · '+maps[key].title;select.append(option);
    const button=document.createElement('button');button.type='button';button.dataset.region=key;
    const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');button.append(number,document.createTextNode(maps[key].title));
    button.addEventListener('click',()=>open(key));nav.append(button);
  });
  function open(key) {
    if(!maps[key]) key='shire';
    region=key;const map=maps[key];
    svg.innerHTML=window.POC_REGIONAL_PLATES[key];svg.dataset.region=key;
    svg.setAttribute('aria-label',map.title+' — '+map.subtitle);view.fit();
    select.value=key;
    nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.region===key)));
    document.getElementById('atlas-area').textContent=map.area;
    document.getElementById('atlas-name').textContent=map.title;
    document.getElementById('atlas-note').textContent=map.note;
    document.getElementById('atlas-folio').textContent='Plate '+String(keys.indexOf(key)+1).padStart(2,'0')+' · '+map.places.length+' landmarks';
    document.getElementById('atlas-download').href='maps/'+key+'.svg';
    history.replaceState(null,'','#'+key);
  }
  select.addEventListener('change',()=>open(select.value));
  window.addEventListener('hashchange',()=>open(location.hash.slice(1)));
  document.querySelector('.explorer-tools').addEventListener('click',e=>{
    if(e.target.dataset.action==='in') view.zoomIn();
    if(e.target.dataset.action==='out') view.zoomOut();
    if(e.target.dataset.action==='fit') view.fit();
  });
  document.getElementById('atlas-routes').addEventListener('change',e=>svg.classList.toggle('atlas-hide-trails',!e.target.checked));
  const entries=keys.flatMap(key=>maps[key].places.map(place=>({key,place})));
  search.addEventListener('input',()=>{
    results.replaceChildren();const query=normalize(search.value.trim());
    if(!query) {document.getElementById('atlas-result-count').textContent='';return;}
    const matches=entries.filter(({place})=>normalize(place.name).includes(query));
    document.getElementById('atlas-result-count').textContent=matches.length?matches.length+' matching places':'No places found. Try a shorter name.';
    for(const {key,place} of matches) {
      const button=document.createElement('button');button.type='button';button.textContent=place.name;
      const detail=document.createElement('small');detail.textContent=maps[key].title;button.append(detail);
      button.addEventListener('click',()=>{
        open(key);view.focus(place.x,place.y,2.5);
        const ns='http://www.w3.org/2000/svg',pin=document.createElementNS(ns,'g');pin.setAttribute('class','atlas-search-pin');
        const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx',place.x);circle.setAttribute('cy',place.y);circle.setAttribute('r','8');
        const title=document.createElementNS(ns,'title');title.textContent=place.name;pin.append(title,circle);svg.append(pin);
        document.getElementById('atlas-name').textContent=place.name;
        document.getElementById('atlas-folio').textContent='Located in '+maps[key].title;
        svg.focus({preventScroll:true});
      });results.append(button);
    }
  });
  open(location.hash.slice(1));
}());
