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
        nameKey: "explorer.folder.frameworks",
        icon: "/assets/icons/frameworks.png",
        defaultView: 'list',
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
                        experienceKey: "explorer.exp.desktopApps",
                        versionKey: "explorer.version.dotnetClassic"
                    },
                    {
                        contentType: "file",
                        name: "Core",
                        icon: "assets/icons/dotnetcore.png",
                        experienceKey: "explorer.exp.webAppsApisMicroservices",
                        version: "2 hasta 9"
                    }
                ]
            },
            {
                contentType: "file",
                name: "Bootstrap",
                icon: "assets/icons/bootstrap.png",
                experienceKey: "explorer.exp.webLayout",
                version: "Latest (5.3)"
            },
            {
                contentType: "file",
                name: "JQuery",
                icon: "assets/icons/jQuery.png",
                experienceKey: "explorer.exp.apiConnectionDom",
                version: "Latest (3.7)"
            },
            {
                contentType: "file",
                name: "Laravel",
                icon: "assets/icons/laravel.png",
                experienceKey: "explorer.exp.apiDevelopment",
                version: "8.0"
            },
            {
                contentType: "file",
                name: "Angular",
                icon: "assets/icons/angular.png",
                experienceKey: "explorer.exp.spaDevelopment",
                version: "12"
            },
            {
                contentType: "file",
                name: "Electron",
                icon: "assets/icons/electron.png",
                experienceKey: "explorer.exp.desktopAppDevelopment",
                version: ""
            }
        ]
    },
    {
        contentType: "folder",
        name: "Lenguajes",
        nameKey: "explorer.folder.languages",
        icon: "/assets/icons/languages.png",
        defaultView: 'grid',
        content: [
            {
                contentType: "file",
                name: "C#",
                icon: "assets/icons/csharp.png",
                experienceKey: "explorer.exp.desktopWebApisMicroservices",
                version: ""
            },
            {
                contentType: "file",
                name: "Visual Basic",
                icon: "assets/icons/vb.png",
                experienceKey: "explorer.exp.desktopWebSoap",
                version: ""
            },
            {
                contentType: "file",
                name: "PHP",
                icon: "assets/icons/php.png",
                experienceKey: "explorer.exp.backendApiDevelopment",
                version: ""
            },
            {
                contentType: "file",
                name: "SQL",
                icon: "assets/icons/sql.png",
                experienceKey: "explorer.exp.databaseOptimization",
                versionKey: "explorer.version.oracleMicrosoft"
            },
            {
                contentType: "file",
                name: "TypeScript",
                icon: "assets/icons/ts.png",
                experienceKey: "explorer.exp.spaDevelopment",
                version: ""
            },
            {
                contentType: "file",
                name: "HTML",
                icon: "assets/icons/html.png",
                experienceKey: "explorer.exp.semanticLayout",
                version: ""
            },
            {
                contentType: "file",
                name: "SCSS",
                icon: "assets/icons/sass.png",
                experienceKey: "explorer.exp.maintainableStyles",
                version: ""
            },
            {
                contentType: "file",
                name: "Java",
                icon: "assets/icons/java.png",
                experienceKey: "explorer.exp.oop",
                version: ""
            }
        ]
    },
    {
        contentType: "folder",
        name: "Microsoft",
        nameKey: "explorer.folder.microsoft",
        icon: "/assets/icons/microsoft.png",
        defaultView: 'list',
        content: [
            {
                contentType: "folder",
                name: "Dynamics",
                nameKey: "explorer.folder.dynamics",
                icon: "/assets/icons/dynamics365.png",
                content: [
                    {
                        contentType: "file",
                        name: "Sales",
                        icon: "assets/icons/dynamics-sales.png",
                        experienceKey: "explorer.exp.moduleDevelopment",
                        version: "Dynamics 2016/365"
                    },
                    {
                        contentType: "file",
                        name: "Marketing",
                        icon: "assets/icons/dynamics-marketing.png",
                        experienceKey: "explorer.exp.campaignMaintenance",
                        version: "Dynamics 365"
                    }
                ]
            },
            {
                contentType: "folder",
                name: "Azure",
                nameKey: "explorer.folder.azure",
                icon: "/assets/icons/azure.png",
                content: [
                    {
                        contentType: "file",
                        name: "DevOps",
                        icon: "assets/icons/devops.png",
                        experienceKey: "explorer.exp.repositoriesCicd",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "App Services",
                        icon: "assets/icons/app-services.png",
                        experienceKey: "explorer.exp.webAppsDeployment",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "Functions",
                        icon: "assets/icons/functions.png",
                        experienceKey: "explorer.exp.apisMicroservicesDeployment",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "Graph API",
                        icon: "assets/icons/graph.png",
                        experienceKey: "explorer.exp.graphManagement",
                        version: ""
                    }
                ]
            },
            {
                contentType: "file",
                name: "SharePoint",
                icon: "/assets/icons/sharepoint.png",
                experienceKey: 'explorer.exp.listsSites',
                version: 'SharePoint Online 365'
            },
            {
                contentType: "folder",
                name: "Power Platform",
                nameKey: "explorer.folder.powerPlatform",
                icon: "/assets/icons/powerplatform.png",
                content: [
                    {
                        contentType: "file",
                        name: "Dataverse",
                        icon: "assets/icons/dataverse.png",
                        experienceKey: "explorer.exp.dataverseConnection",
                        version: ""
                    },
                    {
                        contentType: "file",
                        name: "Power Automate",
                        icon: "assets/icons/automate.png",
                        experienceKey: "explorer.exp.cloudFlows",
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

function getCurrentDirectory(data, path) {
    return path.reduce((dir, name) => {
        return dir.find(item => item.name === name)?.content || [];
    }, data);
}

function getFolderByPath(data, path) {
    return path.reduce((dir, name) => {
        // dir es siempre un objeto { name, content?, ... }
        // o al inicio { content: data }
        return dir.content?.find(item => item.name === name) || null;
    }, { content: data });
}

function itemName(item) {
    return item.nameKey ? window.t(item.nameKey) : item.name;
}

function itemExperience(item) {
    return item.experienceKey ? window.t(item.experienceKey) : item.experience;
}

function itemVersion(item) {
    return item.versionKey ? window.t(item.versionKey) : item.version;
}

function getItemByPath(path) {
    if (!path.length) return null;
    return getFolderByPath(fsData, path);
}

function pathSegmentName(path) {
    const item = getItemByPath(path);
    return item ? itemName(item) : path[path.length - 1];
}



/* =====================
   Render
===================== */

function render(winId) {
    const state = explorers.get(winId);
    const win = window.getWindow(winId);
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

    window.setWindowTitle(winId, win.querySelector('#pathBar').lastElementChild.textContent, { custom: true });
}

function renderPath(winId) {
    const state = explorers.get(winId);
    const win = window.getWindow(winId);
    const pathBar = win.querySelector("#pathBar");

    pathBar.innerHTML = "";

    const root = document.createElement("span");
    root.textContent = window.t('explorer.disk');
    root.onclick = () => navigateTo(winId, []);
    pathBar.appendChild(root);

    state.currentPath.forEach((segment, index) => {
        const span = document.createElement("span");
        span.textContent = pathSegmentName(state.currentPath.slice(0, index + 1));
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

    const experience = itemExperience(item) || "";
    const version = itemVersion(item) || "";
    const title =
        experience +
        (experience && version ? " - " : "") +
        version;

    div.className = "ui-grid-item";
    div.title = title;
    div.innerHTML = `
    <img src="${item.icon}">
    <span>${itemName(item)}</span>
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
    <span>${window.t('explorer.name')}</span>
    <span>${window.t('explorer.experience')}</span>
    <span>${window.t('explorer.version')}</span>
  `;
    return li;
}

function renderListItem(winId, item) {
    const state = explorers.get(winId);
    const li = document.createElement("li");
    const experience = itemExperience(item) || "";
    const version = itemVersion(item) || "";

    li.innerHTML = `
    <span><img src="${item.icon}" class="ui-small-icon">${itemName(item)}</span>
    <span title='${experience}'>${experience || "—"}</span>
    <span title='${version}'>${version || "—"}</span>
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
    const win = window.getWindow(winId);

    state.currentView = state.currentView === "grid" ? "list" : "grid";
    win.querySelector("#toggle-view img").src =
        `/assets/ui/${state.currentView === "grid" ? "list" : "grid"}.png`;

    render(winId);
}

/* =====================
   Public API
===================== */

window.explorerInit = (winId, options) => {
    const initialPath = options.path ? options.path : [];
    const folder = getFolderByPath(fsData, initialPath);

    explorers.set(winId, {
        currentPath: [...initialPath],
        history: [[...initialPath]],
        historyIndex: 0,
        currentView: folder?.defaultView || "grid"
    });

    const win = window.getWindow(winId);
    win.querySelector("#toggle-view img").src =
        `/assets/ui/${folder?.defaultView === "grid" ? "list" : "grid"}.png`;

    render(winId);
};

window.addEventListener('languagechange', () => {
    explorers.forEach((_, winId) => {
        const win = window.getWindow(winId);
        if (win) {
            window.translateElement(win);
            render(winId);
        }
    });
});


window.explorerDispose = (winId) => {
    explorers.clear();
};

window.explorerGoBack = (e) => goBack(e);
window.explorerGoForward = (e) => goForward(e);
window.explorerSwitchView = (e) => switchView(e);
window.explorerGoToPath = (e) => {
    const winId = getWindowIdByEvent(e);
    render(winId);
}
