const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let writes=0;
function element(){const children=new Map();return {style:{setProperty(){writes++;}},setAttribute(){writes++;},append(){writes++;},replaceChildren(){writes++;},addEventListener(){},querySelector(s){if(!children.has(s))children.set(s,element());return children.get(s);}};}
const c={window:{},document:{createElement:element,createElementNS:element,querySelector:()=>element(),querySelectorAll:()=>[]}};vm.createContext(c);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../live-company.js'),'utf8'),c);
for(let i=1;i<=62;i++){const names=c.window.POC_COMPANY_CAST(i,0);assert(names.length>0);assert.equal(new Set(names).size,names.length);}
assert(!c.window.POC_COMPANY_CAST(26,377).includes('Treebeard'));assert(c.window.POC_COMPANY_CAST(26,378).includes('Treebeard'));
assert(!c.window.POC_COMPANY_CAST(17,1954).includes('Gandalf'));assert.equal(c.window.POC_COMPANY_CAST(62,2027).join(),'Sam');
const state={chapter:26,time:0,scene:{id:'test',title:'Fangorn',mapTitle:'Fangorn'},position:[50,50],visited:[]};
c.window.POC_UPDATE_COMPANY(state);c.window.POC_UPDATE_COMPANY(state);const before=writes;
for(let i=0;i<100;i++)c.window.POC_UPDATE_COMPANY({...state,time:i});
assert.equal(writes,before,'unchanged playback must not rewrite the companion DOM');
console.log('PASS: all 62 narrative rosters; timed membership changes; 100 playback ticks cause zero companion DOM writes.');
