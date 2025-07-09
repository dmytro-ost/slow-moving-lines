const canvas = document.getElementById('lines-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawJaggedPolygon(ctx, cx, cy, radius, sides, jaggedness) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    let angle = (Math.PI * 2 / sides) * i;
    let r = radius + (Math.random() - 0.5) * jaggedness;
    let x = cx + Math.cos(angle) * r;
    let y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawRandomShape(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#000';
  const type = randomInt(0, 2);
  if (type === 0) {
    // Круг
    ctx.beginPath();
    ctx.arc(x, y, randomInt(3, 10), 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 1) {
    // Прямоугольник
    ctx.fillRect(x, y, randomInt(5, 10), randomInt(5, 10));
  } else {
    // Неровный многоугольник
    drawJaggedPolygon(ctx, x, y, randomInt(4, 8), randomInt(3, 7), randomInt(2, 6));
  }
  ctx.restore();
}

let shapes = [];
let offscreenCanvas, offscreenCtx;

function generateShapes() {
  shapes = [];
  const margin = 250; // запас по краям
  const fieldWidth = canvas.width + margin * 2;
  const fieldHeight = canvas.height + margin * 2;
  const density = 0.01; // увеличенная плотность фигур на пиксель
  const count = Math.floor(fieldWidth * fieldHeight * density);
  for (let i = 0; i < count; i++) {
    shapes.push({
      x: randomInt(-margin, canvas.width + margin),
      y: randomInt(-margin, canvas.height + margin)
    });
  }
}

function drawAllShapesToOffscreen() {
  const margin = 250;
  const fieldWidth = canvas.width + margin * 2;
  const fieldHeight = canvas.height + margin * 2;
  offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = fieldWidth;
  offscreenCanvas.height = fieldHeight;
  offscreenCtx = offscreenCanvas.getContext('2d');
  offscreenCtx.fillStyle = '#fff';
  offscreenCtx.fillRect(0, 0, fieldWidth, fieldHeight);
  for (const s of shapes) {
    drawRandomShape(offscreenCtx, s.x + margin, s.y + margin);
  }
}

let offsetX = 0, offsetY = 0, targetOffsetX = 0, targetOffsetY = 0, moveFrames = 0, moveStepX = 0, moveStepY = 0;

function startNewMove() {
  // Смещения ограничены запасом
  const margin = 200;
  targetOffsetX = randomInt(-margin, margin);
  targetOffsetY = randomInt(-margin, margin);
  moveFrames = randomInt(60, 120); // 1-2 секунды при 60fps
  moveStepX = (targetOffsetX - offsetX) / moveFrames;
  moveStepY = (targetOffsetY - offsetY) / moveFrames;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  // Сдвигаем картинку так, чтобы запас по краям был учтён
  ctx.setTransform(1, 0, 0, 1, offsetX - 250, offsetY - 250);
  ctx.drawImage(offscreenCanvas, 0, 0);
  ctx.restore();

  if (moveFrames > 0) {
    offsetX += moveStepX;
    offsetY += moveStepY;
    moveFrames--;
  } else {
    offsetX = targetOffsetX;
    offsetY = targetOffsetY;
    startNewMove();
  }
  requestAnimationFrame(draw);
}

function init() {
  resizeCanvas();
  generateShapes();
  drawAllShapesToOffscreen();
  offsetX = 0;
  offsetY = 0;
  startNewMove();
  draw();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  generateShapes();
  drawAllShapesToOffscreen();
});

init(); 