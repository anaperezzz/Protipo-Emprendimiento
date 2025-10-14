/* 🦖 Adivina con Rex - Script mejorado por Ana 2025 */

// 🎉 Versión drop-in: compatible con tu juego actual
const questions = [
  { question: "🧮 ¿Cuánto es 3 + 2?", options: [" 4", " 5", " 6"], answer: "5" },
  { question: "🔢 ¿Qué número sigue después del 6?", options: [" 7", " 8", " 9"], answer: " 7" },
  { question: "🏁 ¿Cuál va primero en una secuencia?", options: ["🚪 Inicio", "⚖️ Medio", "🏁 Final"], answer: "🚪 Inicio" },
  { question: "🍎 Si tienes 2 manzanas y comes 1, ¿cuántas te quedan?", options: [" 1", "2", " 3"], answer: " 1" },
  { question: "🐘 ¿Cuál es mayor?", options: [" 5", " 3", " 1"], answer: " 5" },
  { question: "🧼 ¿Qué viene después de lavarse las manos?", options: ["🏃 Correr", "🍽️ Comer", "😴 Dormir"], answer: "🍽️ Comer" },
  { question: "🧩 ¿Qué número falta? 1, 2, __, 4", options: ["3", " 5", "6"], answer: " 3" },
  { question: "🟦 ¿Cuántos lados tiene un cuadrado?", options: [" 3", " 4", " 5"], answer: " 4" },
  { question: "🍬 Si tenías 5 dulces y te dan 2 más, ahora tienes…", options: [" 6", " 7", " 8"], answer: " 7" },
  { question: "🔢 Completa: 2, 4, __, 8", options: [" 5", " 6", " 7"], answer: " 6" },
  { question: "🔺 ¿Cuántos lados tiene un triángulo?", options: [" 2", " 3", " 4"], answer: " 3" },
  { question: "⚖️ ¿Cuál es menor?", options: [" 9", " 6", " 2"], answer: " 2" },
  { question: "🧮 ¿Cuánto es 10 − 7?", options: [" 2", " 3", " 4"], answer: " 3" },
  { question: "🟣 ¿Qué forma tiene una pelota?", options: ["⬛ Cuadrada", "🟠 Redonda", "🔺 Triangular"], answer: "🟠 Redonda" }
];

let current = 0, score = 0, locked = false;

// DOM
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');
const resultText = document.getElementById('resultText');
const nextBtn = document.getElementById('nextBtn');
const gameArea = document.getElementById('gameArea');
const endScreen = document.getElementById('endScreen');
const scoreText = document.getElementById('scoreText');

// Audios
const clickSound = document.getElementById('clickSound');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const rexAudio = document.getElementById('rexAudio');

// === FUNCIONES ===
function playSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function showQuestion() {
  const q = questions[current];
  locked = false;
  questionText.textContent = `Pregunta ${current + 1}:\n${q.question}`;
  resultText.textContent = "";
  nextBtn.disabled = true;
  answersContainer.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, btn);
    answersContainer.appendChild(btn);
  });
}

function checkAnswer(selected, btn) {
  if (locked) return;
  locked = true;
  playSound(clickSound);

  const correct = questions[current].answer;
  const allBtns = document.querySelectorAll(".answer-btn");
  allBtns.forEach(b => b.disabled = true);

  if (selected === correct) {
    resultText.textContent = "✅ ¡Correcto!";
    resultText.style.color = "#4CAF50";
    btn.style.background = "#4CAF50";
    btn.style.color = "#fff";
    playSound(correctSound);
    animate(btn, "bounce");
    score++;
  } else {
    resultText.textContent = `❌ Incorrecto. La respuesta era "${correct}".`;
    resultText.style.color = "#FF5252";
    btn.style.background = "#FF5252";
    btn.style.color = "#fff";
    playSound(wrongSound);
    animate(btn, "shake");
  }

  nextBtn.disabled = false;
  nextBtn.style.opacity = "1";
}

function animate(element, type) {
  element.style.animation = type === "shake" ? "shakeAnim 0.4s" : "bounceAnim 0.5s";
  setTimeout(() => element.style.animation = "", 600);
}

function nextQuestion() {
  playSound(clickSound);
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else {
    showEndScreen();
  }
}

function showEndScreen() {
  gameArea.style.display = "none";
  endScreen.style.display = "block";
  scoreText.textContent = `Obtuviste ${score} de ${questions.length} puntos 🎉`;
}

// === BOTONES ===
document.getElementById("speakBtn").addEventListener("click", () => {
  playSound(clickSound);
  rexAudio.currentTime = 0;
  rexAudio.play().catch(() => {});
});

document.getElementById("nightModeBtn").addEventListener("click", () => {
  playSound(clickSound);
  document.body.classList.toggle("night-mode");
  const btn = document.getElementById("nightModeBtn");
  btn.innerHTML = document.body.classList.contains("night-mode")
    ? '<i class="fas fa-sun"></i> Modo Día'
    : '<i class="fas fa-moon"></i> Modo Noche';
});

// === ANIMACIONES EXTRA ===
const style = document.createElement("style");
style.innerHTML = `
@keyframes shakeAnim {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
@keyframes bounceAnim {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}`;
document.head.appendChild(style);

// Iniciar
showQuestion();
