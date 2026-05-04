window.textEditorInit = (winId, options) => {
  const win = window.getWindow(winId);
  const editor = win.querySelector("#editor");
  const sidebar = win.querySelector("#sidebar");
  const textPanel = win.querySelector("#textPanel");
  const mediaPanel = win.querySelector("#mediaPanel");

  let savedRange = null;
  let loadingInitialContent = false;

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
  editor.addEventListener("input", () => {
    if (!loadingInitialContent) {
      editor.dataset.generatedInitialContent = 'false';
    }
  });

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
  win.querySelectorAll("[data-list]").forEach(btn => {
    btn.onclick = () => {
      document.execCommand(
        btn.dataset.list === "ul" ? "insertUnorderedList" : "insertOrderedList"
      );
    };
  });

  // ALIGN
  win.querySelectorAll("[data-align]").forEach(btn => {
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
    a.download = `${editor.firstElementChild.textContent.substring(0, 60).trim() || window.t('editor.newDocument')}.ted`;
    a.click();
  };

  // OPEN
  win.querySelector("#openFile").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.innerHTML = reader.result;
      window.setWindowTitle(winId, file.name);
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
      console.error(window.t('editor.applyStyleError'), e);
    }
  };

  win.querySelector("#boldBtn").onclick = () => applyStyle("bold");
  win.querySelector("#italicBtn").onclick = () => applyStyle("italic");
  win.querySelector("#underlineBtn").onclick = () => applyStyle("underline");
  editor.addEventListener("blur", saveSelection);

  if (options.firstLoad) {
    loadingInitialContent = true;
    editor.innerHTML = window.t('editor.initialContent');
    editor.dataset.generatedInitialContent = 'true';
    loadingInitialContent = false;
  }

  window.addEventListener('languagechange', () => {
    window.translateElement(win);

    if (options.firstLoad && editor.dataset.generatedInitialContent === 'true') {
      loadingInitialContent = true;
      editor.innerHTML = window.t('editor.initialContent');
      loadingInitialContent = false;
    }
  });

}

window.textEditorDispose = () => { }
