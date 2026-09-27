(function () {
  const panel = document.getElementById('map-panel-kicker');
  const button = document.createElement('button');
  button.className = 'atlas-expand';
  button.textContent = '⤢';
  button.title = 'Enlarge map';
  button.setAttribute('aria-label', 'Enlarge map');
  panel.replaceChildren(button);
  // The chapter loader updates this element, so keep the control outside it.
  panel.after(button);
  const dialog = document.createElement('dialog');
  dialog.className = 'atlas-dialog';
  dialog.setAttribute('aria-label', 'Enlarged journey map');
  dialog.innerHTML = '<div class="atlas-toolbar"><a href="atlas.html" target="_blank">The regional atlas ↗</a><button type="button" data-zoom="1">Fit</button><button type="button" data-zoom="1.7">Zoom</button><button type="button" class="atlas-close" aria-label="Close enlarged map">×</button></div><div class="atlas-scroll"><svg viewBox="0 0 960 620" role="img" aria-label="Enlarged regional map"></svg></div>';
  document.body.append(dialog);
  button.addEventListener('click',()=>{
    dialog.querySelector('svg').innerHTML = document.getElementById('regional-map').innerHTML.replace(/id="([^"]+)"/g,'id="large-$1"').replace(/url\(#([^\)]+)\)/g,'url(#large-$1)');
    dialog.querySelector('svg').style.width='100%';
    dialog.querySelector('svg').style.height='100%';
    dialog.showModal();
  });
  dialog.querySelector('.atlas-close').addEventListener('click',()=>dialog.close());
  dialog.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{
    const z=Number(b.dataset.zoom)*100;
    dialog.querySelector('svg').style.width=z+'%';
    dialog.querySelector('svg').style.height=z+'%';
  }));
}());
