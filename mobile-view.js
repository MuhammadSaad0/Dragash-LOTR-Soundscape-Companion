(function(){
  const nav=document.createElement('nav');nav.className='mobile-views';nav.setAttribute('aria-label','Reader layout');
  nav.innerHTML='<button type="button" data-view="both" aria-pressed="true">Both</button><button type="button" data-view="map" aria-pressed="false">Map</button><button type="button" data-view="read" aria-pressed="false">Read</button>';
  const app=document.querySelector('.app');app.dataset.view='both';document.querySelector('.workspace').before(nav);
  nav.addEventListener('click',e=>{const view=e.target.dataset.view;if(!view)return;app.dataset.view=view;nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));});
}());
