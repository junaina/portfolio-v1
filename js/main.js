// main.js
(() => {
  const btn = document.querySelector(".hamburger");
  const menu = document.getElementById("mobile-menu");
  const nav = document.getElementById("mobile-nav");

  if (!btn || !menu || !nav) return;

  const mqDesktop = window.matchMedia("(min-width: 821px)");
  let lastActiveEl = null;
  let prevBodyOverflow = "";

  const getFocusable = () =>
    Array.from(
      menu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

  const isOpen = () => !menu.hidden;

  function openMenu({ focus = true } = {}) {
    if (isOpen()) return;

    lastActiveEl = document.activeElement;
    menu.hidden = false; // relies on your .mobile-menu[hidden] CSS :contentReference[oaicite:1]{index=1}

    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close menu");

    // lock scroll on mobile menu open
    prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (focus) {
      const first = getFocusable()[0];
      if (first) first.focus();
    }
  }

  function closeMenu({ focus = true } = {}) {
    if (!isOpen()) return;

    menu.hidden = true;

    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");

    // restore scroll
    document.body.style.overflow = prevBodyOverflow || "";

    if (focus) {
      (lastActiveEl || btn)?.focus?.();
    }
  }

  function toggleMenu() {
    isOpen() ? closeMenu() : openMenu();
  }

  // Button click
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close when tapping a nav link inside the mobile menu (including the CV link)
  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    closeMenu({ focus: false });
  });

  // Click outside to close
  document.addEventListener("pointerdown", (e) => {
    if (!isOpen()) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    closeMenu({ focus: false });
  });

  // ESC to close + basic focus trap (Tab cycles inside menu)
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key !== "Tab") return;

    const focusables = getFocusable();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // If we resize to desktop, force-close (your CSS hides it anyway) :contentReference[oaicite:2]{index=2}
  mqDesktop.addEventListener("change", (ev) => {
    if (ev.matches) closeMenu({ focus: false });
  });

  // Close on hash change (after navigating)
  window.addEventListener("hashchange", () => closeMenu({ focus: false }));
})();
