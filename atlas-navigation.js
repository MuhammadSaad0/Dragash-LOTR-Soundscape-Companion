/* Shared viewport for the reader, enlarged map and atlas. No network services. */
(function () {
  'use strict';
  window.POC_ATLAS_NAVIGATOR = function (svg, onChange = () => {}) {
    let zoom=1,cx=480,cy=310,gesture=null;
    const pointers=new Map(),maximum=5;
    svg.classList.add('atlas-navigator');
    svg.setAttribute('tabindex','0');
    function draw() {
      const w=960/zoom,h=620/zoom;
      cx=Math.max(w/2,Math.min(960-w/2,cx)); cy=Math.max(h/2,Math.min(620-h/2,cy));
      svg.setAttribute('viewBox',[cx-w/2,cy-h/2,w,h].join(' '));
      onChange({zoom,minimum:zoom<=1,maximum:zoom>=maximum});
    }
    function point(x,y) {
      const matrix=svg.getScreenCTM();
      return matrix?new DOMPoint(x,y).matrixTransform(matrix.inverse()):new DOMPoint(cx,cy);
    }
    function magnify(value,anchor) {
      const old=zoom; zoom=Math.max(1,Math.min(maximum,value));
      if(anchor) {cx=anchor.x-(anchor.x-cx)*old/zoom;cy=anchor.y-(anchor.y-cy)*old/zoom;}
      draw();
    }
    function fit() {zoom=1;cx=480;cy=310;draw();}
    function focus(x,y,value=2.5) {cx=x;cy=y;zoom=Math.max(1,Math.min(maximum,value));draw();}
    function begin() {
      const points=[...pointers.values()];
      if(points.length===1) gesture={type:'pan',point:point(points[0].x,points[0].y)};
      else if(points.length>=2) {
        const [a,b]=points;
        gesture={type:'pinch',distance:Math.hypot(a.x-b.x,a.y-b.y),zoom,anchor:point((a.x+b.x)/2,(a.y+b.y)/2)};
      } else gesture=null;
    }
    svg.addEventListener('pointerdown',e=>{
      if(e.button!==0) return;
      svg.focus({preventScroll:true}); pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      svg.setPointerCapture(e.pointerId);svg.classList.add('is-dragging');begin();
    });
    svg.addEventListener('pointermove',e=>{
      if(!pointers.has(e.pointerId)||!gesture) return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(gesture.type==='pan') {const p=point(e.clientX,e.clientY);cx+=gesture.point.x-p.x;cy+=gesture.point.y-p.y;draw();}
      else {
        const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);
        magnify(gesture.zoom*distance/Math.max(1,gesture.distance),gesture.anchor);
      }
    });
    for(const name of ['pointerup','pointercancel','lostpointercapture']) svg.addEventListener(name,e=>{
      pointers.delete(e.pointerId);if(!pointers.size) svg.classList.remove('is-dragging');begin();
    });
    svg.addEventListener('dblclick',e=>{magnify(zoom*1.5,point(e.clientX,e.clientY));});
    svg.addEventListener('wheel',e=>{
      if(!e.ctrlKey) return;
      e.preventDefault();magnify(zoom*Math.exp(-e.deltaY*.005),point(e.clientX,e.clientY));
    },{passive:false});
    svg.addEventListener('keydown',e=>{
      if(!['+','=','-','Home','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
      e.preventDefault();e.stopPropagation();
      if(e.key==='Home') fit();
      else if(e.key==='+'||e.key==='=') magnify(zoom*1.25);
      else if(e.key==='-') magnify(zoom/1.25);
      else {cx+=e.key==='ArrowLeft'?-60/zoom:e.key==='ArrowRight'?60/zoom:0;cy+=e.key==='ArrowUp'?-60/zoom:e.key==='ArrowDown'?60/zoom:0;draw();}
    });
    draw();
    return {fit,focus,zoomIn:()=>magnify(zoom*1.25),zoomOut:()=>magnify(zoom/1.25)};
  };
}());
