const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'../');
const context={window:{}};vm.createContext(context);
for(const file of ['transcript-data.js','atlas-maps.js','journey-tracking.js'])vm.runInContext(fs.readFileSync(root+file,'utf8'),context);
let chapters=0,milestones=0;
context.window.POC_CHAPTERS.forEach((chapter,i)=>{
 const route=context.window.POC_BUILD_TRACKED_SCENES(chapter,i);if(!route)return;chapters++;
 route.forEach((point,j)=>{milestones++;assert(point.start>=0&&point.start<chapter.duration,`time ${i+1}`);assert(point.end>point.start,`order ${i+1}`);assert(context.window.POC_MAP_POSITIONS[point.region][point.map],`location ${i+1}:${point.map}`);if(j)assert(chapter.cues.some(q=>q.start===point.start&&q.text===point.evidence));});
});
const storage=new Map();let status;
function boot(blocked=false){const c={window:{},document:{createElement:()=>status={setAttribute(){}},querySelector:()=>({append(){}})},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v);}}};vm.createContext(c);vm.runInContext(fs.readFileSync(root+'reading-state.js','utf8'),c);return c.window.POC_BOOKMARK;}
let b=boot();assert.equal(b.get('a'),null);b.save('a',0,128.75,{playbackRate:1.25,volume:.8,muted:false});b.save('b',1,45,{playbackRate:1,volume:1,muted:false});b=boot();assert.equal(b.last().id,'b');assert.equal(b.get('a').time,128.75);assert.equal(b.get('a').rate,1.25);b.save('a',0,NaN,{});assert.equal(b.last().id,'b');
storage.set('red-book-reading-v1','invalid');assert.equal(boot().get('a'),null);boot(true).save('a',0,3,{});assert.equal(status.textContent,'Bookmark unavailable');
console.log(`PASS: ${chapters}/62 chapters, ${milestones} transcript milestones; valid map positions, ordered cue timestamps; bookmarks reload, per-chapter positions, corrupt/blocked storage.`);
