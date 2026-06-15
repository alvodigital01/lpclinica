const faqTriggers = Array.from(document.querySelectorAll(".faq-trigger"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const siteHeader = document.querySelector(".site-header");

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
  revealItems.forEach((item, index) => {
    const delay = Math.min(index % 4, 3) * 70;
    item.style.setProperty("--reveal-delay", `${delay}ms`);
  });

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

function updateHeaderState() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

function animateNumber(element, target, duration = 1100) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    element.textContent = `+${value} negócios atendidos`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.classList.remove("is-counting");
    }
  }

  element.classList.add("is-counting");
  requestAnimationFrame(tick);
}

const proofNumber = document.querySelector(".proof-grid span:first-child");

if (proofNumber && !prefersReducedMotion && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(proofNumber, 50);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counterObserver.observe(proofNumber);
}

const tiltCards = Array.from(
  document.querySelectorAll(".compare-card, .step-card, .solution-stack article, .final-card")
);
const canTilt = !prefersReducedMotion && window.matchMedia("(pointer: fine) and (min-width: 760px)").matches;

if (canTilt) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * -5;
      const rotateY = x * 5;

      card.classList.add("is-tilting");
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  });
}
