(function (app) {
  ("use strict");

  let animationElements, animationIndex, animationTimeoutId;

  app.setPageTitle = function (currentPage, defaultTitle) {
    let title = defaultTitle;
    if (currentPage !== "home") title += ` - ${document.querySelector(".nav-link.active").innerText}`;
    document.title = title;
  };

  app.setMenuText = function (menu) {
    const menuIds = ["homeMenuId", "portfolioMenuId", "aboutMenuId", "contactMenuId"];
    for (let i = 0; i < menuIds.length; i++) {
      const id = menuIds[i];
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
    const mainDiv = document.querySelector("main div");

    mainDiv.querySelector("h1").innerText = pageData.heading;

    let html = "";
    for (let i = 0; i < pageData.paragraphs.length; i++) {
      const currentBloc = pageData.paragraphs[i];
      for (let j = 0; j < currentBloc.length; j++) {
        const element = currentBloc[j];
        html += `<span class='animate'>${element}</span>`;
      }
      html += "<br>";
    }

    mainDiv.querySelector("p").innerHTML = html;
  }

  app.fillPortfoliosAsync = async function (items) {
    const portfolioShowroom = document.getElementById("portfolio-showroom");
    const template = await appData.getTextFromFileAsync("./html/portfolio-card.html");

    const portfolioFragment = document.createDocumentFragment();
    const row = document.createElement("div");
    row.classList.add("row", "g-3", "row-cols-1", "row-cols-sm-2", "row-cols-md-3");

    let html;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      html = template
        .replace("@id", item.id)
        .replace("@image", `img/portfolio/${item.images[0]}`)
        .replace("@title", item.title)
        .replace("@description", item.description)
        .replace("@technologies", item.technologies);

      row.innerHTML += html;
    }

    portfolioFragment.appendChild(row);

    portfolioShowroom.childNodes.forEach((el) => el.remove());
    portfolioShowroom.appendChild(portfolioFragment);
    portfolioShowroom.classList.add("show");
  };

  app.setPortfolioItemText = function (itemId, items) {
    const item = items.find((el) => el.id === Number(itemId));

    document.getElementById("item-image").src = `img/portfolio/${item.images[0]}`;
    document.getElementById("item-title").innerText = item.title;
    document.getElementById("item-description").innerText = item.description;
    document.getElementById("item-technologies").innerText = item.technologies;

    if (item.highlights !== undefined && item.highlights.length > 0) {
      let htmlItems = "";
      for (let i = 0; i < item.highlights.length; i++) {
        const highlight = item.highlights[i];
        htmlItems += `<li>${highlight}.</li>`;
      }
      document.getElementById("item-highlights-list").innerHTML = htmlItems;
      document.getElementById("item-highlights").classList.remove("visually-hidden");
    } else {
      document.getElementById("item-highlights").classList.add("visually-hidden");
    }

    const links = ["url", "swagger", "github"];
    links.forEach((link) => {
      const el = document.getElementById(`item-${link}`);
      if (item[link] !== undefined && item[link].length > 0) {
        el.href = item[link];
        el.style.visibility = "visible";
      } else {
        el.style.visibility = "hidden";
      }
    });
  };

  app.setContactText = function (pageData) {
    const form = document.getElementById("contact-form");
    document.querySelector("main div h1").innerText = pageData.heading;
    form.querySelector("#name").previousElementSibling.innerText = pageData.name;
    form.querySelector("#email").previousElementSibling.innerText = pageData.email;
    form.querySelector("#message").previousElementSibling.innerText = pageData.message;
    form.querySelector("button").innerText = pageData.submit;
  };

  app.setFooterText = function (footerSuffix) {
    if (footerSuffix.length > 0)
      document.querySelector("footer").innerHTML = `&copy; ${new Date().getFullYear()} ${footerSuffix}`;
  };

  // #region ANIMATION
  function animatePageText(start = true) {
    animationElements = document.querySelectorAll(".animate");
    animationElements.forEach((el) => {
      el.style.removeProperty("transition");
      el.style.opacity = "0";
    });
    animationIndex = 0;
    if (start) animateCurrentElement();
  }

  function animateCurrentElement() {
    clearTimeout(animationTimeoutId);
    if (animationIndex < animationElements.length) {
      const currentElement = animationElements[animationIndex];
      currentElement.style.transition = "opacity 4s linear 0s";
      currentElement.style.opacity = "1";
      const delay = Math.max(currentElement.innerText.length * 20, 1000);
      animationIndex++;
      animationTimeoutId = setTimeout(animateCurrentElement, delay);
    }
  }
  //#endregion
})((window.appText = window.appText || {}));
