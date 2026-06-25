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

  let nuevoX = currentX + Math.cos(angulo) * distancia;
  let nuevoY = currentY + Math.sin(angulo) * distancia;

  // Evita que los hexágonos salgan del contenedor .hero y rompan el scroll
  const margenHex = 40; 
  if (nuevoX < margenHex) nuevoX = margenHex;
  if (nuevoX > contenedorRect.width - margenHex) nuevoX = contenedorRect.width - margenHex;
  if (nuevoY < margenHex) nuevoY = margenHex;
  if (nuevoY > contenedorRect.height - margenHex) nuevoY = contenedorRect.height - margenHex;

  dibujarLinea(currentX, currentY, nuevoX, nuevoY);

  const nuevoHex = document.createElement('div');
  const colorAleatorio = listaColores[Math.floor(Math.random() * listaColores.length)];

  nuevoHex.className = `hexagono hex-${colorAleatorio}`;
  nuevoHex.style.left = `${nuevoX}px`;
  nuevoHex.style.top = `${nuevoY}px`;

  nuevoHex.style.opacity = '0';
  nuevoHex.style.scale = '0.2';
  nuevoHex.style.transition = 'scale 0.6s ease-out, opacity 0.6s ease-out';
  nuevoHex.style.width = "80px";
  nuevoHex.style.height = "80px";
  nuevoHex.style.position = "absolute";
  nuevoHex.style.zIndex = "10";

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
} // <--- LLAVE DE CIERRE RESTAURADA AQUÍ PORQUE SE HABÍA BORR

// ========================================================
// 5. INICIALIZACIÓN
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("¡Script inicializado correctamente!");

  const hexagonos = document.querySelectorAll('.formas-fondo .hexagono');
  hexagonos.forEach(hex => {
    hex.addEventListener('click', (e) => gestionarClicHexagono(hex, e));
  });

  const boton = document.getElementById('btn-ver-componentes');
  const galeriaComp = document.getElementById('galeria-componentes');

  if (boton && galeriaComp) {
    boton.addEventListener('click', (evento) => {
      evento.preventDefault();
      
      galeriaComp.classList.toggle('mostrar');
      
      if (galeriaComp.classList.contains('mostrar')) {
        boton.textContent = 'Ocultar Componentes';
        galeriaComp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        boton.textContent = 'Ver Componentes';
      }
    });
  } else {
    console.warn("No se encontró el botón o el contenedor en el HTML.");
  }
});

// ========================================================
// 6. SIMULACIÓN DEL ÁRBOL INFINITO (p5.js)
// ========================================================
const sketch = (p) => {
    let nodos = [];
    let lineas = [];
    let tamanoHex = 25; 
    let distanciaRamas = 43.3; 
    let islas = [];
    let camaraX = 0, camaraY = 0;
    let destinoCamX = 0, destinoCamY = 0;
    let zoom = 1.0, destinoZoom = 1.0;
    let juegoGanado = false;
    let particulasMatrix = []; 

    const COLORES_FIGMA = { rojo: '#FF2400', verde: '#00FF00', azul: '#2B2BFF', morado: '#B04FFF' };
    let audioCtx = null;

    function reproducirSonido(frecuencia, tipo = 'sine', duracion = 0.15) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        let osc = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();
        osc.type = tipo;
        osc.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01); 
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracion); 
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duracion + 0.01);
    }

    function sonidoVictoria() {
        reproducirSonido(523.25, 'triangle', 0.1); 
        setTimeout(() => { reproducirSonido(659.25, 'triangle', 0.1); }, 80); 
        setTimeout(() => { reproducirSonido(783.99, 'triangle', 0.3); }, 160); 
    }

    function sonidoVictoriaFinal() {
        setTimeout(() => { reproducirSonido(523.25, 'sine', 0.15); }, 0);
        setTimeout(() => { reproducirSonido(659.25, 'sine', 0.15); }, 100);
        setTimeout(() => { reproducirSonido(783.99, 'sine', 0.15); }, 200);
        setTimeout(() => { reproducirSonido(1046.50, 'sine', 0.4); }, 300);
    }

    function inicializarIslas() {
        islas = [];
        let angulosBase = [p.HALF_PI * 3, p.HALF_PI, 0, p.PI];
        p.shuffle(angulosBase, true); 

        let configIslas = [
            { nombre: 'Roja', color: COLORES_FIGMA.rojo, dist: 350, angulo: angulosBase[0] },
            { nombre: 'Verde', color: COLORES_FIGMA.verde, dist: 450, angulo: angulosBase[1] },
            { nombre: 'Azul', color: COLORES_FIGMA.azul, dist: 550, angulo: angulosBase[2] },
            { nombre: 'Morada', color: COLORES_FIGMA.morado, dist: 650, angulo: angulosBase[3] }
        ];

        const siluetaFielCompleta = [
            {x: -15, y: -140}, {x: 10, y: -140}, {x: 34, y: -123},
            {x: 34, y: -102}, {x: 22, y: -94},  {x: 22, y: -74},
            {x: 10, y: -66},  {x: 22, y: -57},  {x: 22, y: -38},
            {x: 10, y: -29},  {x: 34, y: -12},  {x: 34, y: 8},
            {x: 22, y: 16},   {x: 22, y: 32},   {x: 75, y: 32},   {x: 75, y: 72},
            {x: 0, y: 118},   {x: -75, y: 72},  {x: -75, y: 32},  {x: -22, y: 32},  
            {x: -22, y: 16},  {x: -10, y: 8},   {x: -22, y: -1},  {x: -22, y: -21}, 
            {x: -10, y: -29}, {x: -10, y: -48}, {x: -22, y: -57}, {x: -22, y: -78},
            {x: -10, y: -86}, {x: -10, y: -105},{x: -22, y: -113},{x: -15, y: -125}
        ];

        for (let config of configIslas) {
            let anguloFinal = config.angulo + p.random(-0.1, 0.1);
            let distFinal = config.dist;
            islas.push({
                nombre: config.nombre, color: config.color,
                x: p.cos(anguloFinal) * distFinal, y: p.sin(anguloFinal) * distFinal,
                vertices: siluetaFielCompleta, alcanzada: false
            });
        }
    }

    function configurarEntornoInicial() {
        nodos = []; lineas = []; juegoGanado = false; particulasMatrix = [];
        const elVictoria = document.getElementById('pantalla-victoria');
        const elInstrucciones = document.getElementById('ui-instrucciones');
        if (elVictoria) elVictoria.classList.remove('activa');
        if (elInstrucciones) elInstrucciones.style.opacity = "1";

        camaraX = p.width / 2;
        camaraY = p.height / 2;
        destinoCamX = camaraX; destinoCamY = camaraY; destinoZoom = 1.0;

        let nodoCentral = { id: 0, x: 0, y: 0, tipo: 'tronco', color: 'rgba(255, 255, 255, 0.15)', hijosMax: 6 };
        nodos.push(nodoCentral);
        generarSeisIniciales(nodoCentral);
        inicializarIslas();
        actualizarMensajeUI();
    }

    p.setup = () => {
        let contenedor = document.getElementById('zona-canvas-p5');
        let ancho = contenedor ? contenedor.offsetWidth : p.windowWidth;
        let canvas = p.createCanvas(ancho, 500); 
        canvas.parent('zona-canvas-p5'); 
        configurarEntornoInicial();
    };

    p.draw = () => {
        p.background(juegoGanado ? '#050505' : '#1E1E1E'); 
        if (juegoGanado) { gestionarEfectoMatrix(); return; }

        camaraX = p.lerp(camaraX, destinoCamX, 0.1);
        camaraY = p.lerp(camaraY, destinoCamY, 0.1);
        zoom = p.lerp(zoom, destinoZoom, 0.1);

        p.stroke('rgba(255, 255, 255, 0.025)');
        let paso = 80 * zoom; 
        for (let x = camaraX % paso; x < p.width; x += paso) p.line(x, 0, x, p.height);
        for (let y = camaraY % paso; y < p.height; y += paso) p.line(0, y, p.width, y);

        p.push();
        p.translate(camaraX, camaraY);
        p.scale(zoom);

        let mouseMundialX = (p.mouseX - camaraX) / zoom;
        let mouseMundialY = (p.mouseY - camaraY) / zoom;

        for (let isla of islas) {
            p.push();
            p.translate(isla.x, isla.y);
            p.translate(0, p.sin(p.frameCount * 0.035 + isla.x) * 6);
            p.stroke('#FFFFFF'); p.strokeWeight(2.5 / zoom);
            let colorIsla = p.color(isla.color);
            colorIsla.setAlpha(isla.alcanzada ? 240 : 160);
            p.fill(colorIsla);
            p.beginShape();
            for (let v of isla.vertices) p.vertex(v.x, v.y);
            p.endShape(p.CLOSE);
            p.pop();
        }

        p.strokeWeight(3 / zoom); 
        for (let l of lineas) {
            let medX = (l.p1.x + l.p2.x) / 2;
            let medY = (l.p1.y + l.p2.y) / 2;
            p.stroke(l.p1.tipo !== 'vacio' && l.p2.tipo !== 'vacio' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)');
            p.noFill(); p.beginShape(); p.vertex(l.p1.x, l.p1.y);
            p.vertex(medX + (l.p1.x < l.p2.x ? -5 : 5), (l.p1.y + medY) / 2); 
            p.vertex(medX, medY); p.vertex(l.p2.x, l.p2.y); p.endShape();
        }

        for (let n of nodos) {
            p.stroke('#FFFFFF'); p.strokeWeight(2 / zoom);
            if (n.tipo === 'vacio') {
                p.stroke('rgba(255,255,255,0.25)'); p.noFill();
                dibujarHexagono(n.x, n.y, tamanoHex);
                if (p.dist(mouseMundialX, mouseMundialY, n.x, n.y) < tamanoHex) {
                    p.fill('rgba(255,255,255,0.15)'); dibujarHexagono(n.x, n.y, tamanoHex - 4);
                }
            } else {
                p.fill(n.color); dibujarHexagono(n.x, n.y, tamanoHex);
                p.fill(255, n.tipo === 'tronco' ? 120 : 200); p.noStroke();
                p.ellipse(n.x, n.y, n.tipo === 'tronco' ? 6 : 7, n.tipo === 'tronco' ? 6 : 7);
            }
        }
        p.pop();

        if (p.mouseIsPressed && (!sobreCualquierNodo(mouseMundialX, mouseMundialY) || p.mouseButton !== p.LEFT)) {
            destinoCamX += p.mouseX - p.pmouseX; destinoCamY += p.mouseY - p.pmouseY;
        }
    };

    p.mousePressed = () => {
        if (juegoGanado || p.mouseButton !== p.LEFT) return;
        let mouseMundialX = (p.mouseX - camaraX) / zoom;
        let mouseMundialY = (p.mouseY - camaraY) / zoom;

        for (let n of nodos) {
            if (n.tipo === 'vacio' && p.dist(mouseMundialX, mouseMundialY, n.x, n.y) < tamanoHex) {
                let opciones = [
                    { color: COLORES_FIGMA.rojo, hijos: 1, nota: 329.63 },   
                    { color: COLORES_FIGMA.verde, hijos: 2, nota: 392.00 },  
                    { color: COLORES_FIGMA.azul, hijos: 3, nota: 440.00 },   
                    { color: COLORES_FIGMA.morado, hijos: 4, nota: 523.25 }  
                ];
                let seleccion = p.random(opciones);
                n.tipo = 'color'; n.color = seleccion.color; n.hijosMax = seleccion.hijos; 
                reproducirSonido(seleccion.nota);
                ramificar(n);

                for (let isla of islas) {
                    if (!isla.alcanzada) {
                        let flotacionActual = p.sin(p.frameCount * 0.035 + isla.x) * 6;
                        if (p.dist(n.x, n.y, isla.x, isla.y + flotacionActual) < 100) {
                            isla.alcanzada = true; sonidoVictoria(); actualizarMensajeUI(); verificarCondicionVictoriaGlobal(); break;
                        }
                    }
                }
                break;
            }
        }
    };

    function verificarCondicionVictoriaGlobal() {
        if (islas.every(isla => isla.alcanzada)) {
            juegoGanado = true; sonidoVictoriaFinal();
            const elIns = document.getElementById('ui-instrucciones');
            const elVic = document.getElementById('pantalla-victoria');
            if (elIns) elIns.style.opacity = "0";
            if (elVic) elVic.classList.add('activa');
            for (let i = 0; i < p.width / 20; i++) {
                particulasMatrix.push({
                    x: i * 20 + p.random(-5, 5), y: p.random(-p.height, 0), velocidad: p.random(4, 9), tamano: p.random(6, 16),
                    color: p.random([COLORES_FIGMA.rojo, COLORES_FIGMA.verde, COLORES_FIGMA.azul, COLORES_FIGMA.morado, '#00FF00'])
                });
            }
        }
    }

    function gestionarEfectoMatrix() {
        p.noStroke();
        for (let pt of particulasMatrix) {
            let c = p.color(pt.color); c.setAlpha(p.map(pt.velocidad, 4, 9, 100, 255)); p.fill(c);
            dibujarHexagono(pt.x, pt.y, pt.tamano); pt.y += pt.velocidad;
            if (pt.y > p.height + 20) { pt.y = p.random(-100, -20); pt.velocidad = p.random(4, 9); pt.tamano = p.random(6, 16); }
        }
    }

    function actualizarMensajeUI() {
        let restantes = islas.filter(i => !i.alcanzada).map(i => i.nombre);
        let el = document.getElementById('status-islas');
        if (el) el.innerHTML = `Estructuras pendientes: ${restantes.join(', ')}`;
    }

    p.mouseWheel = (event) => {
        if(juegoGanado) return;
        destinoZoom = p.constrain(destinoZoom * (event.delta > 0 ? 0.9 : 1.1), 0.2, 3.0); 
        // Eliminado "return false;" para no bloquear el scroll nativo de la web
    };

    function sobreCualquierNodo(mx, my) {
        for (let n of nodos) { if (p.dist(mx, my, n.x, n.y) < tamanoHex) return true; }
        return false;
    }

    function generarSeisIniciales(nodoPadre) {
        for (let i = 0; i < 6; i++) {
            let angulo = (p.TWO_PI / 6) * i + p.HALF_PI;
            let nuevoNodo = { id: nodos.length + i + 1, x: nodoPadre.x + p.cos(angulo) * distanciaRamas, y: nodoPadre.y + p.sin(angulo) * distanciaRamas, tipo: 'vacio', color: '#000000', hijosMax: 0, padreX: nodoPadre.x, padreY: nodoPadre.y };
            nodos.push(nuevoNodo); lineas.push({ p1: nodoPadre, p2: nuevoNodo });
        }
    }

    function ramificar(nodoPadre) {
        let cantidadRamas = nodoPadre.hijosMax;
        let ramasCreadas = 0;
        
        let direccionesHexagonales = [];
        for (let i = 0; i < 6; i++) {
            direccionesHexagonales.push((p.TWO_PI / 6) * i + p.HALF_PI);
        }
        
        p.shuffle(direccionesHexagonales, true);
        
        for (let anguloPropuesto of direccionesHexagonales) {
            if (ramasCreadas >= cantidadRamas) break;
            
            let nuevoX = nodoPadre.x + p.cos(anguloPropuesto) * distanciaRamas;
            let nuevoY = nodoPadre.y + p.sin(anguloPropuesto) * distanciaRamas;
            
            let superpuesto = false;
            for (let existente of nodos) { 
                if (p.dist(nuevoX, nuevoY, existente.x, existente.y) < distanciaRamas - 1) { 
                    superpuesto = true; 
                    break; 
                } 
            }
            
            if (!superpuesto) {
                let nuevoNodo = { 
                    id: nodos.length + 1, 
                    x: nuevoX, 
                    y: nuevoY, 
                    tipo: 'vacio', 
                    color: '#000000', 
                    hijosMax: 0, 
                    padreX: nodoPadre.x, 
                    padreY: nodoPadre.y 
                };
                nodos.push(nuevoNodo); 
                lineas.push({ p1: nodoPadre, p2: nuevoNodo }); 
                ramasCreadas++;
            }
        }
    }

    function dibujarHexagono(x, y, radio) {
        p.beginShape();
        for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / 6) p.vertex(x + p.cos(a + p.HALF_PI) * radio, y + p.sin(a + p.HALF_PI) * radio);
        p.endShape(p.CLOSE);
    }

    p.windowResized = () => { 
        let contenedor = document.getElementById('zona-canvas-p5');
        let ancho = contenedor ? contenedor.offsetWidth : p.windowWidth;
        p.resizeCanvas(ancho, 500); 
    };
    reiniciarJuegoTotal = () => { configurarEntornoInicial(); };
};

let miEnlaceFatal = new p5(sketch);