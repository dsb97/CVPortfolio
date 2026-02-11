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
  win.querySelector("#openBtn").onclick = () =>
    win.querySelector("#openFile").click();

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
      <h2>NTT Data</h2>
      <p>
      <ul>
          <li>Diseño, desarrollo y mantenimiento de aplicaciones .NET (de escritorio y web) para diversos proyectos y
              clientes, incluyendo el sector público nacional e internacional, así como sector bancario.</li>
          <li>Desarrollo y soporte de soluciones técnicas y funcionales en Dynamics 365, Power Automate, .NET y
              SharePoint, incluyendo diseño de procesos, modelado de datos y definición de integraciones con APIs y
              servicios externos.</li>
      </ul>
      <div><br></div>
      </p>
      <h2>Indra</h2>
      <p>
      <ul>
          <li>Diseño, desarrollo y mantenimiento de aplicaciones .NET para proyectos del sector público y energético.</li>
          <li>Desarrollo de soluciones técnicas y funcionales en Allegro ETRM en entornos de comercio de materias primas,
              optimizando procesos y soporte para la gestión comercial y operativa.</li>
      </ul>
      </p>`
  }

  if (options.title) {
    win.querySelector('.window-title').innerHTML = `${options.title} - ${win.querySelector('.window-title').innerHTML}`;
  }

}

window.textEditorDispose = () => { }
