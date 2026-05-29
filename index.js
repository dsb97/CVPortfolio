// ========================================
// CONSTANTES Y ELEMENTOS DEL DOM
// ========================================
const DEFAULT_SETTINGS = {
  appearance: {
    wallpaper: '/assets/images/wallpapers/Gradient.png',
    windowColor: '#ffffff',
    dockColor: '#000000'
  },
  language: 'es',
  defaultPosition: {
    coords: {
      latitude: 40.416729,
      longitude: -3.703339
    }
  }
};
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

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
    titleKey: 'apps.explorer',
    icon: { name: 'file-manager', pinned: true },
    singleton: false,
    size: { width: 575, height: 352 }
  },
  textEditor: {
    titleKey: 'apps.textEditor',
    icon: { name: 'text-edit', pinned: true },
    singleton: false,
    size: { width: 695, height: 503 }
  },
  settings: {
    titleKey: 'apps.settings',
    icon: { name: 'settings', pinned: true },
    singleton: true,
    size: { width: 600, height: 400 }
  },
  terminal: {
    titleKey: 'apps.terminal',
    icon: { name: 'terminal', pinned: true },
    singleton: true,
    size: { width: 350, height: 200 }
  },
  about: {
    titleKey: 'apps.about',
    icon: { name: 'about', pinned: false },
    singleton: true,
    size: { width: 525, height: 'auto' }
  }
};

function getAppTitle(appId) {
  const app = appsRegistry[appId];
  if (!app) return '';
  return app.titleKey ? t(app.titleKey) : app.title;
}

function composeWindowTitle(titleKey, titlePrefix = null, titlePrefixKey = null) {
  const baseTitle = titleKey ? t(titleKey) : t('window.defaultTitle');
  const prefix = titlePrefixKey ? t(titlePrefixKey) : titlePrefix;
  return prefix ? `${prefix} - ${baseTitle}` : baseTitle;
}

function getWindowTitle(info) {
  if (info.customTitle) return info.customTitle;
  return composeWindowTitle(info.titleKey, info.titlePrefix, info.titlePrefixKey);
}

// ========================================
// GESTIÓN DEL DOCK
// ========================================


const dockTooltip = document.createElement("div");
dockTooltip.className = "dock-tooltip";
document.body.appendChild(dockTooltip);

function createTooltip(btn) {
  btn.addEventListener("mouseenter", () => {
    dockTooltip.textContent = btn.dataset.title;

    const rect = btn.getBoundingClientRect();

    dockTooltip.style.left = rect.left + rect.width / 2 + "px";
    dockTooltip.style.top = rect.top - 42 + "px";

    dockTooltip.style.opacity = "1";
  });

  btn.addEventListener("mouseleave", () => {
    dockTooltip.style.opacity = "0";
  });
}

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
  btn.dataset.title = getAppTitle(appId);
  btn.innerHTML = `<img src="/assets/icons/${app.icon.name}.png" alt="${getAppTitle(appId)}">`;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleDockIconClick(appId, btn);
  });

  createTooltip(btn);

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

  dockTooltip.style.opacity = "0";

  const menu = document.createElement("div");
  menu.className = "dock-window-menu";
  menu.dataset.appId = appId;
  menu.style.zIndex = 999999;

  windowsByApp[appId].forEach(winId => {
    const info = windowsById[winId];
    if (!info) return;

    const item = createDockMenuItem(winId, info);
    menu.appendChild(item);
  });

  document.body.appendChild(menu);
  positionDockMenu(menu, dockIcon);
}

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
  closeBtn.className = "ui-close";

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
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
}

function updateDockTitles() {
  document.querySelectorAll('.dock-app-icon').forEach(icon => {
    const { appId, windowId } = icon.dataset;
    const windowInfo = windowId ? windowsById[windowId] : null;
    const title = windowInfo ? getWindowTitle(windowInfo) : getAppTitle(appId);

    icon.dataset.title = title;

    const img = icon.querySelector('img');
    if (img) img.alt = title;
  });
}

function removeDockMenu() {
  document.querySelectorAll('.dock-window-menu').forEach(m => m.remove());
}

function getDockIconForWindow(info) {
  if (info.dockButton) return info.dockButton;

  return document.querySelector(`.dock-app-icon[data-app-id="${info.appId}"]`);
}

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
    title = t('window.defaultTitle'),
    contentHTML = "",
    appId = null,
    icon = "folder",
    titleKey = null,
    titlePrefix = null,
    titlePrefixKey = null,
    size = {},
    position = {}
  } = options;

  const { width = 575, height = 352 } = size;
  const calculatedPosition = calculateWindowPosition(width, height, position);

  const clone = windowTemplate.content.firstElementChild.cloneNode(true);
  const winId = "win-" + windowIdCounter++;

  setupWindowElement(clone, winId, calculatedPosition, { width, height });
  setWindowContent(clone, title, contentHTML);
  injectToolbar(clone);

  desktop.appendChild(clone);

  clone.classList.add("opening");

  clone.getBoundingClientRect();

  requestAnimationFrame(() => {
    clone.classList.remove("opening");
  });

  registerWindow(winId, clone, appId, icon, { titleKey, titlePrefix, titlePrefixKey });
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

  if (title) {
    titleEl.removeAttribute('data-i18n');
    titleEl.textContent = title;
  }
  if (contentHTML) contentEl.innerHTML = contentHTML;
}

function setWindowTitle(winId, title, options = {}) {
  const info = windowsById[winId];
  if (!info) return;

  if (options.custom) {
    info.customTitle = title;
  } else {
    info.titlePrefix = title;
    info.titlePrefixKey = null;
    info.customTitle = null;
  }

  updateWindowTitle(winId);
}

function updateWindowTitle(winId) {
  const info = windowsById[winId];
  if (!info) return;

  const title = getWindowTitle(info);
  const titleEl = info.element.querySelector(".window-title");
  if (titleEl) titleEl.textContent = title;

  if (info.dockButton) {
    info.dockButton.dataset.title = title;
    const img = info.dockButton.querySelector('img');
    if (img) img.alt = title;
  }
}

function updateWindowTitles() {
  Object.keys(windowsById).forEach(updateWindowTitle);
}

function registerWindow(winId, element, appId, icon, titleInfo = {}) {
  windowsById[winId] = {
    element,
    appId,
    icon,
    titleKey: titleInfo.titleKey,
    titlePrefix: titleInfo.titlePrefix,
    titlePrefixKey: titleInfo.titlePrefixKey,
    customTitle: null,
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
  btn.innerHTML = `<img src="./assets/icons/${icon.name || "folder"}.png" alt="${title}">`;
  btn.addEventListener("click", () => restoreWindow(winId));
  createTooltip(btn);

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

  const iconEl = getDockIconForWindow(info);
  if (!iconEl) {
    winEl.classList.add('minimized');
    info.minimized = true;
    return;
  }

  const winRect = winEl.getBoundingClientRect();
  const iconRect = iconEl.getBoundingClientRect();

  const winCX = winRect.left + winRect.width / 2;
  const winCY = winRect.top + winRect.height / 2;

  const iconCX = iconRect.left + iconRect.width / 2;
  const iconCY = iconRect.top + iconRect.height / 2;

  const dx = iconCX - winCX;
  const dy = iconCY - winCY;

  const scaleX = iconRect.width / winRect.width;
  const scaleY = iconRect.height / winRect.height;

  info.prevTransform = winEl.style.transform;

  winEl.style.transform = `
    translate(${dx}px, ${dy}px)
    scale(${scaleX}, ${scaleY})
  `;

  winEl.style.opacity = "0";

  winEl.classList.add('minimizing');

  setTimeout(() => {
    winEl.style.display = "none";
    winEl.classList.remove('minimizing');
    winEl.classList.add('minimized');
  }, 200);

  info.minimized = true;
}

function restoreWindow(winId) {
  const info = windowsById[winId];
  if (!info) return;

  const winEl = info.element;

  winEl.style.display = "flex";

  const iconEl = getDockIconForWindow(info);

  if (!iconEl) {
    winEl.classList.remove('minimized');
    info.minimized = false;
    focusWindow(winEl);
    return;
  }

  const winRect = winEl.getBoundingClientRect();
  const iconRect = iconEl.getBoundingClientRect();

  const winCX = winRect.left + winRect.width / 2;
  const winCY = winRect.top + winRect.height / 2;

  const iconCX = iconRect.left + iconRect.width / 2;
  const iconCY = iconRect.top + iconRect.height / 2;

  const dx = iconCX - winCX;
  const dy = iconCY - winCY;

  const scaleX = iconRect.width / winRect.width;
  const scaleY = iconRect.height / winRect.height;

  winEl.style.transform = `
    translate(${dx}px, ${dy}px)
    scale(${scaleX}, ${scaleY})
  `;
  winEl.style.opacity = "0";

  winEl.getBoundingClientRect();

  winEl.style.transform = "";
  winEl.style.opacity = "1";

  winEl.classList.remove('minimized');

  info.minimized = false;
  focusWindow(winEl);
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
  const statusbar = document.getElementById('statusbar');
  const statusbarHeight = parseFloat(getComputedStyle(statusbar).height);

  info.prevRect = {
    left: rect.left,
    top: rect.top,
    width: winEl.style.width === '' || winEl.style.width === 'auto' ? 'auto' : rect.width + 'px',
    height: winEl.style.height === '' || winEl.style.height === 'auto' ? 'auto' : rect.height + 'px'
  };

  winEl.classList.add("maximized");
  winEl.style.left = "5px";
  winEl.style.top = `${statusbarHeight + 10}px`;
  winEl.style.width = window.innerWidth - 10 + "px";
  winEl.style.height = (window.innerHeight - dockHeight - statusbarHeight - 20) + "px";
  info.maximized = true;
}

function restoreMaximizedWindow(winEl, info) {
  winEl.classList.remove("maximized");

  if (info.prevRect) {
    winEl.style.left = info.prevRect.left + "px";
    winEl.style.top = info.prevRect.top + "px";
    winEl.style.width = info.prevRect.width;
    winEl.style.height = info.prevRect.height;
  }

  info.maximized = false;
}

function closeWindow(winEl) {
  const id = winEl.dataset.windowId;
  const info = windowsById[id];
  if (!info) return;

  const appId = info.appId;

  winEl.classList.add("closing");

  setTimeout(() => {
    unregisterWindow(id, appId);
    cleanupAppIfNeeded(appId);

    winEl.remove();

    if (info.dockButton && !appsRegistry[info.appId]?.icon?.pinned) {
      info.dockButton.remove();
    }

    const openMenu = document.querySelector(
      `.dock-window-menu[data-app-id="${appId}"]`
    );

    if (openMenu) {
      const remainingWins = windowsByApp[appId] || [];

      if (remainingWins.length <= 1) {
        removeDockMenu();
      } else {
        createDockMenu(appId, getDockIconForWindow(info));
      }
    }

    updateDockForApp(appId);
  }, 200);
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

function injectToolbar(winEl) {
  const toolbarHost = winEl.querySelector('.window-toolbar');
  const content = winEl.querySelector('.window-content');

  const toolbar = content.querySelector('[data-toolbar]');
  if (!toolbar) {
    toolbarHost.remove();
    return;
  }

  toolbarHost.appendChild(toolbar);
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

    let newLeft = startLeft + dx;
    let newTop = startTop + dy;

    const statusbar = document.getElementById("statusbar");
    const topLimit = statusbar ? statusbar.offsetHeight + statusbar.offsetTop : 0;

    if (newTop < topLimit) {
      newTop = topLimit;
    }

    winEl.style.left = newLeft + "px";
    winEl.style.top = newTop + "px";
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

  if (appScriptLoaders.has(url)) {
    return appScriptLoaders.get(url).then(() => {
      if (typeof window[initName] !== "function") {
        throw new Error(`El script cargó pero no existe window.${initName}`);
      }
      return window[initName](winId, options);
    });
  }

  const loadPromise = createScriptLoadPromise(url);
  appScriptLoaders.set(url, loadPromise);

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
    return;
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

  if (!windowsByApp[appId]) {
    windowsByApp[appId] = [];
  }

  if (app.singleton && windowsByApp[appId].length > 0) {
    const winId = windowsByApp[appId][0];
    updateWindowTitle(winId);
    restoreWindow(winId);
    return;
  }

  const contentHTML = await loadHTML(appId);
  const titlePrefix = options.title;
  const win = createWindow({
    title: composeWindowTitle(app.titleKey, titlePrefix, options.titleKey),
    contentHTML,
    appId,
    icon: app.icon,
    titleKey: app.titleKey,
    titlePrefix,
    titlePrefixKey: options.titleKey,
    size: options.size ?? appsRegistry[appId].size,
    position: options.position ?? appsRegistry[appId].position
  });

  const winId = win.dataset.windowId;
  windowsByApp[appId].push(winId);
  translateElement(win);

  updateDockForApp(appId);
  loadAppStyle(appId);
  loadAppScript(appId, winId, options);
}

// ========================================
// GESTIÓN DEL ESCRITORIO
// ========================================

const SETTINGS_KEY = 'userSettings';

function getSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return structuredClone(DEFAULT_SETTINGS);
    const parsedSettings = JSON.parse(saved);

    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...parsedSettings,
      appearance: {
        ...structuredClone(DEFAULT_SETTINGS).appearance,
        ...parsedSettings.appearance
      }
    };
  } catch (e) {
    console.warn('Error leyendo settings, usando defaults', e);
    return structuredClone(DEFAULT_SETTINGS);
  }
}

function getSetting(path, fallback = undefined) {
  const settings = getSettings();

  let ref = settings;

  for (let i = 0; i < path.length; i++) {
    if (ref == null) return fallback;
    ref = ref[path[i]];
  }

  return ref ?? fallback;
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function updateSettings(path, value) {
  const settingPath = path.join('.');
  const settings = getSettings();

  let ref = settings;
  for (let i = 0; i < path.length - 1; i++) {
    ref = ref[path[i]];
  }

  ref[path[path.length - 1]] = value;

  saveSettings(settings);
  applySettings(settings);

  if (settingPath === 'language') {
    applyLanguage();
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: value } }));
  }
}

function applySettings(settings) {
  applyDesktopWallpaper(settings.appearance.wallpaper);
  applyWindowColors(settings.appearance.windowColor);
  applyDockColors(settings.appearance.dockColor);
  document.documentElement.lang = settings.language;
  applyLanguage();
}

function loadDesktopWallpaper() {
  const settings = getSettings();
  applyDesktopWallpaper(settings.appearance.wallpaper);
}

function applyWindowColors(color) {
  const root = document.documentElement;

  root.style.setProperty('--ui-window-background-color', color + "cc");
  root.style.setProperty('--ui-window-active-background-color', color + "a8");
}

function applyDockColors(color) {
  const root = document.documentElement;
  const dockColor = color || DEFAULT_SETTINGS.appearance.dockColor;
  const textColor = getReadableTextColor(dockColor);

  root.style.setProperty('--ui-dock-background-color', dockColor + "80");
  root.style.setProperty('--ui-dock-text-color', textColor);
}

function getReadableTextColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.68 ? '#000000' : '#ffffff';
}

function applyDesktopWallpaper(src) {
  const desktopEl = document.getElementById('desktop');
  if (!desktopEl) return;
  desktopEl.style.backgroundImage = `url('${resolveDesktopWallpaper(src)}')`;
}

function resolveDesktopWallpaper(src) {
  const customWallpaperPrefix = 'custom-wallpaper:';
  if (!src?.startsWith(customWallpaperPrefix)) return src;

  try {
    const customWallpapers = JSON.parse(localStorage.getItem('customWallpapers') || '[]');
    const wallpaperId = src.slice(customWallpaperPrefix.length);
    const wallpaper = Array.isArray(customWallpapers)
      ? customWallpapers.find(item => item?.id === wallpaperId)
      : null;

    return wallpaper?.src || DEFAULT_SETTINGS.appearance.wallpaper;
  } catch (e) {
    console.warn('Error leyendo fondo personalizado', e);
    return DEFAULT_SETTINGS.appearance.wallpaper;
  }
}

function t(key) {
  if (!key) return '';
  const lang = getSetting(['language'], 'es');
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.es[key] ?? key;
}

function translateElement(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });

  root.querySelectorAll('[data-i18n-alt]').forEach(el => {
    el.alt = t(el.dataset.i18nAlt);
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });
}

function applyLanguage() {
  document.documentElement.lang = getSetting(['language'], 'es');
  document.title = t('app.documentTitle');
  translateElement(document);
  updateDockTitles();
  updateWindowTitles();
  updateClock();
}

// ========================================
// CONFIGURACIÓN INICIAL
// ========================================

function applyLanguageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  const supportedLanguages = ['es', 'en'];

  if (!supportedLanguages.includes(lang)) {
    return;
  }

  const currentLanguage = getSetting(['language']);

  if (currentLanguage === lang) {
    return;
  }

  updateSettings(['language'], lang);
}

function loadInitialApps() {
  if (window.screen.width < 1920) {
    openApp('about', {
      size: { width: 525, height: 'auto' },
    });
  } else {
    openApp('explorer', {
      size: { width: 575, height: 352 },
      position: { left: 627, top: 425 },
      path: ['Lenguajes']
    });
    openApp('explorer', {
      size: { width: 575, height: 352 },
      position: { left: 627, top: 65 },
      path: ['Frameworks']
    });
    openApp('explorer', {
      size: { width: 575, height: 323 },
      position: { left: 42, top: 454 },
      path: ['Microsoft']
    });
    openApp('terminal', {
      size: { width: 350, height: 200 },
      position: { left: 1211, top: 65 },
    });
    openApp('about', {
      size: { width: 525, height: 'auto' },
      position: { left: 95, top: 158 },
    });
    openApp('textEditor', {
      position: { left: 1211, top: 274 },
      firstLoad: true,
      titleKey: 'editor.defaultFileTitle'
    });
  }
}

function updateClock() {
  var time = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var h = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours();
  var m = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes();
  hour.innerHTML = `${h}:${m}`;
  date.innerHTML = time.toLocaleDateString(getSetting(['language'], 'es') === 'en' ? 'en-GB' : 'es-ES' , options);
}

function getLocation() {
  let resolved = false;

  const timeout = setTimeout(() => {
    if (!resolved) {
      resolved = true;
      handlePosition(getSetting(['defaultPosition']));
    }
  }, 6000);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      handlePosition(position);
    },
    () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      handlePosition(getSetting(['defaultPosition']));
    },
    {
      timeout: 5000,
      maximumAge: 0,
      enableHighAccuracy: false
    }
  );
}

function handlePosition(position) {
  getForecast(position);
  getCityName(position);
}

function forecastRequest(position) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lang=${getSetting(['language'], 'es')}&units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=24df251cc48b660b67328e7b827099d5`;
  var myHeaders = new Headers();
  var myInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };
  return new Request(
    url,
    myInit
  );
}

function cityNameRequest(position) {
  let url = `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`;
  var myHeaders = new Headers();
  var myInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };
  return new Request(
    url,
    myInit
  );
}

function getForecast(position) {
  fetch(forecastRequest(position))
    .then(function (response) {
      return response.json();;
    })
    .then(processForecastResponse);
}

function getCityName(position) {
  fetch(cityNameRequest(position))
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      processCityNameResponse(data, position)
    });
}

function processCityNameResponse(data, position) {
  let cityName =
  data.address.city ||
  data.address.town ||
  data.address.village ||
  data.address.municipality ||
  data.address.hamlet ||
  data.address.county ||
  data.address.province ||
  data.address.state ||
  t('status.locationUnavailable');
  cityNameLabel.innerHTML = cityName;
  let dP = getSetting(['defaultPosition']);
  cityNameLabel.title = (
    position.coords.longitude == dP.coords.longitude &&
    position.coords.latitude === dP.coords.latitude
      ? t('status.defaultLocation')
      : ''
  );
}

function processForecastResponse(datos) {
  forecastIcon.setAttribute('src', '/assets/weather/' + datos.weather[0].icon + '.png');
  forecastDescription.innerText = `${Math.ceil(datos.main.temp)} °C  ${datos.weather[0].description.toString().capitalize()}`;
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initDesktop();
});

window.addEventListener('languagechange', () => {
  getLocation();
});

window.addEventListener('locationchange', () => {
  getLocation();
});

function initDesktop() {
  applyLanguageFromUrl();
  applySettings(getSettings());
  getLocation();
  initDock();
  loadInitialApps();
  updateClock();
  setInterval(updateClock, 1000);
}

// ========================================
// API GLOBAL
// ========================================

window.getWindow = (winId) => {
  return document.querySelector(`.window[data-window-id="${winId}"]`);
};

window.updateSettings = updateSettings;
window.getSetting = getSetting;
window.openApp = openApp;
window.setWindowTitle = setWindowTitle;
window.t = t;
window.translateElement = translateElement;
