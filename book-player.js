(function () {
  'use strict';
  const audio = document.getElementById('audio');
  const player = document.createElement('div');
  player.className = 'book-player';
  player.setAttribute('role', 'group');
  player.setAttribute('aria-label', 'Listening controls');
  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
  const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm7 0h4v14h-4z" fill="currentColor"/></svg>';
  const speaker = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8q5 4 0 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  player.innerHTML = '<button class="listen-toggle" type="button" aria-label="Play">'+playIcon+'</button>'+
    '<button class="listen-skip" type="button" data-skip="-15" aria-label="Back 15 seconds" title="Back 15 seconds">↶<small>15</small></button>'+
    '<div class="listen-timeline"><div class="listen-times"><span class="listen-elapsed">0:00</span><span class="listen-state" aria-live="polite"></span><span class="listen-duration">—</span></div><input class="listen-seek" type="range" min="0" max="1" value="0" step="0.1" aria-label="Audio position" disabled></div>'+
    '<button class="listen-skip" type="button" data-skip="15" aria-label="Forward 15 seconds" title="Forward 15 seconds">↷<small>15</small></button>'+
    '<div class="listen-volume"><button class="listen-mute" type="button" aria-label="Mute" aria-pressed="false">'+speaker+'</button><input class="listen-level" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume"></div>'+
    '<select class="listen-speed" aria-label="Playback speed" title="Playback speed">'+[.75,1,1.25,1.5,1.75,2].map(n=>'<option value="'+n+'"'+(n===1?' selected':'')+'>'+n+'×</option>').join('')+'</select>';
  audio.after(player);
  audio.controls = false;
  audio.hidden = true;
  const toggle=player.querySelector('.listen-toggle'), seek=player.querySelector('.listen-seek'), elapsed=player.querySelector('.listen-elapsed'), duration=player.querySelector('.listen-duration'), state=player.querySelector('.listen-state'), mute=player.querySelector('.listen-mute'), level=player.querySelector('.listen-level'), speed=player.querySelector('.listen-speed');
  let dragging=false;
  const fmt=t=>{t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');};
  function paint(range){range.style.setProperty('--filled',100*(Number(range.value)-Number(range.min))/(Number(range.max)-Number(range.min))+'%');}
  function sync(){
    const ready=Number.isFinite(audio.duration)&&audio.duration>0&&audio.readyState>=1;
    seek.disabled=!ready;seek.max=ready?audio.duration:1;
    if(!dragging){seek.value=audio.currentTime||0;elapsed.textContent=fmt(audio.currentTime);paint(seek);}
    duration.textContent=ready?fmt(audio.duration):'—';
    player.querySelectorAll('[data-skip]').forEach(b=>b.disabled=!ready);
    seek.setAttribute('aria-valuetext',fmt(Number(seek.value))+' of '+(ready?fmt(audio.duration):'unknown duration'));
    const label=audio.paused?'Play':'Pause';
    if(toggle.getAttribute('aria-label')!==label){toggle.innerHTML=audio.paused?playIcon:pauseIcon;toggle.setAttribute('aria-label',label);}
    mute.setAttribute('aria-label',audio.muted?'Unmute':'Mute');mute.setAttribute('aria-pressed',String(audio.muted));
    level.value=audio.muted?0:audio.volume;paint(level);speed.value=String(audio.playbackRate);
  }
  toggle.addEventListener('click',()=>{if(audio.paused)audio.play().catch(()=>{state.textContent='Unable to play';});else audio.pause();});
  player.querySelectorAll('[data-skip]').forEach(b=>b.addEventListener('click',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.max(0,Math.min(audio.duration,audio.currentTime+Number(b.dataset.skip)));}));
  seek.addEventListener('input',()=>{dragging=true;elapsed.textContent=fmt(Number(seek.value));seek.setAttribute('aria-valuetext',fmt(Number(seek.value))+' of '+fmt(audio.duration));paint(seek);});
  seek.addEventListener('change',()=>{if(!seek.disabled)audio.currentTime=Number(seek.value);dragging=false;sync();});
  seek.addEventListener('pointercancel',()=>{dragging=false;sync();});
  mute.addEventListener('click',()=>{audio.muted=!audio.muted;});
  level.addEventListener('input',()=>{audio.volume=Number(level.value);audio.muted=audio.volume===0;});
  speed.addEventListener('change',()=>{audio.playbackRate=Number(speed.value);});
  ['timeupdate','durationchange','loadedmetadata','play','pause','ended','volumechange','ratechange','seeked'].forEach(event=>audio.addEventListener(event,sync));
  audio.addEventListener('loadstart',()=>{dragging=false;state.textContent='Loading';sync();});
  audio.addEventListener('waiting',()=>{state.textContent='Buffering';});
  ['canplay','playing','seeked'].forEach(event=>audio.addEventListener(event,()=>{state.textContent='';}));
  audio.addEventListener('error',()=>{state.textContent='Audio unavailable';sync();});
  sync();
}());
