document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

const container = document.querySelector(".card-content");

/* 🚫 DISABLE MAGNETIC ON MOBILE */
if (window.innerWidth > 768) {

  let isScrolling;

  container.addEventListener("scroll", () => {
    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
      const sections = document.querySelectorAll(".snap");
      const scrollPos = container.scrollTop;

      let closest = null;
      let closestDistance = Infinity;

      sections.forEach(section => {
        const offset = section.offsetTop;
        const distance = Math.abs(offset - scrollPos);

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = section;
        }
      });

      if (closest) {
        closest.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    }, 80);
  });

}

/* ✅ FORCE IOS-LIKE MOMENTUM FEEL */
container.style.scrollBehavior = "smooth";