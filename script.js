const faqTriggers = Array.from(document.querySelectorAll(".faq-trigger"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setFaqState(trigger, open) {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));

  trigger.setAttribute("aria-expanded", String(open));

  if (panel) {
    panel.hidden = !open;
  }
}

faqTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    setFaqState(trigger, !isOpen);
  });

  trigger.addEventListener("keydown", (event) => {
    const lastIndex = faqTriggers.length - 1;
    let nextIndex = null;

    if (event.key === "ArrowDown") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowUp") nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;

    if (nextIndex !== null) {
      event.preventDefault();
      faqTriggers[nextIndex].focus();
    }
  });
});

const revealItems = Array.from(document.querySelectorAll(".reveal"));

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
