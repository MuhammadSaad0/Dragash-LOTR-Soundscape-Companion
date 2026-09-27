(function(){
  'use strict';
  const key='red-book-reading-v1';let data={version:1,chapters:{}};
  try{const stored=JSON.parse(localStorage.getItem(key));if(stored&&stored.version===1&&stored.chapters&&typeof stored.chapters==='object')data=stored;}catch(e){}
  const status=document.createElement('span');status.id='bookmark-status';status.setAttribute('aria-live','off');document.querySelector('.top-meta').append(status);
  window.POC_BOOKMARK={
    last:()=>data.last,
    get:id=>{const p=data.chapters[id];return p&&Number.isFinite(p.time)&&p.time>=0?p:null;},
    save:(id,index,time,audio)=>{if(!id||!Number.isFinite(time)||time<0)return;data.last={id,index};data.chapters[id]={time,rate:audio.playbackRate,volume:audio.volume,muted:audio.muted};try{localStorage.setItem(key,JSON.stringify(data));const stamp=Math.floor(time/60)+':'+String(Math.floor(time%60)).padStart(2,'0'),label='Saved · '+stamp;if(status.textContent!==label)status.textContent=label;status.title='Chapter '+(index+1)+' of 62 and audio position saved in this browser. You can safely close the reader.';}catch(e){status.textContent='Bookmark unavailable';status.title='This browser could not save your listening position.';}},
    announce:()=>{status.textContent='Bookmark restored';}
  };
  window.POC_ANIMATE_PAGE=function(delta){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||innerWidth<761)return 0;
    const book=document.querySelector('.workspace');
    const sheet=document.createElement('div');sheet.className='spread-turn'+(delta<0?' reverse':'');sheet.setAttribute('aria-hidden','true');sheet.inert=true;
    // Retain BOTH old pages while the new spread loads beneath them. Namespace
    // SVG definitions too, so a new region cannot alter the outgoing map.
    book.querySelectorAll(':scope > .panel').forEach(source=>{
      const clone=source.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(e=>e.id='turn-'+e.id);
      clone.querySelectorAll('*').forEach(e=>{for(const a of Array.from(e.attributes)){
        if(a.value.includes('url(#'))e.setAttribute(a.name,a.value.replace(/url\(#/g,'url(#turn-'));
        if((a.name==='href'||a.name==='xlink:href')&&a.value.startsWith('#'))e.setAttribute(a.name,'#turn-'+a.value.slice(1));
      }});
      sheet.append(clone);
    });
    book.append(sheet);
    const old=book.querySelector(':scope > .side-panel .transcript-cues'),copy=sheet.querySelector('.transcript-cues');if(old&&copy)copy.scrollTop=old.scrollTop;
    // The outgoing spread stays opaque. Its right (or left) leaf turns over
    // to reveal the real incoming opposite page, never a blank placeholder.
    sheet.classList.add('physical-turn');
    const moving=sheet.querySelector(delta>0?'.side-panel':'.map-panel');
    const fixed=sheet.querySelector(delta>0?'.map-panel':'.side-panel');
    fixed.classList.add('turn-fixed');
    const r=moving.getBoundingClientRect(),b=sheet.getBoundingClientRect();
    const leaf=document.createElement('div');leaf.className='turn-leaf';leaf.style.left=(r.left-b.left)+'px';leaf.style.width=r.width+'px';leaf.style.setProperty('--leaf-scale',fixed.getBoundingClientRect().width/r.width);
    const front=document.createElement('div');front.className='turn-front';front.append(moving);
    const back=document.createElement('div');back.className='turn-back';leaf.append(front,back);sheet.append(leaf);
    if(old&&copy)copy.scrollTop=old.scrollTop;
    window.POC_FINISH_PAGE=function(){
      const incoming=book.querySelector(delta>0?':scope > .map-panel':':scope > .side-panel').cloneNode(true);
      incoming.querySelectorAll('[id]').forEach(e=>e.id='incoming-'+e.id);
      incoming.querySelectorAll('*').forEach(e=>{for(const a of Array.from(e.attributes)){
        if(a.value.includes('url(#'))e.setAttribute(a.name,a.value.replace(/url\(#/g,'url(#incoming-'));
        if((a.name==='href'||a.name==='xlink:href')&&a.value.startsWith('#'))e.setAttribute(a.name,'#incoming-'+a.value.slice(1));
      }});
      back.append(incoming);
      const original=book.querySelector(':scope > .side-panel .transcript-cues'),copied=back.querySelector('.transcript-cues');if(copied)copied.scrollTop=original.scrollTop;
      sheet.classList.add('turn-running');window.POC_FINISH_PAGE=null;
    };
    leaf.addEventListener('animationend',()=>sheet.remove(),{once:true});setTimeout(()=>sheet.remove(),1000);return 900;
  };
}());
