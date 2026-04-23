window.textEditorInit = (winId, options) => {
  const win = window.getWindow(winId);
  const editor = win.querySelector("#editor");
  const sidebar = win.querySelector("#sidebar");
  const textPanel = win.querySelector("#textPanel");
  const mediaPanel = win.querySelector("#mediaPanel");

  let savedRange = null;

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (!savedRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  };

  editor.addEventListener("mouseup", saveSelection);
  editor.addEventListener("keyup", saveSelection);
  editor.addEventListener("focus", saveSelection);

  const getBlock = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return null;
    let node = sel.anchorNode;
    while (node && node !== editor) {
      if (node.nodeType === 1 && ["P", "H1", "H2", "H3", "H4", "H5", "LI"].includes(node.tagName))
        return node;
      node = node.parentNode;
    }
    return null;
  };

  // SIDEBAR TOGGLE
  win.querySelectorAll(".close-panel").forEach(x => {
    x.onclick = () =>
      sidebar.classList.toggle("hidden");
  })

  // TEXT / MEDIA BUTTONS
  win.querySelector("#textBtn").onclick = () => {
    sidebar.classList.remove("hidden");
    textPanel.classList.remove("hidden");
    mediaPanel.classList.add("hidden");
  };

  win.querySelector("#mediaBtn").onclick = () => {
    sidebar.classList.remove("hidden");
    mediaPanel.classList.remove("hidden");
    textPanel.classList.add("hidden");
  };

  // STYLES
  win.querySelector("#styleSelect").onchange = e => {
    const block = getBlock();
    if (!block) return;
    const newEl = document.createElement(e.target.value);
    newEl.innerHTML = block.innerHTML;
    block.replaceWith(newEl);
  };

  win.querySelector("#fontSelect").onchange = e => {
    const block = getBlock();
    if (block) block.style.fontFamily = e.target.value;
  };

  win.querySelector("#fontSize").onclick = e => {
    e.preventDefault();
  }

  win.querySelector("#fontSize").onchange = e => {
    const size = e.target.value;
    if (!size) return;

    editor.focus();
    restoreSelection();

    document.execCommand("fontSize", false, "7");

    const fonts = editor.querySelectorAll("font[size='7']");
    fonts.forEach(font => {
      font.removeAttribute("size");
      font.style.fontSize = size + "px";
    });
  };

  // LISTS
  document.querySelectorAll("[data-list]").forEach(btn => {
    btn.onclick = () => {
      document.execCommand(
        btn.dataset.list === "ul" ? "insertUnorderedList" : "insertOrderedList"
      );
    };
  });

  // ALIGN
  document.querySelectorAll("[data-align]").forEach(btn => {
    btn.onclick = () =>
      document.execCommand("justify" + btn.dataset.align);
  });

  // IMAGES
  win.querySelector("#imageInput").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = "100%";
    editor.appendChild(img);
  };

  // SAVE
  win.querySelector("#saveBtn").onclick = () => {
    const blob = new Blob([editor.innerHTML], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${editor.firstElementChild.textContent.substring(0, 60).trim() || 'Nuevo documento'}.ted`;
    a.click();
  };

  // OPEN
  win.querySelector("#openFile").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.innerHTML = reader.result;
      win.querySelector('.window-title').innerHTML = `${file.name} - ${win.querySelector('.window-title').innerHTML}`;
    };
    reader.readAsText(file);
  };

  // COPY / CUT / PASTE
  win.querySelector("#copyBtn").onclick = () => {
    editor.focus();
    document.execCommand("copy");
  };

  win.querySelector("#cutBtn").onclick = () => {
    editor.focus();
    document.execCommand("cut");
  };

  win.querySelector("#pasteBtn").onclick = () => {
    editor.focus();
    document.execCommand("paste");
  };

  const applyStyle = (command) => {
    editor.focus();
    restoreSelection();
    try {
      document.execCommand(command);
    } catch (e) {
      console.error("No se pudo aplicar el estilo:", e);
    }
  };

  win.querySelector("#boldBtn").onclick = () => applyStyle("bold");
  win.querySelector("#italicBtn").onclick = () => applyStyle("italic");
  win.querySelector("#underlineBtn").onclick = () => applyStyle("underline");
  editor.addEventListener("blur", saveSelection);

  if (options.firstLoad) {
    editor.innerHTML = `
      <h1 style="text-align: center;">Responsabilidades en proyectos</h1>
      <h2>Desarrollo de soluciones en entorno ETRM (Allegro)</h2>
      <p>Participación en el desarrollo de soluciones técnicas y funcionales dentro de un proyecto basado en Allegro ETRM, orientado al trading de commodities.</p>
      <p><b>Entre las tareas realizadas se incluyen:</b></p>
      <ul>
      <li>Implementación de funcionalidades adaptadas a los procesos de negocio del área de trading.</li>
      <li>Ejecución de pruebas funcionales junto con usuarios clave para validar los desarrollos.</li>
      <li>Colaboración en tareas de soporte de primer nivel, resolviendo incidencias operativas y dando asistencia al equipo de negocio.</li>
      <li>Participación en la mejora continua del sistema, proponiendo ajustes técnicos y funcionales.</li>
      </ul>
      <h2>Desarrollo de aplicaciones .NET (Desktop y Web)</h2>
      <p>Intervención en el diseño, desarrollo, pruebas y mantenimiento de aplicaciones tanto de escritorio como web basadas en tecnologías .NET.</p>
      <p><b>Este trabajo abarca:</b></p>
      <ul>
      <li>Desarrollo de nuevas funcionalidades en diferentes proyectos con múltiples versiones del framework .NET.</li>
      <li>Adaptación a distintos entornos tecnológicos y lenguajes asociados según las necesidades del proyecto.</li>
      <li>Diseño y ejecución de pruebas técnicas y funcionales para asegurar la calidad del software.</li>
      <li>Mantenimiento evolutivo y correctivo de aplicaciones existentes.</li>
      <li>Resolución de incidencias y optimización del rendimiento de las soluciones implementadas.</li>
      </ul>
      <h2>Liderazgo técnico en Dynamics 365 y Power Platform</h2>
      <p>Responsabilidad en el liderazgo del diseño, desarrollo y soporte de soluciones basadas en Microsoft Dynamics 365 y Power Platform.</p>
      <p><b>Las funciones principales incluyen:</b></p>
      <ul>
      <li>Definición de arquitecturas técnicas y diseño de soluciones funcionales alineadas con los requisitos del negocio.</li>
      <li>Liderazgo del desarrollo de aplicaciones, módulos y extensiones dentro del ecosistema Dynamics 365.</li>
      <li>Gestión del soporte y mantenimiento de aplicaciones en producción, asegurando su estabilidad y evolución.</li>
      <li>Coordinación técnica de equipos en la implementación de nuevas funcionalidades.</li>
      <li>Mejora continua de las soluciones mediante la optimización de procesos y la adopción de buenas prácticas en la plataforma.</li>
      </ul>`
  }

  if (options.title) {
    win.querySelector('.window-title').innerHTML = `${options.title} - ${win.querySelector('.window-title').innerHTML}`;
  }

}

window.textEditorDispose = () => { }
