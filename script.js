var _audioCtx = null;
function obtenerAudioContext() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}
 
document.addEventListener('DOMContentLoaded', function() {
 
  // GALERÍA
  var btn = document.getElementById('btn-ver-componentes');
  var galeria = document.getElementById('galeria');
  if (btn && galeria) {
    btn.addEventListener('click', function() {
      var abierta = galeria.classList.toggle('abierta');
      btn.textContent = abierta ? 'Ocultar Componentes' : 'Ver Componentes';
      if (abierta) setTimeout(function() { galeria.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    });
  }
 
  // TÍTULO INTERACTIVO
  var titulo = document.getElementById('titulo-interactivo');
  if (titulo) {
    var misColores = ['#e04333', '#39d31c', '#c792f9', '#007fff'];
    titulo.innerHTML = titulo.textContent.trim().split('').map(function(l) {
      return l === ' ' ? '<span style="display:inline-block">&nbsp;</span>'
                       : '<span style="display:inline-block;transition:color 0.2s,transform 0.2s">' + l + '</span>';
    }).join('');
    var spans = titulo.querySelectorAll('span');
    titulo.addEventListener('mouseenter', function() {
      spans.forEach(function(s) {
        if (s.textContent !== '\u00A0') {
          s.style.color = misColores[Math.floor(Math.random() * misColores.length)];
          s.style.transform = 'scale(1.2) translateY(-3px)';
        }
      });
    });
    titulo.addEventListener('mouseleave', function() {
      spans.forEach(function(s) { s.style.color = ''; s.style.transform = ''; });
    });
  }
 
  // HEXÁGONOS — position:absolute con coordenadas de página (scroll + viewport)
  var colores = ['#b87adf', '#2277ee', '#3dcc1e', '#e03535'];
  var hexActivos = [];
 
  function generarDesde(origen) {
    while (hexActivos.length >= 12) {
      var viejo = hexActivos.shift();
      if (viejo && viejo.parentNode) document.body.removeChild(viejo);
    }
    var rect = origen.getBoundingClientRect();
    // Coordenadas de PÁGINA = viewport + scroll
    var x1 = rect.left + rect.width / 2 + window.scrollX;
    var y1 = rect.top + rect.height / 2 + window.scrollY;
    var ang = Math.random() * Math.PI * 2;
    var dist = 100 + Math.random() * 80;
    var size = 50 + Math.random() * 40;
    var color = colores[Math.floor(Math.random() * colores.length)];
    var x2 = x1 + Math.cos(ang) * dist;
    var y2 = y1 + Math.sin(ang) * dist;
 
    // Línea SVG con coordenadas de página
    var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.style.position      = 'absolute';
    svgEl.style.top           = '0';
    svgEl.style.left          = '0';
    svgEl.style.width         = document.body.scrollWidth + 'px';
    svgEl.style.height        = document.body.scrollHeight + 'px';
    svgEl.style.pointerEvents = 'none';
    svgEl.style.zIndex        = '9998';
    svgEl.style.overflow      = 'visible';
    var linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    linea.setAttribute('x1', x1); linea.setAttribute('y1', y1);
    linea.setAttribute('x2', x1); linea.setAttribute('y2', y1);
    linea.setAttribute('stroke', color);
    linea.setAttribute('stroke-width', '2');
    linea.setAttribute('stroke-dasharray', '5 3');
    linea.setAttribute('opacity', '0.8');
    svgEl.appendChild(linea);
    document.body.appendChild(svgEl);
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / 350, 1), ease = 1 - Math.pow(1 - p, 3);
      linea.setAttribute('x2', x1 + (x2 - x1) * ease);
      linea.setAttribute('y2', y1 + (y2 - y1) * ease);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
 
    var hex = document.createElement('div');
    hex.style.position   = 'absolute';
    hex.style.width      = size + 'px';
    hex.style.height     = size + 'px';
    hex.style.left       = (x2 - size / 2) + 'px';
    hex.style.top        = (y2 - size / 2) + 'px';
    hex.style.background = color;
    hex.style.boxShadow  = '0 0 20px ' + color + 'cc';
    hex.style.clipPath   = 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)';
    hex.style.opacity    = '0';
    hex.style.transform  = 'scale(0.1)';
    hex.style.transition = 'opacity 0.35s,transform 0.35s';
    hex.style.cursor     = 'pointer';
    hex.style.zIndex     = '9999';
    hex.style.pointerEvents = 'auto';
    document.body.appendChild(hex);
    hexActivos.push(hex);
    hex.getBoundingClientRect();
    hex.style.opacity   = '0.85';
    hex.style.transform = 'scale(1)';
    hex.addEventListener('click', function(e) {
      e.stopPropagation();
      generarDesde(this);
    });
    setTimeout(function() {
      hex.style.opacity   = '0';
      hex.style.transform = 'scale(0.1)';
      svgEl.style.transition = 'opacity 0.4s';
      svgEl.style.opacity = '0';
      setTimeout(function() {
        if (hex.parentNode) document.body.removeChild(hex);
        if (svgEl.parentNode) document.body.removeChild(svgEl);
        var idx = hexActivos.indexOf(hex);
        if (idx > -1) hexActivos.splice(idx, 1);
      }, 400);
    }, 6000);
  }
 
  document.querySelectorAll('.formas-fondo .hexagono').forEach(function(h) {
    h.addEventListener('click', function(e) { e.stopPropagation(); generarDesde(this); });
  });
 
});
 
// CARRUSEL
function moverCarrusel(dir) {
  var track = document.getElementById('carruselTrack');
  if (!track) return;
  var item = track.querySelector('.carrusel-item');
  if (!item) return;
  track.scrollBy({ left: dir * (item.offsetWidth + 16), behavior: 'smooth' });
}
 
// VISORES
function abrirGaleriaCompleta(src) {
  var v = document.getElementById('visorGaleria'), i = document.getElementById('imagenGaleriaCompleta');
  if (!v || !i) return; i.src = src; v.classList.add('activo'); v.style.display = 'flex';
}
function cerrarGaleriaCompleta() {
  var v = document.getElementById('visorGaleria');
  if (!v) return; v.classList.remove('activo'); v.style.display = 'none';
}
function abrirImagen(src) {
  var v = document.getElementById('visorImagen'), i = document.getElementById('imagenGrande');
  if (!v || !i) return; i.src = src; v.style.display = 'flex';
}
function cerrarImagen() {
  var v = document.getElementById('visorImagen'); if (v) v.style.display = 'none';
}
function irAPaginaPrincipal() {
  document.querySelectorAll('.vista').forEach(function(v) { v.classList.remove('activa'); });
  var m = document.getElementById('pagina-principal'); if (m) m.classList.add('activa');
}
 
// COLMENA
(function() {
  var canvas = document.getElementById('colmenaCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var R = 70, W = Math.min(window.innerWidth, 1400);
  var COLS = Math.floor(W / (R * 1.75)), ROWS = 5;
  canvas.width = COLS * R * 1.75 + R;
  canvas.height = ROWS * R * 1.52 + R;
  var grads = [['#b87adf','#7a3fa0'],['#2277ee','#0044aa'],['#3dcc1e','#1a7a08'],['#e03535','#a01515']];
  var txts = [
    {t:'Conexión',    x:'Dos piezas se incrustan\ncreando una unión\nentre ambos objetos.'},
    {t:'Enlace',      x:'Dos o más objetos\nse unen mediante\notro objeto.'},
    {t:'Construcción',x:'La unión de piezas\ngenera mayor volumen\ndel inicial.'},
    {t:'Conquista',   x:'Llegá al tronco rival\nramificando tus\nconexiones.'},
    {t:'Tablero',     x:'El tablero modular\nelimina ventajas\nposicionales.'},
    {t:'Estrategia',  x:'Cada movimiento\ncuenta para\nsuperar al rival.'},
    {t:'Cartas',      x:'Las cartas otorgan\nhabilidades que\ncambian la partida.'},
    {t:'Piezas',      x:'Su encaje permite\nel desplazamiento\ndel camino.'},
  ];
  var imgs_src = ['assets/foto40.png','assets/foto41.png','assets/foto42.png','assets/foto43.png','assets/foto44.png','assets/foto45.png','assets/foto45.png','assets/foto46.png'];
  var imgs = {};
  imgs_src.forEach(function(s) { var im = new Image(); im.onload = function() { imgs[s] = im; draw(); }; im.src = s; });
  var cells = [], ii = 0, ti = 0, gi = 0;
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      var off = c % 2 === 1 ? R * 0.76 : 0, cx = c * R * 1.75 + R, cy = r * R * 1.52 + R + off;
      var isImg = (c + r) % 2 === 0, cell = { cx: cx, cy: cy, hover: false };
      if (isImg) { cell.t = 'img'; cell.src = imgs_src[ii % imgs_src.length]; ii++; }
      else { cell.t = 'txt'; cell.d = txts[ti % txts.length]; cell.g = grads[gi % grads.length]; ti++; gi++; }
      cells.push(cell);
    }
  }
  function hp(cx, cy, r) { ctx.beginPath(); for (var i = 0; i < 6; i++) { var a = Math.PI/180*(60*i-30), x = cx+r*Math.cos(a), y = cy+r*Math.sin(a); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); } ctx.closePath(); }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.forEach(function(c) {
      ctx.save(); hp(c.cx, c.cy, R-2); ctx.clip();
      if (!c.hover) { ctx.fillStyle='#111'; ctx.fill(); }
      else if (c.t==='img') {
        var im = imgs[c.src];
        if (im&&im.complete&&im.naturalWidth>0) { var s=R*2.2; ctx.drawImage(im,c.cx-s/2,c.cy-s/2,s,s); ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill(); }
        else { ctx.fillStyle='#222'; ctx.fill(); }
      } else {
        ctx.fillStyle='#0e0e0e'; ctx.fill();
        var g=ctx.createLinearGradient(c.cx-R,c.cy,c.cx+R,c.cy);
        g.addColorStop(0,c.g[0]); g.addColorStop(1,c.g[1]);
        ctx.fillStyle=g; ctx.font='bold 13px Segoe UI,sans-serif'; ctx.textAlign='center';
        ctx.fillText(c.d.t.toUpperCase(),c.cx,c.cy-18);
        ctx.fillStyle='rgba(255,255,255,0.78)'; ctx.font='11px Segoe UI,sans-serif';
        c.d.x.split('\n').forEach(function(l,i){ctx.fillText(l,c.cx,c.cy+4+i*16);});
      }
      ctx.restore();
      hp(c.cx,c.cy,R-2);
      ctx.strokeStyle=c.hover?'rgba(255,255,255,0.35)':'rgba(255,255,255,0.1)';
      ctx.lineWidth=1.5; ctx.stroke();
    });
  }
  function getIdx(mx,my){for(var i=0;i<cells.length;i++){var c=cells[i],dx=mx-c.cx,dy=my-c.cy;if(Math.sqrt(dx*dx+dy*dy)<R*0.92)return i;}return -1;}
  canvas.addEventListener('mousemove',function(e){var rect=canvas.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top,id=getIdx(mx,my),ch=false;cells.forEach(function(c,i){var d=i===id;if(c.hover!==d){c.hover=d;ch=true;}});if(ch)draw();});
  canvas.addEventListener('click',function(e){
  var rect=canvas.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top;
  var id=getIdx(mx,my);
  if(id===-1)return;
  var c=cells[id];
  if(c.t==='img'){
    abrirGaleriaCompleta(c.src);
  }
});
  draw();
})();
 
// MINI JUEGO
setTimeout(function() {
  var canvas = document.getElementById('minijuegoCanvas');
  var confCv = document.getElementById('confettiCanvas');
  if (!canvas || !confCv) return;
  var ctx = canvas.getContext('2d');
  var cctx = confCv.getContext('2d');
  var CW = 700, CH = 480;
  canvas.width = confCv.width = CW;
  canvas.height = confCv.height = CH;
  var R = 22, DIST = 80;
  var COLORES = ['#b87adf','#2277ee','#3dcc1e','#e03535'];
  var nodos = [], lineas = [], llenos = 0, juegoTerminado = false;
  var particulas = [], confettiAnim = null;
 
  function hexPath(cx,cy,r){ctx.beginPath();for(var i=0;i<6;i++){var a=Math.PI/3*i+Math.PI/6;i===0?ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}ctx.closePath();}
  function colisiona(x,y){for(var i=0;i<nodos.length;i++)if(Math.sqrt(Math.pow(nodos[i].x-x,2)+Math.pow(nodos[i].y-y,2))<R*2.4)return true;return false;}
 
  function generarJuego() {
    nodos=[]; lineas=[]; llenos=0; juegoTerminado=false;
    document.getElementById('minijuego-victoria').classList.add('oculto');
    if(confettiAnim)cancelAnimationFrame(confettiAnim);
    cctx.clearRect(0,0,CW,CH); particulas=[];
    var centro={x:CW/2,y:CH/2,color:COLORES[0],padre:null,anim:1,animando:false};
    nodos.push(centro); llenos=1;
    var queue=[centro], intentos=0;
    while(nodos.length<20&&intentos<600){
      intentos++;
      var padre=queue[Math.floor(Math.random()*queue.length)];
      var angBase=padre.padre?Math.atan2(padre.y-padre.padre.y,padre.x-padre.padre.x):-Math.PI/2;
      var ang=angBase+(Math.random()-0.5)*Math.PI*1.6;
      var nx=padre.x+Math.cos(ang)*DIST, ny=padre.y+Math.sin(ang)*DIST;
      if(nx>R+15&&nx<CW-R-15&&ny>R+15&&ny<CH-R-15&&!colisiona(nx,ny)){
        var hijo={x:nx,y:ny,color:null,padre:padre,anim:1,animando:false};
        nodos.push(hijo); lineas.push({p1:padre,p2:hijo}); queue.push(hijo);
      }
    }
    document.getElementById('minijuego-contador').textContent=llenos+' / '+nodos.length;
    dibujar();
  }
 
  function dibujar(){
    ctx.clearRect(0,0,CW,CH);
    lineas.forEach(function(l){
      var activa=l.p1.color&&l.p2.color;
      ctx.beginPath(); ctx.moveTo(l.p1.x,l.p1.y);
      var mx=(l.p1.x+l.p2.x)/2+(l.p1.x<l.p2.x?-10:10), my=(l.p1.y+l.p2.y)/2;
      ctx.quadraticCurveTo(mx,my,l.p2.x,l.p2.y);
      ctx.strokeStyle=activa?'rgba(255,255,255,0.65)':'rgba(255,255,255,0.2)';
      ctx.lineWidth=activa?2:1; ctx.stroke();
    });
    var nf=false;
    nodos.forEach(function(n){
      if(n.animando&&n.anim<1){n.anim=Math.min(1,n.anim+0.12);if(n.anim<1)nf=true;else n.animando=false;}
      var disp=!n.color&&n.padre&&n.padre.color;
      ctx.save(); hexPath(n.x,n.y,R);
      if(n.color){ctx.fillStyle=n.color;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(n.x,n.y,4,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fill();}
      else if(disp){ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.arc(n.x,n.y,3,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fill();}
      else{ctx.fillStyle='rgba(255,255,255,0.02)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(n.x,n.y,2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fill();}
      ctx.restore();
    });
    if(nf)requestAnimationFrame(dibujar);
  }
 
  canvas.addEventListener('click',function(e){
    if(juegoTerminado)return;
    var rect=canvas.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top;
    for(var i=0;i<nodos.length;i++){
      var n=nodos[i],dx=mx-n.x,dy=my-n.y;
      if(!n.color&&Math.sqrt(dx*dx+dy*dy)<R*1.2&&n.padre&&n.padre.color){
        n.color=COLORES[Math.floor(Math.random()*COLORES.length)];
        n.anim=0;n.animando=true;llenos++;
        document.getElementById('minijuego-contador').textContent=llenos+' / '+nodos.length;
        try{var actx=obtenerAudioContext(),notas=[261.63,329.63,392,440,523.25,659.25],osc=actx.createOscillator(),g=actx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(notas[Math.floor(Math.random()*notas.length)],actx.currentTime);g.gain.setValueAtTime(0,actx.currentTime);g.gain.linearRampToValueAtTime(0.3,actx.currentTime+0.01);g.gain.exponentialRampToValueAtTime(0.0001,actx.currentTime+0.18);osc.connect(g);g.connect(actx.destination);osc.start();osc.stop(actx.currentTime+0.2);}catch(err){}
        requestAnimationFrame(dibujar);
        if(llenos>=nodos.length){
          juegoTerminado=true;
          setTimeout(function(){
            document.getElementById('minijuego-victoria').classList.remove('oculto');
            try{var actx=obtenerAudioContext();[523.25,659.25,783.99,1046.5].forEach(function(f,i){setTimeout(function(){var osc=actx.createOscillator(),g=actx.createGain();osc.type='sine';osc.frequency.setValueAtTime(f,actx.currentTime);g.gain.setValueAtTime(0,actx.currentTime);g.gain.linearRampToValueAtTime(0.4,actx.currentTime+0.01);g.gain.exponentialRampToValueAtTime(0.0001,actx.currentTime+0.4);osc.connect(g);g.connect(actx.destination);osc.start();osc.stop(actx.currentTime+0.45);},i*120);});}catch(err){}
            particulas=[];var cols=['#b87adf','#2277ee','#3dcc1e','#e03535','#fff','#ffdd00'];
            for(var j=0;j<120;j++)particulas.push({x:Math.random()*CW,y:-10-Math.random()*40,vx:(Math.random()-0.5)*4,vy:2+Math.random()*4,rot:Math.random()*Math.PI*2,vrot:(Math.random()-0.5)*0.2,w:8+Math.random()*8,h:4+Math.random()*4,color:cols[Math.floor(Math.random()*cols.length)],alpha:1});
            (function anim(){cctx.clearRect(0,0,CW,CH);var v=0;particulas.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.rot+=p.vrot;p.vy+=0.1;if(p.y>CH*0.75)p.alpha-=0.02;if(p.alpha<=0)return;v++;cctx.save();cctx.globalAlpha=Math.max(0,p.alpha);cctx.translate(p.x,p.y);cctx.rotate(p.rot);cctx.fillStyle=p.color;cctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cctx.restore();});if(v>0)confettiAnim=requestAnimationFrame(anim);else cctx.clearRect(0,0,CW,CH);})();
          },400);
        }
        break;
      }
    }
  });
 
  canvas.addEventListener('mousemove',function(e){var rect=canvas.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top,enHex=false;for(var i=0;i<nodos.length;i++){var n=nodos[i],dx=mx-n.x,dy=my-n.y;if(!n.color&&Math.sqrt(dx*dx+dy*dy)<R*1.2&&n.padre&&n.padre.color){enHex=true;break;}}canvas.style.cursor=enHex?'pointer':'default';});
 
  window.reiniciarMinijuego=function(){generarJuego();};
  generarJuego();
},500);// SEPARADORES
document.querySelectorAll('.sep-canvas').forEach(function(cv) {
  cv.width = cv.offsetWidth || 1200;
  cv.height = 60;
  var ctx = cv.getContext('2d');
  var COLS = ['#b87adf','#2277ee','#3dcc1e','#e03535'];
  var R = 16;
  var total = Math.floor(cv.width / (R * 1.82));
  var frame = 0;
  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (var i = 0; i < total; i++) {
      var x = i * R * 1.82 + R;
      var y = 30 + Math.sin(frame * 0.04 + i * 0.5) * 6;
      var wave = (Math.sin(frame * 0.05 + i * 0.3) + 1) / 2;
      var colorIdx = (i + Math.floor(frame * 0.05)) % 4;
      var alpha = Math.floor((0.3 + wave * 0.6) * 255).toString(16).padStart(2,'0');
      var size = R * (0.7 + wave * 0.3);
      ctx.beginPath();
      for (var j = 0; j < 6; j++) {
        var a = Math.PI / 3 * j + Math.PI / 6;
        var px = x + Math.cos(a) * size, py = y + Math.sin(a) * size;
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = COLS[colorIdx] + alpha;
      ctx.fill();
      ctx.strokeStyle = COLS[colorIdx] + '44';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    frame++;
    requestAnimationFrame(draw);
  }
  draw();
});function flipCard(card) {
  var inner = card.querySelector('.modo-card-inner');
  var video = card.querySelector('.modo-video');
  var estaVolteada = inner.style.transform === 'rotateY(180deg)';
  if (estaVolteada) {
    inner.style.transform = 'rotateY(0deg)';
    if (video) video.pause();
  } else {
    inner.style.transform = 'rotateY(180deg)';
    if (video) video.play();
  }
}document.querySelectorAll('.modo-card').forEach(function(card) {
  var video = card.querySelector('.modo-video');
  card.addEventListener('mouseenter', function() {
    if (video) video.play();
  });
  card.addEventListener('mouseleave', function() {
    if (video) { video.pause(); video.currentTime = 0; }
  });
});