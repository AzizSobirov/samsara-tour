//** popup */
class Popup {
  constructor(name, data) {
    this.popup = document.querySelector(name);
    this.popupContent = this.popup.querySelector(".popup__content");
    this.body = document.querySelector("body");
    this.data = data;
  }
  open() {
    this.popup.style.display = "flex";
    setTimeout(() => {
      this.popupContent.style.opacity = "1";
      this.popupContent.style.transform = "scale(1)";
      this.body.classList.add("overflow-hidden");
    }, 50);
  }
  close() {
    this.popupContent.style.opacity = "0";
    this.popupContent.style.transform = "scale(0.85)";
    this.body.classList.remove("overflow-hidden");

    setTimeout(() => {
      this.popup.style.display = "none";
    }, 500);
  }
}

const openPopup = (name, data) => {
  new Popup(`.popup--${name}`, data).open();
};

const closePopup = (name, data) => {
  new Popup(`.popup--${name}`, data).close();
};
// ** end popup

//** input mask **/
[].forEach.call(document.querySelectorAll(".v-mask"), function (input) {
  let keyCode;
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode);
    let pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    let matrix = "+7 (___) ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, ""),
      newValue = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = newValue.indexOf("_");
    if (i != -1) {
      i < 5 && (i = 3);
      newValue = newValue.slice(0, i);
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = newValue;
    if (event.type == "blur" && this.value.length < 5) this.value = "";

    if (this.value.length == 18 || this.value.length == 0) {
      input.dataset.numbervalid = "true";
    } else {
      input.dataset.numbervalid = "false";
    }
  }

  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false);
});

//** sticky header **/
const header = document.querySelector(".header");
window.addEventListener("scroll", function () {
  header.classList.toggle("header-sticky", window.scrollY > 0);
});

//** form **//
const form = document.querySelector("#form");
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = form.querySelector("#name");
  let phone = form.querySelector("#phone");

  if (phone.dataset.numbervalid === "true") {
    successSend("form");
  }
});

const popupForm = document.querySelector(".popup--form form");
popupForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = popupForm.querySelector("#name");
  let phone = popupForm.querySelector("#phone");

  if (phone.dataset.numbervalid === "true") {
    // alert("Спасибо за заявку. В ближайшее время с вами свяжутся.");
    successSend();
  }
});

function successSend(parent) {
  let content = document.querySelector(".popup--form #form-content");
  let success = document.querySelector(".popup--form #form-success");

  content.style.display = "none";
  success.style.display = "flex";

  if (parent == "form") {
    openPopup("form");
  }

  setTimeout(() => {
    closePopup("form");
    setTimeout(() => {
      content.style.display = "flex";
      success.style.display = "none";
    }, 500);
  }, 3000);
}

// ** Accordions ** //
const getAccordionParents = document.querySelectorAll("[data-accordion");
getAccordionParents.forEach((parent) => {
  const isMultiple = parent.dataset.multiple;
  const accordions = parent.querySelectorAll(".accordion");
  accordions.forEach((accordion) => {
    const header = accordion.querySelector(".accordion__header");
    const body = accordion.querySelector(".accordion__body");
    const content = accordion.querySelector(".accordion__content");

    header.addEventListener("click", () => {
      const isActive = accordion.classList.contains("active");
      if (!isActive) {
        accordion.classList.add("active");
        body.style.maxHeight = content.scrollHeight + "px";
      } else {
        accordion.classList.remove("active");
        body.style.maxHeight = 0;
      }

      if (!isMultiple || isMultiple == "false") {
        accordions.forEach((el) => {
          if (el !== accordion) {
            el.classList.remove("active");
            el.querySelector(".accordion__body").style.maxHeight = 0;
          }
        });
      }
    });
  });
});


//** scroller **/
const scrollers = document.querySelectorAll(".scroller");
// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  scrollers.forEach((scroller) => {
    // add data-animated="true" to every `.scroller` on the page
    scroller.setAttribute("data-animated", true);

    // Make an array from the elements within `.scroller-inner`
    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);

    // For each item in the array, clone it
    // add aria-hidden to it
    // add it into the `.scroller-inner`
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}


//** page footer article **/
let article = document.querySelector(".article");
if (article) {
  const dropwown = article.querySelector(".article__dropdown");
  const content = article.querySelector(".article__dropdown-content");
  const btn = article.querySelector(".btn");

  btn.addEventListener("click", () => {
    const isActive = dropwown.classList.contains("active");

    if (!isActive) {
      dropwown.classList.add("active");
      dropwown.style.maxHeight = content.scrollHeight + "px";
      btn.innerHTML = "Скрыть";
    } else {
      dropwown.classList.remove("active");
      dropwown.style.maxHeight = "280px";
      btn.innerHTML = "Подробнее";
    }
  });
}


// ** swipers  **//
var swiperGallery = new Swiper("#swiper-gallery", {
  slidesPerView: "auto",
  spaceBetween: 15,
  loop: true,
  loopedSlides: 2,
  centeredSlides: true,
  breakpoints: {
    769: {
      spaceBetween: 20,
    },
  },
});

//** fancybox **//
let dataFancybox = ["gallery", "interiers", "foods", "activity"];
dataFancybox.forEach((name) => {
  Fancybox.bind(`[data-fancybox="${name}"]`, {
    Images: { Panzoom: { maxScale: 3 } },
  });
});