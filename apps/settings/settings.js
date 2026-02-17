window.settingsInit = (winId, options) => {
  const win = window.getWindow(winId);
  if (!win) return;

  const wallpapers = [
    'Architecture.png',
    'Aurora.png',
    'Beach.jpg',
    'Cliff.png',
    'Flower.png',
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
    'Toucan.png',
    'Tree.png',
    'Velvet.png',
    'Waterfall.png',
    'Waves.png',
  ];

  const content = win.querySelector('#settingsContent');

  function loadTemplate(id) {
    content.innerHTML = '';
    if (id != 'tpl-settings-home') {
      const btnBack = document.createElement('button');
      btnBack.title = 'Atrás';
      btnBack.classList.add("ui-button", "btn-back", "primary");
      btnBack.innerHTML = '<img src="/assets/ui/back.png" alt="Icono volver atrás"/>';
      btnBack.addEventListener('click', (event) => {
        loadTemplate('tpl-settings-home');
      });
      content.appendChild(btnBack);
    }
    const tpl = win.querySelector(`#${id}`);
    content.appendChild(tpl.content.cloneNode(true));

    if (id === 'tpl-wallpaper') {
      renderWallpapers();
    }

    // Activar clicks internos
    content.querySelectorAll('[data-template]').forEach(item => {
      item.addEventListener('click', () => {
        loadTemplate(item.dataset.template);
      });
    });
  }

  function renderWallpapers() {
    const pathFull = '/assets/images/wallpapers';
    const pathThumbs = `${pathFull}/thumbnails`;
    const grid = win.querySelector('#wallpaperGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const savedWallpaper = localStorage.getItem('desktopWallpaper');

    wallpapers.forEach(pic => {
      const url = `${pathFull}/${pic}`;
      const div = document.createElement('div');
      div.className = 'wallpaper-item';
      div.title = `${pic.split('.')[0]}`;
      div.innerHTML = `<img src="${pathThumbs}/${pic}" alt="${pic}"/>`;

      if (url === savedWallpaper) {
        div.classList.add('selected');
      }

      div.addEventListener('click', (event) => {
        localStorage.setItem('desktopWallpaper', url);
        window.applyDesktopWallpaper(url);
        grid.querySelector('.selected').classList.remove('selected');
        event.target.classList.add('selected');
      });

      grid.appendChild(div);
    });
  }

  let templateToLoad = '';
    switch(options.setting) {
      case 'language':
        templateToLoad = 'tpl-language';
        break;
      default:
        templateToLoad = 'tpl-settings-home';
        break;
    }

    loadTemplate(templateToLoad);
  

}

window.settingsDispose = () => { }
