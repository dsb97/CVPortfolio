// Gestor simple de ventanas
const desktop = document.getElementById("desktop");
const dockIcons = document.getElementById("dock-icons");
const windowTemplate = document.getElementById("window-template");

let zCounter = 1;
var windowsById = {};
let windowIdCounter = 1;

/**
 * Crea una nueva ventana a partir de la plantilla.
 * options: { title, contentHTML, appId }
 */
function createWindow(options = {}) {
  const { title = "Nueva ventana", contentHTML = "", appId = null, icon = 'folder', height = 352, width = 575 } = options;
  const clone = windowTemplate.content.firstElementChild.cloneNode(true);
  const winId = "win-" + windowIdCounter++;
  clone.dataset.windowId = winId;
  clone.style.left = 60 + windowIdCounter * 20 + "px";
  clone.style.top = 60 + windowIdCounter * 20 + "px";
  clone.style.height = height + "px";
  clone.style.width = width + "px";
  clone.style.minHeight = height + "px";
  clone.style.minWidth = width + "px";

  const titleEl = clone.querySelector(".window-title");
  const contentEl = clone.querySelector(".window-content");
  if (title) titleEl.textContent = title;
  if (contentHTML) contentEl.innerHTML = contentHTML;

  desktop.appendChild(clone);
  windowsById[winId] = { element: clone, appId, icon, minimized: false, maximized: false, dockButton: null, prevRect: null };
  makeWindowInteractive(clone, { appId });

  focusWindow(clone);

  const info = windowsById[winId];
  const btn = document.createElement("div");
  btn.dataset.title = clone.querySelector(".window-title").textContent || "Ventana";
  btn.className = "dock-app-icon";
  btn.innerHTML = `<img src="./assets/icons/${info.icon || "folder"}.png" alt="${info.title}">`;
  btn.dataset.windowId = winId;
  btn.addEventListener("click", () => {
    restoreWindow(winId);
  });
  dockIcons.appendChild(btn);
  info.dockButton = btn;
  return clone;
}

/**
 * Trae una ventana al frente
 */
function focusWindow(winEl) {
  zCounter++;
  winEl.style.zIndex = zCounter;
  document.querySelectorAll(".window").forEach(w => w.classList.remove("active"));
  winEl.classList.add("active");
}

/**
 * Minimiza una ventana al dock
 */
function minimizeWindow(winEl) {
  const id = winEl.dataset.windowId;
  const info = windowsById[id];
  if (!info || info.minimized)
    return;
  winEl.style.display = "none";
  info.minimized = true;
}

/**
 * Restaura una ventana minimizada
 */
function restoreWindow(winId) {
  const info = windowsById[winId];
  if (!info) return;
  info.minimized = false;
  info.element.style.display = "flex";
  focusWindow(info.element);
}

/**
 * Maximizar / restaurar
 */
function toggleMaximize(winEl) {
  const id = winEl.dataset.windowId;
  const info = windowsById[id];
  if (!info) return;

  if (!info.maximized) {
    const rect = winEl.getBoundingClientRect();
    info.prevRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    winEl.classList.add("maximized");
    winEl.style.left = "0px";
    winEl.style.top = "0px";
    winEl.style.width = window.innerWidth + "px";
    winEl.style.height = (window.innerHeight - getComputedStyle(dock).height.replace("px", "") - 20) + "px";
    info.maximized = true;
  } else {
    winEl.classList.remove("maximized");
    if (info.prevRect) {
      winEl.style.left = info.prevRect.left + "px";
      winEl.style.top = info.prevRect.top + "px";
      winEl.style.width = info.prevRect.width + "px";
      winEl.style.height = info.prevRect.height + "px";
    }
    info.maximized = false;
  }
}

/**
 * Cerrar ventana
 */
function closeWindow(winEl) {
  const id = winEl.dataset.windowId;
  const info = windowsById[id];
  if (!info) return;
  if (window[`${info.appId}Dispose`])
    window[`${info.appId}Dispose`](); 
  unloadAppStyle(info.appId);
  unloadAppScript(info.appId);
  delete windowsById[id];
  winEl.remove();
  if (info.dockButton && !info.dockButton.classList.contains('pinned')) {
    info.dockButton.remove();
  }
}

/**
 * Hacer una ventana draggable y con botones
 */
function makeWindowInteractive(winEl) {
  const titlebar = winEl.querySelector(".window-titlebar");
  const btnMin = winEl.querySelector(".btn-minimize");
  const btnMax = winEl.querySelector(".btn-maximize");
  const btnClose = winEl.querySelector(".btn-close");

  // Foco al hacer click
  winEl.addEventListener("mousedown", () => focusWindow(winEl));

  // Drag
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  titlebar.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    isDragging = true;
    winEl.classList.remove("maximized");
    const rect = winEl.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  function handleMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    winEl.style.left = startLeft + dx + "px";
    winEl.style.top = startTop + dy + "px";
  }

  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  // Botones
  btnMin.addEventListener("click", (e) => {
    e.stopPropagation();
    minimizeWindow(winEl);
  });

  btnMax.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMaximize(winEl);
  });

  btnClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeWindow(winEl);
  });
}

/**
 * Leer HTML
 */
async function loadHTML(appId) {
  let url = `/apps/${appId}/${appId}.html`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo cargar " + url);
  return await res.text();
}

function loadAppScript(appId) {
  let url = `/apps/${appId}/${appId}.js`;
  if (document.querySelector(`script[data-app="${url}"]`)) {
    return; // ya está cargado
  }

  const script = document.createElement("script");
  script.src = url;
  script.type = "module";
  script.dataset.app = url;

  document.body.appendChild(script);
}

function loadAppStyle(appId) {
  let url = `/apps/${appId}/${appId}.css`;
  if (document.querySelector(`link[data-app="${url}"]`)) {
    return; // ya está cargado
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.dataset.app = url;

  document.head.appendChild(link);
}

function unloadAppScript(appId) {
  let url = `/apps/${appId}/${appId}.js`
  const script = document.querySelector(`script[data-app="${url}"]`);
  if (script) {
    script.remove();
  }
}

function unloadAppStyle(appId) {
  let url = `/apps/${appId}/${appId}.css`
  const link = document.querySelector(`link[data-app="${url}"]`);
  if (link) {
    link.remove();
  }
}





/**
 * Abrir app (crea una nueva ventana asociada a un appId)
 */
function openApp(appId) {
  if (appId === "example-app") {
    createWindow({
      title: "Ventana de ejemplo",
      contentHTML: `
        <h2>Hola desde la ventana de ejemplo</h2>
        <p>Esta es la base para tus futuras ventanas.</p>
        <p>Puedes clonar la función <code>createWindow</code> o reutilizarla cambiando <em>title</em> y <em>contentHTML</em>.</p>
      `,
      appId: "example-app"
    });
  } else {
    createWindow({
      title: "App: " + appId,
      contentHTML: `<p>Contenido genérico para <strong>${appId}</strong>.</p>`,
      appId
    });
  }
}

// Click en iconos de escritorio
document.querySelectorAll(".desktop-icon").forEach(icon => {
  icon.addEventListener("dblclick", () => {
    const appId = icon.dataset.appId;
    openApp(appId);
  });
});

// Click en iconos del dock
document.querySelectorAll(".dock-app-icon").forEach(icon => {
  icon.addEventListener("click", () => {
    const appId = icon.dataset.appId;
    openApp(appId);
  });
});

// Crear una ventana inicial de ejemplo
async function openExplorer() {
  let newWindow = {
    icon: "file-manager",
    title: "Explorador de archivos",
    contentHTML: '',
    appId: "explorer"
  }
  newWindow.contentHTML = await loadHTML(newWindow.appId);
  createWindow(newWindow);
  loadAppStyle(newWindow.appId);
  loadAppScript(newWindow.appId);
};

async function openAbout() {
  let newWindow = {
    icon: "about",
    title: "Acerca de...",
    contentHTML: '',
    appId: "about",
    height: 305,
    width: 525
  }
  newWindow.contentHTML = await loadHTML(newWindow.appId);
  createWindow(newWindow);
  loadAppStyle(newWindow.appId);
  loadAppScript(newWindow.appId);
};

openExplorer();
openAbout();