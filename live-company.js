/* Narrative focus, not a claim that every named character is co-located.
 * Groups are chapter-level approximations except the explicit timed changes.
 */
(function(){
  'use strict';
  const hobbits=['Frodo','Sam','Merry','Pippin'], hunters=['Aragorn','Legolas','Gimli'];
  const fellowship=[...hobbits,...hunters,'Boromir','Gandalf'];
  const profiles={
    Frodo:['FB','Ring-bearer','#853f32'],Sam:['SG','Companion & protector','#607144'],Merry:['MB','Hobbit of Buckland','#a27835'],Pippin:['PT','Hobbit of the Shire','#7b654e'],
    Aragorn:['AR','Ranger & leader','#465c4c'],Legolas:['LE','Elven archer','#5d7554'],Gimli:['GI','Dwarven warrior','#875a3d'],Boromir:['BO','Captain of Gondor','#6b6360'],Gandalf:['GA','Wizard & guide','#747875'],
    Bilbo:['BB','The old adventurer','#8e6d43'],Treebeard:['TR','Shepherd of the trees','#4d6546'],Gollum:['GO','Guide through the wild','#767249'],Faramir:['FA','Captain of Ithilien','#50695f'],Éowyn:['ÉO','Shieldmaiden of Rohan','#9b885b'],Théoden:['TH','King of the Mark','#8b743a']
  };
  const byChapter={1:['Bilbo','Frodo','Gandalf'],2:['Frodo','Gandalf','Sam'],3: hobbits.slice(0,2).concat('Pippin'),4:['Frodo','Sam','Pippin'],5:hobbits,6:hobbits,7:hobbits,8:hobbits,9:hobbits,10:[...hobbits,'Aragorn'],11:[...hobbits,'Aragorn'],12:[...hobbits,'Aragorn'],13:['Frodo','Bilbo'],14:['Frodo','Gandalf'],15:fellowship,16:fellowship,17:fellowship,18:fellowship.filter(n=>n!=='Gandalf'),19:fellowship.filter(n=>n!=='Gandalf'),20:fellowship.filter(n=>n!=='Gandalf'),21:fellowship.filter(n=>n!=='Gandalf'),22:['Frodo','Sam'],23:hunters,24:hunters,25:['Merry','Pippin'],26:['Merry','Pippin'],27:[...hunters,'Gandalf'],28:[...hunters,'Gandalf'],29:[...hunters,'Théoden'],30:[...hunters,'Gandalf','Théoden'],31:['Merry','Pippin'],32:['Gandalf','Aragorn'],33:['Gandalf','Pippin'],34:['Frodo','Sam'],35:['Frodo','Sam','Gollum'],36:['Frodo','Sam','Gollum'],37:['Frodo','Sam','Gollum'],38:['Frodo','Sam','Faramir'],39:['Frodo','Sam','Faramir'],40:['Frodo','Sam','Gollum'],41:['Frodo','Sam','Gollum'],42:['Frodo','Sam'],43:['Sam'],44:['Pippin','Gandalf'],45:hunters,46:['Merry','Théoden'],47:['Pippin','Gandalf'],48:['Merry','Théoden','Éowyn'],49:['Merry','Éowyn'],50:['Pippin','Gandalf'],51:['Aragorn'],52:['Aragorn','Gandalf'],53:['Aragorn','Gandalf','Pippin'],54:['Sam','Frodo'],55:['Frodo','Sam'],56:['Frodo','Sam'],57:['Frodo','Sam'],58:['Aragorn','Faramir','Éowyn'],59:hobbits,60:[...hobbits,'Gandalf'],61:hobbits,62:['Frodo','Sam']};
  function cast(chapter,time){
    let names=(byChapter[chapter]||['Frodo']).slice();
    if(chapter===26&&time>=378)names.push('Treebeard');
    if(chapter===17&&time>=1954)names=names.filter(n=>n!=='Gandalf');
    if(chapter===62&&time>=2027)names=['Sam'];
    return names;
  }
  window.POC_COMPANY_CAST=cast;
  const panel=document.createElement('section');panel.className='company-ledger';panel.setAttribute('aria-label','Characters in narrative focus');
  panel.innerHTML='<div class="company-heading"><span>In this part of the tale</span><div><button type="button" class="company-toggle" aria-pressed="true">On map</button><button type="button" class="company-details-toggle" aria-expanded="false" aria-controls="company-details">Field notes ▴</button></div></div><div class="company-names"></div><div class="company-note"></div><div id="company-details" class="company-details" hidden><div class="company-detail-head"><strong class="company-person"></strong><button type="button" class="company-close" aria-label="Close field notes">×</button></div><p class="company-role"></p><dl><dt>Current scene</dt><dd class="company-setting"></dd><dt>Position accuracy</dt><dd class="company-certainty"></dd></dl><blockquote class="company-evidence"></blockquote><h3>Journey so far · this chapter</h3><ol class="company-history"></ol></div>';
  document.querySelector('.map-panel').append(panel);
  const ns='http://www.w3.org/2000/svg';let lastKey='',selected='',visible=true,lastState=null;
  function node(tag,attrs){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs||{}))el.setAttribute(k,v);return el;}
  function render(s){
    lastState=s;const names=cast(s.chapter,s.time),key=[s.chapter,s.scene.id,names.join(),selected,visible].join('|');
    if(key===lastKey)return;lastKey=key;
    if(!names.includes(selected))selected=names[0];
    const roster=panel.querySelector('.company-names');roster.replaceChildren();
    names.forEach(name=>{const p=profiles[name],button=document.createElement('button');button.type='button';button.textContent=name;button.style.setProperty('--character-ink',p[2]);button.setAttribute('aria-pressed',String(name===selected));button.title=p[1];button.addEventListener('click',()=>{selected=name;render(lastState);});roster.append(button);});
    panel.querySelector('.company-note').textContent=selected+' · '+profiles[selected][1]+' — '+s.scene.title;
    panel.querySelector('.company-person').textContent=selected;
    panel.querySelector('.company-role').textContent=profiles[selected][1]+' · '+names.filter(n=>n!==selected).join(', ');
    panel.querySelector('.company-setting').textContent=s.scene.title;
    panel.querySelector('.company-certainty').textContent=s.scene.tracked?'Transcript-linked milestone; individual positions are approximate.':'Approximate chapter setting; individual positions are not established.';
    const evidence=panel.querySelector('.company-evidence');evidence.textContent=s.scene.evidence&&s.scene.evidence!=='Chapter setting'?s.scene.evidence:'The narrative is currently centred on this group. Their tokens indicate the scene area, not separate surveyed positions.';
    const history=panel.querySelector('.company-history');history.replaceChildren();
    (s.milestones||[s.scene]).forEach(m=>{const item=document.createElement('li'),time=Math.max(0,Math.floor(m.start||0));item.textContent=Math.floor(time/60)+':'+String(time%60).padStart(2,'0')+' — '+m.title;history.append(item);});
    panel.querySelector('.company-note').title='Narrative-focus roster, not a precise headcount at this instant. Tokens cluster around the scene location; characters may be separated within a scene. '+(s.scene.tracked?'Location milestone is transcript-linked.':'Location timing is approximate.');
    document.querySelectorAll('#regional-map, .atlas-dialog[open] svg').forEach(svg=>{
      svg.querySelectorAll('.live-company').forEach(el=>el.remove());if(!visible)return;
      const layer=node('g',{'class':'live-company','aria-label':'Narrative focus, approximate scene-level positions'});
      // Unconnected dots mark previously reached milestones, not invented roads.
      s.visited.forEach(p=>{layer.append(node('circle',{cx:p[0]*9.6,cy:p[1]*6.2,r:3,fill:'#946738',opacity:.55}));});
      const x=s.position[0]*9.6,y=s.position[1]*6.2;
      const title=node('title');title.textContent='Focus party near '+s.scene.mapTitle+' · scene-level positions';layer.append(title);
      const cy=Math.max(24,Math.min(590,y-35)),start=Math.max(25,Math.min(935-(names.length-1)*25,x-(names.length-1)*12.5));
      layer.append(node('path',{d:'M'+x+' '+y+'L'+(start+(names.length-1)*12.5)+' '+cy,stroke:'#735039','stroke-width':1,'stroke-dasharray':'2 3',fill:'none'}));
      names.forEach((name,i)=>{const p=profiles[name],g=node('g',{'class':'companion-token'}),t=node('title');t.textContent=name+' · '+p[1]+' · near the current scene';g.append(t);g.append(node('circle',{cx:start+i*25,cy,r:name===selected?12:10,fill:p[2],stroke:'#f1dfb4','stroke-width':2}));const label=node('text',{x:start+i*25,y:cy+3.5,'text-anchor':'middle',fill:'#fff0d3','font-size':9,'font-family':'Georgia,serif','font-weight':'bold'});label.textContent=p[0];g.append(label);layer.append(g);});
      svg.append(layer);
    });
  }
  panel.querySelector('.company-toggle').addEventListener('click',e=>{visible=!visible;e.currentTarget.setAttribute('aria-pressed',String(visible));e.currentTarget.textContent=visible?'On map':'Hidden';render(lastState);});
  const detailButton=panel.querySelector('.company-details-toggle'),details=panel.querySelector('.company-details');
  detailButton.addEventListener('click',()=>{details.hidden=!details.hidden;detailButton.setAttribute('aria-expanded',String(!details.hidden));});
  panel.querySelector('.company-close').addEventListener('click',()=>{details.hidden=true;detailButton.setAttribute('aria-expanded','false');detailButton.focus();});
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){details.hidden=true;detailButton.setAttribute('aria-expanded','false');detailButton.focus();}});
  window.POC_UPDATE_COMPANY=render;
}());
