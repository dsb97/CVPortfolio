function aboutChangeTab(tabId) {
    let html = '';
    let className = '';
    switch (tabId) {
        case 'overview':
            html = `
            <div class="about-image">
            <img src="/assets/images/me.png" alt="Un selfie mío">
            </div>

            <div class="about-info">
            <h1><strong>David</strong> Sánchez Barragán</h1>
            <p class="about-version">Desarrollador de aplicaciones</p>

            <ul class="ui-list about-specs">
                <li>Desarrollador full-stack</li>
                <li><strong>Stack principal</strong> .NET (Desktop/Web)</li>
                <li><strong>Ubicación</strong> Madrid</li>
            </ul>

            <div class="about-actions">
                <button class="ui-button">Cambiar idioma...</button>
                <button class="ui-button">Actualizar sistema...</button>
            </div>
            </div>`;
            className = 'about-content';
            break;
        case 'contact':
            html = `
            <div class="contact-header">
            <img class="contact-icon" src="/assets/icons/contact.png" alt="">
            <div class="contact-text">
                <h2>Contacto</h2>
                <p>
                Si este proyecto le ha interesado y le gustaría ver algo similar
                en su empresa, no dude en contactar conmigo.
                </p>
            </div>
            </div>

            <ul class="ui-list contact-list">
            <li>
                <span>Correo electrónico</span>
                <button class="ui-button" onclick="aboutContactByMail()">Enviar email</button>
            </li>
            <li>
                <span>LinkedIn</span>
                <button class="ui-button">Ver perfil</button>
            </li>
            <li>
                <span>X (Twitter)</span>
                <button class="ui-button">Visitar</button>
            </li>
            <li>
                <span>GitHub</span>
                <button class="ui-button">Ver repositorios</button>
            </li>
            </ul>`;
            className = 'contact-layout';
            break;
        case 'experience':
            const totalYears = (new Date().getFullYear() - 2018) - 1;
            const indraYears = 3;
            const nttYears = totalYears - indraYears;

            html = `
            <div class="experience-layout">
            
            <div class="experience-icon">
                <img src="/assets/icons/disk.png" alt="Experiencia">
                <span>${totalYears} años</span>
            </div>

            <div class="experience-info">
                <h2>Experiencia profesional</h2>

                <div class="experience-bar">
                <div
                    class="experience-segment indra"
                    style="width: ${(indraYears / totalYears) * 100}%"
                ></div>
                <div
                    class="experience-segment ntt"
                    style="width: ${(nttYears / totalYears) * 100}%"
                ></div>
                </div>

                <div class="experience-legend-inline">
                <div class="legend-item">
                    <span class="legend-color indra"></span>
                    <span>Indra</span>
                    <span class="legend-value">${indraYears} años</span>
                </div>

                <div class="legend-item">
                    <span class="legend-color ntt"></span>
                    <span>NTT Data</span>
                    <span class="legend-value">${nttYears} años</span>
                </div>

                <div class="legend-item">
                    <span class="legend-color total"></span>
                    <span>Total</span>
                    <span class="legend-value">${totalYears} años</span>
                </div>
                </div>
            </div>

            </div>
        `;
            className = '';
            break;
        case 'diplomas':
            html = `
            <div class="education-scroll">

            <div class="education-item">
                <img src="/assets/icons/dam.png" alt="CFGS DAM">
                <strong>CFGS Desarrollo de Aplicaciones Multiplataforma</strong>
                <span>2016 - 2018</span>
            </div>

            <div class="education-item">
                <img src="/assets/icons/daw.png" alt="CFGS DAW">
                <strong>CFGS Desarrollo de Aplicaciones Web</strong>
                <span>2021 - 2022</span>
            </div>

            </div>
        `;
            className = '';
            break;

    }
    const contentElement = document.querySelector('#content');
    contentElement.innerHTML = html;
    contentElement.className = className;

    let tabs = document.querySelector('.about-tabs').querySelectorAll('.ui-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`#${tabId}`).classList.add('active');

}

function aboutContactByMail() {
    window.location.href = "mailto:davidsanchezbarragan@gmail.com";
}

window.aboutInit = () => {
    aboutChangeTab('overview');
}

window.aboutChangeTab = aboutChangeTab;
window.aboutContactByMail = aboutContactByMail;

window.aboutDispose = () => {
    window.aboutInit = undefined;
    window.aboutChangeTab = undefined;
    window.aboutContactByMail = undefined;
}

