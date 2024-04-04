"use strict";

(function (app) {
  "use strict";

  var animationElements, animationIndex, animationTimeoutId;

  app.setPageTitle = function (currentPage, defaultTitle) {
    var title = defaultTitle;
    if (currentPage !== "home") title += " - ".concat(document.querySelector(".nav-link.active").innerText);
    document.title = title;
  };

  app.setMenuText = function (menu) {
    var menuIds = ["homeMenuId", "portfolioMenuId", "aboutMenuId", "contactMenuId"];

    for (var i = 0; i < menuIds.length; i++) {
      var id = menuIds[i];
      document.getElementById(id).innerText = menu[id];
    }
  };

  app.setHomeText = function (pageData) {
    setHomeAndAboutText(pageData);
    document.getElementById("btnPortfolio").innerText = pageData.btnPortfolio;
    animatePageText();
  };

  app.setAboutText = function (pageData) {
    setHomeAndAboutText(pageData);
    animatePageText();
  };

  function setHomeAndAboutText(pageData) {
    var mainDiv = document.querySelector("main div");
    mainDiv.querySelector("h1").innerText = pageData.heading;
    var html = "";

    for (var i = 0; i < pageData.paragraphs.length; i++) {
      var currentBloc = pageData.paragraphs[i];

      for (var j = 0; j < currentBloc.length; j++) {
        var element = currentBloc[j];
        html += "<span class='animate'>".concat(element, "</span>");
      }

      html += "<br>";
    }

    mainDiv.querySelector("p").innerHTML = html;
  }

  app.fillPortfoliosAsync = function _callee(items) {
    var portfolioShowroom, template, portfolioFragment, row, html, i, item;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            portfolioShowroom = document.getElementById("portfolio-showroom");
            _context.next = 3;
            return regeneratorRuntime.awrap(appData.getTextFromFileAsync("./html/portfolio-card.html"));

          case 3:
            template = _context.sent;
            portfolioFragment = document.createDocumentFragment();
            row = document.createElement("div");
            row.classList.add("row", "g-3", "row-cols-1", "row-cols-sm-2", "row-cols-md-3");

            for (i = 0; i < items.length; i++) {
              item = items[i];
              html = template.replace("@id", item.id).replace("@image_srcset", "img/portfolio/".concat(item.images[0], ".webp")).replace("@image_src", "img/portfolio/png/".concat(item.images[0], ".png")).replace("@title", item.title).replace("@description", item.description).replace("@technologies", item.technologies);
              row.innerHTML += html;
            }

            portfolioFragment.appendChild(row);
            portfolioShowroom.childNodes.forEach(function (el) {
              return el.remove();
            });
            portfolioShowroom.appendChild(portfolioFragment);
            portfolioShowroom.classList.add("show");

          case 12:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  app.setPortfolioItemText = function (itemId, pageData) {
    var item = pageData.items.find(function (el) {
      return el.id === Number(itemId);
    });
    fillPortfolioSlides(item.images);
    document.getElementById("item-title").innerText = item.title;
    document.getElementById("item-description").innerText = item.description;
    document.getElementById("item-technologies").innerText = item.technologies;

    if (item.highlights !== undefined && item.highlights.length > 0) {
      var htmlItems = "";

      for (var i = 0; i < item.highlights.length; i++) {
        var highlight = item.highlights[i];
        htmlItems += "<li>".concat(highlight, ".</li>");
      }

      document.getElementById("item-highlights-list").innerHTML = htmlItems;
      document.getElementById("item-highlights-title").innerText = pageData.highlightsText;
      document.getElementById("item-highlights").classList.remove("visually-hidden");
    } else {
      document.getElementById("item-highlights").classList.add("visually-hidden");
    }

    var links = ["url", "swagger", "github"];
    links.forEach(function (link) {
      var el = document.getElementById("item-".concat(link));

      if (item[link] !== undefined && item[link].length > 0) {
        el.href = item[link];
        el.style.visibility = "visible";
      } else {
        el.style.visibility = "hidden";
      }
    });
  };

  function fillPortfolioSlides(images) {
    var carouselInner = document.querySelector("#images-carousel .carousel-inner"); // const carouselIndicators = document.querySelector("#images-carousel .carousel-indicators");

    document.querySelector("#images-carousel .carousel-inner .carousel-item:last-child");
    var firstItem = document.querySelector("#images-carousel .carousel-item.active"); // const firstButton = document.querySelector("#images-carousel .carousel-indicators button.active");

    document.querySelectorAll("#images-carousel .carousel-item:not(.active)").forEach(function (el) {
      return el.remove();
    }); // document.querySelectorAll("#images-carousel .carousel-indicators button:not(.active)").forEach((el) => el.remove());

    firstItem.classList.remove("active"); // firstButton.classList.remove("active");

    for (var index = 0; index < images.length; index++) {
      var imageName = images[index];

      if (index > 0) {
        carouselInner.appendChild(firstItem.cloneNode(true)); // carouselIndicators.appendChild(firstButton.cloneNode(true));
      }

      var currentItem = document.querySelector("#images-carousel .carousel-inner .carousel-item:last-child");
      currentItem.querySelector("picture source").srcset = "img/portfolio/".concat(imageName, ".webp");
      currentItem.querySelector("picture img").src = "img/portfolio/png/".concat(imageName, ".png");
      currentItem.querySelector("picture img").alt = imageName.title; // const currentButton = document.querySelector("#images-carousel .carousel-indicators button:last-child");
      // currentButton.setAttribute("data-bs-slide-to", `${index}`);
      // currentButton.ariaLabel = `Slide ${imageName.title}`;
      // currentButton.ariaCurrent = "false";
    }

    firstItem.classList.add("active"); // firstButton.classList.add("active");
    // firstButton.ariaCurrent = "true";
  }

  app.setContactText = function (pageData) {
    var form = document.getElementById("contact-form");
    document.querySelector("main div h1").innerText = pageData.heading;
    form.querySelector("#name").previousElementSibling.innerText = pageData.name;
    form.querySelector("#email").previousElementSibling.innerText = pageData.email;
    form.querySelector("#message").previousElementSibling.innerText = pageData.message;
    form.querySelector("button").innerText = pageData.submit;
  };

  app.setFooterText = function (footerSuffix) {
    if (footerSuffix.length > 0) document.querySelector("footer").innerHTML = "&copy; ".concat(new Date().getFullYear(), " ").concat(footerSuffix);
  }; // #region ANIMATION


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
      var delay = Math.max(currentElement.innerText.length * 20, 1000);
      animationIndex++;
      animationTimeoutId = setTimeout(animateCurrentElement, delay);
    }
  } //#endregion

})(window.appText = window.appText || {});