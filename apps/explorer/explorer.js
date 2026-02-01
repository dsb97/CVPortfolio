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

let currentPath = [];
let history = [
    [...currentPath] // estado inicial (root)
];
let historyIndex = 0;
let currentView = "grid"; // "grid" | "list"

function getCurrentDirectory(data, path) {
    return path.reduce((dir, name) => {
        return dir.find(item => item.name === name).content;
    }, data);
}

const items = getCurrentDirectory(fsData, currentPath);

function render(items) {
    const container = document.getElementById("explorer");
    container.innerHTML = "";

    renderPath();

    if (currentView === "grid") {
        container.className = "ui-grid";
        items.forEach(item => container.appendChild(renderGridItem(item)));
    } else {
        container.className = "ui-list ui-list-columns";
        container.appendChild(renderListHeader());
        items.forEach(item => container.appendChild(renderListItem(item)));
    }
}

function renderGridItem(item) {
    const div = document.createElement("div");
    let title = (item.experience || '') + (item.experience && item.version ? ' - ' : '') + (item.version || '');
    div.title = title;
    div.className = "ui-grid-item";
    div.innerHTML = `
    <img title='${title}' src="${item.icon}">
    <span title='${title}'>${item.name}</span>
  `;

    if (item.contentType === "folder") {
        div.ondblclick = () => {
            navigateTo([...currentPath, item.name])
        };
        // div.onclick = () => {
        //     div.classList.add('active');
        // };
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

function renderListItem(item) {
    const li = document.createElement("li");

    li.innerHTML = `
    <span><img src='${item.icon}' class='ui-small-icon'/>${item.name}</span>
    <span title='${item.experience}'>${item.experience || "—"}</span>
    <span title='${item.version}'>${item.version || "—"}</span>
  `;

    if (item.contentType === "folder") {
        li.ondblclick = () => {
            navigateTo([...currentPath, item.name])
        };
        // li.onclick = () => {
        //     li.classList.add('active');
        // };
    }

    return li;
}

function navigateTo(newPath) {
    history = history.slice(0, historyIndex + 1);
    history.push([...newPath]);
    historyIndex++;

    currentPath = [...newPath];
    render(getCurrentDirectory(fsData, currentPath));
}

function switchView() {
    currentView = currentView == 'grid' ? 'list' : 'grid';
    document.querySelector('#toggle-view>img').src = `/assets/ui/${currentView}.png`;
    render(getCurrentDirectory(fsData, currentPath));
}

function renderPath() {
    const pathBar = document.getElementById("pathBar");
    pathBar.innerHTML = "";

    const root = document.createElement("span");
    root.textContent = "Disco";
    root.onclick = () => {
        navigateTo([]);
    };
    pathBar.appendChild(root);

    currentPath.forEach((segment, index) => {
        const span = document.createElement("span");
        span.textContent = segment;
        span.onclick = () => {
            navigateTo(currentPath.slice(0, index + 1));
        };

        pathBar.appendChild(span);
    });
}

function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        currentPath = [...history[historyIndex]];
        render(getCurrentDirectory(fsData, currentPath));
    }
}

function goForward() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        currentPath = [...history[historyIndex]];
        render(getCurrentDirectory(fsData, currentPath));
    }
}

function jumpTo(newPath) {
    currentPath = [...newPath];
    render(getCurrentDirectory(fsData, currentPath));
}

document.querySelector('#toggle-view').addEventListener('click', function () {
    switchView();
});

window.explorerGoBack = goBack;
window.explorerGoForward = goForward;
window.explorerGoToPath = () => {
    render(getCurrentDirectory(fsData, currentPath));
}

window.explorerDispose = () => {
    window.explorerGoBack = undefined;
    window.explorerGoForward = undefined;
}

render(getCurrentDirectory(fsData, currentPath));