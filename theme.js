'use strict';
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const modes = ['system', 'dark', 'light'];
  const storageKey = 'jongmin-theme';
  let preference = 'system';
  try {
    const saved = localStorage.getItem(storageKey);
    if (modes.includes(saved)) preference = saved;
  } catch {}
  function nextPreference() {
    const order = system.matches ? ['system', 'light', 'dark'] : ['system', 'dark', 'light'];
    return order[(order.indexOf(preference) + 1) % order.length];
  }
  function applyTheme() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#151c19' : '#f7f7f2');
    try {
      const visitor = document.querySelector('.visitor-block iframe')?.contentDocument?.documentElement;
      if (visitor) visitor.dataset.theme = theme;
    } catch {}
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const next = nextPreference();
      const label = `Theme: ${preference}. Switch to ${next === 'system' ? 'system theme' : next + ' mode'}`;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.hidden = false;
    }
  }
  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      preference = nextPreference();
      try { localStorage.setItem(storageKey, preference); } catch {}
      applyTheme();
    });
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
