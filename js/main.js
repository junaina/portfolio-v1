(() => {
  //grabbing the button, menu and nav
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
    // grabbng whatever's in foocus on tab hit
    lastActiveEl = document.activeElement;
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close menu");
    // stop user from scrolling on mobile menu open
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
    //can scroll
    document.body.style.overflow = prevBodyOverflow || "";
    if (focus) {
      (lastActiveEl || btn)?.focus?.();
    }
  }

  function toggleMenu() {
    isOpen() ? closeMenu() : openMenu();
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });
  //close on any tap/click
  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    closeMenu({ focus: false });
  });

  //close if clicks away
  document.addEventListener("pointerdown", (e) => {
    if (!isOpen()) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    closeMenu({ focus: false });
  });

  //allow tabs and close on escape
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key !== "Tab") return;
  });

  mqDesktop.addEventListener("change", (ev) => {
    if (ev.matches) closeMenu({ focus: false });
  });
  //eg: #projects: close menu
  window.addEventListener("hashchange", () => closeMenu({ focus: false }));
})();
