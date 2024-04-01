"use strict";

(function (app) {
  "use strict";

  var siteConfig, siteText, siteLang, currentPage;
  var animationElements, animationIndex, animationTimeoutId;

  app.pageSetup = function _callee(page) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            currentPage = page;
            insertHtml();
            _context.next = 4;
            return regeneratorRuntime.awrap(loadSiteData());

          case 4:
            setPageText();
            wireUpEvents();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  function insertHtml() {
    $("header").load("./html/header.html", function () {
      $(this).addClass("m-md-auto");
      $(this).find("#".concat(currentPage, "MenuId")).addClass("active").attr("aria-current", "page");
    });
    $("footer").load("./html/footer.html", function () {
      $(this).addClass("text-center text-white-50");
    });
  }

  function siteInitialize() {
    return regeneratorRuntime.async(function siteInitialize$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  function saveSiteLanguage() {
    return regeneratorRuntime.async(function saveSiteLanguage$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            localStorage.setItem(siteConfig["storageKey"], JSON.stringify({
              language: siteLang
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  }

  function loadSiteLanguage() {
    var config;
    return regeneratorRuntime.async(function loadSiteLanguage$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            config = JSON.parse(localStorage.getItem(siteConfig["storageKey"]));
            if (config !== null) siteLang = config["language"];

            if (siteLang === undefined || siteLang === "") {
              siteLang = navigator.language.includes("ca") ? "ca" : "es";
              saveSiteLanguage();
            }

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    });
  }

  function loadSiteData() {
    return regeneratorRuntime.async(function loadSiteData$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(fetch("./data/config.json").then(function (response) {
              return response.json();
            }));

          case 2:
            siteConfig = _context5.sent;
            _context5.next = 5;
            return regeneratorRuntime.awrap(loadSiteLanguage());

          case 5:
            _context5.next = 7;
            return regeneratorRuntime.awrap(fetch("./data/site-text.".concat(siteLang, ".json")).then(function (response) {
              return response.json();
            }));

          case 7:
            siteText = _context5.sent;

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    });
  } //#region SITE TEXT


  function setPageText() {
    // menús
    for (var i = 0; i < siteConfig["menuIds"].length; i++) {
      var menuId = siteConfig["menuIds"][i];
      document.getElementById(menuId).innerText = siteText[menuId];
    } // pestaña


    if (currentPage != "home") document.title = "".concat(siteConfig["pageTitle"], " - ").concat(document.querySelector(".nav-link.active").innerText); // main

    switch (currentPage) {
      case "home":
      case "about":
        setHomeAndAboutText();
        if (currentPage == "home") document.getElementById("btnPortfolio").innerText = siteText[currentPage].btnPortfolio;
        animatePageText();
        break;
    } // footer


    document.querySelector("footer").innerHTML = "&copy; ".concat(new Date().getFullYear(), " ").concat(siteConfig["footerSuffix"]);
  }

  function setHomeAndAboutText() {
    var mainDiv = $("main div");
    mainDiv.find("h1").text(siteText[currentPage].heading);
    var html = "";

    for (var i = 0; i < siteText[currentPage].textBlocs.length; i++) {
      var currentBloc = siteText[currentPage].textBlocs[i];

      for (var j = 0; j < currentBloc.length; j++) {
        var element = currentBloc[j];
        html += "<span class='animate'>".concat(element, "</span>");
      }

      html += "<br>";
    }

    mainDiv.find("p").first().html(html);
  } //#endregion
  //#region EVENTS


  function wireUpEvents() {
    document.getElementById("lista-idiomas").addEventListener("click", handleLanguageSelect);
  }

  function handleLanguageSelect(e) {
    return regeneratorRuntime.async(function handleLanguageSelect$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            e.preventDefault();
            siteLang = e.target.getAttribute("data-bs-language");
            saveSiteLanguage();
            _context6.next = 5;
            return regeneratorRuntime.awrap(loadSiteData());

          case 5:
            setPageText();

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    });
  } //#endregion
  // #region ANIMATION


  function animatePageText() {
    var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    animationElements = document.querySelectorAll(".animate");
    animationElements.forEach(function (el) {
      el.style.removeProperty("transition");
      el.style.opacity = "0";
    });
    animationIndex = 0;
    if (start) animateCurrentElement();
  }

  function animateCurrentElement() {
    clearTimeout(animationTimeoutId);

    if (animationIndex < animationElements.length) {
      var currentElement = animationElements[animationIndex];
      currentElement.style.transition = "opacity 4s linear 0s";
      currentElement.style.opacity = "1";
      var delay = Math.max(currentElement.innerText.length * 30, siteConfig["minAnimationDelay"]);
      animationIndex++;
      animationTimeoutId = setTimeout(animateCurrentElement, delay);
    }
  } //#endregion
  //#region BORRAR


  function wireContactForm() {
    var contact = document.getElementById("contact-section");
    var a = contact.querySelector("a");
    a.addEventListener("click", toggleFormVisible);
    var form = contact.querySelector("form");
    document.getElementById("contact-form");
    form.onsubmit = formSubmit;
  }

  function toggleFormVisible(e) {
    e.preventDefault();
    var form = document.getElementById("contact-form");

    if (form.style.display == "block") {
      form.style.display = "none";
    } else {
      form.style.display = "block";
    }
  }

  function formSubmit(e) {
    e.preventDefault();
    var form = document.getElementById("contact-form");
    var name = form.querySelector("#name").value;
    var email = form.querySelector("#email").value;
    var message = form.querySelector("#message").value;
    var lb = "%0D%0A";
    var emailString = "mailto:".concat(siteText.email, "?subject=Web Contact from ").concat(name, "&body=Name: ").concat(name).concat(lb, "Email: ").concat(email).concat(lb, "Message: ").concat(message).concat(lb);
    window.open(emailString);
  }

  function setNavigation() {
    var fragment = new DocumentFragment();

    for (var index = 0; index < siteText.workItems.length; index++) {
      var workItem = siteText.workItems[index];
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "workitem.html?item=".concat(index + 1);
      a.innerText = workItem.title;
      li.appendChild(a);
      fragment.appendChild(li);
    }

    document.querySelector("nav ul").appendChild(fragment);
  }

  function setSampleItems() {
    var fragment = new DocumentFragment();

    var _loop = function _loop(index) {
      var workItem = siteText.workItems[index];
      var div1 = document.createElement("div");
      div1.classList.add("highlight");
      if (index % 2 !== 0) div1.classList.add("invert");
      var div2 = document.createElement("div");
      var h2 = document.createElement("h2"); // h2.innerText = workItem.title;

      var titleArray = workItem.title.split(" ");
      var title = "";
      titleArray.forEach(function (word) {
        if (title.length > 0) title += "<br />";
        title += word;
      });
      h2.innerHTML = title;
      var a = document.createElement("a");
      a.href = "workitem.html?item=".concat(index + 1);
      a.innerText = "ver más";
      var picture = document.createElement("picture");
      var source = document.createElement("source");
      source.srcset = "img/".concat(workItem.imgFile, ".webp");
      source.alt = "".concat(workItem.title);
      var img = document.createElement("img");
      img.src = "img/old/".concat(workItem.imgFile, ".png");
      img.alt = "".concat(workItem.title);
      picture.appendChild(source);
      picture.appendChild(img);
      div2.appendChild(h2);
      div2.appendChild(a);
      div1.appendChild(div2);
      div1.appendChild(picture);
      fragment.appendChild(div1);
    };

    for (var index = 0; index < siteText.workItems.length; index++) {
      _loop(index);
    }

    document.querySelector("main").appendChild(fragment);
  }

  function setWorkItemInfo() {
    var itemNumber = readItemNumber();

    if (itemNumber === 0) {
      showErrorNotFound();
      return;
    }

    document.querySelector("h2").innerText = siteText.workItems[itemNumber - 1].title;
    document.querySelector("source").srcset = "img/".concat(siteText.workItems[itemNumber - 1].imgFileFull, ".webp");
    document.querySelector("img").src = "img/".concat(siteText.workItems[itemNumber - 1].imgFileFull, ".jpg");
    document.querySelector("#project-text p").innerText = siteText.workItems[itemNumber - 1].project;
    var fragment = new DocumentFragment();

    for (var index = 0; index < siteText.workItems[itemNumber - 1].technologies.length; index++) {
      // const tech = data.workItems[itemNumber - 1].technologies[index];
      var li = document.createElement("li");
      li.innerText = siteText.workItems[itemNumber - 1].technologies[index];
      fragment.appendChild(li);
    }

    document.querySelector("#technology-text ul").appendChild(fragment);
    document.querySelector("#challenges-text p").innerText = siteText.workItems[itemNumber - 1].challenges;
  }

  function readItemNumber() {
    var itemNumber = 0;
    var searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("item")) {
      var itemParam = parseInt(searchParams.get("item"));

      if (isNaN(itemParam) == false && itemParam > 0 && itemParam <= siteText.workItems.length) {
        itemNumber = itemParam;
      }
    }

    return itemNumber;
  }

  function showErrorNotFound() {
    document.querySelector("main").innerHTML = "<h3>Oops. Page not Found</h3>";
  }

  function populateData() {
    var cachedData;
    return regeneratorRuntime.async(function populateData$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            cachedData = sessionStorage.getItem("portfolioData");

            if (!(cachedData !== null)) {
              _context7.next = 5;
              break;
            }

            siteText = JSON.parse(cachedData);
            _context7.next = 9;
            break;

          case 5:
            _context7.next = 7;
            return regeneratorRuntime.awrap(fetch("./sitedata.json").then(function (response) {
              return response.json();
            }));

          case 7:
            siteText = _context7.sent;
            sessionStorage.setItem("portfolioData", JSON.stringify(siteText));

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    });
  } //#endregion

})(window.app = window.app || {});