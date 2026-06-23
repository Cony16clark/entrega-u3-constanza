function abrirImagen(src){
    document.getElementById("visorImagen").style.display="flex";
    document.getElementById("imagenGrande").src=src;
}
function reproducirSonidoHex() {
    const sonido = document.getElementById("hexSound");

    // Reinicia el sonido para permitir clics rápidos
    sonido.currentTime = 0;
    sonido.play().catch(() => {});
    
}

function cerrarImagen(){
    document.getElementById("visorImagen").style.display="none";
}newHex.addEventListener("click", (e) => {
    e.stopPropagation();
    reproducirSonidoHex();
    branchHexagon(newHex);
});newHex.addEventListener("click", (e) => {
    e.stopPropagation();
    reproducirSonidoHex();
    branchHexagon(newHex);
});