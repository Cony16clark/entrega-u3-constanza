// ========================================================
// 1. CONFIGURACIÓN GLOBAL DEL JUEGO DE CONEXIONES
// ========================================================
const svgConexiones = document.getElementById('svg-conexiones');
const listaColores = ['morado', 'azul', 'verde', 'coral'];

// Función para dibujar la línea blanca brillante desde el hexágono
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
  linea.style.filter = "drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))";
  
  svgConexiones.appendChild(linea);
}

// Gestor de clics: Genera línea blanca y un nuevo hexágono al final
function gestionarClicHexagono(element, evento) {
  evento.stopPropagation(); // Evita conflictos con las capas traseras

  const contenedorFondo = document.querySelector('.formas-fondo');
  const contenedorRect = document.querySelector('.hero').getBoundingClientRect();
  const hexRect = element.getBoundingClientRect();
  
  // Calcular el centro exacto del hexágono presionado
  const currentX = hexRect.left - contenedorRect.left + (hexRect.width / 2);
  const currentY = hexRect.top - contenedorRect.top + (hexRect.height / 2);

  // Calcular la posición del nuevo hexágono (ángulo aleatorio)
  const angulo = Math.random() * Math.PI * 2;
  const distancia = 110; 
  
  const nuevoX = currentX + Math.cos(angulo) * distancia;
  const nuevoY = currentY + Math.sin(angulo) * distancia;

  // Dibujar la línea blanca
  dibujarLinea(currentX, currentY, nuevoX, nuevoY);

  // Crear el clon del nuevo hexágono
  const nuevoHex = document.createElement('div');
  const colorAleatorio = listaColores[Math.floor(Math.random() * listaColores.length)];
  
  nuevoHex.className = `hexagono hex-${colorAleatorio}`;
  nuevoHex.style.left = `${nuevoX}px`;
  nuevoHex.style.top = `${nuevoY}px`;
  
  // Configuración de animación suave nativa
  nuevoHex.style.opacity = '0';
  nuevoHex.style.scale = '0.2'; 
  nuevoHex.style.transition = 'scale 0.6s ease-out, opacity 0.6s ease-out';

  // Registrar clic en el nuevo hijo para ramificación infinita
  nuevoHex.addEventListener('click', (e) => gestionarClicHexagono(nuevoHex, e));
  contenedorFondo.appendChild(nuevoHex);

  // Lanzar transición de aparición suave
  setTimeout(() => {
    nuevoHex.style.opacity = '1';
    nuevoHex.style.scale = '1';
  }, 30);

  // Pequeño feedback visual en el pulsado
  element.style.scale = '1.1';
  setTimeout(() => {
    element.style.scale = '1';
  }, 150);
}

// ========================================================
// 2. CONTROL DEL CARRUSEL EN HORIZONTAL "CÓMO JUGAR"
// ========================================================
let indiceJugar = 0;

function moverJugar(direccion) {
  const track = document.querySelector('.track-jugar');
  const tarjetas = document.querySelectorAll('.tarjeta-jugar');
  
  if (!track || tarjetas.length === 0) return;
  
  // Detecta el ancho exacto de una tarjeta en la pantalla + su separación
  const tarjetaAncho = tarjetas[0].getBoundingClientRect().width + 10; 
  const maximoDesplazamiento = tarjetas.length - 1;

  indiceJugar += direccion;

  // Restringir topes inicial y final
  if (indiceJugar < 0) {
    indiceJugar = 0;
  } else if (indiceJugar > maximoDesplazamiento) {
    indiceJugar = maximoDesplazamiento;
  }

  // Desplazar físicamente la tira de fotos
  track.style.transform = `translateX(-${indiceJugar * tarjetaAncho}px)`;
  track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
}

// ========================================================
// 3. INICIALIZACIONES Y GALERÍAS AUXILIARES
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Activar clics iniciales en hexágonos del HTML
  const hexagonosIniciales = document.querySelectorAll('.formas-fondo .hexagono');
  hexagonosIniciales.forEach(hex => {
    hex.addEventListener('click', (e) => gestionarClicHexagono(hex, e));
  });
});

// Desplazamiento suave a sección componentes
function mostrarGaleria() {
  const galeria = document.getElementById('galeria');
  if(galeria) galeria.scrollIntoView({ behavior: 'smooth' });
}

// Funciones del visor de pantalla completa
function abrirGaleriaCompleta(ruta) {
  const visor = document.getElementById('visorGaleria');
  const img = document.getElementById('imagenGaleriaCompleta');
  if(visor && img) {
    img.src = ruta;
    visor.style.display = 'flex';
  }
}

function cerrarGaleriaCompleta() {
  const visor = document.getElementById('visorGaleria');
  if(visor) visor.style.display = 'none';
}function mostrarGaleria() {
  const galeria = document.getElementById('galeria');
  
  // Si está oculta o no tiene estilo asignado, la mostramos
  if (galeria.style.display === 'none' || galeria.style.display === '') {
    galeria.style.display = 'grid'; // Usamos 'grid' o 'flex' según tu diseño
    
    // Opcional: Desplazar la pantalla suavemente hasta la galería
    galeria.scrollIntoView({ behavior: 'smooth' });
  } else {
    galeria.style.display = 'none';
  }
}

// También asegúrate de tener las funciones para cerrar las vistas completas que ya usas en el HTML:
function abrirGaleriaCompleta(rutaImagen) {
  const visor = document.getElementById('visorGaleria');
  const img = document.getElementById('imagenGaleriaCompleta');
  img.src = rutaImagen;
  visor.style.display = 'flex';
}

function cerrarGaleriaCompleta() {
  document.getElementById('visorGaleria').style.display = 'none';
}document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('btn-ver-componentes');
  const galeria = document.getElementById('galeria-componentes');

  if (boton && galeria) {
    boton.addEventListener('click', () => {
      // Alterna la clase para mostrar/ocultar
      galeria.classList.toggle('mostrar');

      // Cambia el texto del botón dinámicamente
      if (galeria.classList.contains('mostrar')) {
        boton.textContent = 'Ocultar Componentes';
      } else {
        boton.textContent = 'Ver Componentes';
      }
    });
  }
});// CONTROLADOR DE LA GALERÍA DE COMPONENTES
function mostrarGaleria() {
  const galeria = document.getElementById('galeria');
  
  if (galeria) {
    // Alterna de manera segura la clase CSS .mostrar
    galeria.classList.toggle('mostrar');
    
    // Si se despliega, genera un scroll suave directo a los componentes
    if (galeria.classList.contains('mostrar')) {
      setTimeout(() => {
        galeria.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150); // Delay milimétrico para sincronizar con la animación CSS
    }
  }
}

// VISOR DE IMÁGENES COMPLETA (MODAL)
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
  if (visor) {
    visor.style.display = 'none';
  }
}

// FUNCIONES AUXILIARES DE NAVEGACIÓN (Vistas del proyecto)
function irAPaginaPrincipal() {
  const principal = document.getElementById('pagina-principal');
  const detalle = document.getElementById('pagina-detalle');
  if (principal && detalle) {
    detalle.classList.remove('activa');
    principal.classList.add('activa');
  }
}