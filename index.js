const desktop = document.getElementById("desktop");
const dockIcons = document.getElementById("dock-icons");
const windowTemplate = document.getElementById("window-template");
const appScriptLoaders = new Map(); // url -> Promise

let zCounter = 1;
const windowsById = {};
const windowsByApp = {};
let windowIdCounter = 1;


const appsRegistry = {
  explorer: {
    title: 'Explorador de archivos',
    icon: { name: 'file-manager', pinned: true },
    singleton: false
  },
  about: {
    title: 'Acerca de...',
    icon: { name: 'about', pinned: true },
    singleton: true
  },
  terminal: {
    title: 'Terminal',
    icon: { name: 'terminal', pinned: true },
    singleton: true
  }
}

function initDock() {
  Object.entries(appsRegistry).forEach(([appId, app]) => {
    if (!app.icon?.pinned) return;
    const btn = document.createElement("div");
    btn.className = "dock-app-icon pinned";
    btn.dataset.appId = appId;
    btn.dataset.title = app.title;
    btn.innerHTML = `
<img src="/assets/icons/${app.icon.name}.png" alt="${app.title}">
   `;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      debugger;
      const wins = windowsByApp[appId] || [];
      if (wins.length === 0) {
        openApp(appId);
      } else if (wins.length === 1) {
        restoreWindow(wins[0]);
      } else { createDockMenu(appId, btn); }
    });
    dockIcons.appendChild(btn);
  });
}

/**
 * Crea una nueva ventana a partir de la plantilla.
 * options: { title, contentHTML, appId }
 * height = 352, width = 575
 */
function createWindow(options = {}) {
  const {
    title = "Nueva ventana",
    contentHTML = "",
    appId = null,
    icon = "folder",
    size = {},
    position = {}
  } = options;
  const { width = 575, height = 352 } = size;
  const { left = 0, top = 0 } = position;
  const clone = windowTemplate.content.firstElementChild.cloneNode(true);
  const winId = "win-" + windowIdCounter++;
  clone.dataset.windowId = winId;
  clone.style.left = left + "px";
  clone.style.top = top + "px";
  clone.style.height = height + (height == 'auto' ? '' : "px");
  clone.style.width = width + (width == 'auto' ? '' : "px");

  const titleEl = clone.querySelector(".window-title");
  const contentEl = clone.querySelector(".window-content");
  if (title) titleEl.textContent = title;
  if (contentHTML) contentEl.innerHTML = contentHTML;

  desktop.appendChild(clone);
  windowsById[winId] = { element: clone, appId, icon, minimized: false, maximized: false, dockButton: null, prevRect: null };
  makeWindowInteractive(clone, { appId });

  focusWindow(clone);

  const info = windowsById[winId];
  if (!appsRegistry[appId]?.icon?.pinned) {
    const btn = document.createElement("div");
    btn.className = "dock-app-icon";
    btn.dataset.windowId = winId;
    btn.dataset.title = title;
    btn.innerHTML = `
<img src="./assets/icons/${icon.name || "folder"}.png">
 `;
    btn.addEventListener("click", () => restoreWindow(winId));
    dockIcons.appendChild(btn);
    info.dockButton = btn;
  }
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
  const appId = info.appId;
  // Quitar de windowsByApp
  windowsByApp[appId] = windowsByApp[appId].filter(w => w !== id);
  // Si ya no quedan ventanas, descarga recursos
  if (windowsByApp[appId].length === 0) {
    if (window[`${appId}Dispose`])
      window[`${appId}Dispose`]();
    unloadAppStyle(appId);
    unloadAppScript(appId);
  }
  delete windowsById[id];
  winEl.remove();
  if (info.dockButton && !appsRegistry[info.appId]?.icon?.pinned) {
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

function createDockMenu(appId, dockIcon) {
  removeDockMenu();
  const menu = document.createElement("div");
  menu.className = "dock-window-menu";
  menu.dataset.appId = appId;
  windowsByApp[appId].forEach(winId => {
    const info = windowsById[winId];
    if (!info) return;
    const item = document.createElement("div");
    item.className = "dock-window-menu-item";
    item.textContent = info.element.querySelector(".window-title").textContent;
    item.addEventListener("click", () => {
      restoreWindow(winId);
      removeDockMenu();
    });
    menu.appendChild(item);
  });
  document.body.appendChild(menu);
  // posicionar encima del icono
  const rect = dockIcon.getBoundingClientRect();
  menu.style.left = rect.left + rect.width / 2 + "px";
  menu.style.bottom = (window.innerHeight - rect.top + 8) + "px";
}

function removeDockMenu() {
  document.querySelectorAll('.dock-window-menu').forEach(m => m.remove());
}

document.addEventListener("mousedown", (e) => {
  if (!e.target.closest(".dock-window-menu") &&
    !e.target.closest(".dock-app-icon")) {
    removeDockMenu();
  }
});

/**
 * Leer HTML
 */
async function loadHTML(appId) {
  let url = `/apps/${appId}/${appId}.html`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo cargar " + url);
  return await res.text();
}

function loadAppScript(appId, winId, options = {}) {
  const url = `/apps/${appId}/${appId}.js`;
  const initName = `${appId}Init`;

  // 1) Si ya existe la promesa, encadenamos la llamada al init cuando termine.
  if (appScriptLoaders.has(url)) {
    return appScriptLoaders.get(url).then(() => {
      if (typeof window[initName] !== "function") {
        throw new Error(`El script cargó pero no existe window.${initName}`);
      }
      return window[initName](winId, options);
    });
  }

  // 2) Crear una promesa nueva y guardarla *antes* de empezar a cargar (clave).
  const p = new Promise((resolve, reject) => {
    // Si ya hay script tag (por ejemplo insertado por otra parte), reutilízalo.
    let script = document.querySelector(`script[data-app="${url}"]`);

    if (!script) {
      script = document.createElement("script");
      script.src = url;
      script.type = "module";
      script.dataset.app = url;
      document.body.appendChild(script);
    }

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error(`No se pudo cargar ${url}`)), { once: true });
  });

  appScriptLoaders.set(url, p);

  // 3) Cuando la carga termine, llamamos al init (y propagamos errores).
  return p.then(() => {
    if (typeof window[initName] !== "function") {
      throw new Error(`Cargado ${url} pero window.${initName} no está definido`);
    }
    return window[initName](winId, options);
  }).catch(err => {
    // si falla, quitamos la promesa para permitir reintentos
    appScriptLoaders.delete(url);
    throw err;
  });
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
async function openApp(appId, options) {
  const app = appsRegistry[appId];
  if (!app) return;
  // Inicializar lista
  if (!windowsByApp[appId]) {
    windowsByApp[appId] = [];
  }

  if (app.singleton && windowsByApp[appId].length > 0) {
    const winId = windowsByApp[appId][0];
    restoreWindow(winId);
    return;
  }
  const contentHTML = await loadHTML(appId);
  const win = createWindow({
    title: app.title,
    contentHTML,
    appId,
    icon: app.icon,
    size: options.size,
    position: options.position
  });
  const winId = win.dataset.windowId;
  windowsByApp[appId].push(winId);
  loadAppStyle(appId);
  loadAppScript(appId, winId, options);
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

openApp('explorer', {
  size: { width: 575, height: 352 },
  position: { left: 627, top: 369 },
  path: ['Lenguajes']
});
openApp('explorer', {
  size: { width: 575, height: 352 },
  position: { left: 627, top: 9 },
  path: ['Frameworks']
});
openApp('explorer', {
  size: { width: 575, height: 278 },
  position: { left: 45, top: 369 },
  path: ['Microsoft']
});
openApp('terminal', {
  size: { width: 350, height: 200 },
  position: { left: 1211, top: 9 },
});
openApp('about', {
  size: { width: 525, height: 'auto' },
  position: { left: 94, top: 9 },
});

initDock();