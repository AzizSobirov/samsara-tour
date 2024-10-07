// header
const header = document.querySelector(".header");
if (header) {
  const header = document.querySelector(".header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  const menu = header.querySelector(".header__menu");
  const rightContent = header.querySelector(".header__right");

  const tabs = header.querySelectorAll("#tab");
  const tabsBody = header.querySelector(".mobile__menu-content");
  const tabsContent = tabsBody.querySelector("#content");
  const tabsContentClose = tabsBody.querySelector("#close");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabsBody.style.display = "block";

      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");

      if (tab.dataset.toggle == "menu") {
        tabsContent.innerHTML = menu.innerHTML + rightContent.innerHTML;
      }
    });
  });

  tabsContentClose.addEventListener("click", () => {
    tabsContent.innerHTML = "";
    tabsBody.style.display = "none";
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
  });
}

// modal
const modal = {
  el: document.querySelector(".modal"),
  blocks: document.querySelectorAll(".modal__content"),
  open: function (name, animation = true) {
    const target = this.el.querySelector(`[data-root=${name}]`);

    this.el.style.display = "flex";
    target.style.display = "flex";

    if (animation) {
      setTimeout(() => {
        target.style.opacity = 1;
        target.style.transform = "scale(1)";
      }, 50);
    } else {
      target.style.opacity = 1;
      target.style.transform = "scale(1)";
    }
  },
  close: function (name, animation) {
    if (!name) {
      this.blocks.forEach((block) => {
        block.style.opacity = 0;
        block.style.transform = "scale(0.85)";
      });
    } else {
      const target = this.el.querySelector(`[data-root=${name}]`);
      target.style.opacity = 0;
      target.style.transform = "scale(0.85)";

      if (!animation) {
        target.style.display = "none";
      } else {
        setTimeout(() => {
          target.style.display = "none";
        }, 350);
      }
    }

    if (animation) {
      setTimeout(() => {
        this.el.style.display = "none";
      }, 350);
    }
  },
};

const modalTriggers = document.querySelectorAll("[data-modal]");
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const name = trigger.dataset.modal;
    if (name !== "close") {
      modal.open(name);
    } else {
      modal.close(null, true);
    }
  });
});

// form
[].forEach.call(
  document.querySelectorAll("input[name='phone']"),
  function (input) {
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
  }
);

const forms = document.querySelectorAll("form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (form.id == "form") {
      modal.open("success");
    } else {
      modal.close("form", false);
      modal.open("success", false);
    }

    setTimeout(() => {
      modal.close("success", true);
    }, 3000);
  });
});

// swiper
// let certificatesSwiper = new Swiper(".certificates .swiper", {
//   slidesPerView: 2,
//   spaceBetween: 8,
//   navigation: {
//     nextEl: ".certificates .btn-next",
//     prevEl: ".certificates .btn-prev",
//   },
//   pagination: {
//     el: ".certificates .swiper-pagination",
//     clickable: true,
//   },
//   breakpoints: {
//     475: {
//       slidesPerView: 2,
//       spaceBetween: 15,
//     },
//     // 768: {
//     //   slidesPerView: 2,
//     //   spaceBetween: 15,
//     // },
//     769: {
//       slidesPerView: 3,
//       spaceBetween: 20,
//     },
//   },
// });

var introSwiper = new Swiper(".intro .swiper", {
  slidesPerView: 1,
  pagination: {
    el: ".intro .swiper-pagination",
    clickable: true,
  },
});

var gallerySwiper = new Swiper(".gallery .swiper", {
  slidesPerView: 2,
  spaceBetween: 10,
  navigation: {
    nextEl: ".gallery .swiper-button-next",
    prevEl: ".gallery .swiper-button-prev",
  },
  breakpoints: {
    // 641:{
    //   slidesPerView: 2,
    //   spaceBetween: 20,
    // },
    769: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1025: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});

// fancybox
let dataFancybox = ["gallery", "portfolio", "certificates"];
dataFancybox.forEach((name) => {
  Fancybox.bind(`[data-fancybox="${name}"]`, {
    Images: { Panzoom: { maxScale: 3 } },
  });
});
