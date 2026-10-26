'use strict';
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const modes = ['system', 'dark', 'light'];
  const storageKey = 'jongmin-theme';
  const label = value => value[0].toUpperCase() + value.slice(1);
  let preference = 'system';
  try {
    const saved = localStorage.getItem(storageKey);
    if (modes.includes(saved)) preference = saved;
  } catch {}
  function applyTheme() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#232d28' : '#f7f7f2');
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', preference === 'system' ? 'light dark' : theme);
    try {
      const visitor = document.querySelector('.visitor-block iframe')?.contentDocument?.documentElement;
      if (visitor) visitor.dataset.theme = theme;
    } catch {}
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const name = `Color theme: ${label(preference)}${preference === 'system' ? ' (' + label(theme) + ')' : ''}`;
      button.setAttribute('aria-label', name);
      button.title = name;
    }
    document.querySelectorAll('[data-theme-choice]').forEach(option => {
      const checked = option.dataset.themeChoice === preference;
      option.setAttribute('aria-checked', String(checked));
      option.tabIndex = checked ? 0 : -1;
    });
  }
  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('.theme-control');
    const button = control.querySelector('.theme-toggle');
    const menu = control.querySelector('.theme-menu');
    const options = [...menu.querySelectorAll('[data-theme-choice]')];
    function closeMenu(focus = false) {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      if (focus) button.focus({ preventScroll: true });
    }
    function openMenu(index) {
      menu.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      const option = Number.isInteger(index) ? options[index] : options.find(item => item.dataset.themeChoice === preference);
      option.focus({ preventScroll: true });
    }
    button.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu(true));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu(event.key === 'ArrowDown' ? 0 : options.length - 1);
      }
    });
    options.forEach(option => option.addEventListener('click', () => {
      preference = option.dataset.themeChoice;
      try { localStorage.setItem(storageKey, preference); } catch {}
      applyTheme();
      closeMenu(true);
    }));
    menu.addEventListener('keydown', event => {
      let next = options.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') next = (next + 1) % options.length;
      else if (event.key === 'ArrowUp') next = (next - 1 + options.length) % options.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      else return;
      event.preventDefault();
      options[next].focus({ preventScroll: true });
    });
    control.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); closeMenu(true); }
      if (event.key === 'Tab') closeMenu(true);
    });
    document.addEventListener('click', event => { if (!control.contains(event.target)) closeMenu(); });
    window.addEventListener('hashchange', () => closeMenu());
    applyTheme();
  });
  system.addEventListener('change', applyTheme);
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      preference = modes.includes(event.newValue) ? event.newValue : 'system';
      applyTheme();
    }
  });
})();
