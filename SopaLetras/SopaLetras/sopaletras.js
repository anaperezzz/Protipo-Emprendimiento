/* ====== Variables de estado ====== */
let sopa = [];
let nivel = 1;
let segundos = 0;
let cronometro = null;
let puntuacion = 0;
let palabrasEncontradas = [];
let palabrasOcultas = [];
let pistaActiva = false;
let palabraPistaActual = null;   // palabra actualmente sugerida por pista (no cambia hasta encontrarla)
let ultimoAciertoSeg = 0;

const tamanios = { 1: 6, 2: 7, 3: 8 }; // Nivel->tamaño

/* ====== Diccionario de niveles ====== */
const niveles = [
  { // 1: Fácil (6x6)
    palabras: ["RATON","CABLE","TECLA","RED","DATO"],
    pistas: {
      RATON:"🐭 Lo usas para mover el cursor.",
      CABLE:"🔌 Conecta aparatos.",
      TECLA:"⌨️ Sirve para escribir.",
      RED:"🌐 Une computadoras.",
      DATO:"📊 Es información pequeña."
    }
  },
  { // 2: Intermedio (7x7)
    palabras:["ROBOT","LUZ","SONIDO","CHIP","BOTON"],
    pistas:{
      ROBOT:"🤖 Tiene brazos y parece humano.",
      LUZ:"💡 Ilumina la habitación.",
      SONIDO:"🔊 Se oye con los oídos.",
      CHIP:"🧩 Es una pieza muy pequeña.",
      BOTON:"🔘 Se presiona para activar algo."
    }
  },
  { // 3: Difícil (8x8)
    palabras:["TABLET","VIDEO","CLOUD","JUEGO","PIXEL"],
    pistas:{
      TABLET:"📱 Pantalla táctil.",
      VIDEO:"🎬 Se ve y se escucha.",
      CLOUD:"☁️ Guarda cosas en internet.",
      JUEGO:"🎮 Para divertirse.",
      PIXEL:"🟦 Punto de color en la pantalla."
    }
  }
];

/* ====== Utiles DOM ====== */
const el = (id) => document.getElementById(id);
const contSopa = el("sopa-container");
const mensaje = el("mensaje");
const hintBox = el("hint");
const levelMsg = el("levelMsg");
const input = el("input-word");
const searchBtn = el("searchBtn");
const nightBtn = el("nightModeBtn");
const restartBtn = el("restartBtn");
const clickSound = el("clickSound");

/* ====== Audio simple solo en botones ====== */
function playClick(){
  if (!clickSound) return;
  try { clickSound.currentTime = 0; clickSound.play(); } catch(e){}
}

/* ====== Mensajería ====== */
function showMsg(kind, text){
  const map = { ok: "msg--ok", err: "msg--err" };
  mensaje.className = "msg " + (map[kind] || "");
  mensaje.innerHTML = text;
  mensaje.style.display = "block";
  // Ocultar auto (no oculta hint ni level)
  setTimeout(() => { mensaje.style.display = "none"; }, 3500);
}

function showHint(text){
  hintBox.innerHTML = text;
  hintBox.style.display = "block";
}

function hideHint(){
  hintBox.style.display = "none";
}
// ==== Auto-scroll hacia los mensajes dentro del contenedor ====
function scrollToMessages() {
  const box = document.getElementById("gameBox");
  box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
}

// Modifica las funciones que muestran mensajes para incluir scroll:
function showMsg(kind, text){
  const map = { ok: "msg--ok", err: "msg--err" };
  const m = document.getElementById("mensaje");
  m.className = "msg " + (map[kind] || "");
  m.innerHTML = text;
  m.style.display = "block";
  scrollToMessages();
  setTimeout(()=>m.style.display="none",4000);
}

function showHint(text){
  const h = document.getElementById("hint");
  h.innerHTML = text;
  h.style.display = "block";
  scrollToMessages();
}

/* ====== Tablero ====== */
function generarSopa() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const N = tamanios[nivel] || 6;

  // Seguimos regenerando hasta colocar TODAS las palabras sin conflicto.
  // Esto garantiza que las pistas SIEMPRE sean de palabras realmente colocadas.
  let success = false;
  while(!success){
    // matriz vacía con null
    sopa = Array.from({length:N}, () => Array.from({length:N}, () => null));
    palabrasOcultas = [...niveles[nivel-1].palabras];
    success = colocarTodasLasPalabras(sopa, palabrasOcultas);
  }

  // Rellenar huecos con letras aleatorias
  for (let i=0;i<N;i++){
    for (let j=0;j<N;j++){
      if (sopa[i][j] === null){
        sopa[i][j] = letras.charAt(Math.floor(Math.random()*letras.length));
      }
    }
  }
  renderSopa();
  actualizarNivel();
}

function colocarTodasLasPalabras(grid, palabras){
  const N = grid.length;
  for (const p of palabras){
    let colocada = false;
    for (let intento=0; intento<200 && !colocada; intento++){
      const horizontal = Math.random() > 0.5;
      const fila = Math.floor(Math.random()*N);
      const col  = Math.floor(Math.random()*N);
      if (horizontal){
        if (col + p.length <= N && puedeColocarHorizontal(grid, fila, col, p)){
          for (let k=0;k<p.length;k++){ grid[fila][col+k] = p[k]; }
          colocada = true;
        }
      } else {
        if (fila + p.length <= N && puedeColocarVertical(grid, fila, col, p)){
          for (let k=0;k<p.length;k++){ grid[fila+k][col] = p[k]; }
          colocada = true;
        }
      }
    }
    if (!colocada) return false; // falla → regenerar todo
  }
  return true;
}

function puedeColocarHorizontal(grid, fila, col, palabra){
  for (let k=0;k<palabra.length;k++){
    const c = grid[fila][col+k];
    if (c !== null && c !== palabra[k]) return false;
  }
  return true;
}
function puedeColocarVertical(grid, fila, col, palabra){
  for (let k=0;k<palabra.length;k++){
    const c = grid[fila+k][col];
    if (c !== null && c !== palabra[k]) return false;
  }
  return true;
}

function renderSopa(){
  contSopa.innerHTML = "";
  for (let i=0;i<sopa.length;i++){
    const tr = document.createElement("tr");
    for (let j=0;j<sopa[i].length;j++){
      const td = document.createElement("td");
      td.textContent = sopa[i][j];
      tr.appendChild(td);
    }
    contSopa.appendChild(tr);
  }
}

/* ====== Búsqueda y marcado ====== */
function buscarPalabra(){
  const palabra = input.value.toUpperCase().trim();
  input.value = "";
  if (!palabra) return showMsg("err","Escribe una palabra 🦖");
  if (!palabrasOcultas.includes(palabra)) return showMsg("err","No está en la lista del nivel.");
  if (palabrasEncontradas.includes(palabra)) return showMsg("err","Ya la encontraste.");

  if (marcarSiExiste(palabra)){
    palabrasEncontradas.push(palabra);
    puntuacion += palabra.length * 10;
    actualizarDatos();
    showMsg("ok", `🎉 ¡Muy bien! Encontraste <b>${palabra}</b>`);
    // si la pista estaba activa y corresponde a esta palabra → limpiar y reiniciar ventana de 60s
    if (pistaActiva && palabraPistaActual === palabra){
      pistaActiva = false;
      palabraPistaActual = null;
      hideHint();
    }
    ultimoAciertoSeg = segundos;

    // ¿Nivel completado?
    if (palabrasEncontradas.length === palabrasOcultas.length){
      siguienteNivel();
    }
  } else {
    showMsg("err","No se encontró en la sopa.");
  }
}

function marcarSiExiste(p){
  const filas = document.querySelectorAll("#sopa-container tr");
  // Horizontal
  for (let i=0;i<sopa.length;i++){
    const row = sopa[i].join("");
    const idx = row.indexOf(p);
    if (idx !== -1){
      for (let j=0;j<p.length;j++){
        filas[i].children[idx+j].classList.add("found-word");
      }
      return true;
    }
  }
  // Vertical
  for (let j=0;j<sopa.length;j++){
    let col = "";
    for (let i=0;i<sopa.length;i++) col += sopa[i][j];
    const idx = col.indexOf(p);
    if (idx !== -1){
      for (let k=0;k<p.length;k++){
        filas[idx+k].children[j].classList.add("found-word");
      }
      return true;
    }
  }
  return false;
}

/* ====== UI de estado ====== */
function actualizarDatos(){
  el("puntuacion").textContent = puntuacion;
  el("palabras").textContent = palabrasEncontradas.length;
}
function actualizarNivel(){ el("nivel").textContent = nivel; }

/* ====== Tiempo + Pistas (60s sin acierto) ====== */
function iniciarCronometro(){
  clearInterval(cronometro);
  cronometro = setInterval(()=>{
    segundos++;
    const m = Math.floor(segundos/60), s = segundos%60;
    el("timer").textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    // Si NO hay pista activa y pasaron 60s desde el último acierto → mostrar pista
    if (!pistaActiva && (segundos - ultimoAciertoSeg) >= 60){
      const pendiente = palabrasOcultas.filter(p => !palabrasEncontradas.includes(p));
      if (pendiente.length > 0){
        palabraPistaActual = pendiente[Math.floor(Math.random()*pendiente.length)];
        const txt = niveles[nivel-1].pistas[palabraPistaActual] || "Busca una palabra pendiente.";
        showHint(`💡 ${txt}`);
        pistaActiva = true; // queda fija hasta encontrar esa palabra
      }
    }
  },1000);
}

/* ====== Flujo de niveles ====== */
function siguienteNivel(){
  clearInterval(cronometro);
  levelMsg.innerHTML = "🌟 ¡Nivel completado! Preparando el siguiente...";
  levelMsg.style.display = "block";
  setTimeout(()=>{
    levelMsg.style.display = "none";
    if (nivel < 3){
      nivel++;
      iniciarJuego(/*preserva puntos*/ true);
    } else {
      finalizarJuego();
    }
  }, 1500);
}

function finalizarJuego(){
  clearInterval(cronometro);
  contSopa.innerHTML = "";
  levelMsg.innerHTML = `🎊 ¡Excelente trabajo! Has completado los 3 niveles.<br>
  🕐 Tiempo total: <b>${el("timer").textContent}</b><br>
  💯 Puntos: <b>${puntuacion}</b>`;
  levelMsg.style.display = "block";
}

/* ====== Inicio / Reinicio ====== */
function iniciarJuego(preservarPuntos = false){
  const N = tamanios[nivel] || 6;
  segundos = 0;
  if (!preservarPuntos) puntuacion = 0;
  palabrasEncontradas = [];
  pistaActiva = false;
  palabraPistaActual = null;
  ultimoAciertoSeg = 0;
  hideHint();
  mensaje.style.display = "none";
  levelMsg.style.display = "none";

  generarSopa(N);
  iniciarCronometro();
  actualizarDatos();
}

/* ====== Listeners ====== */
searchBtn.addEventListener("click", () => { playClick(); buscarPalabra(); });
input.addEventListener("keydown",(e)=>{ if (e.key === "Enter"){ buscarPalabra(); }});

nightBtn.addEventListener("click", () => {
  playClick();
  document.body.classList.toggle("night-mode");
  nightBtn.innerHTML = document.body.classList.contains("night-mode") ?
    '<i class="fas fa-sun"></i> Modo Día' :
    '<i class="fas fa-moon"></i> Modo Noche';
});

restartBtn.addEventListener("click", () => {
  playClick();
  nivel = 1;
  iniciarJuego(false);
});

/* ====== Boot ====== */
document.addEventListener("DOMContentLoaded", () => {
  iniciarJuego(false);
});
