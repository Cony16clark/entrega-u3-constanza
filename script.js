// ========================================================
// 1. CONFIGURACIÓN GLOBAL DEL JUEGO DE CONEXIONES
// ========================================================
const svgConexiones = document.getElementById('svg-conexiones');
const listaColores = ['morado', 'azul', 'verde', 'coral'];

function dibujarLinea(x1, y1, x2, y2) {
  if (!svgConexiones) return;

  const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
  linea.setAttribute("x1", x1);
  linea.setAttribute("y1", y1);
  linea.setAttribute("x2", x2);
  linea.setAttribute("y2", y2);
  linea.setAttribute("stroke", "white");
  linea.setAttribute("stroke-width", "3");
  linea.setAttribute("stroke-linecap", "round");
  linea.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,0.8))";

  svgConexiones.appendChild(linea);
}

function gestionarClicHexagono(element, evento) {
  evento.stopPropagation();

  const contenedorFondo = document.querySelector('.formas-fondo');
  const contenedorRect = document.querySelector('.hero').getBoundingClientRect();
  const hexRect = element.getBoundingClientRect();

  const currentX = hexRect.left - contenedorRect.left + (hexRect.width / 2);
  const currentY = hexRect.top - contenedorRect.top + (hexRect.height / 2);

  const angulo = Math.random() * Math.PI * 2;
  const distancia = 110;

  const nuevoX = currentX + Math.cos(angulo) * distancia;
  const nuevoY = currentY + Math.sin(angulo) * distancia;

  dibujarLinea(currentX, currentY, nuevoX, nuevoY);

  const nuevoHex = document.createElement('div');
  const colorAleatorio = listaColores[Math.floor(Math.random() * listaColores.length)];

  nuevoHex.className = `hexagono hex-${colorAleatorio}`;
  nuevoHex.style.left = `${nuevoX}px`;
  nuevoHex.style.top = `${nuevoY}px`;

  nuevoHex.style.opacity = '0';
  nuevoHex.style.scale = '0.2';
  nuevoHex.style.transition = 'scale 0.6s ease-out, opacity 0.6s ease-out';

  nuevoHex.addEventListener('click', (e) => gestionarClicHexagono(nuevoHex, e));
  contenedorFondo.appendChild(nuevoHex);

  setTimeout(() => {
    nuevoHex.style.opacity = '1';
    nuevoHex.style.scale = '1';
  }, 30);

  element.style.scale = '1.1';
  setTimeout(() => element.style.scale = '1', 150);
}

// ========================================================
// 2. CARRUSEL "CÓMO JUGAR"
// ========================================================
let indiceJugar = 0;

function moverJugar(direccion) {
  const track = document.querySelector('.track-jugar');
  const tarjetas = document.querySelectorAll('.tarjeta-jugar');

  if (!track || tarjetas.length === 0) return;

  const tarjetaAncho = tarjetas[0].getBoundingClientRect().width + 10;
  const max = tarjetas.length - 1;

  indiceJugar += direccion;

  if (indiceJugar < 0) indiceJugar = 0;
  if (indiceJugar > max) indiceJugar = max;

  track.style.transform = `translateX(-${indiceJugar * tarjetaAncho}px)`;
  track.style.transition = 'transform 0.5s cubic-bezier(0.25,1,0.5,1)';
}

// ========================================================
// 3. GALERÍA Y VISOR
// ========================================================
function mostrarGaleria() {
  const galeria = document.getElementById('galeria');
  if (!galeria) return;

  galeria.classList.toggle('mostrar');

  if (galeria.classList.contains('mostrar')) {
    setTimeout(() => {
      galeria.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }
}

function abrirGaleriaCompleta(rutaImagen) {
  const visor = document.getElementById('visorGaleria');
  const img = document.getElementById('imagenGaleriaCompleta');

  if (visor && img) {
    img.src = rutaImagen;
    visor.style.display = 'flex';
  }
}

function cerrarGaleriaCompleta() {
  const visor = document.getElementById('visorGaleria');
  if (visor) visor.style.display = 'none';
}

// ========================================================
// 4. NAVEGACIÓN
// ========================================================
function irAPaginaPrincipal() {
  const principal = document.getElementById('pagina-principal');
  const detalle = document.getElementById('pagina-detalle');

  if (principal && detalle) {
    detalle.classList.remove('activa');
    principal.classList.add('activa');
  }
}

// ========================================================
// 5. INICIALIZACIÓN
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  const hexagonos = document.querySelectorAll('.formas-fondo .hexagono');

  hexagonos.forEach(hex => {
    hex.addEventListener('click', (e) => gestionarClicHexagono(hex, e));
  });

  const boton = document.getElementById('btn-ver-componentes');
  const galeriaComp = document.getElementById('galeria-componentes');

  if (boton && galeriaComp) {
    boton.addEventListener('click', () => {
      galeriaComp.classList.toggle('mostrar');
      boton.textContent = galeriaComp.classList.contains('mostrar')
        ? 'Ocultar Componentes'
        : 'Ver Componentes';
    });
  }
});nuevoHex.className = `hexagono hex-${colorAleatorio}`;

nuevoHex.style.width = "80px";
nuevoHex.style.height = "80px";
nuevoHex.style.position = "absolute";
nuevoHex.style.zIndex = "10";