/* =====================================================
   FUEGO X 3.0
   ARENA ARCADE
   5 JUEGOS FUNCIONALES
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
   CONFIGURACIÓN
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
let retoTimer = null;

let estadoReto = null;

let record = 0;


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

    } catch (error) {}

}


/* =====================================================
   RÉCORD
===================================================== */

function cargarRecord() {

    record =
        Number(
            localStorage.getItem(
                "fuegoXRecord_" + juegoActual
            )
        ) || 0;

    recordTexto.textContent = record;

}


/* =====================================================
   SELECCIÓN DE JUEGO
===================================================== */

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

    juegoActual = tipo;

    const juego = juegos[tipo];

    juegoActivo = false;

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

    reglasInicio.innerHTML = obtenerReglas(tipo);

    cargarRecord();

    menuArcade.classList.add("oculto");

    panelJuego.classList.remove("oculto");

    pantallaFinal.classList.add("oculto");

    pantallaInicio.classList.remove("oculto");

}


function obtenerReglas(tipo) {

    if (tipo === "objetivo") {

        return `
            <div>🎯 <b>ACERTA</b> los objetivos</div>
            <div>🔥 <b>CREA COMBOS</b> para multiplicar puntos</div>
            <div>⭐ <b>CAPTURA BONIFICACIONES</b></div>
            <div>🏆 <b>SUPERA TU RÉCORD</b></div>
        `;

    }

    if (tipo === "reflejos") {

        return `
            <div>⚡ <b>ESPERA</b> la señal</div>
            <div>🎯 <b>REACCIONA</b> rápidamente</div>
            <div>🔥 <b>CONSIGUE</b> combos</div>
            <div>🏆 <b>SUPERA</b> tu récord</div>
        `;

    }

    if (tipo === "memoria") {

        return `
            <div>🧠 <b>OBSERVA</b> la secuencia</div>
            <div>🔢 <b>RECUERDA</b> los números</div>
            <div>🎯 <b>ELIGE</b> correctamente</div>
            <div>🏆 <b>SUPERA</b> tu récord</div>
        `;

    }

    if (tipo === "puzzle") {

        return `
            <div>🧩 <b>RESUELVE</b> el reto</div>
            <div>⚡ <b>PIENSA</b> rápidamente</div>
            <div>🔥 <b>SUMA</b> puntos</div>
            <div>🏆 <b>SUPERA</b> tu récord</div>
        `;

    }

    return `
        <div>🚀 <b>CONTROLA</b> tu nave</div>
        <div>💥 <b>EVITA</b> obstáculos</div>
        <div>🔥 <b>SOBREVIVE</b> el mayor tiempo</div>
        <div>🏆 <b>SUPERA</b> tu récord</div>
    `;

}


/* =====================================================
   MENÚ
===================================================== */

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
   INTERFAZ
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

    barra.style.width =
        Math.max(
            0,
            (tiempo / 30) * 100
        ) + "%";

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

    efectos.innerHTML = "";

    objetivo.style.display = "none";
    bonificacion.style.display = "none";

    if (juegoActual === "objetivo") {

        iniciarObjetivo();

    }

    if (juegoActual === "reflejos") {

        iniciarReflejos();

    }

    if (juegoActual === "memoria") {

        iniciarMemoria();

    }

    if (juegoActual === "puzzle") {

        iniciarPuzzle();

    }

    if (juegoActual === "carrera") {

        iniciarCarrera();

    }

    iniciarTemporizador();

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
    clearTimeout(retoTimer);

    temporizador = null;
    movimiento = null;
    bonificacionTimer = null;
    retoTimer = null;

}


/* =====================================================
   JUEGO 1
   ATRAPA EL OBJETIVO
===================================================== */

function iniciarObjetivo() {

    mostrarNivel();

    colocarObjetivo();

    iniciarMovimiento();

    programarBonificacion();

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

        if (
            !juegoActivo ||
            juegoActual !== "objetivo"
        ) return;

        sonido(
            500 + combo * 35
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

        const ganados =
            10 * combo;

        puntos += ganados;

        combo =
            Math.min(
                10,
                combo + 1
            );

        mejorCombo =
            Math.max(
                mejorCombo,
                combo
            );

        crearExplosion(x, y);

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


/* =====================================================
   BONIFICACIÓN
===================================================== */

function programarBonificacion() {

    bonificacionTimer =
        setTimeout(() => {

            if (
                !juegoActivo ||
                juegoActual !== "objetivo"
            ) return;

            colocarBonificacion();

            programarBonificacion();

        }, 4500 + Math.random() * 3500);

}


function colocarBonificacion() {

    const margen = 60;

    const ancho =
        zonaJuego.clientWidth;

    const alto =
        zonaJuego.clientHeight;

    bonificacion.style.left =
        (
            margen +
            Math.random() *
            Math.max(
                1,
                ancho - margen * 2
            )
        ) + "px";

    bonificacion.style.top =
        (
            margen +
            Math.random() *
            Math.max(
                1,
                alto - margen * 2
            )
        ) + "px";

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

        if (
            !juegoActivo ||
            juegoActual !== "objetivo"
        ) return;

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

        const ganados =
            50 * combo;

        puntos += ganados;

        sonido(900, 0.15);

        crearExplosion(x, y);

        mostrarPuntos(
            x,
            y,
            "+" + ganados
        );

        bonificacion.style.display =
            "none";

        actualizarInterfaz();

    }
);


/* =====================================================
   CLIC ZONA
===================================================== */

zonaJuego.addEventListener(
    "click",
    function(event) {

        if (!juegoActivo) return;

        if (
            juegoActual === "objetivo" &&
            (
                event.target === zonaJuego ||
                event.target.classList.contains(
                    "instruccion"
                )
            )
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


/* =====================================================
   JUEGO 2
   REFLEJOS X
===================================================== */

function iniciarReflejos() {

    mostrarMensajeCentral(
        "⚡",
        "ESPERA...",
        "Cuando aparezca VERDE, toca"
    );

    retoTimer =
        setTimeout(
            activarReflejo,
            1500 + Math.random() * 2500
        );

}


function activarReflejo() {

    if (
        !juegoActivo ||
        juegoActual !== "reflejos"
    ) return;

    estadoReto = "activo";

    mostrarMensajeCentral(
        "🟢",
        "¡AHORA!",
        "¡TOCA!"
    );

    sonido(900, 0.12);

    zonaJuego.onclick =
        reaccionReflejo;

}


function reaccionReflejo() {

    if (
        !juegoActivo ||
        juegoActual !== "reflejos"
    ) return;

    if (estadoReto !== "activo") return;

    puntos += 25 * combo;

    combo =
        Math.min(
            10,
            combo + 1
        );

    mejorCombo =
        Math.max(
            mejorCombo,
            combo
        );

    sonido(1000, 0.1);

    mostrarPuntos(
        zonaJuego.clientWidth / 2,
        zonaJuego.clientHeight / 2,
        "+" + (25 * (combo - 1))
    );

    estadoReto = null;

    zonaJuego.onclick = null;

    actualizarInterfaz();

    retoTimer =
        setTimeout(
            activarReflejo,
            700 + Math.random() * 1800
        );

}


/* =====================================================
   JUEGO 3
   MEMORIA X
===================================================== */

let secuencia = [];
let respuestaMemoria = [];


function iniciarMemoria() {

    secuencia = [];

    respuestaMemoria = [];

    generarMemoria();

}


function generarMemoria() {

    secuencia = [];

    for (
        let i = 0;
        i < 3 + nivel;
        i++
    ) {

        secuencia.push(
            Math.floor(
                Math.random() * 9
            ) + 1
        );

    }

    mostrarSecuencia();

}


function mostrarSecuencia() {

    mostrarMensajeCentral(
        "🧠",
        secuencia.join("  "),
        "MEMORIZA LA SECUENCIA"
    );

    retoTimer =
        setTimeout(
            pedirMemoria,
            2500
        );

}


function pedirMemoria() {

    if (
        !juegoActivo ||
        juegoActual !== "memoria"
    ) return;

    mostrarMensajeCentral(
        "🧠",
        "¿CUÁL ERA?",
        "Escribe los números con el teclado"
    );

    estadoReto = "";

}


document.addEventListener(
    "keydown",
    function(event) {

        if (
            !juegoActivo ||
            juegoActual !== "memoria"
        ) return;

        if (
            !/^[1-9]$/.test(event.key)
        ) return;

        estadoReto += event.key;

        mostrarMensajeCentral(
            "🧠",
            estadoReto,
            "ENTER PARA COMPROBAR"
        );

        if (event.key === "Enter") {

            comprobarMemoria();

        }

    }
);


function comprobarMemoria() {

    if (!estadoReto) return;

    const correcta =
        estadoReto ===
        secuencia.join("");

    if (correcta) {

        puntos += 50 * combo;

        combo =
            Math.min(
                10,
                combo + 1
            );

        mejorCombo =
            Math.max(
                mejorCombo,
                combo
            );

        sonido(1000, 0.15);

        mostrarMensajeCentral(
            "✅",
            "¡CORRECTO!",
            "+ PUNTOS"
        );

        actualizarInterfaz();

    } else {

        vidas--;

        combo = 1;

        sonido(180, 0.15);

        mostrarMensajeCentral(
            "❌",
            "INCORRECTO",
            "La secuencia era " +
            secuencia.join("")
        );

        actualizarInterfaz();

        if (vidas <= 0) {

            terminarJuego();

            return;

        }

    }

    estadoReto = "";

    retoTimer =
        setTimeout(
            generarMemoria,
            1200
        );

}


/* =====================================================
   JUEGO 4
   PUZZLE X
===================================================== */

let respuestaPuzzle = 0;


function iniciarPuzzle() {

    nuevoPuzzle();

}


function nuevoPuzzle() {

    const a =
        Math.floor(
            Math.random() * 10
        ) + 1;

    const b =
        Math.floor(
            Math.random() * 10
        ) + 1;

    respuestaPuzzle =
        a + b;

    mostrarMensajeCentral(
        "🧩",
        a + " + " + b + " = ?",
        "Escribe la respuesta y presiona ENTER"
    );

    estadoReto = "";

}


document.addEventListener(
    "keydown",
    function(event) {

        if (
            !juegoActivo ||
            juegoActual !== "puzzle"
        ) return;

        if (
            event.key >= "0" &&
            event.key <= "9"
        ) {

            estadoReto += event.key;

            mostrarMensajeCentral(
                "🧩",
                estadoReto,
                "ENTER PARA COMPROBAR"
            );

        }

        if (
            event.key === "Enter" &&
            estadoReto !== ""
        ) {

            const respuesta =
                Number(estadoReto);

            if (
                respuesta === respuestaPuzzle
            ) {

                puntos += 40 * combo;

                combo =
                    Math.min(
                        10,
                        combo + 1
                    );

                mejorCombo =
                    Math.max(
                        mejorCombo,
                        combo
                    );

                sonido(1000, 0.1);

                mostrarMensajeCentral(
                    "✅",
                    "¡CORRECTO!",
                    "+ PUNTOS"
                );

                actualizarInterfaz();

                setTimeout(
                    nuevoPuzzle,
                    800
                );

            } else {

                vidas--;

                combo = 1;

                sonido(180, 0.12);

                mostrarMensajeCentral(
                    "❌",
                    "¡ERROR!",
                    "Inténtalo de nuevo"
                );

                actualizarInterfaz();

                if (vidas <= 0) {

                    terminarJuego();

                }

            }

            estadoReto = "";

        }

    }
);


/* =====================================================
   JUEGO 5
   CARRERA X
===================================================== */

let jugador;
let obstaculos = [];
let carreraTimer = null;


function iniciarCarrera() {

    crearCarrera();

}


function crearCarrera() {

    jugador = {
        x: 50,
        y: zonaJuego.clientHeight / 2
    };

    obstaculos = [];

    efectos.innerHTML = `
        <div
            id="jugador-carrera"
            style="
                position:absolute;
                font-size:42px;
                left:50px;
                top:50%;
                transform:translate(-50%,-50%);
                z-index:30;
            "
        >🚀</div>
    `;

    crearObstaculoCarrera();

    carreraTimer =
        setInterval(
            moverCarrera,
            45
        );

}


function crearObstaculoCarrera() {

    if (
        !juegoActivo ||
        juegoActual !== "carrera"
    ) return;

    const obstaculo =
        document.createElement("div");

    obstaculo.textContent = "🔥";

    obstaculo.style.position =
        "absolute";

    obstaculo.style.fontSize =
        "35px";

    obstaculo.style.left =
        zonaJuego.clientWidth + "px";

    obstaculo.style.top =
        (
            80 +
            Math.random() *
            Math.max(
                30,
                zonaJuego.clientHeight - 160
            )
        ) + "px";

    obstaculo.dataset.x =
        zonaJuego.clientWidth;

    efectos.appendChild(
        obstaculo
    );

    obstaculos.push(
        obstaculo
    );

    setTimeout(
        crearObstaculoCarrera,
        Math.max(
            500,
            1300 - nivel * 80
        )
    );

}


function moverCarrera() {

    if (
        !juegoActivo ||
        juegoActual !== "carrera"
    ) return;

    const nave =
        document.getElementById(
            "jugador-carrera"
        );

    if (!nave) return;

    obstaculos.forEach(
        obstaculo => {

            let x =
                Number(
                    obstaculo.dataset.x
                );

            x -=
                6 + nivel * 0.5;

            obstaculo.dataset.x =
                x;

            obstaculo.style.left =
                x + "px";

            if (x < -60) {

                obstaculo.remove();

                puntos += 5;

                actualizarInterfaz();

            }

            const naveRect =
                nave.getBoundingClientRect();

            const obstaculoRect =
                obstaculo.getBoundingClientRect();

            if (
                naveRect.left <
                obstaculoRect.right &&
                naveRect.right >
                obstaculoRect.left &&
                naveRect.top <
                obstaculoRect.bottom &&
                naveRect.bottom >
                obstaculoRect.top
            ) {

                obstaculo.remove();

                vidas--;

                combo = 1;

                sonido(150, 0.2);

                actualizarInterfaz();

                if (vidas <= 0) {

                    terminarJuego();

                }

            }

        }
    );

}


/* =====================================================
   CONTROL DE CARRERA
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !juegoActivo ||
            juegoActual !== "carrera"
        ) return;

        if (
            event.key === "ArrowUp" ||
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            const nave =
                document.getElementById(
                    "jugador-carrera"
                );

            if (!nave) return;

            let top =
                parseFloat(
                    nave.style.top
                );

            if (
                event.key === "ArrowUp"
            ) {

                top -= 45;

            } else {

                top += 45;

            }

            top =
                Math.max(
                    70,
                    Math.min(
                        zonaJuego.clientHeight - 70,
                        top
                    )
                );

            nave.style.top =
                top + "px";

        }

    }
);


/* =====================================================
   MENSAJE CENTRAL
===================================================== */

function mostrarMensajeCentral(
    icono,
    titulo,
    texto
) {

    efectos.innerHTML = `

        <div
            style="
                position:absolute;
                inset:0;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                text-align:center;
                z-index:40;
                pointer-events:none;
            "
        >

            <div
                style="
                    font-size:60px;
                    margin-bottom:15px;
                "
            >
                ${icono}
            </div>

            <div
                style="
                    font-size:30px;
                    font-weight:900;
                    color:#fff;
                    text-shadow:0 0 20px orange;
                "
            >
                ${titulo}
            </div>

            <div
                style="
                    margin-top:10px;
                    color:#aaa;
                    font-size:14px;
                "
            >
                ${texto}
            </div>

        </div>

    `;

}


/* =====================================================
   NIVEL
===================================================== */

function comprobarNivel() {

    const nuevoNivel =
        Math.floor(
            puntos / 100
        ) + 1;

    if (
        nuevoNivel > nivel
    ) {

        nivel =
            nuevoNivel;

        sonido(700, 0.15);

        mostrarNivel();

        if (
            juegoActual === "objetivo"
        ) {

            iniciarMovimiento();

        }

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
                opacity: .7,
                transform:
                    "translateX(-50%) scale(1)"
            }
        ],
        {
            duration:700
        }
    );

}


/* =====================================================
   COMBO
===================================================== */

function mostrarCombo() {

    if (
        combo <= 1
    ) return;

    mensajeCombo.textContent =
        "🔥 COMBO x" + combo;

    mensajeCombo.animate(
        [
            {
                opacity:0,
                transform:
                    "translateX(-50%) scale(.6)"
            },
            {
                opacity:1,
                transform:
                    "translateX(-50%) scale(1.2)"
            },
            {
                opacity:0,
                transform:
                    "translateX(-50%) scale(1)"
            }
        ],
        {
            duration:600
        }
    );

}


/* =====================================================
   EFECTOS
===================================================== */

function crearExplosion(x,y) {

    const efecto =
        document.createElement(
            "div"
        );

    efecto.className =
        "explosion";

    efecto.style.left =
        x + "px";

    efecto.style.top =
        y + "px";

    efectos.appendChild(
        efecto
    );

    setTimeout(
        () => efecto.remove(),
        500
    );

}


function mostrarPuntos(
    x,
    y,
    texto
) {

    const elemento =
        document.createElement(
            "div"
        );

    elemento.className =
        "texto-puntos";

    elemento.textContent =
        texto;

    elemento.style.left =
        x + "px";

    elemento.style.top =
        y + "px";

    efectos.appendChild(
        elemento
    );

    setTimeout(
        () => elemento.remove(),
        750
    );

}


function crearFallo(
    x,
    y
) {

    const fallo =
        document.createElement(
            "div"
        );

    fallo.className =
        "fallo";

    fallo.textContent =
        "✕";

    fallo.style.left =
        x + "px";

    fallo.style.top =
        y + "px";

    efectos.appendChild(
        fallo
    );

    setTimeout(
        () => fallo.remove(),
        450
    );

}


/* =====================================================
   MEDALLAS
===================================================== */

function obtenerMedalla() {

    if (
        puntos >= 500
    ) {

        return {
            texto:"🔥 FUEGO",
            icono:"🔥"
        };

    }

    if (
        puntos >= 300
    ) {

        return {
            texto:"🥇 ORO",
            icono:"🥇"
        };

    }

    if (
        puntos >= 150
    ) {

        return {
            texto:"🥈 PLATA",
            icono:"🥈"
        };

    }

    return {
        texto:"🥉 BRONCE",
        icono:"🥉"
    };

}


/* =====================================================
   TERMINAR
===================================================== */

function terminarJuego() {

    if (
        !juegoActivo
    ) return;

    juegoActivo =
        false;

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

    if (
        puntos > record
    ) {

        record =
            puntos;

        localStorage.setItem(
            "fuegoXRecord_" +
            juegoActual,
            record
        );

        recordTexto.textContent =
            record;

        mensajeFinal.textContent =
            "🏆 ¡NUEVO RÉCORD!";

    } else {

        mensajeFinal.textContent =
            "🔥 ¡Inténtalo nuevamente!";

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

cargarRecord();

actualizarInterfaz();
