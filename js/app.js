(function (app) {
  ("use strict");

  let siteConfig, portfolio, currentPage;
  let browserStorage = { lang: "", theme: "" };


  app.pageSetup = async function (page) {
    currentPage = page;

    await insertHeaderAsync();
    insertFooter();

    await loadSiteDataAsync();

    await setPageContent();

    wireUpEvents();

    preloadImages();
  };



  async function loadSiteDataAsync() {

    siteConfig = await appIO.getSiteConfigAsync();

    browserStorage = appIO.getBrowserStorage(siteConfig.languages, siteConfig.defaultTheme);

    setSiteLanguage();
    setSiteTheme();


    if(currentPage == "portfolio"){

      portfolio = [];
            
      siteConfig.portfolio.fileNames.forEach(async fileName => {
        const project = await fetch(`./data/${siteConfig.portfolio.folderName}/${fileName}.json`)
                              .then((response) => response.json());
        portfolio.push(project);
      });
    }

  }



  async function setPageContent() {

    const config = siteConfig[browserStorage.lang];

    appContent.setMenuText(config.menu);

    appContent.setPageTitle(currentPage, config.pageTitle);


    switch (currentPage) {

      case "home":
        appContent.setHomeText(config[currentPage]);
        break;

      case "about":
        appContent.setAboutText(config[currentPage]);
        break;

      case "contact":
        appContent.setContactText(config[currentPage]);
        break;

      case "portfolio":
        await appContent.fillPortfolioAsync(portfolio, browserStorage.lang);
        break;
    }

    appContent.setFooterText(config.footerSuffix);
  }



  //#region EVENTS
  function wireUpEvents() {
    document.getElementById("lang-list").addEventListener("click", handleLanguageSelectAsync);

    document.getElementById("theme-list").addEventListener("click", handleThemeSelectAsync);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => setSiteTheme());

    if (currentPage === "contact") document.getElementById("contact-form").onsubmit = handleFormSubmit;

    if (currentPage === "portfolio") {
      const pf = document.getElementById("portfolio-showroom");
      const pfCollapse = document.getElementById("portfolio-collapse");
      const project = document.getElementById("project");
      const projectCollapse = document.getElementById("project-collapse");
      const projectClose = document.getElementById("project-close");

      pf.addEventListener("click", handlePortfolioClick);
      pf.addEventListener("hidden.bs.collapse", () => projectCollapse.click());

      projectClose.addEventListener("click", () => projectCollapse.click());
      project.addEventListener("hidden.bs.collapse", () => pfCollapse.click());
    }
  }

  async function handleLanguageSelectAsync(e) {
    let selectedAnchor;
    const elName = e.target.tagName.toLowerCase();

    if (elName === "a") selectedAnchor = e.target;
    if (elName === "img") selectedAnchor = e.target.parentElement;

    if (selectedAnchor !== undefined) {
      e.preventDefault();

      const selectedLang = selectedAnchor.getAttribute("data-bs-language");
      if (browserStorage.lang !== selectedLang) {
        browserStorage.lang = selectedLang;
        appIO.saveBrowserStorage(browserStorage);

        await loadSiteDataAsync();
        setPageContent();
      }
    }
  }

  async function handleThemeSelectAsync(e) {
    let selectedAnchor;
    const elName = e.target.tagName.toLowerCase();

    if (elName === "a") selectedAnchor = e.target;
    if (elName === "i") selectedAnchor = e.target.parentElement;

    if (selectedAnchor !== undefined) {
      e.preventDefault();

      const selectedTheme = selectedAnchor.getAttribute("data-bs-theme-value");
      if (browserStorage.theme !== selectedTheme) {
        browserStorage.theme = selectedTheme;
        appIO.saveBrowserStorage(browserStorage);
        setSiteTheme();
      }
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById("contact-form");
    const name = form.querySelector("#name").value;
    const email = form.querySelector("#email").value;
    const message = form.querySelector("#message").value;
    const lineBreak = "%0D%0A";

    const emailString = `mailto:${siteConfig.contactMail}?subject=Contacto Web ${name}`;
    emailString += `&body=Nombre: ${name}${lineBreak}Email: ${email}${lineBreak}Mensaje: ${message}${lineBreak}`;
    window.open(emailString);
  }

  function handlePortfolioClick(e) {
    e.preventDefault();
    const anchor = e.target.closest("a");
    if (anchor === null) return;

    const projectId = anchor.id;

    appContent.setProjectText(portfolio[projectId-1], browserStorage.lang);

    document.getElementById("portfolio-showroom").classList.remove("show");
    document.getElementById("project-collapse").click();
  }

  //#endregion



  //#region COMMON HTML
  async function insertHeaderAsync() {
    const header = document.createElement("header");

    header.innerHTML = await appIO.getTextFromFileAsync("./html/header.html");
    header.classList.add("m-md-auto", "d-flex");
    header.setAttribute("data-bs-theme", "dark");

    let menuId = `#${currentPage}MenuId`;
    if (currentPage === "project") menuId = "#portfolioMenuId";
    const menu = header.querySelector(menuId);
    menu.classList.add("active");
    menu.setAttribute("aria-current", "page");

    document.querySelector("body").prepend(header);
  }

  function insertFooter() {
    const footer = document.createElement("footer");
    footer.classList.add("bg-dark", "mt-2", "p-2", "fixed-bottom");
    document.querySelector("body").append(footer);
  }
  //#endregion


  //#region SITE SETTINGS
    function setSiteLanguage() {
      document.querySelectorAll("#lang-list a").forEach((el) => el.classList.remove("selected"));
  
      const languageItem = document.querySelector(`#lang-list a[data-bs-language = ${browserStorage.lang}]`);
      if (languageItem !== null) languageItem.classList.add("selected");
  
      document.documentElement.setAttribute("lang", browserStorage.lang);
    }
  
    function setSiteTheme() {
      document.querySelectorAll("#theme-list a").forEach((el) => el.classList.remove("selected"));
  
      const themeItem = document.querySelector(`#theme-list a[data-bs-theme-value = ${browserStorage.theme}]`);
      if (themeItem !== null) themeItem.classList.add("selected");
  
      const sysLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const pageTheme = browserStorage.theme === "auto" ? (sysLight ? "light" : "dark") : browserStorage.theme;
      document.documentElement.setAttribute("data-bs-theme", pageTheme);
    }
  //#endregion


  function preloadImages(){
    for (let i = 0; i < portfolio.length; i++) {
      const project = portfolio[i];
      for (let j = 0; j < project.images.length; j++) {
        const imgUrl = './img/portfolio/' + project.images[j] +  '.webp';
        let img = new Image();
        img.src = imgUrl;      
      }
    }
  }

})((window.app = window.app || {}));
