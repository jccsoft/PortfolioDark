"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

(function (app) {
  "use strict"; // import("./app-data.js");
  // import("./app-text.js");


  var siteConfig, siteData, currentPage;
  var browserConfig = {
    lang: "",
    theme: ""
  };

  app.pageSetup = function _callee(page) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            currentPage = page;
            _context.next = 3;
            return regeneratorRuntime.awrap(insertCommonHtml());

          case 3:
            _context.next = 5;
            return regeneratorRuntime.awrap(loadSiteDataAsync());

          case 5:
            setPageText();
            wireUpEvents();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  }; //#region COMMON HTML


  function insertCommonHtml() {
    return regeneratorRuntime.async(function insertCommonHtml$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(insertHeaderAsync());

          case 2:
            insertFooter();

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  function insertHeaderAsync() {
    var header, menuId, menu;
    return regeneratorRuntime.async(function insertHeaderAsync$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            header = document.createElement("header");
            _context3.next = 3;
            return regeneratorRuntime.awrap(appData.getTextFromFileAsync("./html/header.html"));

          case 3:
            header.innerHTML = _context3.sent;
            header.classList.add("m-md-auto", "d-flex");
            header.setAttribute("data-bs-theme", "dark");
            menuId = "#".concat(currentPage, "MenuId");
            if (currentPage === "project") menuId = "#portfolioMenuId";
            menu = header.querySelector(menuId);
            menu.classList.add("active");
            menu.setAttribute("aria-current", "page");
            document.querySelector("body").prepend(header);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    });
  }

  function insertFooter() {
    var footer = document.createElement("footer");
    footer.classList.add("bg-dark", "mt-2", "p-2", "fixed-bottom");
    document.querySelector("body").append(footer);
  } //#endregion


  function loadSiteDataAsync() {
    var textRefresh,
        _args4 = arguments;
    return regeneratorRuntime.async(function loadSiteDataAsync$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            textRefresh = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : false;
            _context4.next = 3;
            return regeneratorRuntime.awrap(appData.getDataFileAsync("config", ""));

          case 3:
            siteConfig = _context4.sent;
            browserConfig = appData.getBrowserStorage(siteConfig);
            configureBrowser();
            _context4.next = 8;
            return regeneratorRuntime.awrap(appData.getDataFileAsync("site-data", browserConfig.lang, textRefresh));

          case 8:
            siteData = _context4.sent;

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    });
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
    document.querySelectorAll("#lang-list a").forEach(function (el) {
      return el.classList.remove("selected");
    });
    var languageItem = document.querySelector("#lang-list a[data-bs-language = ".concat(browserConfig.lang, "]"));
    if (languageItem !== null) languageItem.classList.add("selected");
    document.documentElement.setAttribute("lang", browserConfig.lang);
  }

  function setTheme() {
    document.querySelectorAll("#theme-list a").forEach(function (el) {
      return el.classList.remove("selected");
    });
    var themeItem = document.querySelector("#theme-list a[data-bs-theme-value = ".concat(browserConfig.theme, "]"));
    if (themeItem !== null) themeItem.classList.add("selected");
    var sysLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var pageTheme = browserConfig.theme === "auto" ? sysLight ? "light" : "dark" : browserConfig.theme;
    document.documentElement.setAttribute("data-bs-theme", pageTheme);
  } //#region EVENTS


  function wireUpEvents() {
    document.getElementById("lang-list").addEventListener("click", handleLanguageSelectAsync);
    document.getElementById("theme-list").addEventListener("click", handleThemeSelectAsync);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      return setTheme();
    });
    if (currentPage === "contact") document.getElementById("contact-form").onsubmit = handleFormSubmit;

    if (currentPage === "portfolio") {
      var pf = document.getElementById("portfolio-showroom");
      var pfCollapse = document.getElementById("portfolio-collapse");
      var item = document.getElementById("project");
      var itemCollapse = document.getElementById("project-collapse");
      var itemClose = document.getElementById("project-close");
      pf.addEventListener("click", handlePortfolioClick);
      pf.addEventListener("hidden.bs.collapse", function () {
        return itemCollapse.click();
      });
      itemClose.addEventListener("click", function () {
        return itemCollapse.click();
      });
      item.addEventListener("hidden.bs.collapse", function () {
        return pfCollapse.click();
      });
    }
  }

  function handleLanguageSelectAsync(e) {
    var selectedAnchor, elName, selectedLang;
    return regeneratorRuntime.async(function handleLanguageSelectAsync$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            elName = e.target.tagName.toLowerCase();
            if (elName === "a") selectedAnchor = e.target;
            if (elName === "img") selectedAnchor = e.target.parentElement;

            if (!(selectedAnchor !== undefined)) {
              _context5.next = 12;
              break;
            }

            e.preventDefault();
            selectedLang = selectedAnchor.getAttribute("data-bs-language");

            if (!(browserConfig.lang !== selectedLang)) {
              _context5.next = 12;
              break;
            }

            browserConfig.lang = selectedLang;
            appData.saveBrowserStorage(browserConfig);
            _context5.next = 11;
            return regeneratorRuntime.awrap(loadSiteDataAsync(true));

          case 11:
            setPageText();

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    });
  }

  function handleThemeSelectAsync(e) {
    var selectedAnchor, elName, selectedTheme;
    return regeneratorRuntime.async(function handleThemeSelectAsync$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            elName = e.target.tagName.toLowerCase();
            if (elName === "a") selectedAnchor = e.target;
            if (elName === "i") selectedAnchor = e.target.parentElement;

            if (selectedAnchor !== undefined) {
              e.preventDefault();
              selectedTheme = selectedAnchor.getAttribute("data-bs-theme-value");

              if (browserConfig.theme !== selectedTheme) {
                browserConfig.theme = selectedTheme;
                appData.saveBrowserStorage(browserConfig);
                setTheme();
              }
            }

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    var form = document.getElementById("contact-form");
    var name = form.querySelector("#name").value;
    var email = form.querySelector("#email").value;
    var message = form.querySelector("#message").value;
    var lineBreak = "%0D%0A";
    var emailString = "mailto:".concat(siteConfig.contactMail, "?subject=Contacto Web ").concat(name);
    emailString += (_readOnlyError("emailString"), "&body=Nombre: ".concat(name).concat(lineBreak, "Email: ").concat(email).concat(lineBreak, "Mensaje: ").concat(message).concat(lineBreak));
    window.open(emailString);
  }

  function handlePortfolioClick(e) {
    e.preventDefault();
    var anchor = e.target.closest("a");
    if (anchor === null) return;
    var itemId = anchor.id;
    appText.setPortfolioItemText(itemId, siteData.portfolio);
    document.getElementById("portfolio-showroom").classList.remove("show");
    document.getElementById("project-collapse").click();
  } //#endregion

})(window.app = window.app || {});