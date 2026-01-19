const page = document.getElementById("page");
const container = document.getElementById("projectsList");

// theme sync
const isLight = localStorage.getItem("theme") === "light";
if (isLight) {
  page.classList.add("light-mode", "bg-white", "text-black");
  page.classList.remove("bg-[#131313]", "text-white");
}

fetch("projects.json")
  .then(r => r.json())
  .then(data => renderProjects(data));

function renderProjects(projects) {
  projects.forEach(p => {
    const el = document.createElement("div");
    el.className = "border-b border-white/10 pb-10";

    el.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-xl font-medium">${p.title}</h2>
          <p class="italic text-sm opacity-50">${p.org || ""}</p>
        </div>
        <div class="opacity-50">${p.year}</div>
      </div>

      <p class="mt-5 max-w-3xl opacity-80">${p.description}</p>

      <div class="mt-4 flex flex-wrap gap-2">
        ${(p.tags || []).map(t =>
          `<span class="px-2 py-1 text-xs bg-white/10 rounded">${t}</span>`
        ).join("")}
      </div>

      ${p.github ? `<a class="inline-block mt-4 opacity-60 hover:opacity-100" href="${p.github}" target="_blank">GitHub</a>` : ""}
    `;

    container.appendChild(el);
  });
}
