function aboutChangeTab(winId, tabId) {
    let win = window.getWindow(winId);
    let html = '';
    let className = '';
    switch (tabId) {
        case 'overview':
            html = `
            <div class="about-image">
            <img src="/assets/images/me.png" alt="Un selfie mío">
            </div>

            <div class="about-info">
            <h1><strong>David</strong> S. Barragán</h1>
            <p class="ui-muted about-version">Desarrollador de aplicaciones</p>

            <ul class="ui-list about-specs">
                <li>Desarrollador Full-Stack</li>
                <li><strong>Stack principal</strong> .NET (Desktop/Web)</li>
                <li><strong>Ubicación</strong> Madrid</li>
            </ul>

            <div class="about-actions">
                <button class="ui-button" onclick='window.openApp("settings", {"setting":"language"})'>Cambiar idioma</button>
                <button class="ui-button primary" onclick = "window.open('/assets/CV.pdf', '_blank')">Descargar este CV...</button>
            </div>
            </div>`;
            className = 'about-content';
            break;
        case 'contact':
            html = `
            <div class="contact-header">
            <img class="contact-icon" src="/assets/icons/contact.png" alt="">
            <div class="contact-text">
                <h4>Contacto</h4>
                <p class="ui-muted">
                Si este proyecto le ha interesado y le gustaría ver algo similar
                en su empresa, no dude en contactar conmigo.
                </p>
            </div>
            </div>

            <ul class="ui-list contact-list">
            <li>
                <span>Correo electrónico</span>
                <button class="ui-button" onclick="window.location.href = 'mailto:davidsanchezbarragan@gmail.com'">Enviar email</button>
            </li>
            <li>
                <span>LinkedIn</span>
                <button class="ui-button" onclick="window.open('https://www.linkedin.com/in/dsanchezb/', '_blank')">Ver perfil</button>
            </li>
            <li>
                <span>X (Twitter)</span>
                <button class="ui-button" onclick="window.open('https://x.com/davdevdiv_', '_blank')">Visitar</button>
            </li>
            <li>
                <span>GitHub</span>
                <button class="ui-button" onclick="window.open('https://github.com/dsb97', '_blank')">Ver repositorios</button>
            </li>
            </ul>`;
            className = 'contact-layout';
            break;
        case 'experience':
            const totalYears = (new Date().getFullYear() - 2018) - 1;
            const indraYears = 3;
            const nttYears = totalYears - indraYears;

            const publicSector = 3;
            const international = 3;
            const banking = 1;
            const energy = 2;
            const internalTools = 2;
            const totalProjects = publicSector + international + banking + energy + internalTools;

            html = `            
            <div class="experience-icon ui-muted">
                <img src="/assets/icons/disk.png" alt="Experiencia">
                <span>${totalYears} años</span>
            </div>

            <div class="experience-info">
                <h4>Experiencia laboral</h4>

                <div class="experience-bar">
                    <div title="Indra" class="experience-segment blue" style="width: ${(indraYears / totalYears) * 100}%"></div>
                    <div title="NTT Data" class="experience-segment yellow" style="width: ${(nttYears / totalYears) * 100}%"></div>
                </div>

                <div class="experience-legend-inline">
                    <div class="legend-item">
                        <span class="legend-color blue"></span>
                        <span>Indra</span>
                        <span class="ui-muted">${indraYears} años</span>
                    </div>

                    <div class="legend-item">
                        <span class="legend-color yellow"></span>
                        <span>NTT Data</span>
                        <span class="ui-muted">${nttYears} años</span>
                    </div>
                </div>
            </div>

            <div class="experience-icon ui-muted">
                <img src="/assets/icons/suitcase.png" alt="Sectores">
                <span>${totalProjects} clientes</span>
            </div>

            <div class="experience-info">
                <h4>Sectores</h4>

                <div class="experience-bar">
                    <div title="Sector público" class="experience-segment blue" style="width: ${(publicSector / totalProjects) * 100}%"></div>
                    <div title="Internacional" class="experience-segment yellow" style="width: ${(international / totalProjects) * 100}%"></div>
                    <div title="Banca" class="experience-segment red" style="width: ${(banking / totalProjects) * 100}%"></div>
                    <div title="Energía" class="experience-segment green" style="width: ${(energy / totalProjects) * 100}%"></div>
                    <div title="Herramientas empresariales" class="experience-segment purple" style="width: ${(internalTools / totalProjects) * 100}%"></div>
                </div>

                <div class="experience-legend-inline">
                    <div class="legend-item">
                        <span class="legend-color blue"></span>
                        <span>Público</span>
                        <span class="ui-muted">${publicSector} clientes</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color yellow"></span>
                        <span>Internacional</span>
                        <span class="ui-muted">${international} clientes</span>

                    </div>
                    <div class="legend-item">
                        <span class="legend-color red"></span>
                        <span>Banca</span>
                        <span class="ui-muted">${banking} clientes</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color green"></span>
                        <span>Energía</span>
                        <span class="ui-muted">${energy} clientes</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color purple"></span>
                        <span>Herramientas empresariales</span>
                        <span class="ui-muted">${internalTools} clientes</span>
                    </div>
                </div>
            </div>
        `;
        
            className = 'experience-layout';
            break;
        case 'diplomas':
            html = `
            <div class="education-item">
                <img src="/assets/icons/dam.png" alt="CFGS DAM">
                <strong>CFGS Desarrollo de Aplicaciones Multiplataforma</strong>
                <span class="ui-muted">2016 - 2018</span>
            </div>

            <div class="education-item">
                <img src="/assets/icons/daw.png" alt="CFGS DAW">
                <strong>CFGS Desarrollo de Aplicaciones Web</strong>
                <span class="ui-muted">2021 - 2022</span>
            </div>
        `;
            className = 'education-scroll';
            break;
    }
    const contentElement = win.querySelector('#content');
    contentElement.innerHTML = html;
    contentElement.className = className;

    let tabs = win.querySelector('.about-tabs').querySelectorAll('.ui-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    win.querySelector(`#${tabId}`).classList.add('active');

}

window.aboutInit = (winId, options) => {
    aboutChangeTab(winId, 'overview');
    let win = window.getWindow(winId);
    const tabs = win.querySelector('.ui-tabs.about-tabs');
    tabs.addEventListener('click', (e) => {
        if (!e.target.id) return;
        aboutChangeTab(winId, e.target.id);
    });

}

window.aboutDispose = () => {

}

