const canvas = document.getElementById('lines-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ромб параметры
const DIAMOND_WIDTH = 20;
const DIAMOND_HEIGHT = 40;
const DIAMOND_GAP = 10;

// Движение поля
let offsetX = 0;
let offsetY = 0;
let moveStartX = 0;
let moveStartY = 0;
let moveTargetX = 0;
let moveTargetY = 0;
let moveDuration = 1000; // ms
let moveStartTime = 0;

function setRandomMove() {
  moveStartX = offsetX;
  moveStartY = offsetY;
  // Случайное направление и расстояние
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 300;
  moveTargetX = moveStartX + Math.cos(angle) * distance;
  moveTargetY = moveStartY + Math.sin(angle) * distance;
  moveDuration = 1000 + Math.random() * 1200; // 1-2.2 сек
  moveStartTime = performance.now();
}
setRandomMove();

function drawDiamond(cx, cy, w, h) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.fillStyle = '#000';
  ctx.fill();
}

function draw() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Анимация движения
  const now = performance.now();
  let t = (now - moveStartTime) / moveDuration;
  if (t >= 1) {
    offsetX = moveTargetX;
    offsetY = moveTargetY;
    setRandomMove();
    t = 0;
  } else {
    // Плавное движение
    offsetX = moveStartX + (moveTargetX - moveStartX) * t;
    offsetY = moveStartY + (moveTargetY - moveStartY) * t;
  }

  // Сетка ромбов
  const stepX = DIAMOND_WIDTH + DIAMOND_GAP;
  const stepY = DIAMOND_HEIGHT + DIAMOND_GAP;
  // Смещение для seamless движения
  let startX = -((offsetX % stepX) + stepX) % stepX;
  let startY = -((offsetY % stepY) + stepY) % stepY;

  for (let y = startY; y < canvas.height + DIAMOND_HEIGHT; y += stepY) {
    for (let x = startX; x < canvas.width + DIAMOND_WIDTH; x += stepX) {
      drawDiamond(x + DIAMOND_WIDTH / 2, y + DIAMOND_HEIGHT / 2, DIAMOND_WIDTH, DIAMOND_HEIGHT);
    }
  }

  requestAnimationFrame(draw);
}
draw(); 