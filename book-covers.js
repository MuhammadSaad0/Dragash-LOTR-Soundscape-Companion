(function () {
  'use strict';
  const app = document.querySelector('.app');
  const audio = document.querySelector('audio');
  const dialog = document.createElement('dialog');
  dialog.className = 'binding-dialog';
  dialog.setAttribute('aria-label', 'The Red Book covers');
  const star = '<svg viewBox="0 0 120 160" aria-hidden="true"><path d="M60 9 67 63 106 45 77 78 109 96 68 91 60 151 52 91 11 96 43 78 14 45 53 63Z" fill="currentColor"/><path d="M60 34V126M32 77H88" stroke="#fff4d4" stroke-width="1"/></svg>';
  dialog.innerHTML = `<div class="closed-volume" data-side="front">
    <div class="cover-board">
      <div class="cover-front"><div class="cover-tooling"></div><span class="cover-star">${star}</span><p class="cover-kicker">There and back again</p><h2>The Red Book<br><span>of Westmarch</span></h2><div class="cover-rule">✧</div><p class="cover-authors">The recollections of<br>Bilbo &amp; Frodo Baggins</p><span class="cover-monogram">B</span></div>
      <div class="cover-rear"><div class="cover-tooling"></div><span class="rear-star">${star}</span><div class="rear-mark">W</div><p>Herein is set down<br>the tale of the War of the Ring<br>and the return of the King.</p><span class="rear-footer">A record of the passing of an age</span></div>
      <div class="volume-spine" aria-hidden="true"><span>THE RED BOOK</span><span>✧</span><span>WESTMARCH</span></div>
      <div class="volume-edge volume-fore" aria-hidden="true"></div>
      <div class="volume-edge volume-top" aria-hidden="true"></div>
      <div class="volume-edge volume-bottom" aria-hidden="true"></div>
      <span class="cover-ribbon" aria-hidden="true"></span>
    </div>
  </div><div class="cover-actions"><button type="button" class="cover-open">Open the book <span aria-hidden="true">↗</span></button><button type="button" class="cover-flip">View back cover</button></div>`;
  document.body.append(dialog);
  const volume = dialog.querySelector('.closed-volume');
  const flip = dialog.querySelector('.cover-flip');
  const open = dialog.querySelector('.cover-open');
  let busy = false, returnFocus;
  function snapshot(panel) {
    const copy = panel.cloneNode(true);
    copy.querySelectorAll('[id]').forEach(node => { node.id = 'closing-' + node.id; });
    copy.querySelectorAll('*').forEach(node => {
      for (const attr of Array.from(node.attributes)) {
        if (attr.value.includes('url(#')) node.setAttribute(attr.name, attr.value.replace(/url\(#/g, 'url(#closing-'));
        if ((attr.name === 'href' || attr.name === 'xlink:href') && attr.value.startsWith('#')) node.setAttribute(attr.name, '#closing-' + attr.value.slice(1));
      }
    });
    return copy;
  }
  async function closeSpread(side) {
    const workspace = document.querySelector('.workspace');
    const source = workspace.getBoundingClientRect();
    const target = volume.getBoundingClientRect();
    const front = side === 'front';
    const stage = document.createElement('div');
    stage.className = 'closing-spread';
    stage.setAttribute('aria-hidden', 'true');
    stage.inert = true;
    const width = source.width / 2;
    // Each half has its own face. The leather is physically on the reverse
    // of the moving leaf, so it appears as that leaf passes the spine.
    stage.style.cssText = `left:${source.left}px;top:${source.top}px;width:${source.width}px;height:${source.height}px`;
    const fixed = document.createElement('div'); fixed.className = 'closing-fixed';
    const leaf = document.createElement('div'); leaf.className = 'closing-leaf';
    fixed.style.left = front ? '50%' : '0';
    leaf.style.left = front ? '0' : '50%';
    leaf.style.transformOrigin = front ? 'right center' : 'left center';
    const page = document.createElement('div'); page.className = 'closing-page';
    const leather = document.createElement('div'); leather.className = 'closing-leather';
    const panels = [workspace.querySelector(':scope > .map-panel'), workspace.querySelector(':scope > .side-panel')];
    fixed.append(snapshot(panels[front ? 1 : 0]));
    page.append(snapshot(panels[front ? 0 : 1]));
    const artwork = dialog.querySelector(front ? '.cover-front' : '.cover-rear').cloneNode(true);
    artwork.removeAttribute('aria-hidden');
    leather.append(artwork); leaf.append(page, leather); stage.append(fixed, leaf); dialog.append(stage);
    const transcript = stage.querySelector('.transcript-cues');
    if (transcript) transcript.scrollTop = workspace.querySelector('.transcript-cues').scrollTop;
    try {
      await leaf.animate([
        {transform:'rotateY(0deg)'},
        {transform:`rotateY(${front ? 180 : -180}deg)`}
      ], {duration:1000,easing:'cubic-bezier(.36,.02,.22,1)',fill:'forwards'}).finished;
      // Move the folded volume into its resting cover position, continuously.
      const offset = front ? width : 0;
      const scaleX = target.width / width, scaleY = target.height / source.height;
      await stage.animate([
        {transform:'translate(0,0) scale(1)'},
        {transform:`translate(${target.left-source.left-offset*scaleX}px,${target.top-source.top}px) scale(${scaleX},${scaleY})`}
      ], {duration:520,easing:'cubic-bezier(.22,.65,.25,1)',fill:'forwards'}).finished;
    } finally {
      stage.remove();
      dialog.classList.remove('cover-closing');
      busy = false;
      open.focus();
    }
  }
  function show(side) {
    if (dialog.open || busy) return;
    returnFocus = document.activeElement;
    audio.pause();
    volume.dataset.side = side;
    dialog.querySelector('.cover-front').setAttribute('aria-hidden', String(side !== 'front'));
    dialog.querySelector('.cover-rear').setAttribute('aria-hidden', String(side === 'front'));
    flip.textContent = side === 'front' ? 'View back cover' : 'View front cover';
    const title = document.querySelector('h1').textContent;
    open.title = 'Return to ' + title;
    const animate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    busy = animate;
    dialog.classList.toggle('cover-closing', animate);
    dialog.showModal();
    if (animate) closeSpread(side); else open.focus();
  }
  function read() {
    if (busy) return;
    busy = true;
    dialog.classList.add('cover-opening');
    const finish = () => {
      dialog.close();
      dialog.classList.remove('cover-opening');
      busy = false;
      (returnFocus instanceof HTMLElement ? returnFocus : frontButton).focus();
    };
    setTimeout(finish, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 720);
  }
  flip.addEventListener('click', () => {
    if (busy) return;
    const front = volume.dataset.side !== 'front';
    volume.dataset.side = front ? 'front' : 'back';
    dialog.querySelector('.cover-front').setAttribute('aria-hidden', String(!front));
    dialog.querySelector('.cover-rear').setAttribute('aria-hidden', String(front));
    flip.textContent = front ? 'View back cover' : 'View front cover';
  });
  open.addEventListener('click', read);
  dialog.addEventListener('cancel', event => { event.preventDefault(); read(); });
  // Keep the reader's global play/seek shortcuts out of the closed book.
  dialog.addEventListener('keydown', event => event.stopPropagation());
  const frontButton = document.createElement('button');
  frontButton.type = 'button';
  frontButton.className = 'binding-control';
  frontButton.textContent = 'Front cover';
  frontButton.addEventListener('click', () => show('front'));
  const backButton = frontButton.cloneNode(true);
  backButton.textContent = 'Back cover';
  backButton.addEventListener('click', () => show('back'));
  const controls = document.createElement('div');
  controls.className = 'binding-controls';
  controls.append(frontButton, backButton);
  app.querySelector('.topbar > div:first-child').append(controls);
  window.POC_SHOW_COVER = show;
}());
