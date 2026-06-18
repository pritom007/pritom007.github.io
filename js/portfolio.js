const curatedRepos = [
  {
    name: "Network-Traffic-Classification",
    description: "Research artifacts for supervised ML network traffic classification in a Docker-based SDN lab network.",
    html_url: "https://github.com/pritom007/Network-Traffic-Classification",
    language: "Jupyter Notebook",
    stargazers_count: 40,
    forks_count: 11,
    updated_at: "2026-06-02T09:57:27Z",
    tags: ["research", "ml", "sdn"]
  },
  {
    name: "AngleMate",
    description: "Local-first iOS camera coach for portrait framing, tilt, lighting, lens choice, and filters.",
    html_url: "https://github.com/pritom007/AngleMate",
    language: "Swift",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-05-29T05:42:09Z",
    tags: ["product", "ios", "vision"]
  },
  {
    name: "linkedapply",
    description: "Chrome extension that turns LinkedIn job posts into tailored ATS-friendly CVs and cover letters.",
    html_url: "https://github.com/pritom007/linkedapply",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-02-27T11:17:25Z",
    tags: ["ai", "extension", "product"]
  },
  {
    name: "ai-pr-review",
    description: "LLM-powered GitHub Action for automated PR review across OpenAI-compatible providers.",
    html_url: "https://github.com/pritom007/ai-pr-review",
    language: "Python",
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2025-03-17T11:10:13Z",
    tags: ["ai", "github-actions", "review"]
  },
  {
    name: "ollama_chatbot",
    description: "Flask chatbot with contextual memory, chat history, markdown rendering, and external data integration.",
    html_url: "https://github.com/pritom007/ollama_chatbot",
    language: "Python",
    stargazers_count: 7,
    forks_count: 0,
    updated_at: "2025-10-15T23:52:28Z",
    tags: ["ai", "flask", "chatbot"]
  },
  {
    name: "BioInfoML",
    description: "Bioinformatics ML project using PCA, regression, SVM, and DNN for disease prediction experiments.",
    html_url: "https://github.com/pritom007/BioInfoML",
    language: "Python",
    stargazers_count: 3,
    forks_count: 1,
    updated_at: "2026-03-12T12:31:47Z",
    tags: ["research", "bioinformatics", "ml"]
  }
];

const answers = {
  identity: {
    title: "What makes you different?",
    body: "I am a QA engineer who thinks like a platform builder. I do not stop at writing automated checks; I care about evidence, dashboards, review loops, CI/CD quality gates, and systems that make engineering risk visible.",
    tags: ["Quality systems", "Automation", "AI tools", "Research"]
  },
  automation: {
    title: "How do you connect web, mobile, and API automation?",
    body: "I design automation around a complete business state, not a single screen. A flow can start in a web UI, continue through mobile approval, verify backend/API state, inspect persistence, and attach logs/screenshots/version metadata to one traceable run.",
    tags: ["Web", "Mobile", "API", "Evidence", "Traceability"]
  },
  ai: {
    title: "Where does AI belong in QA?",
    body: "AI belongs above reliable evidence. It should summarize diffs, query execution data, explain trends, generate review hints, and help humans see risk faster. It should not replace the source of truth.",
    tags: ["LLM review", "RAG", "Dashboards", "Human-in-loop"]
  },
  research: {
    title: "Why does research matter for testing?",
    body: "Research trained me to respect baselines, data quality, reproducibility, and measurement. That mindset is exactly what good QA needs: results that can be trusted, compared, explained, and improved.",
    tags: ["Baselines", "Metrics", "Reproducibility", "Data quality"]
  }
};

let repos = curatedRepos;
let currentFilter = "featured";
const curatedMap = new Map(curatedRepos.map((repo) => [repo.name, repo]));

function cleanText(value) {
  return String(value || "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value));
}

function repoScore(repo) {
  return (repo.stargazers_count || 0) * 3 + (repo.forks_count || 0) * 2;
}

function repoTags(repo) {
  const curated = curatedMap.get(repo.name);
  if (curated) return curated.tags;
  const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  const tags = [];
  if (/traffic|bio|research|ml|machine|sdn|notebook/.test(text)) tags.push("research");
  if (/ai|gpt|ollama|review|rag|llm|groq|apply/.test(text)) tags.push("ai");
  if (/angle|ios|swift|chrome|extension|product/.test(text)) tags.push("product");
  return tags.length ? tags : ["software"];
}

function filteredRepos() {
  let list = repos.filter((repo) => !repo.fork && repo.name !== "pritom007.github.io");
  if (currentFilter === "featured") {
    const names = new Set(curatedRepos.map((repo) => repo.name));
    return list.filter((repo) => names.has(repo.name)).sort((a, b) => repoScore(b) - repoScore(a));
  }
  if (currentFilter === "recent") {
    return list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 9);
  }
  return list.filter((repo) => repoTags(repo).includes(currentFilter)).sort((a, b) => repoScore(b) - repoScore(a));
}

function renderPublicProjects() {
  const container = document.querySelector("[data-public-projects]");
  if (!container) return;
  container.innerHTML = curatedRepos.slice(1, 5).map((repo) => `
    <article>
      <span>${repo.language}</span>
      <h3>${repo.name}</h3>
      <p>${repo.description}</p>
      <div class="chips">${repo.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `).join("");
}

function renderRepos() {
  const grid = document.querySelector("[data-repo-grid]");
  if (!grid) return;
  const visible = filteredRepos();
  const output = visible.length ? visible : curatedRepos;

  grid.innerHTML = output.slice(0, 9).map((repo) => {
    const curated = curatedMap.get(repo.name);
    const description = cleanText(curated?.description || repo.description || "Public repository from Pritom's GitHub workspace.");
    const tags = repoTags(repo);
    return `
      <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
        <span class="repo-score">${repoScore(repo)} signal</span>
        <h3>${repo.name}</h3>
        <p>${description}</p>
        <div class="chips">${tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="repo-meta">
          <span>${repo.language || "Mixed"}</span>
          <span>${repo.stargazers_count || 0} stars</span>
          <span>${repo.forks_count || 0} forks</span>
          <span>${formatDate(repo.updated_at)}</span>
        </div>
      </a>
    `;
  }).join("");
}

async function hydrateGithub() {
  const status = document.querySelector("[data-live-status]");
  try {
    const response = await fetch("https://api.github.com/users/pritom007/repos?per_page=100&sort=updated", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const liveRepos = await response.json();
    repos = liveRepos.length ? liveRepos : curatedRepos;
    const sourceRepos = repos.filter((repo) => !repo.fork);
    const topRepo = [...sourceRepos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))[0];
    const latestRepo = [...sourceRepos].filter((repo) => repo.name !== "pritom007.github.io").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

    document.querySelector("[data-public-repos]").textContent = String(repos.length);
    document.querySelector("[data-top-stars]").textContent = String(topRepo?.stargazers_count || 0);
    const currentSignal = document.querySelector("[data-current-signal]");
    if (currentSignal) currentSignal.textContent = latestRepo?.name?.replace(/-/g, " ") || "Public GitHub activity";
    status.textContent = "Live from GitHub public API";
  } catch (error) {
    status.textContent = "Using curated public snapshot";
    const currentSignal = document.querySelector("[data-current-signal]");
    if (currentSignal) currentSignal.textContent = "Public project snapshot";
  } finally {
    renderRepos();
  }
}

function setupFilters() {
  document.querySelectorAll("[data-repo-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-repo-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.repoFilter;
      renderRepos();
    });
  });
}

function setupAnswers() {
  const panel = document.querySelector("[data-answer-card]");
  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-answer]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const answer = answers[button.dataset.answer];
      panel.innerHTML = `
        <span>Answer</span>
        <h3>${answer.title}</h3>
        <p>${answer.body}</p>
        <div class="chips">${answer.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      `;
    });
  });
}

function setupNavigation() {
  const sidebar = document.querySelector("[data-sidebar]");
  document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll("[data-nav-link]").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      sidebar.classList.remove("open");
    });
  });
}

function setupLightweightTracking() {
  document.querySelectorAll("[data-track='cv']").forEach((link) => {
    link.addEventListener("click", () => {
      const ping = new Image();
      ping.decoding = "async";
      ping.src = `https://hits.sh/pritom007.github.io/cv-download.svg?${Date.now()}`;
    });
  });
}

function setupCanvas() {
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let points = [];
  let frameId = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(60, Math.max(30, Math.floor(width / 24)));
    points = Array.from({ length: count }, (_, index) => ({
      x: (index * 131) % width,
      y: (index * 83) % height,
      vx: ((index % 5) - 2) * 0.08,
      vy: ((index % 7) - 3) * 0.07
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
    });
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const squaredDistance = dx * dx + dy * dy;
        if (squaredDistance < 16900) {
          const distance = Math.sqrt(squaredDistance);
          ctx.strokeStyle = `rgba(72, 215, 200, ${0.16 * (1 - distance / 130)})`;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    points.forEach((point) => {
      ctx.fillStyle = "rgba(77, 140, 255, 0.32)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!reduceMotion && !document.hidden) frameId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !reduceMotion) {
      cancelAnimationFrame(frameId);
      draw();
    }
  });
  resize();
  draw();
}

renderPublicProjects();
renderRepos();
setupFilters();
setupAnswers();
setupNavigation();
setupLightweightTracking();
setupCanvas();
hydrateGithub();
