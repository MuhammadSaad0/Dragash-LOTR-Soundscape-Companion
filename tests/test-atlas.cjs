const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'atlas-maps.js'),'utf8'),context);
const maps=context.window.POC_ATLAS_MAPS,positions=context.window.POC_MAP_POSITIONS;
const point=(region,key)=>maps[region].places.find(a=>a.key===key);
assert.equal(Object.keys(maps).length,12);
let count=0;
for(const [key,map] of Object.entries(maps)) {
  assert(map.area&&map.note,`${key}: missing geographic context`);
  assert.equal(new Set(map.places.map(p=>p.key)).size,map.places.length,`${key}: duplicate landmark`);
  for(const p of map.places) {
    assert(p.x>=35&&p.x<=925&&p.y>=96&&p.y<=561,`${key}/${p.key}: off plate`);
    const shared=positions[key][p.key];
    assert(Math.abs(shared[0]*9.6-p.x)<.00001&&Math.abs(shared[1]*6.2-p.y)<.00001,`${key}/${p.key}: artwork/playback divergence`);
    count++;
  }
  for(const a of map.labelLayout) assert(a.box.x>=35&&a.box.x+a.box.w<=925&&a.box.y>=96&&a.box.y+a.box.h<=561,`${key}/${a.name}: clipped label`);
  const svg=context.window.POC_REGIONAL_PLATES[key];
  assert(!/NaN|undefined/.test(svg),`${key}: invalid markup`);
  const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${key}: duplicate SVG IDs`);
  for(const [,id] of svg.matchAll(/url\(#([^)]+)\)/g)) assert(ids.includes(id),`${key}: broken paint reference ${id}`);
  assert(fs.existsSync(path.join(root,'maps',key+'.svg')),`${key}: missing export`);
}
// Directional constraints from the published maps, independent of drawing code.
assert(point('shire','hobbiton').y<point('shire','waymeet').y);
assert(point('shire','crickhollow').x>point('shire','east-road').x);
assert(point('trollshaws','rivendell').x>point('trollshaws','ford-bruinen').x);
assert(point('trollshaws','rivendell').y<point('trollshaws','ford-bruinen').y);
assert(point('moria','doors-of-durin').x<point('moria','bridge-khazad-dum').x);
assert(point('moria','bridge-khazad-dum').x<point('moria','east-gate').x);
assert.notDeepEqual(positions.moria.rivendell,positions.moria.hollin);
assert(point('lothlorien','cerin-amroth').y<point('lothlorien','caras-galadhon').y);
assert(point('anduin','amon-hen').x<point('anduin','tol-brandir').x);
assert(point('anduin','amon-lhaw').x>point('anduin','tol-brandir').x);
assert(point('anduin','rauros').y>point('anduin','nen-hithoel').y);
assert(point('rohan','dunharrow').y>point('rohan','edoras').y);
assert(point('mordor','henneth-annun').y<point('mordor','cair-andros').y);
assert(point('mordor','henneth-annun').x>point('mordor','cair-andros').x);
assert(point('mordor-heart','mount-doom').x<point('mordor-heart','barad-dur').x);
assert(point('mordor-heart','mount-doom').y<point('mordor-heart','barad-dur').y);
assert(point('gondor','minas-tirith').x<point('gondor','osgiliath').x);
assert(point('gondor','pelargir').y>point('gondor','osgiliath').y);
assert(point('lindon','grey-havens').x<point('lindon','tower-hills').x);
console.log(`PASS: 12 plates, ${count} landmarks, geographic constraints, shared positions, label bounds and SVG references.`);
