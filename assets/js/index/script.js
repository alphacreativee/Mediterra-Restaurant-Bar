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
        const currentImg = valueSelect.querySelector("img").src;
        const currentText = valueSelect.querySelector("span").textContent;
        const currentHtml = valueSelect.innerHTML;

        // Store clicked item values
        const clickedHtml = item.innerHTML;

        // Update the button with clicked item values
        valueSelect.innerHTML = clickedHtml;

        // Update the clicked item with the previous button values
        item.innerHTML = `<img src="${currentImg}" alt="" /><span>${currentText}</span>`;

        closeAllDropdowns();
      });
    });

    // Close dropdown on scroll
    window.addEventListener("scroll", function () {
      closeAllDropdowns();
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

  const offerItems = $(".section-offers .list-item li");
  const offerCount = offerItems.length;

  if (offerCount < 1) return;

  console.log(offerItems);

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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  customDropdown();
  marquee();
  intro();
  itemParallax();
  sectionOffers();
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
