// ========================================
// CONSTANTES Y ELEMENTOS DEL DOM
// ========================================

const desktop = document.getElementById("desktop");
const dockIcons = document.getElementById("dock-icons");
const windowTemplate = document.getElementById("window-template");
const appScriptLoaders = new Map();

let zCounter = 1;
const windowsById = {};
const windowsByApp = {};
let windowIdCounter = 1;

const appsRegistry = {
  explorer: {
    title: 'Explorador de archivos',
    icon: { name: 'file-manager', pinned: true },
    singleton: false,
    size: { width: 575, height: 352 }
  },
  textEditor: {
    title: 'Editor de texto',
    icon: { name: 'text-edit', pinned: true },
    singleton: false,
    size: { width: 695, height: 503 }
  },
  settings: {
    title: 'Ajustes',
    icon: { name: 'settings', pinned: true },
    singleton: true,
    size: { width: 600, height: 400 }
  },
  terminal: {
    title: 'Terminal',
    icon: { name: 'terminal', pinned: true },
    singleton: true,
    size: { width: 350, height: 200 }
  },
  about: {
    title: 'Acerca de...',
    icon: { name: 'about', pinned: false },
    singleton: true,
    size: { width: 525, height: 'auto' }
  }
};

// ========================================
// GESTIÓN DEL DOCK
// ========================================

function initDock() {
  Object.entries(appsRegistry).forEach(([appId, app]) => {
    if (!app.icon?.pinned) return;

    const btn = createDockIcon(appId, app);
    dockIcons.appendChild(btn);
  });
}

function createDockIcon(appId, app) {
  const btn = document.createElement("div");
  btn.className = "dock-app-icon pinned";
  btn.dataset.appId = appId;
  btn.dataset.title = app.title;
  btn.innerHTML = `<img src="/assets/icons/${app.icon.name}.png" alt="${app.title}">`;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleDockIconClick(appId, btn);
  });

  return btn;
}

function handleDockIconClick(appId, btn) {
  const wins = windowsByApp[appId] || [];

  if (wins.length === 0) {
    openApp(appId);
  } else if (wins.length === 1) {
    restoreWindow(wins[0]);
  } else {
    createDockMenu(appId, btn);
  }
}

function createDockMenu(appId, dockIcon) {
  removeDockMenu();

  const menu = document.createElement("div");
  menu.className = "dock-window-menu";
  menu.dataset.appId = appId;

  windowsByApp[appId].forEach(winId => {
    const info = windowsById[winId];
    if (!info) return;

    const item = createDockMenuItem(winId, info);
    menu.appendChild(item);
  });

  document.body.appendChild(menu);
  positionDockMenu(menu, dockIcon);
}

// function createDockMenuItem(winId, windowInfo) {
//   const item = document.createElement("div");
//   item.className = "dock-window-menu-item";
//   item.textContent = windowInfo.element.querySelector(".window-title").textContent;

//   item.addEventListener("click", () => {
//     restoreWindow(winId);
//     removeDockMenu();
//   });

//   return item;
// }

function createDockMenuItem(winId, windowInfo) {
  const item = document.createElement("div");
  item.className = "dock-window-menu-item";

  const title = document.createElement("span");
  title.className = "dock-window-title";
  title.textContent =
    windowInfo.element.querySelector(".window-title").textContent;

  title.addEventListener("click", () => {
    restoreWindow(winId);
    removeDockMenu();
  });

  const closeBtn = document.createElement("button");
  closeBtn.className = "dock-window-close";
  closeBtn.textContent = "×";

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 🔥 CLAVE
    closeWindow(windowInfo.element);
  });

  item.appendChild(title);
  item.appendChild(closeBtn);

  return item;
}


function positionDockMenu(menu, dockIcon) {
  const rect = dockIcon.getBoundingClientRect();
  menu.style.left = rect.left + rect.width / 2 + "px";
  menu.style.bottom = (window.innerHeight - rect.top + 8) + "px";
}

function updateDockForApp(appId) {
  const dockIcon = document.querySelector(`.dock-app-icon[data-app-id="${appId}"]`);
  if (!dockIcon) return;

  const wins = windowsByApp[appId] || [];
  dockIcon.classList.toggle("open", wins.length > 0);
  dockIcon.classList.toggle("has-multiple", wins.length > 1);

  if (wins.length > 1) {
    createDockMenu(appId, dockIcon);
  } else {
    removeDockMenu();
  }
}

function removeDockMenu() {
  document.querySelectorAll('.dock-window-menu').forEach(m => m.remove());
}

// Cerrar menú del dock al hacer click fuera
document.addEventListener("mousedown", (e) => {
  if (!e.target.closest(".dock-window-menu") && !e.target.closest(".dock-app-icon")) {
    removeDockMenu();
  }
});

// ========================================
// GESTIÓN DE VENTANAS
// ========================================

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
  const calculatedPosition = calculateWindowPosition(width, height, position);

  const clone = windowTemplate.content.firstElementChild.cloneNode(true);
  const winId = "win-" + windowIdCounter++;

  setupWindowElement(clone, winId, calculatedPosition, { width, height });
  setWindowContent(clone, title, contentHTML);

  desktop.appendChild(clone);

  registerWindow(winId, clone, appId, icon);
  makeWindowInteractive(clone);
  focusWindow(clone);
  createWindowDockButton(winId, title, icon, appId);

  return clone;
}

function calculateWindowPosition(width, height, position) {
  const numericWidth = width === 'auto' ? 575 : width;
  const numericHeight = height === 'auto' ? 352 : height;

  return {
    left: position.left ?? (window.innerWidth - numericWidth) / 2,
    top: position.top ?? (window.innerHeight - numericHeight) / 2
  };
}

function setupWindowElement(element, winId, position, size) {
  element.dataset.windowId = winId;
  element.style.left = position.left + "px";
  element.style.top = position.top + "px";
  element.style.height = size.height + (size.height === 'auto' ? '' : "px");
  element.style.width = size.width + (size.width === 'auto' ? '' : "px");
}

function setWindowContent(element, title, contentHTML) {
  const titleEl = element.querySelector(".window-title");
  const contentEl = element.querySelector(".window-content");

  if (title) titleEl.textContent = title;
  if (contentHTML) contentEl.innerHTML = contentHTML;
}

function registerWindow(winId, element, appId, icon) {
  windowsById[winId] = {
    element,
    appId,
    icon,
    minimized: false,
    maximized: false,
    dockButton: null,
    prevRect: null
  };
}

function createWindowDockButton(winId, title, icon, appId) {
  const info = windowsById[winId];

  if (appsRegistry[appId]?.icon?.pinned) return;

  const btn = document.createElement("div");
  btn.className = "dock-app-icon";
  btn.dataset.appId = appId;
  btn.dataset.windowId = winId;
  btn.dataset.title = title;
  btn.innerHTML = `<img src="./assets/icons/${icon.name || "folder"}.png">`;
  btn.addEventListener("click", () => restoreWindow(winId));

  dockIcons.appendChild(btn);
  info.dockButton = btn;
}

function focusWindow(winEl) {
  zCounter++;
  winEl.style.zIndex = zCounter;
  document.querySelectorAll(".window").forEach(w => w.classList.remove("active"));
  winEl.classList.add("active");
}

function minimizeWindow(winEl) {
  const id = winEl.dataset.windowId;
  const info = windowsById[id];

  if (!info || info.minimized) return;

  winEl.style.display = "none";
  info.minimized = true;
}

function restoreWindow(winId) {
  const info = windowsById[winId];
  if (!info) return;

  info.minimized = false;
  info.element.style.display = "flex";
  focusWindow(info.element);
}

function toggleMaximize(winEl) {
  const id = winEl.dataset.windowId;
  const info = windowsById[id];
  if (!info) return;

  if (!info.maximized) {
    maximizeWindow(winEl, info);
  } else {
    restoreMaximizedWindow(winEl, info);
  }
}

function maximizeWindow(winEl, info) {
  const rect = winEl.getBoundingClientRect();
  const dock = document.getElementById('dock');
  const dockHeight = parseFloat(getComputedStyle(dock).height);

  info.prevRect = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };

  winEl.classList.add("maximized");
  winEl.style.left = "0px";
  winEl.style.top = "0px";
  winEl.style.width = window.innerWidth + "px";
  winEl.style.height = (window.innerHeight - dockHeight - 20) + "px";
  info.maximized = true;
}

function restoreMaximizedWindow(winEl, info) {
  winEl.classList.remove("maximized");

  if (info.prevRect) {
    winEl.style.left = info.prevRect.left + "px";
    winEl.style.top = info.prevRect.top + "px";
    winEl.style.width = info.prevRect.width + "px";
    winEl.style.height = info.prevRect.height + "px";
  }

  info.maximized = false;
}

function closeWindow(winEl) {
  const id = winEl.dataset.windowId;
  const info = windowsById[id];
  if (!info) return;

  const appId = info.appId;

  unregisterWindow(id, appId);
  cleanupAppIfNeeded(appId);

  winEl.remove();

  if (info.dockButton && !appsRegistry[info.appId]?.icon?.pinned) {
    info.dockButton.remove();
  }

  updateDockForApp(appId);
}

function unregisterWindow(winId, appId) {
  windowsByApp[appId] = windowsByApp[appId].filter(w => w !== winId);
  delete windowsById[winId];
}

function cleanupAppIfNeeded(appId) {
  if (windowsByApp[appId].length === 0) {
    if (window[`${appId}Dispose`]) {
      window[`${appId}Dispose`]();
    }
    unloadAppStyle(appId);
    unloadAppScript(appId);
  }
}

// ========================================
// INTERACTIVIDAD DE VENTANAS
// ========================================

function makeWindowInteractive(winEl) {
  setupWindowFocus(winEl);
  setupWindowDrag(winEl);
  setupWindowButtons(winEl);
}

function setupWindowFocus(winEl) {
  winEl.addEventListener("mousedown", () => focusWindow(winEl));
}

function setupWindowDrag(winEl) {
  const titlebar = winEl.querySelector(".window-titlebar");
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
}

function setupWindowButtons(winEl) {
  const btnMin = winEl.querySelector(".btn-minimize");
  const btnMax = winEl.querySelector(".btn-maximize");
  const btnClose = winEl.querySelector(".btn-close");

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

// ========================================
// CARGA DE RECURSOS DE APLICACIONES
// ========================================

async function loadHTML(appId) {
  const url = `/apps/${appId}/${appId}.html`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("No se pudo cargar " + url);
  }

  return await res.text();
}

function loadAppScript(appId, winId, options = {}) {
  const url = `/apps/${appId}/${appId}.js`;
  const initName = `${appId}Init`;

  // Si ya existe la promesa, encadenamos la llamada al init
  if (appScriptLoaders.has(url)) {
    return appScriptLoaders.get(url).then(() => {
      if (typeof window[initName] !== "function") {
        throw new Error(`El script cargó pero no existe window.${initName}`);
      }
      return window[initName](winId, options);
    });
  }

  // Crear promesa de carga
  const loadPromise = createScriptLoadPromise(url);
  appScriptLoaders.set(url, loadPromise);

  // Ejecutar init cuando termine la carga
  return loadPromise
    .then(() => executeScriptInit(initName, winId, options))
    .catch(err => {
      appScriptLoaders.delete(url);
      throw err;
    });
}

function createScriptLoadPromise(url) {
  return new Promise((resolve, reject) => {
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
}

function executeScriptInit(initName, winId, options) {
  if (typeof window[initName] !== "function") {
    throw new Error(`window.${initName} no está definido`);
  }
  return window[initName](winId, options);
}

function loadAppStyle(appId) {
  const url = `/apps/${appId}/${appId}.css`;

  if (document.querySelector(`link[data-app="${url}"]`)) {
    return; // Ya está cargado
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.dataset.app = url;

  document.head.appendChild(link);
}

function unloadAppScript(appId) {
  const url = `/apps/${appId}/${appId}.js`;
  const script = document.querySelector(`script[data-app="${url}"]`);

  if (script) {
    script.remove();
  }

  appScriptLoaders.delete(url);
}

function unloadAppStyle(appId) {
  const url = `/apps/${appId}/${appId}.css`;
  const link = document.querySelector(`link[data-app="${url}"]`);

  if (link) {
    link.remove();
  }
}

// ========================================
// GESTIÓN DE APLICACIONES
// ========================================

async function openApp(appId, options = {}) {
  const app = appsRegistry[appId];
  if (!app) return;

  // Inicializar lista de ventanas para esta app
  if (!windowsByApp[appId]) {
    windowsByApp[appId] = [];
  }

  // Si es singleton y ya tiene ventanas, restaurar la primera
  if (app.singleton && windowsByApp[appId].length > 0) {
    const winId = windowsByApp[appId][0];
    restoreWindow(winId);
    return;
  }

  // Cargar HTML y crear ventana
  const contentHTML = await loadHTML(appId);
  const win = createWindow({
    title: app.title,
    contentHTML,
    appId,
    icon: app.icon,
    size: options.size ?? appsRegistry[appId].size,
    position: options.position ?? appsRegistry[appId].position
  });

  const winId = win.dataset.windowId;
  windowsByApp[appId].push(winId);

  updateDockForApp(appId);
  loadAppStyle(appId);
  loadAppScript(appId, winId, options);
}

// ========================================
// GESTIÓN DEL ESCRITORIO
// ========================================

function loadDesktopWallpaper() {
  const saved = localStorage.getItem('desktopWallpaper');
  applyDesktopWallpaper(saved || '/assets/images/wallpapers/Gradient.png');
}

function applyDesktopWallpaper(src) {
  const desktopEl = document.getElementById('desktop');
  if (!desktopEl) return;
  desktopEl.style.backgroundImage = `url('${src}')`;
}

// ========================================
// CONFIGURACIÓN INICIAL
// ========================================

function loadInitialSetup() {
  if (window.screen.width < 1920) {
    openApp('about', {
      size: { width: 525, height: 'auto' },
    });
  } else {
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
      size: { width: 575, height: 352 },
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
    openApp('textEditor', {
      position: { left: 1211, top: 218 },
      firstLoad: true,
      title: 'Responsabilidades en proyectos.ted'
    });
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', loadDesktopWallpaper);

initDock();
loadInitialSetup();

// ========================================
// API GLOBAL
// ========================================

window.getWindow = (winId) => {
  return document.querySelector(`.window[data-window-id="${winId}"]`);
};

window.applyDesktopWallpaper = applyDesktopWallpaper;