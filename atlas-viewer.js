(function () {
  'use strict';
  const panel=document.getElementById('map-panel-kicker'),source=document.getElementById('regional-map');
  const button=document.createElement('button');
  button.className='atlas-expand';button.textContent='⤢';button.title='Enlarge map';button.setAttribute('aria-label','Enlarge map');panel.after(button);
  const dialog=document.createElement('dialog');dialog.className='atlas-dialog';dialog.setAttribute('aria-label','Enlarged journey map');
  dialog.innerHTML='<div class="atlas-toolbar"><a href="atlas.html" target="_blank">Explore the atlas ↗</a><button type="button" data-action="out" aria-label="Zoom enlarged map out">−</button><button type="button" data-action="fit">Fit</button><button type="button" data-action="in" aria-label="Zoom enlarged map in">+</button><button type="button" data-action="party">Find company</button><button type="button" class="atlas-close" aria-label="Close enlarged map">×</button></div><div class="atlas-scroll"><svg viewBox="0 0 960 620" role="img" aria-label="Enlarged regional map"></svg></div><p class="atlas-help">Drag to pan · Double-click or pinch to zoom · Arrow keys to move · Home to fit</p>';
  document.body.append(dialog);
  const svg=dialog.querySelector('svg');
  const view=window.POC_ATLAS_NAVIGATOR(svg,s=>{
    dialog.querySelector('[data-action="out"]').disabled=s.minimum;
    dialog.querySelector('[data-action="in"]').disabled=s.maximum;
  });
  function sync() {
    svg.innerHTML=source.innerHTML.replace(/id="([^"]+)"/g,'id="large-$1"').replace(/url\(#([^\)]+)\)/g,'url(#large-$1)');
    svg.setAttribute('aria-label',source.getAttribute('aria-label')||'Enlarged regional map');
    dialog.querySelector('a').href='atlas.html#'+source.dataset.region;
    view.fit();
  }
  button.addEventListener('click',()=>{sync();dialog.showModal();});
  dialog.querySelector('.atlas-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>button.focus());
  dialog.querySelector('.atlas-toolbar').addEventListener('click',e=>{
    const action=e.target.dataset.action;
    if(action==='fit') view.fit();
    else if(action==='in') view.zoomIn();
    else if(action==='out') view.zoomOut();
    else if(action==='party') {
      const match=svg.querySelector('#large-atlas-current')?.getAttribute('transform')?.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      if(match) view.focus(Number(match[1]),Number(match[2]));
    }
  });
  new MutationObserver(()=>{if(dialog.open)sync();}).observe(source,{attributes:true,attributeFilter:['data-region']});
}());
