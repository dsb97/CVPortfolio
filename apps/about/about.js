function aboutChangeTab(winId, tabId) {
    let win = window.getWindow(winId);
    const t = window.t;
    let html = '';
    let className = '';
    switch (tabId) {
        case 'overview':
            html = `
            <div class="about-image">
            <img src="/assets/images/me.png" alt="David S. Barragan">
            </div>

            <div class="about-info">
            <h1><strong>David</strong> S. Barragán</h1>
            <p class="ui-muted about-version">${t('about.overview.description')}</p>

            <ul class="ui-list about-specs">
                <li>${t('about.overview.position')}</li>
                <li><strong>${t('about.overview.mainStack')}</strong> .NET (Desktop/Web)</li>
                <li><strong>${t('about.overview.location.title')}</strong> Madrid (${t('about.overview.location.country')})</li>
            </ul>

            <div class="about-actions">
                <button class="ui-button" onclick='window.openApp("settings", {"setting":"language"})'>${t('about.overview.changeLanguage')}</button>
                <button class="ui-button primary" onclick = "window.open('/assets/CV.pdf', '_blank')">${t('about.overview.downloadCv')}</button>
            </div>
            </div>`;
            className = 'about-content';
            break;
        case 'contact':
            html = `
            <div class="contact-header">
            <img class="contact-icon" src="/assets/icons/contact.png" alt="">
            <div class="contact-text">
                <h4>${t('about.contact')}</h4>
                <p class="ui-muted">
                ${t('about.contact.description')}
                </p>
            </div>
            </div>

            <ul class="ui-list contact-list">
            <li>
                <span>${t('about.contact.email')}</span>
                <button class="ui-button" onclick="window.location.href = 'mailto:davidsanchezbarragan@gmail.com'">${t('about.contact.email.text')}</button>
            </li>
            <li>
                <span>LinkedIn</span>
                <button class="ui-button" onclick="window.open('https://www.linkedin.com/in/dsanchezb/', '_blank')">${t('about.contact.text')}</button>
            </li>
            <li>
                <span>X (Twitter)</span>
                <button class="ui-button" onclick="window.open('https://x.com/davdevdiv_', '_blank')">${t('about.contact.visit')}</button>
            </li>
            <li>
                <span>GitHub</span>
                <button class="ui-button" onclick="window.open('https://github.com/dsb97', '_blank')">${t('about.contact.github.text')}</button>
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
                <img src="/assets/icons/disk.png" alt="${t('about.workExperience')}">
                <span>${totalYears} ${t('about.workExperience.years')}</span>
            </div>

            <div class="experience-info">
                <h4>${t('about.workExperience')}</h4>

                <div class="experience-bar">
                    <div title="Indra" class="experience-segment blue" style="width: ${(indraYears / totalYears) * 100}%"></div>
                    <div title="NTT Data" class="experience-segment yellow" style="width: ${(nttYears / totalYears) * 100}%"></div>
                </div>

                <div class="experience-legend-inline">
                    <div class="legend-item">
                        <span class="legend-color blue"></span>
                        <span>Indra</span>
                        <span class="ui-muted">${indraYears} ${t('about.workExperience.years')}</span>
                    </div>

                    <div class="legend-item">
                        <span class="legend-color yellow"></span>
                        <span>NTT Data</span>
                        <span class="ui-muted">${nttYears} ${t('about.workExperience.years')}</span>
                    </div>
                </div>
            </div>

            <div class="experience-icon ui-muted">
                <img src="/assets/icons/suitcase.png" alt="${t('about.workExperience.sectors')}">
                <span>${totalProjects} ${t('about.workExperience.clients')}</span>
            </div>

            <div class="experience-info">
                <h4>${t('about.workExperience.sectors')}</h4>

                <div class="experience-bar">
                    <div title="${t('about.workExperience.public')}" class="experience-segment blue" style="width: ${(publicSector / totalProjects) * 100}%"></div>
                    <div title="${t('about.workExperience.international')}" class="experience-segment yellow" style="width: ${(international / totalProjects) * 100}%"></div>
                    <div title="${t('about.workExperience.banking')}" class="experience-segment red" style="width: ${(banking / totalProjects) * 100}%"></div>
                    <div title="${t('about.workExperience.energy')}" class="experience-segment green" style="width: ${(energy / totalProjects) * 100}%"></div>
                    <div title="${t('about.workExperience.businessTools')}" class="experience-segment purple" style="width: ${(internalTools / totalProjects) * 100}%"></div>
                </div>

                <div class="experience-legend-inline">
                    <div class="legend-item">
                        <span class="legend-color blue"></span>
                        <span>${t('about.workExperience.public')}</span>
                        <span class="ui-muted">${publicSector} ${t('about.workExperience.clients')}</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color yellow"></span>
                        <span>${t('about.workExperience.international')}</span>
                        <span class="ui-muted">${international} ${t('about.workExperience.clients')}</span>

                    </div>
                    <div class="legend-item">
                        <span class="legend-color red"></span>
                        <span>${t('about.workExperience.banking')}</span>
                        <span class="ui-muted">${banking} ${t('about.workExperience.clients')}</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color green"></span>
                        <span>${t('about.workExperience.energy')}</span>
                        <span class="ui-muted">${energy} ${t('about.workExperience.clients')}</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color purple"></span>
                        <span>${t('about.workExperience.businessTools')}</span>
                        <span class="ui-muted">${internalTools} ${t('about.workExperience.clients')}</span>
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
                <strong>${t('about.education.dam')}</strong>
                <span class="ui-muted">2016 - 2018</span>
            </div>

            <div class="education-item">
                <img src="/assets/icons/daw.png" alt="CFGS DAW">
                <strong>${t('about.education.daw')}</strong>
                <span class="ui-muted">2021 - 2022</span>
            </div>

            <div class="education-item">
                <img src="/assets/icons/english.png" alt="${t('about.education.englishAlt')}">
                <strong>Key English Test - Cambridge</strong>
                <span class="ui-muted">2018</span>
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
    window.translateElement(win);

}

window.aboutInit = (winId, options) => {
    aboutChangeTab(winId, 'overview');
    let win = window.getWindow(winId);
    window.addEventListener('languagechange', () => {
        const activeTab = win.querySelector('.ui-tab.active')?.id || 'overview';
        aboutChangeTab(winId, activeTab);
    });
    const tabs = win.querySelector('.ui-tabs.about-tabs');
    tabs.addEventListener('click', (e) => {
        if (!e.target.id) return;
        aboutChangeTab(winId, e.target.id);
    });

}

window.aboutDispose = () => {

}
