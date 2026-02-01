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
                <li><strong>Experiencia</strong> ${(new Date().getFullYear() - 2018)} años desarrollando soluciones reales</li>
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

window.aboutChangeTab = aboutChangeTab;
window.aboutContactByMail = aboutContactByMail;

aboutChangeTab('overview');