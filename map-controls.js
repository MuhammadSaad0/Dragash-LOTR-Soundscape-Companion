(function(){
  'use strict';
  const svg=document.getElementById('regional-map'),head=document.querySelector('.map-panel .panel-head');
  const controls=document.createElement('div');controls.className='map-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Map magnification');
  controls.innerHTML='<button type="button" data-map="out" aria-label="Zoom map out">−</button><button type="button" data-map="fit" title="Show the entire map">Fit</button><button type="button" data-map="in" aria-label="Zoom map in">+</button><button type="button" data-map="party" title="Magnify the current scene">Find company</button>';
  head.append(controls);
  const view=window.POC_ATLAS_NAVIGATOR(svg,s=>{
    controls.querySelector('[data-map="out"]').disabled=s.minimum;
    controls.querySelector('[data-map="in"]').disabled=s.maximum;
  });
  controls.addEventListener('click',e=>{
    const action=e.target.dataset.map;
    if(action==='fit') view.fit();
    else if(action==='in') view.zoomIn();
    else if(action==='out') view.zoomOut();
    else if(action==='party') {
      const marker=svg.querySelector('#atlas-current');
      const match=marker?.getAttribute('transform')?.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      if(match) view.focus(Number(match[1]),Number(match[2]));
    }
  });
  new MutationObserver(()=>view.fit()).observe(svg,{attributes:true,attributeFilter:['data-region']});
}());
