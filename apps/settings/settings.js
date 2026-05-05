window.settingsInit = (winId, options) => {
  const win = window.getWindow(winId);
  if (!win) return;

  const CUSTOM_WALLPAPERS_KEY = 'customWallpapers';
  const CUSTOM_WALLPAPER_MAX_SIZE = 1600;
  const CUSTOM_WALLPAPER_QUALITY = 0.78;

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
    {
      code: '#f7fbff',
      name: window.t ? window.t('settings.windowColor.sky') : 'Cielo'
    },
    {
      code: '#8db9e8',
      name: window.t ? window.t('settings.windowColor.twilight') : 'Crepúsculo'
    },
    {
      code: '#73d6d5',
      name: window.t ? window.t('settings.windowColor.sea') : 'Mar'
    },
    {
      code: '#72c86f',
      name: window.t ? window.t('settings.windowColor.leaf') : 'Hoja'
    },
    {
      code: '#b7e46d',
      name: window.t ? window.t('settings.windowColor.lime') : 'Lima'
    },
    {
      code: '#fff2a5',
      name: window.t ? window.t('settings.windowColor.sun') : 'Sol'
    },
    {
      code: '#ffc36f',
      name: window.t ? window.t('settings.windowColor.pumpkin') : 'Calabaza'
    },
    {
      code: '#e76565',
      name: window.t ? window.t('settings.windowColor.ruby') : 'Rubí'
    },
    {
      code: '#f49ac8',
      name: window.t ? window.t('settings.windowColor.fuschia') : 'Fucsia'
    },
    {
      code: '#efd5ec',
      name: window.t ? window.t('settings.windowColor.flush') : 'Rubor'
    },
    {
      code: '#b595d0',
      name: window.t ? window.t('settings.windowColor.violet') : 'Violeta'
    },
    {
      code: '#e4d9e5',
      name: window.t ? window.t('settings.windowColor.lavender') : 'Lavanda'
    },
    {
      code: '#d9d2c1',
      name: window.t ? window.t('settings.windowColor.taupe') : 'Gris'
    },
    {
      code: '#b99b9b',
      name: window.t ? window.t('settings.windowColor.chocolate') : 'Chocolate'
    },
    {
      code: '#b9b9b9',
      name: window.t ? window.t('settings.windowColor.slate') : 'Pizarra'
    },
    {
      code: '#ffffff',
      name: window.t ? window.t('settings.windowColor.frost') : 'Hielo'
    },
  ];

  const dockColors = [
    {
      code: '#000000',
      name: window.t ? window.t('settings.windowColor.night') : 'Noche'
    },
    {
      code: '#ffffff',
      name: window.t ? window.t('settings.windowColor.frost') : 'Hielo'
    }
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

    const customWallpapers = getCustomWallpapers();
    let savedWallpaper = window.getSetting(['appearance', 'wallpaper']);
    savedWallpaper = migrateCustomWallpaperSetting(savedWallpaper, customWallpapers);

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

    customWallpapers.forEach(wallpaper => {
      const settingValue = getCustomWallpaperSettingValue(wallpaper.id);
      grid.appendChild(createWallpaperItem({
        src: settingValue,
        thumb: wallpaper.src,
        title: wallpaper.name,
        alt: wallpaper.name,
        isSelected: settingValue === savedWallpaper || wallpaper.src === savedWallpaper,
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
      removeButton.className = 'ui-close wallpaper-remove';
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

      createOptimizedWallpaper(file)
        .then(src => {
          clearWallpaperMessage();
          const customWallpapers = getCustomWallpapers();
          const wallpaper = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            src
          };

          customWallpapers.push(wallpaper);

          if (!saveCustomWallpapers(customWallpapers)) {
            showWallpaperMessage(window.t ? window.t('settings.wallpaperStorageError') : 'No hay espacio suficiente para guardar este fondo.');
            return;
          }

          window.updateSettings(['appearance', 'wallpaper'], getCustomWallpaperSettingValue(wallpaper.id));
          renderWallpapers();
        })
        .catch((error) => {
          console.warn('Error preparando fondo personalizado', error);
          showWallpaperMessage(window.t ? window.t('settings.wallpaperLoadError') : 'No se pudo cargar esta imagen.');
        });

      input.value = '';
    });
  }

  function createOptimizedWallpaper(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('El archivo no es una imagen'));
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('error', () => reject(reader.error));
      reader.addEventListener('load', () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('Imagen no valida'));
          return;
        }

        const img = new Image();
        img.addEventListener('error', () => reject(new Error('No se pudo leer la imagen')));
        img.addEventListener('load', () => {
          const scale = Math.min(1, CUSTOM_WALLPAPER_MAX_SIZE / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            reject(new Error('Canvas no disponible'));
            return;
          }

          canvas.width = width;
          canvas.height = height;
          context.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', CUSTOM_WALLPAPER_QUALITY));
        });
        img.src = reader.result;
      });
      reader.readAsDataURL(file);
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
    try {
      localStorage.setItem(CUSTOM_WALLPAPERS_KEY, JSON.stringify(wallpapers));
      return true;
    } catch (e) {
      console.warn('No se pudieron guardar los fondos personalizados', e);
      return false;
    }
  }

  function getCustomWallpaperSettingValue(id) {
    return `custom-wallpaper:${id}`;
  }

  function migrateCustomWallpaperSetting(savedWallpaper, customWallpapers) {
    if (!savedWallpaper?.startsWith('data:image/')) return savedWallpaper;

    const wallpaper = customWallpapers.find(item => item.src === savedWallpaper);
    if (!wallpaper) return savedWallpaper;

    const settingValue = getCustomWallpaperSettingValue(wallpaper.id);
    window.updateSettings(['appearance', 'wallpaper'], settingValue);
    return settingValue;
  }

  function removeCustomWallpaper(id) {
    const customWallpapers = getCustomWallpapers();
    const wallpaperToRemove = customWallpapers.find(wallpaper => wallpaper.id === id);
    const updatedWallpapers = customWallpapers.filter(wallpaper => wallpaper.id !== id);
    const currentWallpaper = window.getSetting(['appearance', 'wallpaper']);

    saveCustomWallpapers(updatedWallpapers);

    if (
      currentWallpaper === getCustomWallpaperSettingValue(id) ||
      wallpaperToRemove?.src === currentWallpaper
    ) {
      window.updateSettings(['appearance', 'wallpaper'], '/assets/images/wallpapers/Gradient.png');
    }

    renderWallpapers();
  }

  function showWallpaperMessage(message) {
    const messageEl = win.querySelector('#wallpaperMessage');
    if (!messageEl) return;
    messageEl.textContent = message;
  }

  function clearWallpaperMessage() {
    showWallpaperMessage('');
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
      button.style.setProperty('--swatch-color', color.code);
      button.title = color.name;
      button.setAttribute('aria-label', color.name);

      if (color.code.toLowerCase() === selectedColor) {
        button.classList.add('selected');
      }

      button.addEventListener('click', () => {
        window.updateSettings(settingPath, color.code);
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
