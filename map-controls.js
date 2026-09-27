(function(){
  'use strict';
  const svg=document.getElementById('regional-map'),head=document.querySelector('.map-panel .panel-head');
  const controls=document.createElement('div');controls.className='map-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Map magnification');
  controls.innerHTML='<button type="button" data-map="out" aria-label="Zoom map out">−</button><button type="button" data-map="fit" title="Show the entire map">Fit</button><button type="button" data-map="in" aria-label="Zoom map in">+</button><button type="button" data-map="party" title="Magnify the current scene">Find company</button>';
  head.append(controls);let zoom=1,cx=480,cy=310;
  function draw(){const w=960/zoom,h=620/zoom;cx=Math.max(w/2,Math.min(960-w/2,cx));cy=Math.max(h/2,Math.min(620-h/2,cy));svg.setAttribute('viewBox',[cx-w/2,cy-h/2,w,h].join(' '));controls.querySelector('[data-map="out"]').disabled=zoom<=1;controls.querySelector('[data-map="in"]').disabled=zoom>=3;}
  controls.addEventListener('click',e=>{const action=e.target.dataset.map;if(!action)return;
    if(action==='fit'){zoom=1;cx=480;cy=310;}
    else if(action==='party'){const marker=svg.querySelector('#atlas-current'),point=marker&&marker.getAttribute('transform').match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);if(point){cx=Number(point[1]);cy=Number(point[2]);}zoom=2;}
    else zoom=Math.max(1,Math.min(3,zoom+(action==='in'?.25:-.25)));draw();
  });
  // Reset the viewport only when the geographic plate changes, never on audio ticks.
  new MutationObserver(()=>{zoom=1;cx=480;cy=310;draw();}).observe(svg,{attributes:true,attributeFilter:['data-region']});
  let pointer=null;
  svg.addEventListener('pointerdown',e=>{if(zoom<=1||e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,cx,cy};svg.setPointerCapture(e.pointerId);});
  svg.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;const r=svg.getBoundingClientRect(),scale=Math.min(r.width/(960/zoom),r.height/(620/zoom));cx=pointer.cx-(e.clientX-pointer.x)/scale;cy=pointer.cy-(e.clientY-pointer.y)/scale;draw();});
  ['pointerup','pointercancel','lostpointercapture'].forEach(name=>svg.addEventListener(name,()=>{pointer=null;}));draw();
}());
