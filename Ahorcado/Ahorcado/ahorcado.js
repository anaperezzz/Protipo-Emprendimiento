const terms = [
  { word: "GATO", description: "Animal que dice miau." },
  { word: "SOL", description: "Lo ves en el cielo y da calor." },
  { word: "PELOTA", description: "Objeto redondo para jugar." },
  { word: "ARBOL", description: "Tiene hojas y vive en el parque." },
  { word: "CASA", description: "Lugar donde vive una familia." },
  { word: "LUNA", description: "Brilla en la noche en el cielo." },
  { word: "SILLA", description: "Objeto para sentarse." },
  { word: "MANO", description: "Parte del cuerpo que tiene dedos." },
  { word: "LIBRO", description: "Tiene hojas y letras para leer." },
  { word: "NUBE", description: "Está en el cielo y es blanca o gris." },
  { word: "ROJO", description: "Color como una manzana." },
  { word: "AZUL", description: "Color del cielo sin nubes." },
  { word: "CAMA", description: "Se usa para dormir." },
  { word: "RANA", description: "Animal verde que salta." },
  { word: "TREN", description: "Vehículo que va por rieles." }
];

let currentWordIndex = 0;
let correctGuesses = [];
let incorrectGuesses = 0;
let maxGuesses = 6;

function initGame() {
  const term = terms[Math.floor(Math.random() * terms.length)];
  document.getElementById('descripcion').textContent = term.description;
  currentWordIndex = terms.indexOf(term);
  correctGuesses = [];
  incorrectGuesses = 0;
  document.getElementById('word').innerHTML = '_ '.repeat(term.word.length).trim();
  document.getElementById('keyboard').innerHTML = '';
  drawBaseAndRope();

  document.getElementById('completionMessageContainer').style.display = 'none';
  document.getElementById('allTermsCompletedContainer').style.display = 'none';
  document.getElementById('hangmanCanvas').style.display = 'block';
  document.getElementById('keyboard').style.display = 'block';

  for (let i = 65; i <= 90; i++) {
    const key = document.createElement('div');
    key.textContent = String.fromCharCode(i);
    key.classList.add('key');
    key.addEventListener('click', () => handleGuess(key));
    document.getElementById('keyboard').appendChild(key);
  }
}

function handleGuess(key) {
  const letter = key.textContent;
  const term = terms[currentWordIndex].word;
  if (term.includes(letter)) {
    correctGuesses.push(letter);
    updateWord();
  } else {
    incorrectGuesses++;
    drawHangman();
  }
  key.classList.add('disabled');
  key.onclick = null;
  checkGameOver();
}

function updateWord() {
  const term = terms[currentWordIndex].word;
  let displayWord = '';
  for (const letter of term) {
    displayWord += correctGuesses.includes(letter) ? letter : '_';
    displayWord += ' ';
  }
  document.getElementById('word').textContent = displayWord.trim();
}

function drawBaseAndRope() {
  const canvas = document.getElementById('hangmanCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo claro del canvas
  ctx.fillStyle = '#d1d1a7ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Base
  ctx.strokeStyle = '#483514ff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(10, 180); ctx.lineTo(150, 180);
  ctx.moveTo(50, 180); ctx.lineTo(50, 20);
  ctx.lineTo(120, 20); ctx.lineTo(120, 40);
  ctx.stroke();
}

function drawHangman() {
  const canvas = document.getElementById('hangmanCanvas');
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000000ff'; // Rojo amigable
  ctx.fillStyle = '#FFCDD2';

  const stages = [
    // Cabeza
    () => {
      ctx.beginPath();
      ctx.arc(120, 55, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
    // Cuerpo
    () => {
      ctx.beginPath();
      ctx.moveTo(120, 70);
      ctx.lineTo(120, 120);
      ctx.stroke();
    },
    // Brazo izquierdo
    () => {
      ctx.beginPath();
      ctx.moveTo(120, 85);
      ctx.lineTo(100, 105);
      ctx.stroke();
    },
    // Brazo derecho
    () => {
      ctx.beginPath();
      ctx.moveTo(120, 85);
      ctx.lineTo(140, 105);
      ctx.stroke();
    },
    // Pierna izquierda
    () => {
      ctx.beginPath();
      ctx.moveTo(120, 120);
      ctx.lineTo(100, 150);
      ctx.stroke();
    },
    // Pierna derecha + cara triste
    () => {
      ctx.beginPath();
      ctx.moveTo(120, 120);
      ctx.lineTo(140, 150);
      ctx.stroke();

      // Ojos X
      ctx.strokeStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(113, 50); ctx.lineTo(117, 54);
      ctx.moveTo(117, 50); ctx.lineTo(113, 54);
      ctx.moveTo(123, 50); ctx.lineTo(127, 54);
      ctx.moveTo(127, 50); ctx.lineTo(123, 54);
      ctx.stroke();

      // Boca triste
      ctx.beginPath();
      ctx.arc(120, 65, 5, 0, Math.PI, true); // boca hacia abajo
      ctx.stroke();
    }
  ];

  if (incorrectGuesses <= stages.length) {
    stages[incorrectGuesses - 1]();
  }
}

function checkGameOver() {
  const term = terms[currentWordIndex].word;
  const currentWord = document.getElementById('word').textContent.replace(/\s+/g, '');

  if (currentWord === term) {
    setTimeout(() => showCompletionMessage(), 300);
  } else if (incorrectGuesses >= maxGuesses) {
    setTimeout(() => showErrorMessage(term), 300);
  }
}

function showCompletionMessage() {
  document.getElementById('keyboard').style.display = 'none';
  document.getElementById('hangmanCanvas').style.display = 'none';
  document.getElementById('completionMessageContainer').style.display = 'block';
}

function cycleNextTerm() {
  terms.splice(currentWordIndex, 1);
  if (terms.length > 0) {
    initGame();
  } else {
    showAllTermsCompletedMessage();
  }
}

function showAllTermsCompletedMessage() {
  document.getElementById('keyboard').style.display = 'none';
  document.getElementById('hangmanCanvas').style.display = 'none';
  document.getElementById('completionMessageContainer').style.display = 'none';
  document.getElementById('allTermsCompletedContainer').style.display = 'block';
}

function showErrorMessage(term) {
  const container = document.getElementById('errorMessageContainer');
  container.style.display = 'block';
  container.innerHTML = `
    <div style="
      width: 100%;                /* ocupa todo el ancho de la columna */
      margin: 10px auto 0;
      text-align: center;
      color: #C62828;             /* rojo texto */
      font-weight: 800;
      font-size: clamp(16px, 2.6vh, 22px);
      line-height: 1.2;           /* bajito para no crecer en altura */
      overflow: hidden;           /* evita scroll interno */
    " role="alert" aria-live="assertive">
      ¡Has perdido! 😢 La palabra era: <strong style="color:#B71C1C;">${term}</strong>
    </div>
    <div style="width:100%; display:flex; justify-content:center; margin-top:10px;">
      <button onclick="retryGuess()" style="
        padding: 10px 20px;
        background-color: #EF5350;
        color: #ffffff;
        border: none;
        border-radius: 999px;
        font-size: clamp(14px, 2vh, 16px);
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.15s ease;
      " onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
        🔁 Seguir jugando
      </button>
    </div>
  `;

  /* Si no quieres que mueva la pantalla, déjala comentada */
  // container.scrollIntoView({ behavior: 'smooth' });
}

function retryGuess() {
  document.getElementById('errorMessageContainer').style.display = 'none';
  initGame();
}

initGame();
