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


//#region HOME-ABOUT
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
//#endregion



//#region PORTFOLIO

  app.fillPortfolioAsync = async function (portfolios, lang) {

    const portfolioShowroom = document.getElementById("portfolio-showroom");
    const template = await appIO.getTextFromFileAsync("./html/portfolio-card.html");

    const portfolioFragment = document.createDocumentFragment();
    const row = document.createElement("div");
    row.classList.add("row", "g-3", "row-cols-1", "row-cols-sm-2", "row-cols-md-3");

    let html;
    for (let i = 0; i < portfolios.length; i++) {
      const project = portfolios[i];

      html = template
        .replace("@id", project.id)
        .replace("@image_srcset", `img/portfolio/${project.images[0]}.webp`)
        .replace("@image_src", `img/portfolio/png/${project.images[0]}.png`)
        .replace("@title", project[lang].title)
        .replace("@description", project[lang].description)
        .replace("@technologies", project.technologies);

      row.innerHTML += html;
    }

    portfolioFragment.appendChild(row);

    portfolioShowroom.childNodes.forEach((el) => el.remove());
    portfolioShowroom.appendChild(portfolioFragment);
    portfolioShowroom.classList.add("show");
  };



  app.setProjectText = function (project, lang) {

    setProjectSlides(project.images);
    document.getElementById("project-title").innerText = project[lang].title;
    document.getElementById("project-description").innerText = project[lang].description;
    document.getElementById("project-technologies").innerText = project.technologies;

    if (project[lang].highlights !== undefined && project[lang].highlights.length > 0) {
      let htmlItems = "";
      for (let i = 0; i < project[lang].highlights.length; i++) {
        const highlight = project[lang].highlights[i];
        htmlItems += `<li>${highlight}.</li>`;
      }

      document.getElementById("project-highlights-list").innerHTML = htmlItems;
      //document.getElementById("project-highlights-title").innerText = pageData.highlightsText;
      document.getElementById("project-highlights").classList.remove("visually-hidden");

    } else {
      document.getElementById("project-highlights").classList.add("visually-hidden");
    }


    const links = ["url", "url2", "swagger", "github"];
    const default_titles = ["Web", "Web", "Swagger", "GitHub"];

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const el = document.getElementById(`project-${link}`);

      if (project[link] !== undefined && project[link].length > 0) {
        el.href = project[link];
        el.style.visibility = "visible";
        let title = project[`${link}_title`];
        el.text = title !== undefined ? title : default_titles[i];

      } else {
        el.style.visibility = "hidden";
      }
    }
  };



  function setProjectSlides(images) {

    const carouselInner = document.querySelector("#images-carousel .carousel-inner");
    document.querySelector("#images-carousel .carousel-inner .carousel-item:last-child");
    const firstItem = document.querySelector("#images-carousel .carousel-item.active");

    document.querySelectorAll("#images-carousel .carousel-item:not(.active)").forEach((el) => el.remove());
    firstItem.classList.remove("active");

    for (let index = 0; index < images.length; index++) {
      const imageName = images[index];

      if (index > 0) {
        carouselInner.appendChild(firstItem.cloneNode(true));
      }

      const currentItem = document.querySelector("#images-carousel .carousel-inner .carousel-item:last-child");
      currentItem.querySelector("picture source").srcset = `img/portfolio/${imageName}.webp`;
      currentItem.querySelector("picture img").src = `img/portfolio/png/${imageName}.png`;
      currentItem.querySelector("picture img").alt = imageName.title;
    }
    firstItem.classList.add("active");
  }
//#endregion


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

})((window.appContent = window.appContent || {}));
