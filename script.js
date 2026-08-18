/* ==========================================
   FUEGO X
   Juego arcade de puntería
========================================== */

const zonaJuego = document.getElementById("zona-juego");
const objetivo = document.getElementById("objetivo");
const explosion = document.getElementById("explosion");

const puntosTexto = document.getElementById("puntos");
const comboTexto = document.getElementById("combo");
const nivelTexto = document.getElementById("nivel");
const vidasTexto = document.getElementById("vidas");
const tiempoTexto = document.getElementById("tiempo");
const recordTexto = document.getElementById("record");
const barra = document.getElementById("barra");

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaFinal = document.getElementById("pantalla-final");

const btnJugar = document.getElementById("btn-jugar");
const btnIniciar = document.getElementById("btn-iniciar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnOtra = document.getElementById("btn-otra");

const puntuacionFinal = document.getElementById("puntuacion-final");
const nivelFinal = document.getElementById("nivel-final");
const comboFinal = document.getElementById("combo-final");
const mensajeFinal = document.getElementById("mensaje-final");

let puntos = 0;
let combo = 1;
let nivel = 1;
let vidas = 3;
let tiempo = 30;

let juegoActivo = false;
let temporizador = null;
let movimiento = null;

let record = Number(localStorage.getItem("fuegoXRecord")) || 0;

recordTexto.textContent = record;


/* ==========================================
   INICIAR
========================================== */

function iniciarJuego() {

    detenerJuego();

    puntos = 0;
    combo = 1;
    nivel = 1;
    vidas = 3;
    tiempo = 30;

    juegoActivo = true;

    actualizarInterfaz();

    pantallaInicio.classList.add("oculto");
    pantallaFinal.classList.add("oculto");

    objetivo.style.display = "block";

    mostrarNivel();

    moverObjetivo();

    temporizador = setInterval(() => {

        if (!juegoActivo) return;

        tiempo--;

        actualizarInterfaz();

        if (tiempo <= 0) {
            terminarJuego();
        }

    }, 1000);
}


/* ==========================================
   DETENER
========================================== */

function detenerJuego() {

    clearInterval(temporizador);
    clearInterval(movimiento);

    temporizador = null;
    movimiento = null;
}


/* ==========================================
   ACTUALIZAR INTERFAZ
========================================== */

function actualizarInterfaz() {

    puntosTexto.textContent = puntos;
    comboTexto.textContent = "x" + combo;
    nivelTexto.textContent = nivel;
    vidasTexto.textContent = vidas;
    tiempoTexto.textContent = tiempo;

    const porcentaje = (tiempo / 30) * 100;

    barra.style.width = porcentaje + "%";
}


/* ==========================================
   MOVER OBJETIVO
========================================== */

function moverObjetivo() {

    if (!juegoActivo) return;

    clearInterval(movimiento);

    colocarObjetivo();

    const velocidad = Math.max(350, 1200 - (nivel * 90));

    movimiento = setInterval(() => {

        if (juegoActivo) {
            colocarObjetivo();
        }

    }, velocidad);
}


function colocarObjetivo() {

    const margen = 55;

    const ancho = zonaJuego.clientWidth;
    const alto = zonaJuego.clientHeight;

    const x = margen + Math.random() * (ancho - margen * 2);
    const y = margen + Math.random() * (alto - margen * 2);

    objetivo.style.left = x + "px";
    objetivo.style.top = y + "px";
}


/* ==========================================
   DISPARO / ACIERTO
========================================== */

objetivo.addEventListener("click", function(event) {

    event.stopPropagation();

    if (!juegoActivo) return;

    const rect = objetivo.getBoundingClientRect();
    const zonaRect = zonaJuego.getBoundingClientRect();

    crearExplosion(
        rect.left - zonaRect.left + rect.width / 2,
        rect.top - zonaRect.top + rect.height / 2
    );

    puntos += 10 * combo;

    combo++;

    if (combo > 10) {
        combo = 10;
    }

    comprobarNivel();

    actualizarInterfaz();

    colocarObjetivo();
});


/* ==========================================
   CLIC FUERA DEL OBJETIVO
========================================== */

zonaJuego.addEventListener("click", function(event) {

    if (!juegoActivo) return;

    if (event.target === zonaJuego) {

        perderCombo();

        crearFallo(event.offsetX, event.offsetY);

    }
});


/* ==========================================
   FALLAR
========================================== */

function perderCombo() {

    combo = 1;

    vidas--;

    actualizarInterfaz();

    if (vidas <= 0) {
        terminarJuego();
    }
}


/* ==========================================
   COMPROBAR NIVEL
========================================== */

function comprobarNivel() {

    const nuevoNivel = Math.floor(puntos / 100) + 1;

    if (nuevoNivel > nivel) {

        nivel = nuevoNivel;

        mostrarNivel();

        moverObjetivo();
    }
}


/* ==========================================
   MENSAJE DE NIVEL
========================================== */

function mostrarNivel() {

    const mensaje = document.getElementById("mensaje-nivel");

    mensaje.textContent = "NIVEL " + nivel;

    mensaje.animate(
        [
            {
                opacity: 0,
                transform: "translateX(-50%) scale(.7)"
            },
            {
                opacity: 1,
                transform: "translateX(-50%) scale(1.2)"
            },
            {
                opacity: .7,
                transform: "translateX(-50%) scale(1)"
            }
        ],
        {
            duration: 700
        }
    );
}


/* ==========================================
   EXPLOSION VISUAL
========================================== */

function crearExplosion(x, y) {

    const efecto = document.createElement("div");

    efecto.className = "explosion";

    efecto.style.left = x + "px";
    efecto.style.top = y + "px";

    zonaJuego.appendChild(efecto);

    setTimeout(() => {
        efecto.remove();
    }, 450);
}


/* ==========================================
   EFECTO DE FALLO
========================================== */

function crearFallo(x, y) {

    const fallo = document.createElement("div");

    fallo.textContent = "✕";

    fallo.style.position = "absolute";
    fallo.style.left = x + "px";
    fallo.style.top = y + "px";
    fallo.style.color = "#777";
    fallo.style.fontSize = "30px";
    fallo.style.fontWeight = "bold";
    fallo.style.pointerEvents = "none";

    zonaJuego.appendChild(fallo);

    fallo.animate(
        [
            {
                transform: "scale(.5)",
                opacity: 1
            },
            {
                transform: "scale(1.5)",
                opacity: 0
            }
        ],
        {
            duration: 400
        }
    );

    setTimeout(() => {
        fallo.remove();
    }, 400);
}


/* ==========================================
   TERMINAR
========================================== */

function terminarJuego() {

    if (!juegoActivo) return;

    juegoActivo = false;

    detenerJuego();

    objetivo.style.display = "none";

    puntuacionFinal.textContent = puntos;
    nivelFinal.textContent = nivel;
    comboFinal.textContent = "x" + combo;

    if (puntos > record) {

        record = puntos;

        localStorage.setItem("fuegoXRecord", record);

        recordTexto.textContent = record;

        mensajeFinal.textContent = "🏆 ¡NUEVO RÉCORD!";
    }

    else if (puntos >= 300) {
        mensajeFinal.textContent = "🔥 ¡PARTIDA BRUTAL!";
    }

    else if (puntos >= 150) {
        mensajeFinal.textContent = "⚡ ¡MUY BUENA PARTIDA!";
    }

    else {
        mensajeFinal.textContent = "🎯 ¡Vuelve a intentarlo!";
    }

    pantallaFinal.classList.remove("oculto");
}


/* ==========================================
   BOTONES
========================================== */

btnJugar.addEventListener("click", iniciarJuego);

btnIniciar.addEventListener("click", iniciarJuego);

btnReiniciar.addEventListener("click", iniciarJuego);

btnOtra.addEventListener("click", iniciarJuego);


/* ==========================================
   TECLADO
========================================== */

document.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !juegoActivo) {
        iniciarJuego();
    }

});


/* ==========================================
   INICIO
========================================== */

actualizarInterfaz();
