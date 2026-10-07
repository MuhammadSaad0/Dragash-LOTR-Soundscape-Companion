/* Rebuild distributable SVGs from exactly the data used by the reader. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname,context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'atlas-maps.js'),'utf8'),context);
const css=fs.readFileSync(path.join(root,'atlas.css'),'utf8')
  .replace(/@font-face\{[^}]+\}/g,'')
  .split('\n').filter(line=>line.startsWith('.atlas-plate ')).join('\n')
  .replace(/Atlas, /g,'');
const out=path.join(root,'maps');fs.mkdirSync(out,{recursive:true});
for(const [key,map] of Object.entries(context.window.POC_ATLAS_MAPS)) {
  const title=map.title.replace(/&/g,'&amp;');
  let body=context.window.POC_REGIONAL_PLATES[key];
  // Three decimal places retain sub-pixel geometry and keep exports manageable.
  body=body.replace(/-?\d+\.\d{4,}/g,n=>String(Number(Number(n).toFixed(3))));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${map.note.replace(/&/g,'&amp;')} Original regional interpretation; north up; no numerical scale.</desc><style>${css}</style>${body}</svg>\n`;
  fs.writeFileSync(path.join(out,key+'.svg'),svg);
}
console.log('Exported all twelve atlas plates from atlas-maps.js.');
