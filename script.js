/* =============================================
   TÍTULO — INTERACTIVIDAD DE COLORES DÍNÁMICOS
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  const titulo = document.getElementById('titulo-interactivo');
  if (titulo) {
    const texto = titulo.textContent;
    const misColores = ['#e04333', '#39d31c', '#c792f9', '#007fff'];

    // Envolver cada letra en un span (respetando espacios)
    titulo.innerHTML = texto
      .split('')
      .map(letra => letra === ' ' ? '<span>&nbsp;</span>' : `<span>${letra}</span>`)
      .join('');

    const spans = titulo.querySelectorAll('span');

    // Cambiar a colores aleatorios del juego al pasar el mouse
    titulo.addEventListener('mouseenter', () => {
      spans.forEach(span => {
        if (span.textContent !== '\u00A0') {
          const colorRandom = misColores[Math.floor(Math.random() * misColores.length)];
          span.style.color = colorRandom;
        }
      });
    });

    // Volver a blanco al salir
    titulo.addEventListener('mouseleave', () => {
      spans.forEach(span => {
        span.style.color = 'white';
      });
    });
  }
});

/* =============================================
   GALERÍA DESPLEGABLE — VER COMPONENTES
   ============================================= */
function mostrarGaleria() {
  const galeria = document.getElementById("galeria");
  const btn = document.getElementById("btnComponentes");
  if (!galeria || !btn) return;
  
  const abierta = galeria.classList.toggle("mostrar");
  btn.textContent = abierta ? "Ocultar Componentes" : "Ver Componentes";
  if (open) {
    setTimeout(() => galeria.scrollIntoView({ behavior: "smooth" }), 100);
  }
}

/* =============================================
   VISORES DE IMÁGENES (HERO Y GALERÍA)
   ============================================= */
function abrirGaleriaCompleta(ruta) {
  const visor = document.getElementById("visorGaleria");
  const img = document.getElementById("imagenGaleriaCompleta");
  if (visor && img) {
    img.src = ruta;
    visor.classList.add("activo");
  }
}

function cerrarGaleriaCompleta() {
  const visor = document.getElementById("visorGaleria");
  if (visor) visor.classList.remove("activo");
}

function abrirImagen(ruta) {
  const visor = document.getElementById("visorImagen");
  const img = document.getElementById("imagenGrande");
  if (visor && img) {
    img.src = ruta;
    visor.style.display = "flex";
  }
}

function cerrarImagen() {
  const visor = document.getElementById("visorImagen");
  if (visor) visor.style.display = "none";
}

// Cerrar visores con la tecla Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { 
    cerrarGaleriaCompleta(); 
    cerrarImagen(); 
  }
});

/* =============================================
   NAVEGACIÓN ENTRE VISTAS (PÁGINA DETALLE)
   ============================================= */
function irAPaginaDetalle(ruta, titulo) {
  const principal = document.getElementById("pagina-principal");
  const detalle = document.getElementById("pagina-detalle");
  const imgDetalle = document.getElementById("detalle-img");
  const tituloDetalle = document.getElementById("detalle-titulo");

  if (principal && detalle && imgDetalle && tituloDetalle) {
    principal.classList.remove("activa");
    detalle.classList.add("activa");
    imgDetalle.src = ruta;
    tituloDetalle.innerText = titulo;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function irAPaginaPrincipal() {
  const principal = document.getElementById("pagina-principal");
  const detalle = document.getElementById("pagina-detalle");

  if (principal && detalle) {
    detalle.classList.remove("activa");
    principal.classList.add("activa");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* =============================================
   HEXÁGONOS — CONEXIÓN Y RAMIFICACIÓN DINÁMICA
   ============================================= */
(function () {
  const container = document.querySelector(".formas-fondo");
  const svg = document.getElementById("svg-conexiones");
  if (!container || !svg) return;
  const activeConnections = [];

  function branchHexagon(hex) {
    if (!hex.dataset.id) hex.dataset.id = "hex_" + Math.random().toString(36).substr(2, 9);
    const branches = parseInt(hex.dataset.branches || "0");
    if (branches >= 3) return;

    const cRect = container.getBoundingClientRect();
    const r = hex.getBoundingClientRect();
    const x = r.left - cRect.left + r.width / 2;
    const y = r.top - cRect.top + r.height / 2;
    
    const angles = [30, 90, 150, 210, 270, 330].sort(() => Math.random() - 0.5);
    let tx = 0, ty = 0, valid = false;

    for (const a of angles) {
      const rad = a * Math.PI / 180;
      const cx = x + Math.cos(rad) * 150;
      const cy = y + Math.sin(rad) * 150;
      if (cx > 40 && cx < cRect.width - 40 && cy > 40 && cy < cRect.height - 40) {
        tx = cx; ty = cy; valid = true; break;
      }
    }
    if (!valid) return;

    hex.dataset.branches = branches + 1;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x); line.setAttribute("y1", y);
    line.setAttribute("x2", x); line.setAttribute("y2", y);
    line.setAttribute("stroke", "rgba(255,255,255,0.85)");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    line.style.filter = "drop-shadow(0 0 5px rgba(255,255,255,0.6))";
    svg.appendChild(line);

    const t0 = performance.now();
    function anim(now) {
      const p = Math.min((now - t0) / 400, 1);
      const e = 1 - Math.pow(1 - p, 2);
      line.setAttribute("x2", x + (tx - x) * e);
      line.setAttribute("y2", y + (ty - y) * e);
      if (p < 1) requestAnimationFrame(anim);
      else spawnHexagon(tx, ty, hex, line);
    }
    requestAnimationFrame(anim);
  }

  function spawnHexagon(x, y, parent, lineEl) {
    const h = document.createElement("div");
    const cols = ["hex-morado", "hex-azul", "hex-verde", "hex-coral"];
    h.className = "hexagono " + cols[Math.floor(Math.random() * cols.length)];
    const s = [70, 80, 95, 110][Math.floor(Math.random() * 4)];
    h.style.width = s + "px"; h.style.height = s + "px";
    h.style.left = (x - s / 2) + "px"; h.style.top = (y - s / 2) + "px";
    h.style.transform = "scale(0)";
    h.style.transition = "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)";
    container.appendChild(h);

    h.getBoundingClientRect();
    h.style.transform = "";

    const anims = ["flotar-A", "flotar-B", "flotar-C", "flotar-D", "flotar-E"];
    const dur = 18 + Math.random() * 12;
    const delay = -Math.random() * 20;

    setTimeout(() => {
      h.style.animation = `${anims[Math.floor(Math.random() * 5)]} ${dur}s ease-in-out infinite alternate`;
      h.style.animationDelay = delay + "s";
    }, 400);

    h.addEventListener("click", e => { e.stopPropagation(); branchHexagon(h); });
    activeConnections.push({ lineEl, startEl: parent, endEl: h });
  }

  (function updateConnections() {
    const cRect = container.getBoundingClientRect();
    
    // ESTA LÍNEA CORRIGE EL PROBLEMA: fuerza al SVG a medir lo mismo que el layout del texto
    svg.style.height = cRect.height + "px"; 

    activeConnections.forEach(c => {
      const s = c.startEl.getBoundingClientRect();
      const e = c.endEl.getBoundingClientRect();
      c.lineEl.setAttribute("x1", s.left - cRect.left + s.width / 2);
      c.lineEl.setAttribute("y1", s.top - cRect.top + s.height / 2);
      c.lineEl.setAttribute("x2", e.left - cRect.left + e.width / 2);
      c.lineEl.setAttribute("y2", e.top - cRect.top + e.height / 2);
    });
    requestAnimationFrame(updateConnections);
  })();
    requestAnimationFrame(updateConnections);
  })();

  container.querySelectorAll(".hexagono").forEach(h => {
    h.addEventListener("click", e => { e.stopPropagation(); branchHexagon(h); });
  });

/* =============================================
   CARRUSELES (AUTOPLAY Y MANUALES)
   ============================================= */
(function () {
  const track = document.getElementById("carruselTrack");
  if (!track) return;
  let interval;

  const move = dir => {
    const item = track.querySelector(".carrusel-item");
    if (!item) return;
    track.scrollBy({ left: (item.getBoundingClientRect().width + 16) * dir, behavior: "smooth" });
  };

  const start = () => { interval = setInterval(() => move(1), 3500); };
  const stop = () => clearInterval(interval);

  track.addEventListener("mouseenter", stop);
  track.addEventListener("mouseleave", start);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  
  start();
  window.moverCarrusel = move;
})();

function moverJugar(direccion) {
  const carrusel = document.getElementById('carruselJugar');
  if (!carrusel) return;
  const anchoContenedor = carrusel.clientWidth;
  
  carrusel.scrollBy({
    left: anchoContenedor * direccion,
    behavior: 'smooth'
  });
}