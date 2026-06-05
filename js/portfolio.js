const modeCopy = {
  systems: "Systems lens: I connect automation frameworks, CI/CD, dashboards, alerts, and AI assistants into one quality operating layer.",
  qa: "QA strategy lens: I validate business-critical invariants across web, mobile, API, database, and external systems instead of trusting one response.",
  ai: "AI tooling lens: I build assistants that read automation data, documents, and PR diffs, then turn them into reviews, charts, summaries, and alerts.",
  research: "Research lens: ML, SDN, network traffic classification, and patents shaped how I think about signal, data quality, and system behavior."
};

const output = document.querySelector("[data-mode-output]");
document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    output.textContent = modeCopy[button.dataset.mode];
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".evidence-card").forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const canvas = document.getElementById("signal-canvas");
const ctx = canvas.getContext("2d");
let points = [];
let width = 0;
let height = 0;
let mouse = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(72, Math.max(34, Math.floor(width / 20)));
  points = Array.from({ length: count }, (_, index) => ({
    x: (index * 149) % width,
    y: (index * 83) % height,
    vx: ((index % 5) - 2) * 0.08,
    vy: ((index % 7) - 3) * 0.07
  }));
}

function drawCanvas() {
  ctx.clearRect(0, 0, width, height);
  const isDark = document.body.classList.contains("high-contrast");
  const lineColor = isDark ? "rgba(100, 210, 200, 0.22)" : "rgba(34, 87, 122, 0.18)";
  const pointColor = isDark ? "rgba(242, 195, 107, 0.55)" : "rgba(29, 120, 116, 0.42)";

  points.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > width) point.vx *= -1;
    if (point.y < 0 || point.y > height) point.vy *= -1;

    if (mouse.active) {
      const dx = mouse.x - point.x;
      const dy = mouse.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 160) {
        point.x -= dx * 0.0015;
        point.y -= dy * 0.0015;
      }
    }
  });

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 145) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1 - distance / 145;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }

  points.forEach((point) => {
    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawCanvas);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (event) => {
  mouse = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("mouseleave", () => {
  mouse.active = false;
});

resizeCanvas();
drawCanvas();
