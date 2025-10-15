<?php
// =============== GESTIÓN DEL FORO ===============
$file = 'foro.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['mensaje'])) {
  header('Content-Type: application/json; charset=utf-8');
  $nombre  = htmlspecialchars(trim($_POST['nombre'] ?: 'Anónimo'), ENT_QUOTES, 'UTF-8');
  $mensaje = htmlspecialchars(trim($_POST['mensaje']), ENT_QUOTES, 'UTF-8');

  if ($mensaje !== '') {
    $nuevo = ['nombre' => $nombre, 'mensaje' => $mensaje, 'fecha' => date('d/m/Y H:i')];
    $foro  = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $foro[] = $nuevo;
    file_put_contents($file, json_encode($foro, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
  }

  echo json_encode(['ok' => true]);
  exit;
}

$foro = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Plataforma para Padres y Profesores | Click y Crea</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #87CEEB, #1E90FF);
  color: #2E4053;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* ====== HEADER ====== */
header {
  text-align: center;
  background: #FFE66D;
  padding: 30px 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,.1);
}
header h1 {
  color: #FF6B6B;
  font-size: 2.2rem;
  margin-bottom: 10px;
}
header p {
  font-size: 1.1rem;
  color: #333;
}

/* ====== SECCIONES GENERALES ====== */
section {
  width: min(1000px, 90%);
  margin: 40px auto;
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  border-left: 8px solid #FFE66D;
}
h2 {
  color: #1E90FF;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* ====== TARJETAS (OBJETIVO Y USO) ====== */
.card-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 25px;
}
.card {
  background: #cad1feff;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform .25s ease;
}
.card:hover { transform: scale(1.02); }
.card h3 {
  color: #FF6B6B;
  margin-bottom: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
ul li {
  margin: 8px 0;
}
ul li::before {
  content: "• ";
  color: #FF6B6B;
  font-weight: 700;
}

/* ====== PDF AREA ====== */
.pdf-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 25px;
}
.pdf-card {
  background: #e1dcbfff;
  border-radius: 18px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform .25s ease;
}
.pdf-card:hover { transform: scale(1.03); }
.pdf-card h3 {
  color: #1E90FF;
  margin-bottom: 10px;
}
.pdf-card a {
  display: inline-block;
  margin-top: 8px;
  background: #FF6B6B;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 3px 0 #E91E63;
}
.pdf-card a:hover { background: #FF5252; }

/* ====== FORO ====== */
#foro{
  background:#f9f9f9;
  border-radius:16px;
  padding:16px;
  /* Altura fija para que NO crezca el contenedor */
  height: 340px;               /* ajusta a tu gusto */
  overflow-y:auto;             /* solo el listado scrollea */
  box-shadow: inset 0 0 8px rgba(0,0,0,0.08);
  scroll-behavior: smooth;
  overscroll-behavior: contain;/* evita saltos del layout */
}

.mensaje{
  background:#FFD166;
  border-radius:14px;
  padding:12px 16px;
  margin:10px 0;
  max-width:100%;
  box-shadow:0 3px 6px rgba(0,0,0,.1);
  animation:pop .25s ease;
  word-break: break-word;      /* corta palabras largas */
}

.mensaje span{
  display:block;
  font-size:.8rem;
  color:#555;
  text-align:right;
  margin-top:6px;
}

@keyframes pop{
  from{transform:scale(.98);opacity:0}
  to{transform:scale(1);opacity:1}
}

.form-foro{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-top:14px;             /* el formulario no se mueve */
}

.form-foro input,
.form-foro textarea{
  border:2px solid #FF6B6B;
  border-radius:12px;
  padding:10px;
  background:#FFF9C4;
  font-size:1rem;
  resize:none;
}

.form-foro textarea{
  min-height:70px;
  max-height:140px;            /* evita que el form se haga enorme */
}

.form-foro button{
  align-self:flex-end;
  background:#FF6B6B;
  color:#fff;
  border:none;
  border-radius:10px;
  padding:10px 20px;
  font-weight:600;
  cursor:pointer;
  box-shadow:0 3px 0 #E91E63;
  transition:filter .15s ease;
}
.form-foro button:hover{ filter:brightness(1.05); }

/* ====== CONTACTO ====== */
form#contactForm {
  background: #fdfdfd;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
form#contactForm input, form#contactForm textarea {
  border: 2px solid #FF6B6B;
  border-radius: 10px;
  padding: 10px;
  background: #FFF9C4;
}
form#contactForm button {
  background: #FF6B6B;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 3px 0 #E91E63;
}
form#contactForm button:hover { background: #FF5252; }

/* ====== FOOTER ====== */
footer {
  text-align: center;
  background: #1E90FF;
  color: white;
  padding: 15px;
  font-size: 0.95rem;
}
</style>
</head>
<body>

<header>
  <h1><i class="fa-solid fa-people-group"></i> Plataforma para Padres y Profesores</h1>
  <p>Acompaña y potencia el aprendizaje de los niños desde la orientación educativa</p>
</header>

<!-- ===== 1. OBJETIVO + USO ===== -->
<section>
  <div class="card-row">
    <div class="card">
      <h3><i class="fa-solid fa-bullseye"></i> Objetivo de la Plataforma</h3>
      <p>Esta plataforma proporciona herramientas para enseñar fundamentos de lógica y programación a niños de 7 a 12 años, fomentando el pensamiento crítico, la resolución de problemas y la creatividad en un entorno educativo guiado por adultos.</p>
      <ul>
        <li>Desarrollar pensamiento lógico y estructurado.</li>
        <li>Fomentar la resolución de problemas mediante juegos.</li>
        <li>Introducir el pensamiento computacional de forma sencilla.</li>
      </ul>
    </div>
    <div class="card">
      <h3><i class="fa-solid fa-book-open-reader"></i> Guía de Uso</h3>
      <p>Recomendaciones para acompañar el proceso de aprendizaje de los estudiantes:</p>
      <ul>
        <li>Supervisar las sesiones de juego durante los primeros usos.</li>
        <li>Establecer un tiempo de aprendizaje máximo de 30 minutos diarios.</li>
        <li>Conversar con los estudiantes sobre lo aprendido para reforzar la comprensión.</li>
      </ul>
    </div>
  </div>
</section>

<!-- ===== 2. TEMAS + PDF ===== -->
<section>
<h2><i class="fa-solid fa-graduation-cap"></i> Temas Pedagógicos</h2>
<p>
  Encontrarás ocho cuadernos en PDF pensados para que padres y docentes acompañen el aprendizaje de 7 a 12 años. 
  Inician con una <strong>introducción al pensamiento lógico</strong>, continúan con <strong>orden y secuencia</strong> y la construcción de <strong>algoritmos</strong> (pasos claros para lograr una meta); incorporan <strong>matemáticas aplicadas a la programación</strong> como herramienta de razonamiento; y avanzan por los componentes básicos: <strong>variables y constantes</strong>, <strong>condiciones</strong> (si… entonces…) y <strong>bucles</strong> (repetir). 
  El recorrido cierra con <strong>cultura tecnológica y aplicación práctica</strong>
  Cada PDF incluye una explicación breve, ejemplos cotidianos, actividades guiadas y recomendaciones para adaptarlas a casa o aula. 
  Te sugerimos avanzar en ese orden y seleccionar las actividades según el tiempo disponible y el nivel del grupo.
</p>
  <h2 style="margin-top:30px;"><i class="fa-solid fa-file-pdf"></i> Material de Apoyo en PDF</h2>
  <div class="pdf-area">
    <!-- PDF 1 -->
    <div class="pdf-card">
      <h3>Tema 1</h3>
      <p>Introducción al pensamiento lógico</p>
      <a href="CONTENIDO1-CLICL-Y-CREA.pdf" download title="Introducción al pensamiento lógico">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>

    <!-- PDF 2 -->
    <div class="pdf-card">
      <h3>Tema 2</h3>
      <p>Orden y secuencia</p>
      <a href="CONTENIDO2-CLICK-Y-CREA.pdf" download title="Orden y secuencia">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>

    <!-- PDF 3 -->
    <div class="pdf-card">
      <h3>Tema 3</h3>
      <p>Algoritmos (pasos para lograr una meta)</p>
      <a href="CONTENIDO3-CLICKYCREA.pdf" download title="Algoritmos">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>

    <!-- PDF 4 -->
    <div class="pdf-card">
      <h3>Tema 4</h3>
      <p>Matemáticas aplicadas a la programación</p>
      <a href="CONTENIDO4-CLICKYCREA.pdf" download title="Matemáticas aplicadas a la programación">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>

    <!-- PDF 5 -->
    <div class="pdf-card">
      <h3>Tema 5</h3>
      <p>Variables y constantes</p>
      <a href="CONTENIDO5-CLICKYCREA.pdf" download title="Variables y constantes">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>

    <!-- PDF 6 -->
    <div class="pdf-card">
      <h3>Tema 6</h3>
      <p>Condiciones (si… entonces…)</p>
      <a href="CONTENIDO6-CLICKYCREA.pdf" download title="Condiciones">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>

    <!-- PDF 7 -->
    <div class="pdf-card">
      <h3>Tema 7</h3>
      <p>Bucles (repetir)</p>
      <a href="CONTENIDO7-CLICKYCREA.pdf" download title="Bucles (repetir)">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>

    <!-- PDF 8 -->
    <div class="pdf-card">
      <h3>Tema 8</h3>
      <p>Cultura tecnológica y aplicación práctica</p>
      <a href="CONTENIDO8-CLICKYCREA.pdf" download title="Cultura tecnológica y aplicación práctica">
        <i class="fa-solid fa-download"></i> Descargar
      </a>
    </div>
  </div>
</section>
<!-- ===== 3. FORO ===== -->
<section>
  <h2><i class="fa-solid fa-comments"></i> Foro de Preguntas y Respuestas</h2>

  <div id="foro" aria-live="polite" aria-label="Listado de mensajes del foro">
    <?php foreach ($foro as $f): ?>
      <div class="mensaje">
        <strong><i class="fa-solid fa-user"></i> <?php echo $f['nombre']; ?></strong><br>
        <?php echo nl2br($f['mensaje']); ?>
        <span><i class="fa-regular fa-clock"></i> <?php echo $f['fecha']; ?></span>
      </div>
    <?php endforeach; ?>
  </div>

  <form class="form-foro" id="formForo" autocomplete="off">
    <input type="text" name="nombre" placeholder="Tu nombre (opcional)">
    <textarea name="mensaje" placeholder="Escribe un mensaje..." required></textarea>
    <button type="submit"><i class="fa-solid fa-paper-plane"></i> Enviar</button>
  </form>
</section>
<!-- ===== 4. CONTACTO ===== -->
<section>
  <h2><i class="fa-solid fa-envelope"></i> Contáctanos</h2>
  <p>Si tienes preguntas o sugerencias, envíanos un mensaje. Nuestro equipo técnico responderá a la brevedad.</p>
  <form id="contactForm" method="post" action="contacto.php">
    <input type="text" name="nombre" placeholder="Tu nombre" required>
    <input type="email" name="correo" placeholder="Tu correo electrónico" required>
    <textarea name="mensaje" placeholder="Tu mensaje" required></textarea>
    <button type="submit"><i class="fa-solid fa-paper-plane"></i> Enviar Mensaje</button>
  </form>
</section>

<footer>
  <p>&copy; 2025 Click y Crea | Plataforma Educativa. Todos los derechos reservados.</p>
</footer>

<script>
const formForo=document.getElementById('formForo');
formForo.addEventListener('submit',e=>{
  e.preventDefault();
  fetch('',{method:'POST',body:new FormData(formForo)})
  .then(r=>r.json())
  .then(()=>location.reload());
});
</script>
<script>
  const foroBox = document.getElementById('foro');
  const formForo = document.getElementById('formForo');

  function autoScrollForo(){
    foroBox.scrollTop = foroBox.scrollHeight;
  }

  async function loadForo(){
    try{
      const res = await fetch('foro.json?ts=' + Date.now());
      if(!res.ok) return;
      const data = await res.json();
      foroBox.innerHTML = data.map(f => `
        <div class="mensaje">
          <strong><i class="fa-solid fa-user"></i> ${f.nombre}</strong><br>
          ${String(f.mensaje).replace(/\n/g,'<br>')}
          <span><i class="fa-regular fa-clock"></i> ${f.fecha}</span>
        </div>
      `).join('');
      autoScrollForo();
    }catch(e){ /* opcional: manejar error */ }
  }

  formForo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(formForo);
    try{
      const r = await fetch('', { method:'POST', body: fd });
      await r.json();               // esperamos ok del servidor
      formForo.reset();             // limpiar campos
      await loadForo();             // recargar listado
    }catch(e){ /* opcional: feedback error */ }
  });

  // Cargar mensajes al entrar y dejar al final
  document.addEventListener('DOMContentLoaded', () => {
    loadForo();
  });
</script>
</body>
</html>
