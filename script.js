const faqTriggers = Array.from(document.querySelectorAll(".faq-trigger"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function setMenuState(open) {
  if (!menuToggle || !navLinks) return;

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  navLinks.classList.toggle("is-open", open);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

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

const finalForm = document.getElementById("final-form");

if (finalForm) {
  finalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = (finalForm.querySelector("#f-nome")?.value ?? "").trim();
    const clinica = (finalForm.querySelector("#f-clinica")?.value ?? "").trim();
    const cidade = (finalForm.querySelector("#f-cidade")?.value ?? "").trim();
    const desafio = (finalForm.querySelector("#f-desafio")?.value ?? "").trim();

    let msg = "Olá!";
    if (nome) msg += ` Sou ${nome}`;
    if (clinica) msg += ` da clínica ${clinica}`;
    if (cidade) msg += `, em ${cidade}`;
    msg += ".";
    if (desafio) msg += ` Meu maior desafio hoje: ${desafio}.`;
    msg += " Vim pelo site e quero meu diagnóstico gratuito.";

    window.open(
      `https://wa.me/5543988724786?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });
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
