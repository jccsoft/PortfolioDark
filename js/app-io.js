(function (app) {
  ("use strict");

  const storageKey = "portfoliodark";

  
  app.getSiteConfigAsync = async function () {

    let data = await fetch(`./data/config.dev.json`).then((response) => response.json());
    
    if (data === undefined) data = await fetch(`./data/config.json`).then((response) => response.json());

    return data;
  };



  app.getBrowserStorage = function (languages, defaultTheme) {

    let config = { lang: "", theme: "" };
    let configChanged = false;

    const browserConfig = JSON.parse(localStorage.getItem(storageKey));

    if (browserConfig !== null) {
      if (browserConfig.lang !== null) config.lang = browserConfig.lang;
      if (browserConfig.theme !== null) config.theme = browserConfig.theme;
    }

    if (config.lang === "") {
      config.lang = languages[0];
      for (let i = 1; i < languages.length; i++) {
        const l = languages[i];
        if (navigator.language.startsWith(l)) config.lang = l;
      }
      configChanged = true;
    }

    if (config.theme === "") {
      config.theme = defaultTheme;
      configChanged = true;
    }

    if (configChanged) app.saveBrowserStorage(config);

    return config;
  };



  app.saveBrowserStorage = function (config) {
    localStorage.setItem(storageKey, JSON.stringify({ lang: config.lang, theme: config.theme }));
  };



  app.getTextFromFileAsync = async function (file) {

    let text = "";

    await fetch(file)
      .then((response) => response.text())
      .then((body) => (text = body))
      .catch(() => console.error(`Error leyendo ${file}`));

    return text;
  };


  app.fileExists = async function(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' }).then((response) => response.json());
        // .then(response => return [response.json(), true]);
        return [response.json(), true];
    } catch (err) {
        return [{}, false];
    }
}

})((window.appIO = window.appIO || {}));
