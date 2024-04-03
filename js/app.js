(function (app) {
  ("use strict");

  import("./app-data.js");
  import("./app-text.js");

  let siteConfig, siteData, currentPage;
  let browserConfig = { lang: "", theme: "" };

  app.pageSetup = async function (page) {
    currentPage = page;

    await insertCommonHtml();

    await loadSiteDataAsync();

    setPageText();

    wireUpEvents();
  };

  //#region COMMON HTML
  async function insertCommonHtml() {
    await insertHeaderAsync();
    insertFooter();
  }

  async function insertHeaderAsync() {
    const header = document.createElement("header");

    header.innerHTML = await appData.getTextFromFileAsync("./html/header.html");
    header.classList.add("m-md-auto", "d-flex");
    header.setAttribute("data-bs-theme", "dark");

    let menuId = `#${currentPage}MenuId`;
    if (currentPage === "portfolio-item") menuId = "#portfolioMenuId";
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

  async function loadSiteDataAsync(textRefresh = false) {
    siteConfig = await appData.getFileDataAsync("config", "");

    browserConfig = appData.getBrowserConfig(siteConfig);
    configureBrowser();

    siteData = await appData.getFileDataAsync("site-data", browserConfig.lang, textRefresh);
  }

  function setPageText() {
    appText.setMenuText(siteData.menu);

    appText.setPageTitle(currentPage, siteData.pageTitle);

    switch (currentPage) {
      case "home":
        appText.setHomeText(siteData[currentPage]);
        break;
      case "about":
        appText.setAboutText(siteData[currentPage]);
        break;
      case "contact":
        appText.setContactText(siteData[currentPage]);
        break;
      case "portfolio":
        appText.fillPortfoliosAsync(siteData.portfolio.items);
        break;
    }

    appText.setFooterText(siteData.footerSuffix);
  }

  function configureBrowser() {
    setLanguage();
    setTheme();
  }

  function setLanguage() {
    document.querySelectorAll("#lang-list a").forEach((el) => el.classList.remove("selected"));

    const languageItem = document.querySelector(`#lang-list a[data-bs-language = ${browserConfig.lang}]`);
    if (languageItem !== null) languageItem.classList.add("selected");

    document.documentElement.setAttribute("lang", browserConfig.lang);
  }

  function setTheme() {
    document.querySelectorAll("#theme-list a").forEach((el) => el.classList.remove("selected"));

    const themeItem = document.querySelector(`#theme-list a[data-bs-theme-value = ${browserConfig.theme}]`);
    if (themeItem !== null) themeItem.classList.add("selected");

    const sysLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const pageTheme = browserConfig.theme === "auto" ? (sysLight ? "light" : "dark") : browserConfig.theme;
    document.documentElement.setAttribute("data-bs-theme", pageTheme);
  }

  //#region EVENTS
  function wireUpEvents() {
    document.getElementById("lang-list").addEventListener("click", handleLanguageSelectAsync);

    document.getElementById("theme-list").addEventListener("click", handleThemeSelectAsync);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => setTheme());

    if (currentPage === "contact") document.getElementById("contact-form").onsubmit = handleFormSubmit;

    if (currentPage === "portfolio") {
      const pf = document.getElementById("portfolio-showroom");
      const pfCollapse = document.getElementById("portfolio-collapse");
      const item = document.getElementById("portfolio-item");
      const itemCollapse = document.getElementById("item-collapse");
      const itemClose = document.getElementById("item-close");

      pf.addEventListener("click", handlePortfolioClick);
      pf.addEventListener("hidden.bs.collapse", () => itemCollapse.click());

      itemClose.addEventListener("click", () => itemCollapse.click());
      item.addEventListener("hidden.bs.collapse", () => pfCollapse.click());
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
      if (browserConfig.lang !== selectedLang) {
        browserConfig.lang = selectedLang;
        appData.saveBrowserConfig(browserConfig);

        await loadSiteDataAsync(true);
        setPageText();
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
      if (browserConfig.theme !== selectedTheme) {
        browserConfig.theme = selectedTheme;
        appData.saveBrowserConfig(browserConfig);
        setTheme();
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

    const itemId = anchor.id;

    appText.setPortfolioItemText(itemId, siteData.portfolio);

    document.getElementById("portfolio-showroom").classList.remove("show");
    document.getElementById("item-collapse").click();
  }

  //#endregion
})((window.app = window.app || {}));
