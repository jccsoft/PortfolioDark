(function (app) {
  ("use strict");

  const storageKey = "portfolio";

  app.getFileDataAsync = async function (file, dataKey, refresh = false) {
    const storeKey = `${storageKey}-${file}`;

    if (refresh) sessionStorage.removeItem(storeKey);

    const cachedData = sessionStorage.getItem(storeKey);

    let data;
    if (cachedData !== null) {
      data = JSON.parse(cachedData);
    } else {
      let fullData = await fetch(`./data/${file}.dev.json`).then((response) => response.json());
      if (fullData === null) fullData = await fetch(`./data/${file}.json`).then((response) => response.json());
      data = dataKey.length > 0 ? fullData[dataKey] : fullData;
      sessionStorage.setItem(storeKey, JSON.stringify(data));
    }

    return data;
  };

  app.getBrowserConfig = function (siteConfig) {
    let config = { lang: "", theme: "" };
    let configChanged = false;

    const browserConfig = JSON.parse(localStorage.getItem(storageKey));

    if (browserConfig !== null) {
      if (browserConfig.lang !== null) config.lang = browserConfig.lang;
      if (browserConfig.theme !== null) config.theme = browserConfig.theme;
    }

    if (config.lang === "") {
      config.lang = siteConfig.languages[0];
      for (let i = 1; i < siteConfig.languages.length; i++) {
        const l = siteConfig.languages[i];
        if (navigator.language.startsWith(l)) config.lang = l;
      }
      configChanged = true;
    }

    if (config.theme === "") {
      config.theme = siteConfig.defaultTheme;
      configChanged = true;
    }

    if (configChanged) app.saveBrowserConfig(config);

    return config;
  };

  app.saveBrowserConfig = function (config) {
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
})((window.appData = window.appData || {}));
