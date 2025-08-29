import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;
// setup lenis
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
// end lenis
function customDropdown() {
  const dropdowns = document.querySelectorAll(".dropdown-custom");

  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");

    // Toggle dropdown on button click
    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    // Handle item selection
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        // Store current values from the button
        const currentImgEl = valueSelect.querySelector("img");
        const currentImg = currentImgEl ? currentImgEl.src : "";
        const currentText = valueSelect.querySelector("span").textContent;
        const currentHtml = valueSelect.innerHTML;

        // Store clicked item values
        const clickedHtml = item.innerHTML;

        // Update the button with clicked item values
        valueSelect.innerHTML = clickedHtml;

        // Update the clicked item with the previous button values
        if (currentImg) {
          item.innerHTML = `<img src="${currentImg}" alt="" /><span>${currentText}</span>`;
        } else {
          item.innerHTML = `<span>${currentText}</span>`;
        }

        closeAllDropdowns();
      });
    });

    // Close dropdown on scroll
    window.addEventListener("scroll", function () {
      if (dropdownMenu.closest(".header-lang")) {
        dropdownMenu.classList.remove("dropdown--active");
        btnDropdown.classList.remove("--active");
      }
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}
function marquee() {
  document.querySelectorAll(".marquee-container").forEach((container) => {
    const content = container.querySelector(".marquee-content");
    const items = [...container.querySelectorAll(".marquee-item")];
    const speed = parseFloat(container.getAttribute("data-speed")) || 50;

    content.innerHTML = "";
    items.forEach((item) => content.appendChild(item.cloneNode(true)));

    const clonedItems = [...content.children];
    let totalWidth = 0;

    clonedItems.forEach((item) => (totalWidth += item.offsetWidth));

    const containerWidth = container.offsetWidth;
    const copiesNeeded = Math.ceil(containerWidth / totalWidth) + 2;

    for (let i = 0; i < copiesNeeded; i++) {
      clonedItems.forEach((item) => {
        content.appendChild(item.cloneNode(true));
      });
    }

    let fullWidth = 0;
    [...content.children].forEach((item) => (fullWidth += item.offsetWidth));

    gsap.set(content, {
      x: 0,
      willChange: "transform",
      force3D: true
    });

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(content, {
      x: -fullWidth,
      duration: fullWidth / speed,
      ease: "none",
      modifiers: {
        x: (x) => `${parseFloat(x) % fullWidth}px`
      }
    });

    // Hover pause
    const pause = parseFloat(container.getAttribute("hover-pause")) || false;
    if (pause) {
      container.addEventListener("mouseenter", () => tl.pause());
      container.addEventListener("mouseleave", () => tl.resume());
    }
  });
}
function intro() {
  if (document.querySelector(".intro").length < 1) return;

  const tl = gsap.timeline({
    defaults: { duration: 2, ease: "power2.inOut" }
  });

  tl.fromTo(
    ".intro",
    { clipPath: "inset(0% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 100% 0%)",
      onComplete: () => {
        document.querySelector(".intro").classList.add("d-none");
      }
    }
  );
}
function itemParallax() {
  if ($(".js-parallax").length < 1 && $(".image-parallax").length < 1) return;

  gsap.utils.toArray(".js-parallax").forEach((wrap) => {
    const y = parseFloat(wrap.getAttribute("data-y")) || 100;
    const direction = wrap.getAttribute("data-direction") || "up";

    const fromY = direction === "down" ? -y : y;

    gsap.fromTo(
      wrap,
      { y: fromY },
      {
        y: 0,
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          ease: "power4",
          delay: 0.2
          // markers: true
        }
      }
    );
  });

  document.querySelectorAll(".image-parallax").forEach((section) => {
    const media = section.querySelector("img, video");

    if (!media) return;

    gsap.set(media, { yPercent: 10 });

    gsap.to(media, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom top",
        scrub: true
      }
    });
  });
}
function sectionOffers() {
  if ($(".section-offers").length < 1) return;

  const offerItems = $(".section-offers .list-item a");
  const offerCount = offerItems.length;

  if (offerCount < 1) return;

  offerItems.on("mouseenter", function () {
    const thisItemData = $(this).data("tab");
    $(
      `.section-offers .list-item__image .image[data-tab="${thisItemData}"]`
    ).addClass("--active");
  });

  offerItems.on("mouseleave", function () {
    const thisItemData = $(this).data("tab");
    $(
      `.section-offers .list-item__image .image[data-tab="${thisItemData}"]`
    ).removeClass("--active");
  });
}
function bookingForm() {
  if ($(".booking-form").length < 1) return;

  const formBooking = $(".booking-form form");

  const dateField = formBooking.find("input[name='date']")[0];
  if (dateField) {
    new Lightpick({
      field: dateField,
      singleDate: true,
      numberOfMonths: 1,
      format: "DD/MM/YYYY",
      minDate: moment(),
      onSelect: function (start) {
        try {
          if (!start) return;

          dateField.value = start.format("DD/MM/YYYY");
          dateField.classList.remove("error");
        } catch (error) {
          console.error("Lỗi trong Lightpick onSelect:", error);
        }
      }
    });
  }

  formBooking.on("submit", function (e) {
    e.preventDefault();

    var isValid = true;

    $(this).find(".field").removeClass("error");

    var date = formBooking.find("input[name='date']").val();
    if (date === "") {
      formBooking
        .find("input[name='date']")
        .closest(".field")
        .addClass("error");
      isValid = false;
    }

    var time = formBooking
      .find(".dropdown-custom-btn[name='time'] .value-select span")
      .text()
      .trim();
    if (time === "" || time === "Time") {
      formBooking
        .find(".dropdown-custom-btn[name='time']")
        .closest(".field")
        .addClass("error");
      isValid = false;
    }

    var adult = formBooking.find("input[name='adult']").val().trim();
    var child = formBooking.find("input[name='child']").val().trim()
      ? formBooking.find("input[name='child']").val().trim()
      : "0";
    if (adult === "") {
      formBooking
        .find("input[name='adult']")
        .closest(".field")
        .addClass("error");
      isValid = false;
    }

    var fullname = formBooking.find("input[name='fullname']").val().trim();
    if (fullname === "") {
      formBooking
        .find("input[name='fullname']")
        .closest(".field")
        .addClass("error");
      isValid = false;
    }

    var email = formBooking.find("input[name='email']").val().trim();
    if (email === "" || !/^\S+@\S+\.\S+$/.test(email)) {
      formBooking
        .find("input[name='email']")
        .closest(".field")
        .addClass("error");
      isValid = false;
    }

    var phone = formBooking.find("input[name='phone']").val().trim();
    if (phone === "") {
      formBooking
        .find("input[name='phone']")
        .closest(".field")
        .addClass("error");
      isValid = false;
    }

    var message = formBooking.find("textarea[name='message']").val().trim();

    if (isValid) {
      var formData = {
        action: "submit_booking_form",
        date: date,
        fullname: fullname,
        phone: phone,
        email: email,
        message: message
      };

      formBooking.find("button[type='submit']").addClass("aloading");
      setTimeout(() => {
        formBooking.find("button[type='submit']").removeClass("aloading");

        formBooking.find(".message").show();
        formBooking[0].reset();

        setTimeout(() => {
          formBooking.find(".message").hide();
        }, 10000);
      }, 3000);

      // $.ajax({
      //   url: ajaxUrl,
      //   method: "POST",
      //   data: formData,
      //   beforeSend: function () {
      //     formBooking.find("button[type='submit']").addClass("aloading");
      //   },
      //   success: function (res) {
      //     formBooking.find("button[type='submit']").removeClass("aloading");

      //     formBooking.find(".message").show();
      //     formBooking[0].reset();

      //     setTimeout(() => {
      //       formBooking.find(".message").hide();
      //     }, 10000);
      //   },
      //   error: function (xhr, status, error) {
      //     console.error(xhr.responseText);
      //     alert("Có lỗi xảy ra, vui lòng thử lại.");
      //   }
      // });
    }
  });
}
function CTA() {
  if (document.querySelector(".cta").length < 1) return;
  ScrollTrigger.create({
    start: "top+=100vh top",
    end: 99999,
    paused: true,
    onUpdate: (self) => {
      self.direction === 1
        ? document.querySelector(".cta").classList.add("hide")
        : document.querySelector(".cta").classList.remove("hide");
    }
  });
}
function hero() {
  document.querySelectorAll(".swiper-hero").forEach((el) => {
    const swiper = new Swiper(el, {
      slidesPerView: 1,
      watchSlidesProgress: true,
      speed: 1500,
      loop: true,
      autoplay: {
        delay: 3000
      },

      on: {
        progress(swiper) {
          swiper.slides.forEach((slide) => {
            const slideProgress = slide.progress || 0;
            const innerOffset = swiper.width * 0.9;
            const innerTranslate = slideProgress * innerOffset;

            const slideInner = slide.querySelector(".hero-box");
            if (slideInner && !isNaN(innerTranslate)) {
              slideInner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          });
        },
        touchStart(swiper) {
          swiper.slides.forEach((slide) => {
            slide.style.transition = "";
          });
        },
        setTransition(swiper, speed) {
          const easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
          swiper.slides.forEach((slide) => {
            slide.style.transition = `${speed}ms ${easing}`;
            const slideInner = slide.querySelector(".hero-box");
            if (slideInner) {
              slideInner.style.transition = `${speed}ms ${easing}`;
            }
          });
        }
      }
    });
  });
}
function effectText() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const elementsBlur = document.querySelectorAll(".effect-blur");
  elementsBlur.forEach((elementBlur) => {
    let splitBlur = SplitText.create(elementBlur, {
      type: "words, chars",
      charsClass: "split-char"
    });
    gsap.fromTo(
      splitBlur.chars,
      {
        filter: "blur(5px) ",
        y: 10,
        willChange: "filter, transform",
        opacity: 0
      },
      {
        ease: "none",
        filter: "blur(0px)",
        y: 0,
        stagger: 0.025,
        opacity: 1,
        scrollTrigger: {
          trigger: elementBlur,
          start: "top 90%"
        }
      }
    );
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  customDropdown();
  marquee();
  intro();
  CTA();
  itemParallax();
  sectionOffers();
  bookingForm();
  hero();
  effectText();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

// loadpage
let isLinkClicked = false;
$("a").on("click", function (e) {
  // Nếu liên kết dẫn đến trang khác (không phải hash link hoặc javascript void)
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
