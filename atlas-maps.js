/* Original engraved regional atlas. North is up throughout.
 * Geography references and limits are documented in MAP-NOTES.md.
 * Terrain marks are illustrative, not surveyed elevation contours.
 */
(function () {
  'use strict';
  const ink = '#433d30', paper = '#eee3c5';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const p = (d, attr = '') => `<path d="${d}" ${attr}/>`;
  const line = (d, color = ink, width = 1, extra = '') => p(d, `fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
  const group = (x, y, s, content) => `<g transform="translate(${x} ${y}) scale(${s})">${content}</g>`;
  const poly = a => a.map(v => v.join(',')).join(' ');
  const path = a => 'M' + a.map(v => v.join(' ')).join('L');
  function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  function inside(x, y, polygon) {
    let yes = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) yes = !yes;
    }
    return yes;
  }
  function curve(points) {
    let d = `M${points[0].join(' ')}`;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], e = points[Math.min(points.length - 1, i + 2)];
      d += `C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
    }
    return d;
  }
  function mountain(x, y, scale, rand) {
    const h = 17 + rand() * 24, w = 9 + rand() * 8, peak = (rand() - .5) * 9;
    let s = p(`M${-w} 4L${-w*.6} ${-h*.35}L${peak-5} ${-h*.56}L${peak} ${-h}L${peak+6} ${-h*.67}L${w*.7} ${-h*.22}L${w} 4L2 7Z`, `fill="${paper}" stroke="${ink}" stroke-width="1.05"`);
    s += p(`M${peak} ${-h}L${peak+1} ${-h*.62}L${w*.28} ${-h*.4}L${w*.25} 3L${w} 4L${w*.7} ${-h*.22}L${peak+6} ${-h*.67}Z`, 'fill="#697068" opacity=".68"');
    s += p(`M${peak-5} ${-h*.56}L${peak} ${-h}L${peak+6} ${-h*.67}L${peak+2} ${-h*.73}L${peak} ${-h*.66}L${peak-2} ${-h*.75}Z`, 'fill="#faf5df" opacity=".95"');
    s += line(`M${peak} ${-h}l-3 ${h*.28} 1 ${h*.2} -5 ${h*.2} 2 ${h*.23}`, ink, .65);
    s += line(`M${-w} 4l-4 2 -5 -1m${w*1.5} -9l4 -6 4 7 5 4`,ink,.6,'opacity=".6"');
    for (let i = 0; i < 7; i++) { const t = (i + 1) / 9; s += line(`M${-w*(1-t)} ${3-h*t*.66}l${3+4*t} ${-4-3*t}`, ink, .55); }
    s += line(`M${-w-5} 7l7 -1m${w+3} 2l7 1`, '#806d4f', .55);
    return group(x, y, scale, s);
  }
  function ridge(points, size = 1, rows = 2, seed = 1, hills = false) {
    const r = rng(seed), marks = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i], b = points[i+1], dist = Math.hypot(b[0]-a[0],b[1]-a[1]), n = Math.max(1,Math.ceil(dist/(hills?25:15)/size));
        for (let k = 0; k < n; k++) {
          const t = k/n, x = a[0]+(b[0]-a[0])*t+(r()-.5)*25+(j-(rows-1)/2)*25*size, y = a[1]+(b[1]-a[1])*t+(r()-.5)*26+j*13*size;
          marks.push({x,y,s:size*(.7+r()*.45)});
        }
      }
    }
    marks.sort((a,b)=>a.y-b.y);
    const d=curve(points), tint=hills?'#a8ad72':'#858a79';
    let relief=line(d,tint,(hills?44:64)*size,'opacity=".16"');
    // Ink contours are decorative relief, never numerical elevation isolines.
    for(const offset of [-27,-18,19,29]) relief+=line(d,tint,.65,`transform="translate(${offset*size} 9)" opacity=".32"`);
    return relief+marks.map(m => hills ? hill(m.x,m.y,m.s,r) : mountain(m.x,m.y,m.s,r)).join('');
  }
  function hill(x,y,s,r) {
    const w=15+r()*16, h=5+r()*10;
    let out = p(`M${-w} 2Q${-w*.6} ${-h*.4} -5 ${-h}Q4 ${-h-3} 11 ${-h*.3}L${w} 3`, `fill="${paper}" stroke="${ink}" stroke-width=".75"`);
    for(let i=0;i<10;i++) { const t=i/10; out+=line(`M${-w+6+t*w*1.5} ${2-h*Math.sin(t*Math.PI)}l${-2-r()*3} ${3+r()*5}`, ink,.5,'opacity=".7"'); }
    return group(x,y,s,out);
  }
  function tree(x,y,s,type,r) {
    let out='';
    if(type==='pine') {
      out=p('M0 -18L-4 -11H-2L-7 -5H-4L-9 2Q0 5 9 2L4 -5H7L2 -11H4Z',`fill="#809485" stroke="${ink}" stroke-width=".75"`)+line('M0 -16V7M0 -9L4 -5M0 -3L6 1',ink,.65);
    } else {
      const h=12+r()*4;
      out=p(`M-7 -2C-12 -5 -9 -11 -5 -11C-6 ${-h-5} 3 ${-h-5} 5 -12C12 -14 13 -6 9 -4C11 2 3 3 0 1C-5 4 -9 3 -7 -2Z`,`fill="${type==='gold'?'#cdb767':'#9dae83'}" stroke="${ink}" stroke-width=".8"`)+line('M0 -7V7M0 -2L-4 -6M0 1L5 -4M-6 -8l2 -2M4 -10l3 2M5 -1l2 -1M6 -7l2 3M-6 -2l2 2',ink,.65);
    }
    return group(x,y,s,out);
  }
  function woodland(polygon, type='oak', seed=1, spacing=15) {
    const r=rng(seed), xs=polygon.map(v=>v[0]), ys=polygon.map(v=>v[1]);
    let out=p(curve([...polygon,polygon[0]])+'Z',`fill="${type==='gold'?'#c5af59':'#7d9874'}" opacity=".22"`);
    for(let y=Math.min(...ys)+8;y<Math.max(...ys);y+=spacing*.72) {
      for(let x=Math.min(...xs)+7;x<Math.max(...xs);x+=spacing) {
        const a=x+(r()-.5)*10,b=y+(r()-.5)*7;
        if(inside(a,b,polygon)) out+=tree(a,b,.52+r()*.25,type,r);
      }
    }
    return out;
  }
  function marsh(polygon,seed=1) {
    const r=rng(seed); let out=p(curve([...polygon,polygon[0]])+'Z','fill="#8aa99b" opacity=".18"');
    const xs=polygon.map(v=>v[0]),ys=polygon.map(v=>v[1]);
    for(let y=Math.min(...ys);y<Math.max(...ys);y+=13)for(let x=Math.min(...xs);x<Math.max(...xs);x+=19){const a=x+r()*11,b=y+r()*6;if(inside(a,b,polygon))out+=line(`M${a-4} ${b}h9m-7 -3l-2 -4m5 5v-7m3 6l3 -4`,'#65705b',.65,'opacity=".75"');}
    return out;
  }
  function ground(polygon, seed=1, ash=false) {
    const r=rng(seed),xs=polygon.map(v=>v[0]),ys=polygon.map(v=>v[1]);let out='';
    for(let y=Math.min(...ys);y<Math.max(...ys);y+=16)for(let x=Math.min(...xs);x<Math.max(...xs);x+=20){const a=x+r()*13,b=y+r()*10;if(inside(a,b,polygon)&&r()>.35)out+=ash?line(`M${a} ${b}l3 -2 3 2m-9 4h2m7 1h1`,ink,.45,'opacity=".32"'):line(`M${a} ${b}l-1 -2m4 2l1 -3m4 5h2`,ink,.5,'opacity=".28"');}
    return out;
  }
  function river(points,w=3) {const d=curve(points);return `<g class="atlas-river">`+line(d,'#81aaa3',w+9,'opacity=".16"')+line(d,'#567f7d',w+1.8)+line(d,'#a5c3bb',w)+line(d,'#e6efda',.65)+'</g>';}
  function road(points,trail=false) {const d=curve(points);return `<g class="${trail?'atlas-trail':'atlas-road'}">`+line(d,paper,4.5)+line(d,trail?'#985244':'#7d6950',trail?1.6:1.4,trail?'stroke-dasharray="2 5"':'stroke-dasharray="7 3"')+'</g>';}
  function lake(points) {const d=curve(points)+'Z';return p(d,`fill="#a9c4bb" stroke="#567f7d" stroke-width="1.3"`)+p(d,'fill="url(#atlasWater)"');}
  const place = (key,name,x,y,dx=12,dy=-12,kind='village') => ({key,name,x,y,dx,dy,kind});
  const label = (name,x,y,kind='region',angle=0) => ({name,x,y,kind,angle});
  function symbol(kind) {
    if(kind==='refuge') return p('M-11 5Q-12 -14 0 -16Q12 -13 11 5Z',`fill="#858a79" stroke="${ink}" stroke-width="1"`)+p('M-6 5Q-6 -7 0 -8Q6 -7 6 5Z',`fill="${ink}"`)+line('M-13 -8v18m3 -21V8','#86b6b4',1.5);
    if(kind==='river-island') return p('M0 -21Q-10 -8 -7 7Q-2 14 0 20Q9 4 7 -7Q3 -14 0 -21Z','fill="#a5b786" stroke="#567f7d" stroke-width="1"')+line('M-2 -12l-3 7h3m5 0l-3 7h3M-1 5l-3 6h5','#536b50',.8);
    if(kind==='hobbit-hole') return p('M-15 5Q-17 -13 0 -14Q17 -13 15 5Z','fill="#a4b183" stroke="#5b664c" stroke-width="1"')+`<circle cy="0" r="5" fill="#5f7961" stroke="${ink}" stroke-width="1"/><circle cx="2" cy="0" r=".8" fill="#e9d58d"/>`+line('M-18 6H18M-11 -1h2m18 0h2',ink,.8);
    if(kind==='fortress') return p('M-18 6V-7h5v-6h5v6h4v-16h8v16h4v-6h5v6h5V6Z',`fill="${paper}" stroke="${ink}" stroke-width="1.3"`)+line('M-3 6V-1h6v7M-13 -3V2M13 -3V2M0 -19v6',ink,1);
    if(kind==='volcano') return p('M-31 7L-23 -3L-15 -17L-8 -36Q0 -40 8 -36L13 -20L24 -3L34 8L9 11Z',`fill="${paper}" stroke="${ink}" stroke-width="1.2"`)+p('M8 -36L13 -20L24 -3L34 8L11 7L5 -8Z',`fill="${ink}" opacity=".8"`)+line('M-8 -36Q0 -31 8 -36M-20 1L-13 -9M-16 -3L-8 -19M-10 1L-4 -13M-2 5L1 -8M-32 12l14 -1m28 3h18',ink,.85);
    if(kind==='island') return p('M-12 6L-7 -4L0 -15L7 -3L12 6Q0 13 -12 6Z',`fill="${paper}" stroke="${ink}" stroke-width="1.1"`)+p('M0 -15L7 -3L12 6L2 5Z',`fill="${ink}"`);
    if(kind==='city') return line('M-13 3V-8h5v-8h5v-5h6v5h5v8h5V3ZM-9 -8V3M9 -8V3M-3 3V-4h6v7',ink,1.3)+p('M-3 -21L0 -28L3 -21Z',`fill="${ink}"`);
    if(kind==='tower') return p('M-5 4V-19L-7 -22V-25H-3V-22H3V-25H7V-22L5 -19V4Z',`fill="${paper}" stroke="${ink}" stroke-width="1.2"`)+line('M1 -17V-9M-1 -3V4',ink,1.2);
    if(kind==='gate') return line('M-10 4V-12h6V4M4 4V-12h6V4M-4 -7H4M-4 -3H4',ink,2);
    if(kind==='bridge') return line('M-10 -6L10 4M-10 -2L10 8M-6 -4L-8 0M6 2L4 6',ink,1.4);
    if(kind==='hill') return line('M-12 2Q0 -15 12 2M-9 5H9',ink,1.2);
    if(kind==='tree') return tree(0,0,1,'oak',rng(4));
    if(kind==='ruin') return line('M-10 4V-10h3v5h5v-10h4v7h6v12M-13 6h25',ink,1.2);
    if(kind==='dot') return `<circle r="3" fill="${ink}"/>`;
    return p('M-8 2V-5L-4 -9L0 -5V2ZM1 4V-3L5 -7L9 -3V4Z',`fill="${paper}" stroke="${ink}" stroke-width=".95"`)+line('M-5 -4V0M5 -2V2',ink,.9);
  }
  function field(x,y,w,h,angle=0) {
    let a=p(`M0 0L${w} 3L${w-4} ${h}L-3 ${h-3}Z`,'fill="#ae9a65" opacity=".12"');
    for(let k=4;k<h-2;k+=4)a+=line(`M1 ${k}l${w-5} 3`,'#8d7953',.55,'opacity=".5"');
    return `<g transform="translate(${x} ${y}) rotate(${angle})">${a}</g>`;
  }
  const maps = {};
  // Locations are authored once; artwork and playback pins consume the same data.
  maps.shire = {
    title:'A Part of the Shire', subtitle:'The Westfarthing, the Marish & Buckland',
    places:[place('bag-end','Bag End',349,228,-12,-20),place('hobbiton','Hobbiton',360,260,-15,25),place('party-field','Party Field',325,246,-112,2,'tree'),place('bywater','Bywater',425,286,10,-8),place('tuckborough','Tuckborough',405,420,-45,25),place('michel-delving','Michel Delving',116,390,-65,-17),place('waymeet','Waymeet',255,331,-37,26),place('overhill','Overhill',411,190,13,3),place('frogmorton','Frogmorton',560,315,-49,-15),place('whitfurrows','Whitfurrows',659,312,-27,28),place('scary','Scary',619,174,12,3),place('stock','Stock',702,398,-40,-13),place('east-road','Brandywine Bridge',779,312,-50,-22,'bridge'),place('crickhollow','Crickhollow',829,357,10,-8),place('bucklebury-ferry','Bucklebury Ferry',783,425,-18,25,'bridge'),place('maggots-farm','Bamfurlong',730,462,-92,20),place('old-forest-gate','Forest Gate',856,390,10,-9,'gate'),place('woody-end','Woody End',559,407,-40,-16,'dot')],
    labels:[label('GREEN HILL COUNTRY',430,473,'region',-8),label('WESTFARTHING',215,185,'region',-9),label('EASTFARTHING',640,249,'region'),label('The Water',502,265,'water',7),label('Brandywine',765,195,'water',84),label('OLD FOREST',876,488,'minor',-86),label('Bindbole Wood',274,121,'minor'),label('to Bree →',875,302,'minor'),label('The East Road',528,350,'minor'),label('BUCKLAND',851,535,'minor')],
    terrain:()=>woodland([[215,104],[342,106],[373,144],[320,165],[221,146]],'oak',11)+woodland([[484,371],[551,366],[603,397],[624,465],[545,459],[493,423]],'oak',12)+woodland([[872,337],[922,322],[923,541],[864,537]],'oak',13)+ridge([[315,395],[389,403],[462,419],[510,449]],.72,2,14,true)+ridge([[610,139],[650,161],[683,183]],.65,2,15,true)+ridge([[99,171],[124,234],[118,318]],.65,2,16,true)+[field(210,374,54,35,-10),field(273,409,43,28,14),field(469,304,36,23),field(644,398,35,42,-9),field(655,466,42,27,13),field(168,288,54,34)].join(''),
    waters:()=>river([[769,96],[785,166],[774,237],[779,312],[786,368],[783,425],[797,499],[767,558]],5)+river([[196,201],[252,221],[312,254],[360,260],[407,272],[447,286],[528,291],[625,303],[709,312],[779,312]],2)+river([[417,105],[432,180],[411,223],[425,278]],1.5)+river([[569,403],[616,410],[668,414],[704,398],[786,395]],1.4)+river([[502,485],[599,499],[706,507],[793,500]],1.5),
    roads:()=>road([[65,353],[167,345],[255,331],[348,323],[425,314],[560,315],[659,312],[779,312],[919,304]])+road([[349,228],[360,260],[425,286],[425,314]])+road([[360,260],[386,343],[405,420],[489,425],[559,407],[652,405],[704,398]],true)+road([[704,398],[730,462],[783,425],[822,404],[829,357]])+road([[822,404],[856,390]],true)
  };
  maps['old-forest']={title:'The Old Forest',subtitle:'Buckland · the Withywindle · the Barrow-downs',
    places:[place('forest-gate','Forest Gate',248,240,-114,-8,'gate'),place('bonfire','Bonfire Glade',329,264,12,-12,'dot'),place('old-willow','Old Man Willow',492,427,-15,28,'tree'),place('tom-house',"Tom Bombadil’s House",681,348,15,22),place('barrow-downs','The Great Barrow',764,235,10,-12,'hill'),place('east-road','To Bree',793,133,0,-15,'dot')],
    labels:[label('THE OLD FOREST',451,320,'region',-12),label('BARROW-DOWNS',771,180,'region'),label('Buckland',146,290,'region',-90),label('The High Hay',233,435,'minor',-90),label('Withywindle',575,404,'water',-18),label('Brandywine',161,469,'water',-90),label('The East Road',475,114,'minor')],
    terrain:()=>woodland([[269,171],[441,153],[601,210],[677,313],[642,437],[553,506],[344,527],[261,472]],'oak',21,13)+ridge([[724,156],[747,239],[716,310],[785,391],[836,470]],.9,3,22,true),
    waters:()=>river([[160,98],[173,181],[161,266],[173,354],[179,441],[183,544]],5)+river([[766,340],[681,362],[612,391],[543,426],[492,439],[382,475],[278,493],[181,513]],2.6),
    roads:()=>road([[178,132],[345,130],[520,141],[680,129],[793,133],[920,128]])+line('M245 154Q232 305 249 519','#55543b',2.5,'stroke-dasharray="1 4"')+road([[248,240],[329,264],[398,338],[492,427],[591,385],[681,348],[716,301],[764,235],[793,133]],true)
  };
  maps['bree-weather']={title:'Bree-land & the Weather Hills',subtitle:'The road from Bree to Amon Sûl',
    places:[place('bree','Bree',248,350,12,22,'village'),place('staddle','Staddle',294,328,11,-5),place('combe','Combe',329,279,12,2),place('archet','Archet',319,230,12,-10),place('weathertop','Weathertop',762,332,12,-15,'ruin'),place('east-road','East Road',562,383,-34,30,'dot')],
    labels:[label('CHETWOOD',391,175,'region',-9),label('MIDGEWATER',487,289,'region'),label('MARSHES',493,312,'region'),label('WEATHER HILLS',773,191,'region',78),label('The Greenway',192,234,'minor',-74),label('to the Shire',106,405,'minor'),label('to the Last Bridge →',810,435,'minor'),label('SOUTH DOWNS',573,526,'region',-6)],
    terrain:()=>woodland([[314,107],[449,120],[492,180],[408,234],[338,205]],'oak',31)+marsh([[384,250],[521,218],[620,270],[602,353],[467,346]],32)+ridge([[761,133],[748,194],[757,253],[762,320]],.9,3,33,true)+ridge([[378,516],[488,512],[590,500],[691,526]],.8,2,34,true)+ridge([[258,278],[274,311],[259,326]],.9,2,35,true),
    waters:()=>river([[582,227],[565,264],[586,304],[552,349],[586,438],[645,500]],1.2),
    roads:()=>road([[55,376],[165,371],[233,358],[355,376],[562,383],[714,397],[907,412]])+road([[242,112],[221,234],[210,322],[231,385],[235,504]])+road([[248,350],[294,328],[329,279],[319,230]])+road([[248,350],[320,362],[382,203],[513,190],[654,226],[762,332]],true)
  };
  maps.trollshaws={title:'The Road to Rivendell',subtitle:'The Hoarwell · the Trollshaws · the Loudwater',
    places:[place('last-bridge','Last Bridge',238,345,-100,27,'bridge'),place('trollshaws','Trolls’ Clearing',469,284,-80,-19,'dot'),place('ford-bruinen','Ford of Bruinen',714,381,15,27,'bridge'),place('rivendell','Rivendell',801,238,-52,-28,'city')],
    labels:[label('THE TROLLSHAWS',472,190,'region'),label('RHÛDAUR',443,488,'region'),label('Mitheithel',206,217,'water',79),label('Bruinen',743,309,'water',70),label('HITHAEGLIR',872,422,'region',84),label('The East Road',515,424,'minor'),label('to Weathertop',118,323,'minor')],
    terrain:()=>woodland([[302,109],[485,118],[660,164],[661,283],[551,339],[348,299]],'pine',41,15)+ridge([[360,169],[423,243],[517,263],[612,287]],.75,2,42,true)+ridge([[864,115],[861,224],[867,342],[890,478],[891,548]],1.05,3,43)+woodland([[719,161],[775,149],[813,208],[771,292],[712,267]],'pine',44),
    waters:()=>river([[207,104],[195,178],[228,271],[238,345],[257,428],[318,547]],3.2)+river([[860,180],[822,234],[780,273],[748,328],[714,381],[650,451],[553,547]],3)+river([[765,108],[769,164],[795,250]],1.7),
    roads:()=>road([[66,322],[161,335],[238,345],[380,369],[511,394],[627,404],[714,381],[786,319],[837,306]])+road([[238,345],[303,293],[370,273],[469,284],[595,351],[714,381],[763,284],[801,238]],true)
  };
  maps.moria={title:'Eregion & the Gates of Moria',subtitle:'Hollin · the Redhorn Gate · Dimrill Dale',
    places:[place('hollin','Hollin',243,266,-70,-18,'dot'),place('redhorn-pass','Redhorn Pass',578,202,16,-8,'dot'),place('doors-of-durin','Doors of Durin',433,371,-157,10,'gate'),place('moria','Khazad-dûm',537,378,-35,28,'dot'),place('bridge-khazad-dum','East-gate',668,386,13,-16,'gate'),place('dimrill-dale','Dimrill Dale',733,410,16,2,'dot')],
    labels:[label('EREGION',239,184,'region'),label('Caradhras',580,133,'minor'),label('Celebdil',570,304,'minor'),label('Fanuidhol',672,336,'minor'),label('Mirrormere',719,476,'water'),label('Sirannon',284,449,'water',-13),label('The Silverlode',797,531,'water',26),label('from Rivendell ↓',177,111,'minor'),label('MISTY MOUNTAINS',727,171,'region',63)],
    terrain:()=>ridge([[537,119],[572,172]],1.2,3,51)+ridge([[574,258],[598,317],[638,374],[643,449],[654,523]],1.15,3,52)+ridge([[211,351],[239,398],[291,437]],.75,2,53,true)+woodland([[119,236],[174,213],[212,283],[185,350],[111,333]],'oak',54,19)+woodland([[744,471],[794,459],[874,513],[900,553],[791,549]],'gold',55),
    waters:()=>lake([[405,346],[423,336],[432,353],[425,375],[402,380],[396,364]])+river([[403,379],[372,407],[299,429],[226,453],[104,492]],1.7)+lake([[717,424],[734,432],[735,451],[723,462],[711,450]])+river([[723,462],[756,487],[810,514],[902,554]],2.5),
    roads:()=>road([[190,104],[210,184],[243,266],[352,246],[468,212],[578,202],[687,246]],true)+road([[468,212],[446,278],[419,316],[433,371]],true)+line('M433 371Q540 353 668 386',paper,5)+line('M433 371Q540 353 668 386','#784c39',1.5,'stroke-dasharray="2 5"')+road([[668,386],[701,397],[733,410],[753,461],[830,495]],true)
  };
  maps.lothlorien={title:'Lothlórien',subtitle:'The Golden Wood between Celebrant and Anduin',
    places:[place('dimrill-dale','Dimrill Dale',228,179,-130,-4,'dot'),place('nimrodel','Nimrodel',362,281,-82,-20,'bridge'),place('cerin-amroth','Cerin Amroth',491,304,13,-14,'tree'),place('caras-galadhon','Caras Galadhon',572,396,13,-15,'tree'),place('boat-landing','The Elven Quay',749,470,13,25,'dot')],
    labels:[label('THE GOLDEN WOOD',513,219,'region',12),label('Celebrant',472,439,'water',15),label('ANDUIN',809,326,'water',86),label('The Naith',647,443,'minor'),label('to Dol Guldur →',837,205,'minor'),label('to the Great River ↓',687,547,'minor'),label('HITHAEGLIR',149,321,'region',-78)],
    terrain:()=>ridge([[183,113],[203,162],[193,227],[167,289],[153,365]],.9,3,61)+woodland([[337,193],[469,167],[630,192],[730,267],[754,412],[723,467],[591,437],[466,413],[355,338]],'gold',62,14)+woodland([[859,131],[921,123],[920,289],[863,262]],'pine',63),
    waters:()=>river([[776,98],[790,191],[782,295],[766,383],[758,477],[787,556]],5)+river([[228,179],[258,228],[321,277],[379,321],[462,379],[564,433],[657,472],[758,477]],3)+river([[313,185],[338,231],[362,281],[379,321]],1.6),
    roads:()=>road([[228,179],[284,240],[362,281],[431,307],[491,304],[543,337],[572,396],[651,444],[749,470]],true)
  };
  maps.anduin={title:'The Great River',subtitle:'Sarn Gebir · the Argonath · Nen Hithoel',
    places:[place('sarn-gebir','Sarn Gebir',477,199,-118,-6,'dot'),place('argonath','The Argonath',500,297,28,-5,'gate'),place('nen-hithoel','Nen Hithoel',506,395,45,1,'dot'),place('tol-brandir','Tol Brandir',508,468,37,2,'hill'),place('amon-hen','Amon Hen',377,449,-101,-15,'hill'),place('parth-galen','Parth Galen',423,474,-100,29,'dot'),place('amon-lhaw','Amon Lhaw',620,450,13,-15,'hill'),place('rauros','Rauros',511,520,22,22,'dot')],
    labels:[label('EMYN MUIL',714,227,'region',-17),label('THE WOLD',203,185,'region'),label('Anduin',520,127,'water'),label('to Rohan',197,514,'minor'),label('BROWN LANDS',770,130,'region')],
    terrain:()=>ridge([[631,215],[665,258],[678,328],[659,399],[631,455],[602,491]],.85,3,71)+ridge([[337,241],[352,306],[336,372],[367,417],[377,449]],.8,2,72)+woodland([[213,360],[294,324],[334,368],[351,467],[273,477],[211,436]],'oak',73)+woodland([[651,443],[728,413],[782,473],[739,532],[667,525]],'oak',74)+ridge([[222,240],[185,295]],.65,2,75,true),
    waters:()=>river([[482,99],[466,154],[477,199],[495,247],[500,297],[500,345]],10)+lake([[500,331],[536,353],[552,398],[537,445],[522,486],[499,501],[469,471],[456,418],[466,363]])+river([[511,499],[511,520],[516,540],[506,561]],11)+line('M497 516h29m-30 4h29m-28 4h29m-26 4h27',ink,.85),
    roads:()=>road([[458,152],[445,207],[458,265],[468,301]],true)+road([[476,360],[444,415],[423,474],[377,449]],true)
  };
  maps.rohan={title:'Rohan & Fangorn',subtitle:'The Riddermark, from the Isen to the Great River',
    places:[place('isengard','Isengard',202,238,-102,-15,'tower'),place('fangorn','Fangorn',443,207,15,-9,'tree'),place('wellinghall','Wellinghall',367,184,-108,0,'tree'),place('fords-isen','Fords of Isen',209,358,-116,0,'bridge'),place('helm-deep','Helm’s Deep',300,426,-123,20,'city'),place('edoras','Edoras',478,458,12,19,'city'),place('westfold','Westfold',357,368,0,-15,'dot'),place('eastemnet','Eastemnet',657,303,9,-12,'dot'),place('parth-galen','Parth Galen',843,226,-112,-14,'dot'),place('emyn-muil','Emyn Muil',854,183,-72,-20,'hill'),place('dol-baran','Dol Baran',175,290,-92,-5,'hill')],
    labels:[label('FANGORN FOREST',450,137,'region'),label('ROHAN',537,352,'large'),label('WHITE MOUNTAINS',525,536,'region',9),label('Entwash',588,256,'water',34),label('Anduin',885,348,'water',85),label('Isen',137,426,'water',-53),label('WESTEMNET',356,307,'minor'),label('EASTFOLD',716,462,'region')],
    terrain:()=>ridge([[207,108],[210,156],[198,214]],1,3,81)+woodland([[274,103],[487,111],[532,181],[460,252],[345,229],[252,180]],'oak',82,13)+ridge([[185,468],[273,475],[387,502],[478,509],[599,519],[715,549]],1.1,3,83)+ridge([[829,121],[843,171],[867,214]],.8,3,84)+marsh([[730,416],[807,417],[865,454],[856,493],[764,480]],85),
    waters:()=>river([[202,238],[217,302],[209,358],[154,423],[96,468],[65,498]],3)+river([[423,200],[479,227],[517,290],[584,339],[665,381],[746,427],[851,462]],3)+river([[883,107],[870,180],[866,245],[876,313],[861,399],[851,462],[898,554]],5)+river([[478,458],[507,422],[531,384],[584,339]],1.7),
    roads:()=>road([[209,358],[300,353],[391,410],[478,458],[660,465],[803,500]])+road([[202,238],[217,302],[209,358],[252,381],[300,426]],true)+road([[843,226],[720,220],[592,259],[443,207]],true)+road([[443,207],[431,330],[478,458]],true)+road([[478,458],[391,410],[300,426]],true)
  };
  maps.mordor={title:'Ithilien & the Shadow',subtitle:'The Dead Marshes · the Morannon · the Morgul Vale',
    places:[place('emyn-muil','Emyn Muil',199,157,-78,-15,'hill'),place('dead-marshes','Dead Marshes',400,207,-83,30,'dot'),place('black-gate','Black Gate',654,207,15,-16,'gate'),place('ithilien','North Ithilien',499,330,-65,-21,'dot'),place('henneth-annun','Henneth Annûn',446,358,-127,0),place('cross-roads','Cross-roads',519,443,-90,24,'dot'),place('morgul-vale','Minas Morgul',632,437,-26,32,'city'),place('cirith-ungol','Cirith Ungol',689,407,22,-14,'tower'),place('osgiliath','Osgiliath',316,443,-92,25,'ruin')],
    labels:[label('DAGORLAD',561,141,'region'),label('ITHILIEN',461,498,'region',-8),label('EPHEL DÚATH',681,520,'region',74),label('MORDOR',815,336,'large',8),label('Anduin',295,308,'water',87),label('to Mount Doom →',803,446,'minor')],
    terrain:()=>ridge([[112,118],[169,132],[211,173]],.85,3,91)+marsh([[283,157],[388,145],[490,175],[524,233],[458,270],[328,251]],92)+ridge([[611,244],[645,293],[666,352]],1,3,93)+ridge([[686,465],[702,513],[720,552]],1,3,94)+ridge([[707,223],[783,239],[912,249]],1,3,95)+woodland([[424,287],[537,271],[578,349],[552,399],[417,393]],'oak',96,18)+woodland([[476,479],[593,481],[623,541],[463,551]],'oak',97,18),
    waters:()=>river([[66,107],[89,180],[159,255],[245,331],[316,443],[308,518],[282,556]],5)+river([[632,437],[566,450],[519,454],[419,444],[316,443]],1.5),
    roads:()=>road([[519,546],[519,443],[530,362],[552,287],[617,227],[654,207]])+road([[316,443],[424,437],[519,443],[571,427],[632,437]])+road([[199,157],[290,227],[400,207],[515,238],[600,225],[654,207]],true)+road([[552,287],[499,330],[446,358],[519,443],[632,437],[659,411],[689,407]],true)
  };
  maps.gondor={title:'Gondor',subtitle:'The White Mountains · Anórien · the Vale of Anduin',
    places:[place('edoras','Edoras',146,171,-60,-18,'city'),place('dunharrow','Dunharrow',151,226,-83,17),place('paths-dead','Paths of the Dead',182,276,16,10,'gate'),place('erech','Erech',204,332,-47,25,'dot'),place('minas-tirith','Minas Tirith',653,364,-131,15,'city'),place('pelennor','Pelennor',687,343,12,-14,'dot'),place('osgiliath','Osgiliath',748,358,14,18,'ruin'),place('pelargir','Pelargir',581,518,-88,6,'city'),place('druadan-forest','Drúadan Forest',589,288,-110,-20,'tree'),place('cormallen','Cormallen',791,218,13,-15,'tree'),place('morgul-road','Morgul Road',851,358,-9,28,'dot')],
    labels:[label('WHITE MOUNTAINS',360,237,'region',15),label('ANÓRIEN',526,181,'region',12),label('LEBENNIN',383,445,'large'),label('ITHILIEN',831,482,'region',-80),label('Anduin',739,454,'water',-64),label('Lamedon',309,350,'region'),label('Lossarnach',608,417,'minor'),label('to Minas Morgul →',846,328,'minor')],
    terrain:()=>ridge([[96,239],[202,259],[322,280],[414,302],[520,320],[626,347]],1.15,3,101)+woodland([[525,257],[601,250],[633,285],[596,316],[524,295]],'oak',102)+woodland([[774,174],[831,163],[860,217],[826,278],[780,264]],'oak',103)+ridge([[122,385],[162,423],[219,458]],.7,2,104,true)+field(626,307,30,22,-5)+field(661,394,28,31,9)+field(400,493,39,24,-8),
    waters:()=>river([[727,106],[741,170],[729,239],[751,302],[748,358],[738,410],[687,462],[581,518],[442,561]],7)+river([[197,310],[252,348],[279,411],[242,470],[186,541]],2)+river([[425,333],[443,406],[466,465],[442,561]],2)+river([[536,350],[559,412],[562,478],[581,518]],2)+river([[869,349],[808,360],[748,358]],1.4),
    roads:()=>road([[146,171],[294,180],[440,228],[556,247],[637,289],[653,364]])+road([[653,364],[687,343],[748,358],[851,358],[914,353]])+road([[146,171],[151,226],[182,276],[204,332],[306,370],[398,395],[454,467],[581,518]],true)+road([[581,518],[687,462],[738,410],[748,358]],true)
  };
  maps['mordor-heart']={title:'Mordor',subtitle:'Udûn · the Plateau of Gorgoroth · Orodruin',
    places:[place('black-gate','The Black Gate',254,182,-168,-9,'gate'),place('dagorlad','Dagorlad',163,134,-61,-13,'dot'),place('udun','Udûn',347,213,-17,26,'dot'),place('isenmouthe','Isenmouthe',375,280,16,16,'gate'),place('tower-cirith','Cirith Ungol',238,473,-145,18,'tower'),place('gorgoroth','Gorgoroth',488,361,-64,40,'dot'),place('mount-doom','Mount Doom',542,321,-36,40,'hill'),place('barad-dur','Barad-dûr',742,274,17,-4,'tower')],
    labels:[label('ERED LITHUI',669,147,'region',5),label('EPHEL DÚATH',159,359,'region',-85),label('MORDOR',733,443,'large'),label('the road to Barad-dûr',622,298,'minor',-15),label('to the Sea of Núrnen ↓',704,536,'minor')],
    terrain:()=>ridge([[266,126],[354,136],[397,196]],.9,2,111)+ridge([[286,232],[321,267]],.75,2,112)+ridge([[446,174],[540,186],[650,182],[768,190],[909,203]],1.2,3,113)+ridge([[250,235],[243,321],[254,408]],1.05,3,114)+ridge([[250,503],[292,553]],1.05,3,115)+ridge([[818,222],[852,267],[795,289]],.7,2,116)+ridge([[437,451],[489,470],[573,495]],.55,1,117,true),
    waters:()=>'',
    roads:()=>road([[254,182],[305,211],[347,213],[375,280],[495,280],[603,281],[742,274]])+road([[238,473],[301,425],[315,347],[347,298],[375,280],[423,330],[488,361],[520,354],[542,321]],true)
  };
  maps.lindon={title:'The Road to the Sea',subtitle:'The Shire · Emyn Beraid · the Grey Havens',
    places:[place('shire','The Shire',844,313,14,-14,'village'),place('far-downs','Far Downs',715,325,8,-15,'hill'),place('tower-hills','Tower Hills',600,319,-48,-28,'tower'),place('grey-havens','Grey Havens',415,331,22,-19,'city'),place('harlond','Harlond',271,445,14,13),place('forlond','Forlond',208,178,14,-17)],
    labels:[label('FORLINDON',337,150,'region'),label('HARLINDON',327,517,'region'),label('ERED LUIN',508,193,'region',78),label('Gulf of Lhûn',259,354,'water',-10),label('Lhûn',493,244,'water',-74),label('BELEGAER',136,469,'region',-90),label('White Downs',809,251,'minor'),label('The East Road',718,368,'minor')],
    terrain:()=>ridge([[478,104],[469,157],[488,213],[487,264]],.9,3,121)+ridge([[447,409],[455,465],[482,548]],.9,3,122)+ridge([[589,284],[600,319],[612,352]],.75,2,123,true)+ridge([[710,244],[715,295],[715,347],[709,397]],.65,2,124,true)+ridge([[813,203],[809,248],[826,285]],.6,2,125,true)+woodland([[551,117],[675,119],[708,184],[643,218],[551,184]],'oak',126)+woodland([[568,422],[646,401],[729,436],[711,498],[602,511]],'oak',127)+field(809,407,41,30,-8)+field(851,461,35,22,15),
    waters:()=>{
      const coast='M61 100L196 100C179 134 204 163 208 178C224 213 274 233 281 267C289 294 381 294 415 331C399 354 340 358 308 375C280 392 295 414 271 445C241 477 266 520 243 563H61Z';
      let a=p(coast,'fill="#a9c4bb" opacity=".8"')+p(coast,'fill="url(#atlasWater)"');
      const shore='M196 100C179 134 204 163 208 178C224 213 274 233 281 267C289 294 381 294 415 331C399 354 340 358 308 375C280 392 295 414 271 445C241 477 266 520 243 563';
      for(let k=17;k>=0;k-=4) a+=line(shore,'#6a7059',.8,`transform="translate(${-k} 0)" opacity=".65"`);
      a+=river([[544,107],[525,163],[502,223],[462,275],[415,331]],3.5);
      a+=group(210,355,.85,line('M-27 6Q0 26 27 6H-27ZM0 6V-36M2 -32Q28 -23 20 -1H2ZM-3 -29Q-22 -18 -20 0H-3',ink,1.25));
      return a;
    },
    roads:()=>road([[415,331],[500,343],[600,319],[715,325],[844,313],[920,305]])+road([[844,313],[799,349],[756,359],[715,325],[661,337],[600,319],[515,340],[415,331]],true)
  };

  // Smaller named features drawn from the published regional and general maps.
  maps.shire.places.push(place('needlehole','Needlehole',165,155,-63,-17),place('budgeford','Budgeford',622,284,8,-13),place('woodhall','Woodhall',631,422,7,21),place('deephallow','Deephallow',770,512,-100,29),place('willowbottom','Willowbottom',639,507,-52,24));
  maps.shire.labels.push(label('Rushock Bog',161,205,'minor'),label('NORTHFARTHING',486,141,'region'),label('The Marish',720,445,'minor',-80),label('Shirebourn',563,500,'water'));
  const shireTerrain=maps.shire.terrain;
  maps.shire.terrain=()=>shireTerrain()+marsh([[127,167],[163,165],[190,189],[179,220],[142,213]],133)+woodland([[567,381],[609,380],[645,405],[663,446],[613,450]],'oak',134,17);
  const tune=(key,name,changes)=>Object.assign(maps[key].labels.find(a=>a.name===name),changes);
  tune('shire','GREEN HILL COUNTRY',{x:419,y:482,angle:0});
  tune('shire','The Water',{x:515,y:245});
  tune('shire','OLD FOREST',{x:903,y:481,angle:-90});
  tune('shire','BUCKLAND',{x:852,y:489,angle:-90});
  tune('shire','to Bree →',{x:877,y:326});
  tune('shire','Rushock Bog',{x:166,y:230});
  tune('shire','Shirebourn',{x:535,y:524});
  tune('shire','The Marish',{x:750,y:481,angle:-85});
  Object.assign(maps.shire.places.find(a=>a.key==='willowbottom'),{dx:-66,dy:36});
  Object.assign(maps.shire.places.find(a=>a.key==='deephallow'),{dx:-30,dy:29});
  tune('moria','MISTY MOUNTAINS',{x:797,y:241,angle:70});
  tune('mordor','EPHEL DÚATH',{x:811,y:504,angle:0});
  tune('mordor','Anduin',{x:231,y:336,angle:53});
  tune('lindon','FORLINDON',{x:336,y:130});
  tune('lindon','ERED LUIN',{x:420,y:209,angle:80});
  tune('lindon','Gulf of Lhûn',{x:257,y:300,angle:-10});
  maps['mordor-heart'].places.find(a=>a.key==='mount-doom').kind='volcano';
  maps.anduin.places.find(a=>a.key==='tol-brandir').kind='island';
  maps.gondor.labels.push(label('Ringló',228,447,'water',68),label('Sirith',544,463,'water',78),label('ROHAN',244,139,'region'));
  maps.rohan.labels.push(label('Snowbourn',522,426,'water',-48),label('The Wold',700,158,'minor'),label('Nan Curunír',188,178,'minor',-82));
  maps.moria.labels.push(label('The West Road',339,308,'minor',-32));
  maps['mordor-heart'].labels.push(label('Morgai',314,440,'minor',-78),label('ASH MOUNTAINS',756,232,'minor'));

  // Geographic revisions. These remain regional interpretations of the cited
  // published maps; symbol locations and playback positions share these records.
  const movePlace=(region,key,changes)=>Object.assign(maps[region].places.find(a=>a.key===key),changes);
  movePlace('shire','bag-end',{kind:'hobbit-hole'});
  movePlace('shire','budgeford',{x:622,y:303,dx:8,dy:-24,kind:'bridge'});
  maps.shire.places.push(place('brockenborings','Brockenborings',559,159,-69,-21),place('three-farthing-stone','Three-Farthing Stone',446,346,12,20,'dot'),place('tookbank','Tookbank',310,410,-70,25),place('brandy-hall','Brandy Hall',818,413,13,-10));
  maps.shire.labels.push(label('SOUTHFARTHING',371,544,'region'),label('Stock-brook',645,399,'water'),label('Thistle Brook',590,478,'water',32));
  tune('shire','NORTHFARTHING',{x:497,y:115});
  // The Water passes through Bywater Pool; Thistle Brook meets Shirebourn
  // near Willowbottom. The old plate omitted both named water features.
  const shireWater=maps.shire.waters;
  maps.shire.waters=()=>shireWater()+lake([[414,270],[430,266],[445,280],[439,290],[426,290],[414,279]])+river([[544,448],[573,466],[609,482],[639,502]],1.5);
  const shireRoad=maps.shire.roads;
  maps.shire.roads=()=>shireRoad()+road([[659,312],[642,241],[619,174],[559,159]])+road([[255,331],[268,388],[310,410],[405,420]])+road([[822,404],[818,413]]);
  maps['old-forest'].labels.push(label('THE MARISH',96,232,'minor',-90),label('the path to the Downs',752,399,'minor',61));
  maps['bree-weather'].places.push(place('bree-hill','Bree-hill',265,293,-97,-17,'hill'));
  // Staddle lies on the southeastern slopes of Bree-hill, Combe in the east.
  movePlace('bree-weather','staddle',{x:301,y:336});
  maps.trollshaws.labels.push(label('to the Ettenmoors ↑',573,112,'minor'));
  // Distinguish the underground bridge from the East-gate, and an off-plate
  // approach from Rivendell from Hollin itself.
  movePlace('moria','bridge-khazad-dum',{name:'Bridge of Khazad-dûm',x:610,y:379,dx:-47,dy:39,kind:'bridge'});
  maps.moria.places.push(place('east-gate','East-gate',668,386,14,-15,'gate'),place('rivendell','From Rivendell',190,108,15,12,'dot'));
  maps.moria.labels=maps.moria.labels.filter(a=>a.name!=='from Rivendell ↓');
  const moriaRoad=maps.moria.roads;
  maps.moria.roads=()=>'<g class="atlas-trail">'+moriaRoad()+line('M610 379L668 386','#985244',1.7,'stroke-dasharray="2 5"')+'</g>';
  maps.lothlorien.labels.push(label('Nimrodel',319,230,'water',58),label('DIMRILL STAIR',262,141,'minor'),label('SILVERLODE',570,496,'water',15));
  maps.anduin.labels.push(label('the western portage',381,214,'minor',78),label('the North Stair',438,546,'minor'));
  maps.rohan.places.push(place('amon-hen','Amon Hen',825,264,-84,24,'hill'),place('dunharrow','Dunharrow',476,500,-114,17,'village'));
  movePlace('rohan','helm-deep',{kind:'fortress'});
  maps.rohan.waters=()=>river([[202,238],[217,302],[209,358],[154,423],[96,468],[65,498]],3)+river([[423,200],[479,227],[517,290],[584,339],[665,381],[746,427],[765,438],[851,462]],3)+river([[883,107],[870,180],[866,245],[876,313],[861,399],[851,462],[898,554]],5)+river([[476,500],[478,458],[487,430],[551,432],[649,437],[765,438]],1.7)+river([[746,427],[799,449],[851,478]],1.6)+river([[773,438],[812,479],[864,491]],1.3);
  tune('rohan','Snowbourn',{x:587,y:453,angle:0});
  const rohanRoad=maps.rohan.roads;
  maps.rohan.roads=()=>rohanRoad()+road([[478,458],[476,480],[476,500]]);
  maps.rohan.labels.push(label('MOUTHS OF ENTWASH',776,524,'minor'));
  maps.mordor.places.push(place('cair-andros','Cair Andros',287,390,-118,-6,'river-island'));
  movePlace('mordor','henneth-annun',{kind:'refuge'});
  maps.mordor.labels.push(label('Morgulduin',431,423,'water'),label('NINDALF',154,362,'minor',48));
  // Keep the mountain name alongside its range instead of on the empty plain.
  tune('mordor','EPHEL DÚATH',{x:744,y:355,angle:78});
  tune('mordor','MORDOR',{x:822,y:504,angle:0});
  maps.gondor.places.push(place('cair-andros','Cair Andros',729,239,-110,-12,'river-island'),place('calembel','Calembel',306,370,-71,27),place('mindolluin','Mindolluin',617,345,-88,-24,'hill'));
  movePlace('gondor','minas-tirith',{kind:'fortress'});
  const gondorWater=maps.gondor.waters;
  maps.gondor.waters=()=>gondorWater()+river([[323,317],[311,359],[299,390],[279,411]],1.6)+river([[623,377],[647,419],[687,462]],1.7);
  maps.gondor.labels.push(label('Ciril',321,413,'water',80),label('Gilrain',445,474,'water',80),label('Erui',647,432,'water',57));
  // On Christopher Tolkien's southern map, Orodruin lies west and a little
  // north of Barad-dûr. The previous plate reversed that north/south relation.
  movePlace('mordor-heart','barad-dur',{x:742,y:345,dx:18,dy:2,kind:'fortress'});
  maps['mordor-heart'].roads=()=>road([[254,182],[305,211],[347,213],[375,280],[495,280],[603,281],[671,321],[742,345]])+road([[238,473],[301,425],[315,347],[347,298],[375,280],[423,330],[488,361],[520,354],[542,321]],true);
  tune('mordor-heart','the road to Barad-dûr',{x:652,y:308,angle:24});
  const mordorTerrain=maps['mordor-heart'].terrain;
  maps['mordor-heart'].terrain=()=>mordorTerrain()+ridge([[299,339],[313,400],[311,473],[339,534]],.55,1,218);
  maps.lindon.labels.push(label('MITHLOND',457,376,'minor'),label('the road west',680,294,'minor'));
  maps.lindon.places.push(place('elostirion','Elostirion',588,293,-96,-18,'tower'));
  const notes={
    shire:['Eriador','The Water runs east through Hobbiton and Bywater. Buckland lies between the Brandywine and the High Hay; the Old Forest is beyond the hedge.'],
    'old-forest':['Eriador','The Withywindle drains west into the Brandywine. Bombadil’s house stands at the eastern forest edge; the way out crosses the Downs north to the East Road.'],
    'bree-weather':['Eriador','Bree stands beside the crossing of the East Road and Greenway. Chetwood is northeast; Midgewater lies between Bree and the Weather Hills.'],
    trollshaws:['Eriador','The Last Bridge crosses the Hoarwell west of the Bruinen. Rivendell lies northeast of the Ford, beneath the western slopes of the Misty Mountains.'],
    moria:['Hithaeglir','Eregion is west of the mountain barrier; Dimrill Dale is east. The dotted crossing beneath Khazad-dûm is underground and schematic.'],
    lothlorien:['The Anduin vale','The Golden Wood stands west of Anduin and north of Celebrant. Nimrodel joins Celebrant; Cerin Amroth is north of Caras Galadhon.'],
    anduin:['The Anduin vale','The river flows south from Sarn Gebir, through the Argonath into Nen Hithoel. Amon Hen is on the west bank, Amon Lhaw on the east; Rauros is below the lake.'],
    rohan:['The Riddermark','Fangorn borders the northern plains. Isengard is north of the Fords of Isen; Helm’s Deep lies west of Edoras. Entwash branches into Anduin in the east.'],
    mordor:['Ithilien','The Dead Marshes lie northwest of the Black Gate. Ithilien lies between Anduin and the Ephel Dúath; the Morgul road climbs east from Osgiliath.'],
    gondor:['The southern kingdom','The White Mountains divide Rohan from southern Gondor. Minas Tirith stands west of Anduin; Osgiliath spans the river. Pelargir lies downstream to the southwest.'],
    'mordor-heart':['The land of shadow','Ered Lithui encloses Mordor to the north and Ephel Dúath to the west. Udûn is behind the Black Gate. Mount Doom is west and slightly north of Barad-dûr.'],
    lindon:['The western shores','The westward road crosses the Far Downs and Tower Hills to Mithlond, at the head of the Gulf of Lhûn. Forlindon is north of the gulf; Harlindon is south.']
  };
  Object.entries(notes).forEach(([key,[area,note]])=>Object.assign(maps[key],{area,note}));
  // Low-contrast engraved ground marks describe surface character, not new landmarks.
  const groundAreas={
    shire:[[170,234],[297,204],[361,294],[491,310],[670,348],[669,394],[543,361],[274,379],[167,447]],
    'old-forest':[[727,219],[893,225],[908,489],[739,490]],
    'bree-weather':[[345,395],[852,430],[854,488],[355,477]],
    trollshaws:[[335,408],[592,445],[682,505],[545,546],[336,508]],
    moria:[[271,145],[410,146],[446,242],[369,354],[329,474],[174,478],[232,327]],
    lothlorien:[[276,403],[409,417],[616,515],[605,551],[233,542]],
    anduin:[[700,306],[849,304],[882,482],[817,528],[732,472]],
    rohan:[[279,258],[627,208],[821,265],[791,401],[593,453],[320,397]],
    mordor:[[737,279],[910,283],[905,516],[771,530]],
    gondor:[[272,364],[500,372],[609,434],[539,508],[281,527]],
    'mordor-heart':[[344,306],[631,241],[849,322],[849,504],[421,534],[296,441]],
    lindon:[[543,375],[872,388],[901,526],[778,544],[744,422],[547,428]]
  };
  Object.keys(maps).forEach((key,i)=>{const previous=maps[key].terrain;maps[key].terrain=()=>ground(groundAreas[key],200+i,key.startsWith('mordor'))+previous();});

  // Nearby events deliberately share a geographic point at this regional scale.
  const aliases={shire:{},'old-forest':{withywindle:'old-willow'},'bree-weather':{'prancing-pony':'bree'},trollshaws:{council:'rivendell'},moria:{rivendell:'hollin'},lothlorien:{mirror:'caras-galadhon',anduin:'boat-landing'},anduin:{anduin:'sarn-gebir'},rohan:{'amon-hen':'parth-galen',orthanc:'isengard',meduseld:'edoras',hornburg:'helm-deep'},mordor:{'forbidden-pool':'henneth-annun',stairs:'cirith-ungol',shelob:'cirith-ungol','tower-cirith':'cirith-ungol'},gondor:{'rath-dinen':'minas-tirith','houses-healing':'minas-tirith'},'mordor-heart':{'cirith-ungol':'tower-cirith','cracks-doom':'mount-doom'},lindon:{'lindon-coast':'grey-havens'}};
  delete aliases.moria.rivendell;
  delete aliases.rohan['amon-hen'];
  const defs=`<defs>
    <filter id="atlasPaper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".065" numOctaves="3" seed="17"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
    <radialGradient id="atlasAge"><stop offset=".55" stop-color="#aa7139" stop-opacity="0"/><stop offset="1" stop-color="#865127" stop-opacity=".12"/></radialGradient>
    <pattern id="atlasWater" width="17" height="9" patternUnits="userSpaceOnUse"><path d="M2 5h7m2 -3h3" stroke="#527b78" stroke-width=".6" opacity=".42"/></pattern>
    <clipPath id="atlasClip"><rect x="35" y="96" width="890" height="465"/></clipPath>
  </defs>`;
  const compass=group(82,524,1,`<circle r="22" fill="${paper}" stroke="${ink}" stroke-width=".8"/><circle r="19" fill="none" stroke="${ink}" stroke-width=".5"/>`+line('M0 -28V28M-28 0H28',ink,.7)+p('M0 -24L4 -4L24 0L4 4L0 24L-4 4L-24 0L-4 -4Z',`fill="${paper}" stroke="${ink}" stroke-width=".7"`)+p('M0 -24V0L-4 -4ZM0 24V0L4 4ZM24 0H0L4 -4ZM-24 0H0L-4 4Z',`fill="${ink}"`)+`<text class="atlas-cardinal" x="0" y="-33" text-anchor="middle">N</text>`);
  // Deterministic placement avoids label/label and label/symbol collisions.
  // Conservative font metrics keep exported SVGs independent of canvas/DOM.
  function labelWidth(name,size,spacing=0) {
    return [...name].reduce((w,c)=>w+size*(/[ilI1.,’' ]/.test(c)?.28:/[MWmw]/.test(c)?.83:/[A-Z]/.test(c)?.66:.51)+spacing,0);
  }
  function layoutLabels(m) {
    const occupied=m.places.map(a=>({x:a.x-10,y:a.y-21,w:20,h:29}));
    occupied.push({x:49,y:480,w:63,h:77});
    const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
    const result=[];
    const items=[...m.places.map(a=>({...a,kind:'town',px:a.x,py:a.y,x:a.x+a.dx,y:a.y+a.dy})),...m.labels];
    for(const a of items) {
      const size={town:15,region:18,large:29,water:15,minor:13}[a.kind],spacing=a.kind==='region'?1.5:a.kind==='large'?4:0;
      const w=labelWidth(a.name,size,spacing),angle=(a.angle||0)*Math.PI/180;
      const bw=Math.abs(w*Math.cos(angle))+Math.abs(size*Math.sin(angle)),bh=Math.abs(w*Math.sin(angle))+Math.abs(size*Math.cos(angle));
      const baseX=a.x+(a.kind==='town'?w/2:0),baseY=a.y-size*.32;
      let best;
      const candidates=[[0,0]];
      if(a.kind==='town') candidates.push([a.px+14+w/2-baseX,a.py-12-baseY],[a.px-14-w/2-baseX,a.py-12-baseY],[a.px-baseX,a.py+24-baseY],[a.px-baseX,a.py-34-baseY]);
      for(const r of [18,34,52,72]) for(const [x,y] of [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]]) candidates.push([x*r,y*r]);
      for(const [dx,dy] of candidates) {
        const x=Math.max(41+bw/2,Math.min(919-bw/2,baseX+dx)), y=Math.max(102+bh/2,Math.min(554-bh/2,baseY+dy));
        const box={x:x-bw/2-3,y:y-bh/2-3,w:bw+6,h:bh+6};
        const score=occupied.reduce((sum,b)=>sum+overlap(box,b),0)*35+Math.hypot(x-baseX,y-baseY);
        if(!best||score<best.score) best={x,y,box,score};
      }
      occupied.push(best.box);
      result.push({...a,x:best.x,y:best.y+size*.32,box:best.box});
    }
    return result;
  }
  function render(m,index) {
    let body=`<g class="atlas-terrain">${m.terrain()}</g>${m.waters()}${m.roads()}`;
    m.places.forEach(a=>{body+=`<g class="atlas-place" data-place="${a.key}" data-x="${a.x}" data-y="${a.y}"><title>${esc(a.name)}</title>${group(a.x,a.y,1,symbol(a.kind))}</g>`;});
    // Labels are a separate top layer, with paper halos to keep fine terrain out of letters.
    m.labelLayout=layoutLabels(m);
    body+=m.labelLayout.map(a=>{
      const leader=a.kind==='town'&&Math.hypot(a.x-a.px,a.y-a.py)>40?line(`M${a.px} ${a.py+5}L${Math.max(a.box.x,Math.min(a.x,a.box.x+a.box.w))} ${a.y-5}`,'#89795e',.65,'opacity=".7"'):'';
      return leader+`<text class="atlas-label atlas-${a.kind}" ${a.key?`data-label="${a.key}"`:''} x="${a.x}" y="${a.y}" text-anchor="middle" transform="rotate(${a.angle||0} ${a.x} ${a.y})">${esc(a.name)}</text>`;
    }).join('');
    return defs+`<g class="atlas-plate"><rect width="960" height="620" fill="${paper}" filter="url(#atlasPaper)"/><rect width="960" height="620" fill="url(#atlasAge)"/>
      <rect x="15" y="15" width="930" height="590" fill="none" stroke="#77603e" stroke-width="1.2"/><rect x="21" y="21" width="918" height="578" fill="none" stroke="#77603e" stroke-width=".5"/>
      <path d="M30 30h18m-18 0v18M930 30h-18m18 0v18M30 590h18m-18 0v-18M930 590h-18m18 0v-18" fill="none" stroke="#59462d" stroke-width="1"/>
      <text x="49" y="54" class="atlas-title">${esc(m.title)}</text><text x="49" y="76" class="atlas-subtitle">${esc(m.subtitle)}</text><text x="909" y="54" text-anchor="end" class="atlas-folio">${String(index+1).padStart(2,'0')} / XII</text>
      <path d="M49 87H911" stroke="#917a52" stroke-width=".6"/><g clip-path="url(#atlasClip)">${body}</g>${compass}
      <path d="M49 567H911" stroke="#917a52" stroke-width=".6"/>
      <g class="atlas-legend"><path d="M51 586h25" stroke="#7d6950" stroke-width="1.4" stroke-dasharray="7 3"/><text x="84" y="589">Road</text><path d="M147 586h25" stroke="#985244" stroke-width="1.6" stroke-dasharray="2 5"/><text x="180" y="589">Approx. journey</text><path d="M304 586h25" stroke="#567f7d" stroke-width="3"/><text x="338" y="589">Water</text><text x="909" y="589" text-anchor="end">NORTH UP · REGIONAL SCALE · THIRD AGE</text></g>
      <g id="atlas-current" class="atlas-current" pointer-events="none" visibility="hidden"><circle r="10" fill="none" stroke="#934737" stroke-width="1.3"/><circle r="5" fill="#934737" stroke="${paper}" stroke-width="2"/><title>Current scene</title></g></g>`;
  }
  window.POC_ATLAS_MAPS=maps;
  window.POC_MAP_POSITIONS={};
  window.POC_REGIONAL_PLATES={};
  Object.keys(maps).forEach((key,i)=>{
    const m=maps[key], pos={};
    m.places.forEach(a=>{pos[a.key]=[a.x/9.6,a.y/6.2];});
    Object.entries(aliases[key]||{}).forEach(([a,b])=>{pos[a]=pos[b];});
    window.POC_MAP_POSITIONS[key]=pos;
    window.POC_REGIONAL_PLATES[key]=render(m,i);
  });
}());
