/* =========================================================
   FUEGO X 2.0
   ARENA ARCADE
   5 JUEGOS FUNCIONANDO
========================================================= */

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


/* =========================================================
   JUEGOS
========================================================= */

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


/* =========================================================
   VARIABLES
========================================================= */

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

let record = 0;

let juegoDatos = {};

recordTexto.textContent = "0";


/* =========================================================
   SONIDO
========================================================= */

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

    } catch (error) {}

}


/* =========================================================
   SELECCIONAR JUEGO
========================================================= */

tarjetasJuego.forEach(tarjeta => {

    tarjeta.addEventListener("click", () => {

        seleccionarJuego(
            tarjeta.dataset.juego
        );

    });

});


function seleccionarJuego(tipo) {

    if (!juegos[tipo]) return;

    detenerJuego();

    juegoActivo = false;

    juegoActual = tipo;

    const juego = juegos[tipo];

    objetivo.style.display = "none";
    bonificacion.style.display = "none";

    efectos.innerHTML = "";

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
        "Prepárate para " +
        juego.descripcion +
        ". Consigue puntos y supera tu récord.";

    if (tipo === "objetivo") {

        reglasInicio.innerHTML = `
            <div>🎯 <b>ACERTA</b> los objetivos</div>
            <div>🔥 <b>CREA COMBOS</b></div>
            <div>⭐ <b>CAPTURA BONIFICACIONES</b></div>
            <div>🏆 <b>SUPERA TU RÉCORD</b></div>
        `;

    }

    if (tipo === "reflejos") {

        reglasInicio.innerHTML = `
            <div>⚡ <b>ESPERA</b> la señal</div>
            <div>🎯 <b>TOCA</b> rápidamente</div>
            <div>🔥 <b>MEJORA</b> tus reacciones</div>
            <div>🏆 <b>SUPERA TU RÉCORD</b></div>
        `;

    }

    if (tipo === "memoria") {

        reglasInicio.innerHTML = `
            <div>🧠 <b>OBSERVA</b> las cartas</div>
            <div>🔎 <b>ENCUENTRA</b> las parejas</div>
            <div>🔥 <b>COMBINA</b> correctamente</div>
            <div>🏆 <b>SUPERA TU RÉCORD</b></div>
        `;

    }

    if (tipo === "puzzle") {

        reglasInicio.innerHTML = `
            <div>🧩 <b>RESUELVE</b> el reto</div>
            <div>⚡ <b>PIENSA</b> rápidamente</div>
            <div>🔥 <b>CONSIGUE</b> puntos</div>
            <div>🏆 <b>SUPERA TU RÉCORD</b></div>
        `;

    }

    if (tipo === "carrera") {

        reglasInicio.innerHTML = `
            <div>🚀 <b>MUÉVETE</b> rápidamente</div>
            <div>💥 <b>EVITA</b> obstáculos</div>
            <div>🔥 <b>SOBREVIVE</b> todo lo posible</div>
            <div>🏆 <b>SUPERA TU RÉCORD</b></div>
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


/* =========================================================
   VOLVER AL MENÚ
========================================================= */

function volverMenu() {

    detenerJuego();

    juegoActivo = false;

    objetivo.style.display = "none";
    bonificacion.style.display = "none";

    efectos.innerHTML = "";

    pantallaInicio.classList.add("oculto");
    pantallaFinal.classList.add("oculto");

    panelJuego.classList.add("oculto");
    menuArcade.classList.remove("oculto");

}

btnMenu.addEventListener(
    "click",
    volverMenu
);

btnVolverMenu.addEventListener(
    "click",
    volverMenu
);

btnFinalMenu.addEventListener(
    "click",
    volverMenu
);


/* =========================================================
   INTERFAZ
========================================================= */

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
        Math.max(
            0,
            (tiempo / 30) * 100
        );

    barra.style.width =
        porcentaje + "%";

}


/* =========================================================
   INICIAR JUEGO
========================================================= */

function iniciarJuego() {

    detenerJuego();

    puntos = 0;
    combo = 1;
    mejorCombo = 1;
    nivel = 1;
    vidas = 3;
    tiempo = 30;

    juegoDatos = {};

    efectos.innerHTML = "";

    juegoActivo = true;

    actualizarInterfaz();

    pantallaInicio.classList.add("oculto");
    pantallaFinal.classList.add("oculto");

    objetivo.style.display = "none";
    bonificacion.style.display = "none";


    /* JUEGO 1 */

    if (juegoActual === "objetivo") {

        iniciarJuegoObjetivo();

    }


    /* JUEGO 2 */

    else if (juegoActual === "reflejos") {

        iniciarJuegoReflejos();

    }


    /* JUEGO 3 */

    else if (juegoActual === "memoria") {

        iniciarJuegoMemoria();

    }


    /* JUEGO 4 */

    else if (juegoActual === "puzzle") {

        iniciarJuegoPuzzle();

    }


    /* JUEGO 5 */

    else if (juegoActual === "carrera") {

        iniciarJuegoCarrera();

    }

}


/* =========================================================
   TEMPORIZADOR GENERAL
========================================================= */

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


/* =========================================================
   DETENER
========================================================= */

function detenerJuego() {

    clearInterval(temporizador);
    clearInterval(movimiento);
    clearTimeout(bonificacionTimer);

    temporizador = null;
    movimiento = null;
    bonificacionTimer = null;

}


/* =========================================================
   JUEGO 1
   ATRAPA EL OBJETIVO
========================================================= */

function iniciarJuegoObjetivo() {

    mostrarNivel();

    objetivo.style.display = "block";

    colocarObjetivo();

    iniciarMovimiento();

    programarBonificacion();

    iniciarTemporizador();

}


function iniciarMovimiento() {

    clearInterval(movimiento);

    const velocidad =
        Math.max(
            330,
            1200 - nivel * 75
        );

    movimiento = setInterval(() => {

        if (juegoActivo) {

            colocarObjetivo();

        }

    }, velocidad);

}


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
        Math.max(
            1,
            ancho - margen * 2
        );

    const y =
        margen +
        Math.random() *
        Math.max(
            1,
            alto - margen * 2
        );

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


objetivo.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        if (!juegoActivo) return;

        if (juegoActual !== "objetivo") return;

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

        const ganados =
            10 * combo;

        puntos += ganados;

        combo++;

        if (combo > 10) combo = 10;

        if (combo > mejorCombo) {

            mejorCombo = combo;

        }

        mostrarPuntos(
            x,
            y,
            "+" + ganados
        );

        mostrarCombo();

        comprobarNivel();

        actualizarInterfaz();

        colocarObjetivo();

    }
);


/* =========================================================
   BONIFICACIÓN JUEGO 1
========================================================= */

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

    if (!juegoActivo) return;

    const margen = 60;

    const ancho =
        zonaJuego.clientWidth;

    const alto =
        zonaJuego.clientHeight;

    const x =
        margen +
        Math.random() *
        Math.max(
            1,
            ancho - margen * 2
        );

    const y =
        margen +
        Math.random() *
        Math.max(
            1,
            alto - margen * 2
        );

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


bonificacion.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        if (!juegoActivo) return;

        if (juegoActual !== "objetivo") return;

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

        const bonus =
            50 * combo;

        puntos += bonus;

        sonido(850, 0.18);

        crearExplosion(x, y);

        mostrarPuntos(
            x,
            y,
            "+" + bonus
        );

        bonificacion.style.display =
            "none";

        actualizarInterfaz();

    }
);


/* =========================================================
   FALLAR JUEGO 1
========================================================= */

zonaJuego.addEventListener(
    "click",
    function(event) {

        if (!juegoActivo) return;

        if (juegoActual !== "objetivo") return;

        if (
            event.target === zonaJuego ||
            event.target.classList.contains("instruccion")
        ) {

            combo = 1;

            vidas--;

            sonido(180, 0.12);

            crearFallo(
                event.offsetX,
                event.offsetY
            );

            actualizarInterfaz();

            if (vidas <= 0) {

                terminarJuego();

            }

        }

    }
);


/* =========================================================
   NIVEL
========================================================= */

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


/* =========================================================
   JUEGO 2
   REFLEJOS X
========================================================= */

function iniciarJuegoReflejos() {

    efectos.innerHTML = `
        <button
            id="objetivo-reflejos"
            class="objetivo-reflejos"
            type="button">
            ⚡
        </button>
    `;

    const objetivoReflejos =
        document.getElementById(
            "objetivo-reflejos"
        );

    juegoDatos.reflejos = {
        objetivo: objetivoReflejos,
        espera: false,
        ronda: 0
    };

    objetivoReflejos.addEventListener(
        "click",
        () => {

            if (!juegoActivo) return;

            if (juegoDatos.reflejos.espera) {

                const ganados =
                    25 + combo * 5;

                puntos += ganados;

                combo++;

                if (combo > mejorCombo) {
                    mejorCombo = combo;
                }

                if (combo > 10) combo = 10;

                sonido(850, 0.1);

                mostrarPuntos(
                    zonaJuego.clientWidth / 2,
                    zonaJuego.clientHeight / 2,
                    "+" + ganados
                );

                juegoDatos.reflejos.espera = false;

                siguienteReflejo();

                actualizarInterfaz();

            }

        }
    );

    siguienteReflejo();

    iniciarTemporizador();

}


function siguienteReflejo() {

    if (!juegoActivo) return;

    const boton =
        juegoDatos.reflejos.objetivo;

    boton.style.display = "none";

    juegoDatos.reflejos.espera = false;

    setTimeout(() => {

        if (!juegoActivo) return;

        const margen = 70;

        const x =
            margen +
            Math.random() *
            Math.max(
                1,
                zonaJuego.clientWidth -
                margen * 2
            );

        const y =
            margen +
            Math.random() *
            Math.max(
                1,
                zonaJuego.clientHeight -
                margen * 2
            );

        boton.style.left =
            x + "px";

        boton.style.top =
            y + "px";

        boton.style.display =
            "block";

        juegoDatos.reflejos.espera = true;

    }, 500 + Math.random() * 1000);

}


/* =========================================================
   JUEGO 3
   MEMORIA X
========================================================= */

function iniciarJuegoMemoria() {

    const simbolos = [
        "🔥", "🔥",
        "⭐", "⭐",
        "⚡", "⚡",
        "🎯", "🎯",
        "🚀", "🚀",
        "💎", "💎"
    ];

    simbolos.sort(
        () => Math.random() - 0.5
    );

    efectos.innerHTML = `
        <div class="memoria-grid"></div>
    `;

    const grid =
        efectos.querySelector(
            ".memoria-grid"
        );

    juegoDatos.memoria = {
        primera: null,
        bloqueo: false,
        parejas: 0
    };

    simbolos.forEach(simbolo => {

        const carta =
            document.createElement("button");

        carta.type = "button";

        carta.className =
            "carta-memoria";

        carta.dataset.valor =
            simbolo;

        carta.textContent = "?";

        carta.addEventListener(
            "click",
            () => {

                voltearCarta(carta);

            }
        );

        grid.appendChild(carta);

    });

    iniciarTemporizador();

}


function voltearCarta(carta) {

    if (!juegoActivo) return;

    const datos =
        juegoDatos.memoria;

    if (
        datos.bloqueo ||
        carta.classList.contains("descubierta") ||
        carta === datos.primera
    ) return;

    carta.textContent =
        carta.dataset.valor;

    carta.classList.add(
        "descubierta"
    );

    if (!datos.primera) {

        datos.primera = carta;

        return;

    }

    const segunda = carta;

    if (
        datos.primera.dataset.valor ===
        segunda.dataset.valor
    ) {

        sonido(750, 0.12);

        datos.primera = null;

        datos.parejas++;

        puntos += 50 * combo;

        combo++;

        if (combo > 10) combo = 10;

        if (combo > mejorCombo) {
            mejorCombo = combo;
        }

        actualizarInterfaz();

        if (datos.parejas >= 6) {

            puntos += 100;

            terminarJuego();

        }

    } else {

        sonido(180, 0.12);

        combo = 1;

        vidas--;

        datos.bloqueo = true;

        actualizarInterfaz();

        setTimeout(() => {

            if (!datos.primera || !segunda) return;

            datos.primera.textContent = "?";
            segunda.textContent = "?";

            datos.primera.classList.remove(
                "descubierta"
            );

            segunda.classList.remove(
                "descubierta"
            );

            datos.primera = null;
            datos.bloqueo = false;

            if (vidas <= 0) {

                terminarJuego();

            }

        }, 700);

    }

}


/* =========================================================
   JUEGO 4
   PUZZLE X
========================================================= */

function iniciarJuegoPuzzle() {

    const numero1 =
        Math.floor(Math.random() * 20) + 5;

    const numero2 =
        Math.floor(Math.random() * 15) + 2;

    const respuesta =
        numero1 + numero2;

    juegoDatos.puzzle = {
        respuesta: respuesta
    };

    efectos.innerHTML = `
        <div class="puzzle-juego">

            <h2>🧩 RESUELVE</h2>

            <div class="problema">
                ${numero1} + ${numero2} = ?
            </div>

            <input
                id="respuesta-puzzle"
                type="number"
                placeholder="Respuesta"
                autocomplete="off">

            <button
                id="btn-puzzle"
                type="button">
                COMPROBAR
            </button>

        </div>
    `;

    const input =
        document.getElementById(
            "respuesta-puzzle"
        );

    const boton =
        document.getElementById(
            "btn-puzzle"
        );

    boton.addEventListener(
        "click",
        comprobarPuzzle
    );

    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                comprobarPuzzle();

            }

        }
    );

    input.focus();

    iniciarTemporizador();

}


function comprobarPuzzle() {

    if (!juegoActivo) return;

    const input =
        document.getElementById(
            "respuesta-puzzle"
        );

    const valor =
        Number(input.value);

    if (
        valor ===
        juegoDatos.puzzle.respuesta
    ) {

        sonido(850, 0.12);

        puntos += 75 * combo;

        combo++;

        if (combo > 10) combo = 10;

        if (combo > mejorCombo) {
            mejorCombo = combo;
        }

        mostrarPuntos(
            zonaJuego.clientWidth / 2,
            zonaJuego.clientHeight / 2,
            "¡CORRECTO!"
        );

        actualizarInterfaz();

        crearNuevoPuzzle();

    } else {

        sonido(180, 0.12);

        combo = 1;

        vidas--;

        actualizarInterfaz();

        if (vidas <= 0) {

            terminarJuego();

        }

    }

}


function crearNuevoPuzzle() {

    if (!juegoActivo) return;

    const numero1 =
        Math.floor(Math.random() * 30) + 5;

    const numero2 =
        Math.floor(Math.random() * 20) + 2;

    juegoDatos.puzzle.respuesta =
        numero1 + numero2;

    const problema =
        efectos.querySelector(
            ".problema"
        );

    const input =
        document.getElementById(
            "respuesta-puzzle"
        );

    if (!problema || !input) return;

    problema.textContent =
        `${numero1} + ${numero2} = ?`;

    input.value = "";

    input.focus();

}


/* =========================================================
   JUEGO 5
   CARRERA X
========================================================= */

function iniciarJuegoCarrera() {

    efectos.innerHTML = `
        <div class="carrera-juego">

            <div
                id="jugador-carrera"
                class="jugador-carrera">
                🚀
            </div>

            <div
                id="obstaculo-carrera"
                class="obstaculo-carrera">
                💥
            </div>

            <div class="carrera-instruccion">
                ⬅️ ➡️ USA LAS FLECHAS
            </div>

        </div>
    `;

    juegoDatos.carrera = {
        posicion: 50,
        velocidad: 1
    };

    document.addEventListener(
        "keydown",
        controlarCarrera
    );

    colocarObstaculo();

    iniciarTemporizador();

}


function controlarCarrera(event) {

    if (
        !juegoActivo ||
        juegoActual !== "carrera"
    ) return;

    if (event.key === "ArrowLeft") {

        juegoDatos.carrera.posicion -= 8;

    }

    if (event.key === "ArrowRight") {

        juegoDatos.carrera.posicion += 8;

    }

    juegoDatos.carrera.posicion =
        Math.max(
            8,
            Math.min(
                92,
                juegoDatos.carrera.posicion
            )
        );

    const jugador =
        document.getElementById(
            "jugador-carrera"
        );

    if (jugador) {

        jugador.style.left =
            juegoDatos.carrera.posicion +
            "%";

    }

}


function colocarObstaculo() {

    if (!juegoActivo) return;

    const obstaculo =
        document.getElementById(
            "obstaculo-carrera"
        );

    if (!obstaculo) return;

    obstaculo.style.left =
        (10 + Math.random() * 80) +
        "%";

    obstaculo.style.top =
        "-60px";

    let posicion = -60;

    const intervalo =
        setInterval(() => {

            if (!juegoActivo) {

                clearInterval(intervalo);
                return;

            }

            posicion += 4;

            obstaculo.style.top =
                posicion + "px";

            const jugador =
                document.getElementById(
                    "jugador-carrera"
                );

            const obstaculoX =
                parseFloat(
                    obstaculo.style.left
                );

            const jugadorX =
                juegoDatos.carrera.posicion;

            if (
                posicion > 200 &&
                posicion < 430 &&
                Math.abs(
                    obstaculoX -
                    jugadorX
                ) < 10
            ) {

                clearInterval(intervalo);

                sonido(150, 0.2);

                vidas--;

                combo = 1;

                actualizarInterfaz();

                if (vidas <= 0) {

                    terminarJuego();

                    return;

                }

                colocarObstaculo();

                return;

            }

            if (posicion > 500) {

                clearInterval(intervalo);

                puntos += 20 * combo;

                if (combo < 10) {

                    combo++;

                }

                if (combo > mejorCombo) {

                    mejorCombo = combo;

                }

                actualizarInterfaz();

                colocarObstaculo();

            }

        }, 50);

}


/* =========================================================
   EFECTOS
========================================================= */

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


/* =========================================================
   MEDALLAS
========================================================= */

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


/* =========================================================
   TERMINAR
========================================================= */

function terminarJuego() {

    if (!juegoActivo) return;

    juegoActivo = false;

    detenerJuego();

    document.removeEventListener(
        "keydown",
        controlarCarrera
    );

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


/* =========================================================
   BOTONES
========================================================= */

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


/* =========================================================
   ENTER
========================================================= */

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


/* =========================================================
   INICIO
========================================================= */

actualizarInterfaz();
