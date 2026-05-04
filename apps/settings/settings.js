window.settingsInit = (winId, options) => {
  const win = window.getWindow(winId);
  if (!win) return;

  const CUSTOM_WALLPAPERS_KEY = 'customWallpapers';

  const wallpapers = [
    'Architecture.png',
    'Aurora.png',
    'Beach.jpg',
    'Cliff.png',
    'Frogs.png',
    'Gradient.png',
    'Grass.png',
    'Lavender.png',
    'Lily.jpg',
    'Mountains.png',
    'Nebula.png',
    'Purple.png',
    'Sand.png',
    'Sky.png',
    'Space.png',
    'Strawberries.png',
    'Sunflower.png',
    'Toucan.png',
    'Tree.png',
    'Velvet.png',
    'Waterfall.png',
    'Waves.png',
  ];

  const windowColors = [
    '#f7fbff',
    '#8db9e8',
    '#73d6d5',
    '#72c86f',
    '#b7e46d',
    '#fff2a5',
    '#ffc36f',
    '#e76565',
    '#f49ac8',
    '#efd5ec',
    '#b595d0',
    '#e4d9e5',
    '#d9d2c1',
    '#b99b9b',
    '#b9b9b9',
    '#ffffff'
  ];

  const dockColors = [
    '#000000',
    '#ffffff'
  ];

  const content = win.querySelector('#settingsContent');
  const toolbar = win.querySelector('.window-toolbar');
  const btnBack = win.querySelector('.btn-back');
  let currentTemplateId = 'tpl-settings-home';

  btnBack.addEventListener('click', () => {
    loadTemplate('tpl-settings-home');
  });

  function loadTemplate(id) {
    currentTemplateId = id;
    content.innerHTML = '';

    updateBackButton(win, id);

    const tpl = win.querySelector(`#${id}`);
    content.appendChild(tpl.content.cloneNode(true));
    window.translateElement(content);

    if (id === 'tpl-wallpaper') {
      renderWallpapers();
    }

    if (id === 'tpl-language') {
      renderLanguageOptions();
    }

    if (id === 'tpl-window-color') {
      renderColorOptions();
    }

    content.querySelectorAll('[data-template]').forEach(item => {
      item.addEventListener('click', () => {
        loadTemplate(item.dataset.template);
      });
    });
  }

  function updateBackButton(win, currentTemplate) {
    if (!toolbar) return;
    toolbar.style.padding = '0';

    const btnBack = win.querySelector('.btn-back');
    if (!btnBack) return;

    if (currentTemplate === 'tpl-settings-home') {
      btnBack.style.display = 'none';
    } else {
      btnBack.style.display = 'inline-flex';
      btnBack.style.transform = 'translateX(6px) translateY(-32px)';
    }
  }

  function renderWallpapers() {
    const pathFull = '/assets/images/wallpapers';
    const pathThumbs = `${pathFull}/thumbnails`;
    const grid = win.querySelector('#wallpaperGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const savedWallpaper = window.getSetting(['appearance', 'wallpaper']);

    wallpapers.forEach(pic => {
      const url = `${pathFull}/${pic}`;
      grid.appendChild(createWallpaperItem({
        src: url,
        thumb: `${pathThumbs}/${pic}`,
        title: pic.split('.')[0],
        alt: pic,
        isSelected: url === savedWallpaper
      }));
    });

    getCustomWallpapers().forEach(wallpaper => {
      grid.appendChild(createWallpaperItem({
        src: wallpaper.src,
        thumb: wallpaper.src,
        title: wallpaper.name,
        alt: wallpaper.name,
        isSelected: wallpaper.src === savedWallpaper,
        onRemove: () => removeCustomWallpaper(wallpaper.id)
      }));
    });

    bindWallpaperFileInput();
  }

  function createWallpaperItem({ src, thumb, title, alt, isSelected, onRemove }) {
    const div = document.createElement('div');
    div.className = 'wallpaper-item';
    div.title = title;

    const img = document.createElement('img');
    img.src = thumb;
    img.alt = alt;
    div.appendChild(img);

    if (isSelected) {
      div.classList.add('selected');
    }

    div.addEventListener('click', () => {
      window.updateSettings(['appearance', 'wallpaper'], src);
      win.querySelector('#wallpaperGrid .selected')?.classList.remove('selected');
      div.classList.add('selected');
    });

    if (onRemove) {
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'ui-button icon wallpaper-remove';
      removeButton.textContent = 'x';
      removeButton.title = window.t ? window.t('settings.removeWallpaper') : 'Quitar fondo';
      removeButton.setAttribute('aria-label', removeButton.title);
      removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        onRemove();
      });
      div.appendChild(removeButton);
    }

    return div;
  }

  function bindWallpaperFileInput() {
    const input = win.querySelector('#wallpaperFileInput');
    if (!input) return;

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const src = reader.result;
        if (typeof src !== 'string') return;

        const customWallpapers = getCustomWallpapers();
        customWallpapers.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          src
        });

        saveCustomWallpapers(customWallpapers);
        window.updateSettings(['appearance', 'wallpaper'], src);
        renderWallpapers();
      });
      reader.readAsDataURL(file);
      input.value = '';
    });
  }

  function getCustomWallpapers() {
    try {
      const saved = localStorage.getItem(CUSTOM_WALLPAPERS_KEY);
      if (!saved) return [];
      const wallpapers = JSON.parse(saved);
      if (!Array.isArray(wallpapers)) return [];

      return wallpapers.filter(wallpaper =>
        wallpaper &&
        typeof wallpaper.id === 'string' &&
        typeof wallpaper.name === 'string' &&
        typeof wallpaper.src === 'string'
      );
    } catch (e) {
      console.warn('Error leyendo fondos personalizados', e);
      return [];
    }
  }

  function saveCustomWallpapers(wallpapers) {
    localStorage.setItem(CUSTOM_WALLPAPERS_KEY, JSON.stringify(wallpapers));
  }

  function removeCustomWallpaper(id) {
    const customWallpapers = getCustomWallpapers();
    const wallpaperToRemove = customWallpapers.find(wallpaper => wallpaper.id === id);
    const updatedWallpapers = customWallpapers.filter(wallpaper => wallpaper.id !== id);
    const currentWallpaper = window.getSetting(['appearance', 'wallpaper']);

    saveCustomWallpapers(updatedWallpapers);

    if (wallpaperToRemove?.src === currentWallpaper) {
      window.updateSettings(['appearance', 'wallpaper'], '/assets/images/wallpapers/Gradient.png');
    }

    renderWallpapers();
  }

  function renderLanguageOptions() {
    const currentLanguage = window.getSetting(['language'], 'es');

    content.querySelectorAll('[data-language]').forEach(item => {
      const language = item.dataset.language;

      if (language === currentLanguage) {
        item.classList.add('selected');
      }

      item.addEventListener('click', () => {
        window.updateSettings(['language'], language);
        loadTemplate('tpl-language');
      });
    });
  }

  function renderColorOptions() {
    renderColorGrid({
      gridId: 'windowColorGrid',
      colors: windowColors,
      settingPath: ['appearance', 'windowColor']
    });

    renderColorGrid({
      gridId: 'dockColorGrid',
      colors: dockColors,
      settingPath: ['appearance', 'dockColor']
    });
  }

  function renderColorGrid({ gridId, colors, settingPath }) {
    const grid = win.querySelector(`#${gridId}`);
    if (!grid) return;

    const selectedColor = window.getSetting(settingPath, '').toLowerCase();
    grid.innerHTML = '';

    colors.forEach(color => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'color-swatch';
      button.style.setProperty('--swatch-color', color);
      button.title = color;
      button.setAttribute('aria-label', color);

      if (color.toLowerCase() === selectedColor) {
        button.classList.add('selected');
      }

      button.addEventListener('click', () => {
        window.updateSettings(settingPath, color);
        renderColorGrid({ gridId, colors, settingPath });
      });

      grid.appendChild(button);
    });
  }


  let templateToLoad = '';
  switch (options.setting) {
    case 'language':
      templateToLoad = 'tpl-language';
      break;
    default:
      templateToLoad = 'tpl-settings-home';
      break;
  }

  loadTemplate(templateToLoad);

  window.addEventListener('languagechange', () => {
    loadTemplate(currentTemplateId);
  });


}

window.settingsDispose = () => { }
