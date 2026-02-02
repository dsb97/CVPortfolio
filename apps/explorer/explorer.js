/***********************
 * Explorer App (multi-window)
 ***********************/

/* =====================
   Data
===================== */

const fsData = [
    {
        contentType: "folder",
        name: "Frameworks",
        icon: "/assets/icons/frameworks.png",
        content: [
            {
                contentType: "folder",
                name: ".NET",
                icon: "assets/icons/dotnet.png",
                content: [
                    {
                        contentType: "file",
                        name: "Classic",
                        icon: "assets/icons/dotnetclassic.png",
                        experience: "Aplicaciones de escritorio",
                        version: "2 hasta 4.8"
                    },
                    {
                        contentType: "file",
                        name: "Core",
                        icon: "assets/icons/dotnetcore.png",
                        experience: "Web Apps, APIs y microservicios",
                        version: "2 hasta 9"
                    }
                ]
            },
            {
                contentType: "file",
                name: "Bootstrap",
                icon: "assets/icons/bootstrap.png",
                experience: "Diseño y maquetado web",
                version: "Latest (5.3)"
            },
            {
                contentType: "file",
                name: "JQuery",
                icon: "assets/icons/jQuery.png",
                experience: "Conexión a APIs, manejo del DOM",
                version: "Latest (3.7)"
            },
            {
                contentType: "file",
                name: "Laravel",
                icon: "assets/icons/laravel.png",
                experience: "Desarrollo de APIs",
                version: "8.0"
            },
            {
                contentType: "file",
                name: "Angular",
                icon: "assets/icons/angular.png",
                experience: "Desarrollo de SPAs",
                version: "12"
            },
            {
                contentType: "file",
                name: "Electron",
                icon: "assets/icons/electron.png",
                experience: "Desarrollo de aplicaciones de escritorio",
                version: ""
            }
        ]
    },
    {
        contentType: "folder",
        name: "Lenguajes",
        icon: "/assets/icons/languages.png",
        content: [
            {
                contentType: "file",
                name: "C#",
                icon: "assets/icons/csharp.png",
                experience: "Desarrollo de aplicaciones de escritorio y web, APIs y microservicios",
                version: ""
            },
            {
                contentType: "file",
                name: "Visual Basic",
                icon: "assets/icons/vb.png",
                experience: "Desarrollo de aplicaciones de escritorio y web y servicios SOAP",
                version: ""
            },
            {
                contentType: "file",
                name: "PHP",
                icon: "assets/icons/php.png",
                experience: "Desarrollo de APIs y backend",
                version: ""
            },
            {
                contentType: "file",
                name: "SQL",
                icon: "assets/icons/sql.png",
                experience: "Consultas de bases de datos y optimización; procesos batch",
                version: "Oracle y Microsoft"
            },
            {
                contentType: "file",
                name: "TypeScript",
                icon: "assets/icons/ts.png",
                experience: "Desarrollo de SPAs",
                version: ""
            },
            {
                contentType: "file",
                name: "HTML",
                icon: "assets/icons/html.png",
                experience: "Maquetado web semántico y accesible",
                version: ""
            },
            {
                contentType: "file",
                name: "SCSS",
                icon: "assets/icons/sass.png",
                experience: "Estilos mantenibles y modularizados",
                version: ""
            },
            {
                contentType: "file",
                name: "Java",
                icon: "assets/icons/java.png",
                experience: "Experiencia general en lógica y OOP",
                version: ""
            }
        ]
    },
    {
        contentType: "folder",
        name: "Microsoft",
        icon: "/assets/icons/microsoft.png",
        content: [
            {
                contentType: "folder",
                name: "Dynamics",
                icon: "/assets/icons/dynamics365.png",
                content: [
                    {
                        contentType: "file",
                        name: "Sales",
                        icon: "assets/icons/dynamics-sales.png",
                        experience: "Desarrollo de módulos",
                        version: "Dynamics 2016/365"
                    },
                    {
                        contentType: "file",
                        name: "Marketing",
                        icon: "assets/icons/dynamics-marketing.png",
                        experience: "Desarrollo/mantenimiento de campañas",
                        version: "Dynamics 365"
                    }
                ]
            },
            {
                contentType: "folder",
                name: "Azure",
                icon: "/assets/icons/azure.png",
                content: [
                    {
                        contentType: "file",
                        name: "DevOps",
                        icon: "assets/icons/devops.png",
                        experience: "Gestión de repositorios y CI/CD",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "App Services",
                        icon: "assets/icons/app-services.png",
                        experience: "Gestión y despliegue de Web Apps",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "Functions",
                        icon: "assets/icons/functions.png",
                        experience: "Gestión y despliegue de APIs y microservicios",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "Graph API",
                        icon: "assets/icons/graph.png",
                        experience: "Gestión de usuarios, grupos, sitios, drives, eventos y más",
                        version: ""
                    }
                ]
            },
            {
                contentType: "file",
                name: "SharePoint",
                icon: "/assets/icons/sharepoint.png",
                experience: 'Gestión de listas y sitios',
                version: 'SharePoint Online 365'
            },
            {
                contentType: "folder",
                name: "Power Platform",
                icon: "/assets/icons/powerplatform.png",
                content: [
                    {
                        contentType: "file",
                        name: "Dataverse",
                        icon: "assets/icons/dataverse.png",
                        experience: "Gestión y conexión a través de .NET",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "Power Automate",
                        icon: "assets/icons/automate.png",
                        experience: "Desarrollo de flujos de nube",
                        version: ""
                    }
                ]
            }
        ]
    }
];

/* =====================
   State
===================== */

// winId -> state
const explorers = new Map();

/* =====================
   Helpers
===================== */

function getWindow(winId) {
    return document.querySelector(`.window[data-window-id="${winId}"]`);
}

function getCurrentDirectory(data, path) {
    return path.reduce((dir, name) => {
        return dir.find(item => item.name === name)?.content || [];
    }, data);
}

/* =====================
   Render
===================== */

function render(winId) {
    const state = explorers.get(winId);
    const win = getWindow(winId);
    if (!state || !win) return;

    const container = win.querySelector("#explorer");
    const items = getCurrentDirectory(fsData, state.currentPath);

    container.innerHTML = "";
    renderPath(winId);

    if (state.currentView === "grid") {
        container.className = "ui-grid";
        items.forEach(item =>
            container.appendChild(renderGridItem(winId, item))
        );
    } else {
        container.className = "ui-list ui-list-columns";
        container.appendChild(renderListHeader());
        items.forEach(item =>
            container.appendChild(renderListItem(winId, item))
        );
    }
}

function renderPath(winId) {
    const state = explorers.get(winId);
    const win = getWindow(winId);
    const pathBar = win.querySelector("#pathBar");

    pathBar.innerHTML = "";

    const root = document.createElement("span");
    root.textContent = "Disco";
    root.onclick = () => navigateTo(winId, []);
    pathBar.appendChild(root);

    state.currentPath.forEach((segment, index) => {
        const span = document.createElement("span");
        span.textContent = segment;
        span.onclick = () =>
            navigateTo(winId, state.currentPath.slice(0, index + 1));
        pathBar.appendChild(span);
    });
}

/* =====================
   Items
===================== */

function renderGridItem(winId, item) {
    const state = explorers.get(winId);
    const div = document.createElement("div");

    const title =
        (item.experience || "") +
        (item.experience && item.version ? " - " : "") +
        (item.version || "");

    div.className = "ui-grid-item";
    div.title = title;
    div.innerHTML = `
    <img src="${item.icon}">
    <span>${item.name}</span>
  `;

    if (item.contentType === "folder") {
        div.ondblclick = () =>
            navigateTo(winId, [...state.currentPath, item.name]);
    }

    return div;
}

function renderListHeader() {
    const li = document.createElement("li");
    li.className = "ui-list-header";
    li.innerHTML = `
    <span>Nombre</span>
    <span>Experiencia</span>
    <span>Versión</span>
  `;
    return li;
}

function renderListItem(winId, item) {
    const state = explorers.get(winId);
    const li = document.createElement("li");

    li.innerHTML = `
    <span><img src="${item.icon}" class="ui-small-icon">${item.name}</span>
    <span>${item.experience || "—"}</span>
    <span>${item.version || "—"}</span>
  `;

    if (item.contentType === "folder") {
        li.ondblclick = () =>
            navigateTo(winId, [...state.currentPath, item.name]);
    }

    return li;
}

/* =====================
   Navigation
===================== */

function getWindowIdByEvent(e) {
    return e.target.closest('.window').dataset.windowId;
}

function navigateTo(winId, newPath) {
    const state = explorers.get(winId);

    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push([...newPath]);
    state.historyIndex++;

    state.currentPath = [...newPath];
    render(winId);
}

function goBack(e) {
    let winId = getWindowIdByEvent(e);
    const state = explorers.get(winId);
    if (state.historyIndex > 0) {
        state.historyIndex--;
        state.currentPath = [...state.history[state.historyIndex]];
        render(winId);
    }
}

function goForward(e) {
    let winId = getWindowIdByEvent(e);
    const state = explorers.get(winId);
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.currentPath = [...state.history[state.historyIndex]];
        render(winId);
    }
}

function switchView(e) {
    let winId = getWindowIdByEvent(e);
    const state = explorers.get(winId);
    const win = getWindow(winId);

    state.currentView = state.currentView === "grid" ? "list" : "grid";
    win.querySelector("#toggle-view img").src =
        `/assets/ui/${state.currentView}.png`;

    render(winId);
}

/* =====================
   Public API
===================== */

window.explorerInit = (winId) => {
    explorers.set(winId, {
        currentPath: [],
        history: [[]],
        historyIndex: 0,
        currentView: "grid"
    });

    render(winId);
};

//Refactor
window.explorerDispose = (winId) => {
    explorers.delete(winId);
};

window.explorerGoBack = (e) => goBack(e);
window.explorerGoForward = (e) => goForward(e);
window.explorerSwitchView = (e) => switchView(e);
window.explorerGoToPath = (e) => {
    getWindowIdByEvent(e);
    render(winId);
}
