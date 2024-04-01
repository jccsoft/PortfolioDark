"use strict";

(function (app) {
  "use strict";

  var storageKey = "portfolio";

  app.getFileDataAsync = function _callee(file, dataKey) {
    var refresh,
        storeKey,
        cachedData,
        data,
        fullData,
        _args = arguments;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            refresh = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
            storeKey = "".concat(storageKey, "-").concat(file);
            if (refresh) sessionStorage.removeItem(storeKey);
            cachedData = sessionStorage.getItem(storeKey);

            if (!(cachedData !== null)) {
              _context.next = 8;
              break;
            }

            data = JSON.parse(cachedData);
            _context.next = 17;
            break;

          case 8:
            _context.next = 10;
            return regeneratorRuntime.awrap(fetch("./data/".concat(file, ".dev.json")).then(function (response) {
              return response.json();
            }));

          case 10:
            fullData = _context.sent;

            if (!(fullData === null)) {
              _context.next = 15;
              break;
            }

            _context.next = 14;
            return regeneratorRuntime.awrap(fetch("./data/".concat(file, ".json")).then(function (response) {
              return response.json();
            }));

          case 14:
            fullData = _context.sent;

          case 15:
            data = dataKey.length > 0 ? fullData[dataKey] : fullData;
            sessionStorage.setItem(storeKey, JSON.stringify(data));

          case 17:
            return _context.abrupt("return", data);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  app.getBrowserConfig = function (siteConfig) {
    var config = {
      lang: "",
      theme: ""
    };
    var configChanged = false;
    var browserConfig = JSON.parse(localStorage.getItem(storageKey));

    if (browserConfig !== null) {
      if (browserConfig.lang !== null) config.lang = browserConfig.lang;
      if (browserConfig.theme !== null) config.theme = browserConfig.theme;
    }

    if (config.lang === "") {
      config.lang = siteConfig.languages[0];

      for (var i = 1; i < siteConfig.languages.length; i++) {
        var l = siteConfig.languages[i];
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
    localStorage.setItem(storageKey, JSON.stringify({
      lang: config.lang,
      theme: config.theme
    }));
  };

  app.getTextFromFileAsync = function _callee2(file) {
    var text;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            text = "";
            _context2.next = 3;
            return regeneratorRuntime.awrap(fetch(file).then(function (response) {
              return response.text();
            }).then(function (body) {
              return text = body;
            })["catch"](function () {
              return console.error("Error leyendo ".concat(file));
            }));

          case 3:
            return _context2.abrupt("return", text);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  };
})(window.appData = window.appData || {});