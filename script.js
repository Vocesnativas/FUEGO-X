/* =====================================================
   FUEGO X 2.0
   ARENA ARCADE
   5 JUEGOS
===================================================== */

/* =====================================================
   ELEMENTOS GENERALES
===================================================== */

const menuArcade = document.getElementById("menu-arcade");
const panelJuego = document.getElementById("panel-juego");

const tarjetasJuego = document.querySelectorAll(".juego-card");

const btnMenu = document.getElementById("btn-menu");
const btnVolverMenu = document.getElementById("btn-volver-menu");
const btnFinalMenu = document.getElementById("btn-final-menu");

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaFinal = document.getElementById("pantalla-final");

const btnJugar = document.getElementById("btn-jugar");
const btnIniciar = document.getElementById("btn-iniciar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnOtra = document.getElementById("btn-otra");

/* =====================================================
   ELEMENTOS DEL JUEGO 1
===================================================== */

const zonaJuego = document.getElementById("zona-juego");
const objetivo = document.getElementById("objetivo");
const bonificacion = document.getElementById("bonificacion");
const efectos = document.getElementById("efectos");

const puntosTexto = document.getElementById("puntos");
const comboTexto = document.getElementById("combo");
const nivelTexto = document.getElementById("nivel");
const vidasTexto = document.getElementById("vidas");
const tiempoTexto = document.getElementById("tiempo");
const barra = document.getElementById("barra");

const recordTexto = document.getElementById("record");

const puntuacionFinal = document.getElementById("puntuacion-final");
const nivelFinal = document.getElementById("nivel-final");
const comboFinal = document.getElementById("combo-final");
const mensajeFinal = document.getElementById("mensaje-final");

const mensajeNivel = document.getElementById("mensaje-nivel");
const mensajeCombo = document.getElementById("mensaje-combo");

const medalla = document.getElementById("medalla");
const iconoFinal = document.getElementById("icono-final");

const juegoTitulo = document.getElementById("juego-titulo");
const juegoDescripcion = document.getElementById("juego-descripcion");

const iconoInicio = document.getElementById("icono-inicio");
const etiquetaInicio = document.getElementById("etiqueta-inicio");
const tituloInicio = document.getElementById("titulo-inicio");
const descripcionInicio = document.getElementById("descripcion-inicio");
const reglasInicio = document.getElementById("reglas-inicio");

/* =====================================================
   CONFIGURACIÓN DE LOS 5 JUEGOS
===================================================== */

const juegos = {

    objetivo: {
        numero: "JUEGO 01",
        icono: "🎯",
        titulo: "ATRAPA EL OBJETIVO",
        descripcion: "Reflejos y precisión"
    },

    reflejos: {
        numero: "JUEGO 02",
        icono: "⚡",
        titulo: "REFLEJOS X",
        descripcion: "Reacciona rápidamente"
    },

    memoria: {
        numero: "JUEGO 03",
        icono: "🧠",
        titulo: "MEMORIA X",
        descripcion: "Encuentra las parejas"
    },

    puzzle: {
        numero: "JUEGO 04",
        icono: "🧩",
        titulo: "PUZZLE X",
        descripcion: "Piensa rápido"
    },

    carrera: {
        numero: "JUEGO 05",
        icono: "🚀",
        titulo: "CARRERA X",
        descripcion: "Evita los obstáculos"
    }

};

/* =====================================================
   VARIABLES
===================================================== */

let juegoActual = "objetivo";

let puntos = 0;
let combo = 1;
let mejorCombo = 1;
let nivel = 1;
let vidas = 3;
let tiempo = 30;

let juegoActivo = false;

let temporizador = null;
let movimiento = null;
let bonificacionTimer = null;

let record = Number(
    localStorage.getItem("fuegoXRecord_" + juegoActual)
) || 0;

recordTexto.textContent = record;

/* =====================================================
   SONIDO
===================================================== */

let audioContext = null;

function sonido(frecuencia, duracion = 0.08) {

    try {

        if (!audioContext) {

            audioContext = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        }

        const oscilador =
            audioContext.createOscillator();

        const ganancia =
            audioContext.createGain();

        oscilador.frequency.value = frecuencia;
        oscilador.type = "sine";

        ganancia.gain.setValueAtTime(
            0.08,
            audioContext.currentTime
        );

        ganancia.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duracion
        );

        oscilador.connect(ganancia);
        ganancia.connect(audioContext.destination);

        oscilador.start();

        oscilador.stop(
            audioContext.currentTime + duracion
        );

    } catch (error) {

        console.log("Audio no disponible");

    }

}

/* =====================================================
   SELECCIONAR JUEGO
===================================================== */

tarjetasJuego.forEach(tarjeta => {

    tarjeta.addEventListener("click", () => {

        const tipo = tarjeta.dataset.juego;

        seleccionarJuego(tipo);

    });

});


function seleccionarJuego(tipo) {

    if (!juegos[tipo]) return;

    juegoActual = tipo;

    const juego = juegos[tipo];

    detenerJuego();

    juegoActivo = false;

    objetivo.style.display = "none";
    bonificacion.style.display = "none";

    juegoTitulo.textContent =
        juego.icono + " " + juego.titulo;

    juegoDescripcion.textContent =
        juego.descripcion;

    iconoInicio.textContent =
        juego.icono;

    etiquetaInicio.textContent =
        juego.numero;

    tituloInicio.textContent =
        juego.titulo;

    descripcionInicio.textContent =
        "Prepárate para " + juego.descripcion +
        ". Consigue puntos y supera tu récord.";

    if (tipo === "objetivo") {

        reglasInicio.innerHTML = `
            <div>🎯 <b>ACERTA</b> los objetivos</div>
            <div>🔥 <b>CREA COMBOS</b> para multiplicar puntos</div>
            <div>⭐ <b>CAPTURA BONIFICACIONES</b></div>
            <div>🏆 <b>SUPERA TU RÉCORD</b></div>
        `;

    } else {

        reglasInicio.innerHTML = `
            <div>🎮 <b>JUEGA</b> y consigue puntos</div>
            <div>⚡ <b>SUPERA</b> tus propios tiempos</div>
            <div>🔥 <b>AUMENTA</b> tu puntuación</div>
            <div>🏆 <b>ROMPE TU RÉCORD</b></div>
        `;

    }

    record =
        Number(
            localStorage.getItem(
                "fuegoXRecord_" + juegoActual
            )
        ) || 0;

    recordTexto.textContent = record;

    menuArcade.classList.add("oculto");

    panelJuego.classList.remove("oculto");

    pantallaInicio.classList.remove("oculto");

}

/* =====================================================
   VOLVER AL MENÚ
===================================================== */

function volverMenu() {

    detenerJuego();

    juegoActivo = false;

    objetivo.style.display = "none";
    bonificacion.style.display = "none";

    pantallaInicio.classList.add("oculto");
    pantallaFinal.classList.add("oculto");

    panelJuego.classList.add("oculto");
    menuArcade.classList.remove("oculto");

}

btnMenu.addEventListener("click", volverMenu);

btnVolverMenu.addEventListener(
    "click",
    volverMenu
);

btnFinalMenu.addEventListener(
    "click",
    volverMenu
);

/* =====================================================
   ACTUALIZAR INTERFAZ
===================================================== */

function actualizarInterfaz() {

    puntosTexto.textContent = puntos;

    comboTexto.textContent =
        "x" + combo;

    nivelTexto.textContent =
        nivel;

    vidasTexto.textContent =
        vidas;

    tiempoTexto.textContent =
        tiempo;

    const porcentaje =
        (tiempo / 30) * 100;

    barra.style.width =
        porcentaje + "%";

}

/* =====================================================
   INICIAR
===================================================== */

function iniciarJuego() {

    detenerJuego();

    puntos = 0;
    combo = 1;
    mejorCombo = 1;
    nivel = 1;
    vidas = 3;
    tiempo = 30;

    juegoActivo = true;

    actualizarInterfaz();

    pantallaInicio.classList.add("oculto");
    pantallaFinal.classList.add("oculto");

    if (juegoActual === "objetivo") {

        objetivo.style.display = "block";
        bonificacion.style.display = "none";

        mostrarNivel();

        colocarObjetivo();

        iniciarMovimiento();

        programarBonificacion();

    } else {

        prepararJuegoProximamente();

    }

    iniciarTemporizador();

}

/* =====================================================
   JUEGOS 2-5
===================================================== */

function prepararJuegoProximamente() {

    objetivo.style.display = "none";
    bonificacion.style.display = "none";

    efectos.innerHTML = `
        <div class="mensaje-proximo">
            ${juegos[juegoActual].icono}
            <br>
            ${juegos[juegoActual].titulo}
            <br>
            <small>PREPARANDO RETO...</small>
        </div>
    `;

}

/* =====================================================
   TEMPORIZADOR
===================================================== */

function iniciarTemporizador() {

    temporizador = setInterval(() => {

        if (!juegoActivo) return;

        tiempo--;

        actualizarInterfaz();

        if (tiempo <= 0) {

            terminarJuego();

        }

    }, 1000);

}

/* =====================================================
   DETENER
===================================================== */

function detenerJuego() {

    clearInterval(temporizador);
    clearInterval(movimiento);
    clearTimeout(bonificacionTimer);

    temporizador = null;
    movimiento = null;
    bonificacionTimer = null;

}

/* =====================================================
   MOVIMIENTO
===================================================== */

function iniciarMovimiento() {

    clearInterval(movimiento);

    const velocidad =
        Math.max(
            330,
            1200 - (nivel * 75)
        );

    movimiento = setInterval(() => {

        if (juegoActivo) {

            colocarObjetivo();

        }

    }, velocidad);

}

/* =====================================================
   COLOCAR OBJETIVO
===================================================== */

function colocarObjetivo() {

    if (!juegoActivo) return;

    const margen = 55;

    const ancho =
        zonaJuego.clientWidth;

    const alto =
        zonaJuego.clientHeight;

    const x =
        margen +
        Math.random() *
        (ancho - margen * 2);

    const y =
        margen +
        Math.random() *
        (alto - margen * 2);

    objetivo.style.left =
        x + "px";

    objetivo.style.top =
        y + "px";

    const tamaño =
        Math.max(
            48,
            74 - nivel * 2
        );

    objetivo.style.width =
        tamaño + "px";

    objetivo.style.height =
        tamaño + "px";

}

/* =====================================================
   ACIERTO
===================================================== */

objetivo.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        if (!juegoActivo) return;

        sonido(
            500 + combo * 35,
            0.09
        );

        const rect =
            objetivo.getBoundingClientRect();

        const zonaRect =
            zonaJuego.getBoundingClientRect();

        const x =
            rect.left -
            zonaRect.left +
            rect.width / 2;

        const y =
            rect.top -
            zonaRect.top +
            rect.height / 2;

        crearExplosion(x, y);

        const puntosGanados =
            10 * combo;

        puntos += puntosGanados;

        combo++;

        if (combo > 10) {

            combo = 10;

        }

        if (combo > mejorCombo) {

            mejorCombo = combo;

        }

        mostrarPuntos(
            x,
            y,
            "+" + puntosGanados
        );

        mostrarCombo();

        comprobarNivel();

        actualizarInterfaz();

        colocarObjetivo();

    }
);

/* =====================================================
   CLIC FUERA
===================================================== */

zonaJuego.addEventListener(
    "click",
    function(event) {

        if (!juegoActivo) return;

        if (
            event.target === zonaJuego ||
            event.target.classList.contains(
                "instruccion"
            )
        ) {

            perderCombo();

            crearFallo(
                event.offsetX,
                event.offsetY
            );

        }

    }
);

/* =====================================================
   PERDER
===================================================== */

function perderCombo() {

    combo = 1;

    vidas--;

    sonido(180, 0.12);

    actualizarInterfaz();

    if (vidas <= 0) {

        terminarJuego();

    }

}

/* =====================================================
   NIVEL
===================================================== */

function comprobarNivel() {

    const nuevoNivel =
        Math.floor(
            puntos / 100
        ) + 1;

    if (nuevoNivel > nivel) {

        nivel = nuevoNivel;

        sonido(700, 0.15);

        mostrarNivel();

        iniciarMovimiento();

    }

}

/* =====================================================
   MENSAJE NIVEL
===================================================== */

function mostrarNivel() {

    mensajeNivel.textContent =
        "NIVEL " + nivel;

    mensajeNivel.animate(
        [
            {
                opacity: 0,
                transform:
                    "translateX(-50%) scale(.6)"
            },
            {
                opacity: 1,
                transform:
                    "translateX(-50%) scale(1.25)"
            },
            {
                opacity: .75,
                transform:
                    "translateX(-50%) scale(1)"
            }
        ],
        {
            duration: 700
        }
    );

}

/* =====================================================
   COMBO
===================================================== */

function mostrarCombo() {

    if (combo <= 1) return;

    mensajeCombo.textContent =
        "🔥 COMBO x" + combo;

    mensajeCombo.animate(
        [
            {
                opacity: 0,
                transform:
                    "translateX(-50%) scale(.6)"
            },
            {
                opacity: 1,
                transform:
                    "translateX(-50%) scale(1.2)"
            },
            {
                opacity: 0,
                transform:
                    "translateX(-50%) scale(1)"
            }
        ],
        {
            duration: 600
        }
    );

}

/* =====================================================
   BONIFICACIÓN
===================================================== */

function programarBonificacion() {

    clearTimeout(bonificacionTimer);

    bonificacionTimer =
        setTimeout(() => {

            if (!juegoActivo) return;

            colocarBonificacion();

            programarBonificacion();

        }, 5000 + Math.random() * 4000);

}

function colocarBonificacion() {

    const margen = 60;

    const ancho =
        zonaJuego.clientWidth;

    const alto =
        zonaJuego.clientHeight;

    const x =
        margen +
        Math.random() *
        (ancho - margen * 2);

    const y =
        margen +
        Math.random() *
        (alto - margen * 2);

    bonificacion.style.left =
        x + "px";

    bonificacion.style.top =
        y + "px";

    bonificacion.style.display =
        "block";

    setTimeout(() => {

        if (juegoActivo) {

            bonificacion.style.display =
                "none";

        }

    }, 3000);

}

/* =====================================================
   ATRAPAR BONIFICACIÓN
===================================================== */

bonificacion.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        if (!juegoActivo) return;

        const rect =
            bonificacion.getBoundingClientRect();

        const zonaRect =
            zonaJuego.getBoundingClientRect();

        const x =
            rect.left -
            zonaRect.left +
            rect.width / 2;

        const y =
            rect.top -
            zonaRect.top +
            rect.height / 2;

        const puntosBonus =
            50 * combo;

        puntos += puntosBonus;

        sonido(850, 0.18);

        crearExplosion(x, y);

        mostrarPuntos(
            x,
            y,
            "+" + puntosBonus
        );

        bonificacion.style.display =
            "none";

        actualizarInterfaz();

    }
);

/* =====================================================
   EXPLOSIÓN
===================================================== */

function crearExplosion(x, y) {

    const efecto =
        document.createElement("div");

    efecto.className =
        "explosion";

    efecto.style.left =
        x + "px";

    efecto.style.top =
        y + "px";

    efectos.appendChild(efecto);

    setTimeout(() => {

        efecto.remove();

    }, 500);

}

/* =====================================================
   PUNTOS
===================================================== */

function mostrarPuntos(x, y, texto) {

    const elemento =
        document.createElement("div");

    elemento.className =
        "texto-puntos";

    elemento.textContent =
        texto;

    elemento.style.left =
        x + "px";

    elemento.style.top =
        y + "px";

    efectos.appendChild(elemento);

    setTimeout(() => {

        elemento.remove();

    }, 750);

}

/* =====================================================
   FALLO
===================================================== */

function crearFallo(x, y) {

    const fallo =
        document.createElement("div");

    fallo.className =
        "fallo";

    fallo.textContent =
        "✕";

    fallo.style.left =
        x + "px";

    fallo.style.top =
        y + "px";

    efectos.appendChild(fallo);

    setTimeout(() => {

        fallo.remove();

    }, 450);

}

/* =====================================================
   MEDALLAS
===================================================== */

function obtenerMedalla() {

    if (puntos >= 500) {

        return {
            texto: "🔥 FUEGO",
            icono: "🔥"
        };

    }

    if (puntos >= 300) {

        return {
            texto: "🥇 ORO",
            icono: "🥇"
        };

    }

    if (puntos >= 150) {

        return {
            texto: "🥈 PLATA",
            icono: "🥈"
        };

    }

    return {
        texto: "🥉 BRONCE",
        icono: "🥉"
    };

}

/* =====================================================
   TERMINAR
===================================================== */

function terminarJuego() {

    if (!juegoActivo) return;

    juegoActivo = false;

    detenerJuego();

    objetivo.style.display =
        "none";

    bonificacion.style.display =
        "none";

    puntuacionFinal.textContent =
        puntos;

    nivelFinal.textContent =
        nivel;

    comboFinal.textContent =
        "x" + mejorCombo;

    const resultado =
        obtenerMedalla();

    medalla.textContent =
        resultado.texto;

    iconoFinal.textContent =
        resultado.icono;

    if (puntos > record) {

        record = puntos;

        localStorage.setItem(
            "fuegoXRecord_" + juegoActual,
            record
        );

        recordTexto.textContent =
            record;

        mensajeFinal.textContent =
            "🏆 ¡NUEVO RÉCORD!";

    }

    else if (puntos >= 500) {

        mensajeFinal.textContent =
            "🔥 ¡NIVEL FUEGO!";

    }

    else if (puntos >= 300) {

        mensajeFinal.textContent =
            "⚡ ¡PARTIDA INCREÍBLE!";

    }

    else if (puntos >= 150) {

        mensajeFinal.textContent =
            "⭐ ¡MUY BUENA PARTIDA!";

    }

    else {

        mensajeFinal.textContent =
            "🎯 ¡Puedes superar esa puntuación!";

    }

    pantallaFinal.classList.remove(
        "oculto"
    );

}

/* =====================================================
   BOTONES
===================================================== */

btnJugar.addEventListener(
    "click",
    iniciarJuego
);

btnIniciar.addEventListener(
    "click",
    iniciarJuego
);

btnReiniciar.addEventListener(
    "click",
    iniciarJuego
);

btnOtra.addEventListener(
    "click",
    iniciarJuego
);

/* =====================================================
   TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !juegoActivo &&
            !pantallaInicio.classList.contains(
                "oculto"
            )
        ) {

            iniciarJuego();

        }

    }
);

/* =====================================================
   INICIO
===================================================== */

actualizarInterfaz();
