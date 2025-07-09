const canvas = document.getElementById('lines-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Line properties
const NUM_LINES = 8;
const lines = [];
for (let i = 0; i < NUM_LINES; i++) {
  lines.push({
    y: Math.random() * canvas.height,
    speed: 0.1 + Math.random() * 0.2,
    amplitude: 40 + Math.random() * 80,
    phase: Math.random() * Math.PI * 2,
    color: `hsl(${Math.floor(Math.random()*360)}, 80%, 60%)`
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const time = Date.now() * 0.0002;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 2) {
      const y = line.y + Math.sin(time * line.speed + x * 0.002 + line.phase) * line.amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }
  requestAnimationFrame(draw);
}
draw(); 