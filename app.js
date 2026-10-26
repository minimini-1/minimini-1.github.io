'use strict';
(() => {
  const content = window.SITE_CONTENT;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  $('.skip-link').addEventListener('click', event => { event.preventDefault(); $('#main').focus(); });
  const navigationMore = $('.nav-more');
  document.addEventListener('click', event => { if (!navigationMore.contains(event.target) || event.target.closest('.nav-more a')) navigationMore.open = false; });
  navigationMore.addEventListener('keydown', event => { if (event.key === 'Escape') { navigationMore.open = false; $('summary', navigationMore).focus(); } });
  let activeYear = 'all';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transitions = new WeakMap();
  function revealContent(element) {
    transitions.get(element)?.cancel();
    if (motionPreference.matches || !element.animate) return;
    transitions.set(element, element.animate([
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' }));
  }

  const navigation = $('.glass-nav');
  const navigationGlass = $('.nav-glider');
  let glassAnimation;
  let glassDestination;
  function updateNavigationGlass(animate = true) {
    const direct = $('.glass-nav > a.active');
    const moreVisible = navigationMore.offsetWidth > 0;
    const target = moreVisible && (navigationMore.open || !direct?.offsetWidth) ? $('summary', navigationMore) : direct;
    if (!target?.offsetWidth) return;
    const parent = navigation.getBoundingClientRect();
    const item = target.getBoundingClientRect();
    const end = { left: item.left - parent.left - navigation.clientLeft, top: item.top - parent.top - navigation.clientTop, width: item.width, height: item.height };
    const destination = Object.values(end).join(',');
    if (animate && destination === glassDestination) return;
    const current = getComputedStyle(navigationGlass);
    const start = { left: current.left, top: current.top, width: current.width, height: current.height };
    const ready = !navigationGlass.hidden;
    glassAnimation?.cancel();
    Object.entries(end).forEach(([property, value]) => { navigationGlass.style[property] = value + 'px'; });
    navigationGlass.hidden = false;
    navigation.classList.add('glass-ready');
    glassDestination = destination;
    if (!ready || !animate || motionPreference.matches || !navigationGlass.animate) return;
    const distance = end.left - parseFloat(start.left);
    const stretch = Math.min(Math.abs(distance) * .14, 28);
    const finish = Object.fromEntries(Object.entries(end).map(([property, value]) => [property, value + 'px']));
    glassAnimation = navigationGlass.animate([
      { ...start, transform: 'scaleY(1)' },
      { ...finish, left: (end.left - stretch / 2 + Math.sign(distance) * 3) + 'px', width: (end.width + stretch) + 'px', transform: 'scaleY(.96)', offset: .72 },
      { ...finish, transform: 'scaleY(1)' }
    ], { duration: 480, easing: 'cubic-bezier(.22,.8,.2,1)' });
  }
  let navigationResize;
  function resizeNavigationGlass() {
    cancelAnimationFrame(navigationResize);
    navigationResize = requestAnimationFrame(() => updateNavigationGlass(false));
  }
  navigationMore.addEventListener('toggle', () => updateNavigationGlass());
  window.addEventListener('resize', resizeNavigationGlass);
  if ('ResizeObserver' in window) new ResizeObserver(resizeNavigationGlass).observe(navigation);
  document.fonts?.ready.then(resizeNavigationGlass);
  motionPreference.addEventListener('change', () => updateNavigationGlass(false));

  const venueShort = p => {
    if (p.slug === 'craft') return 'SIGGRAPH ASIA · 2026';
    if (p.slug === 'svd-style') return 'CVPR · 2026';
    if (p.slug === 'style-aligned') return 'ARXIV PREPRINT · 2025';
    if (p.slug === 'infinite-story') return 'AAAI · 2026';
    if (p.slug === 'style_editor') return 'CVPR · 2025';
    return 'ACCV · 2024';
  };
  const badge = p => p.slug === 'infinite-story' ? '<span class="paper-badge">Oral</span>' : p.slug === 'style_editor' ? '<span class="paper-badge">Highlight</span>' : '';
  const paperLinks = p => p.links.map((l, i) => `<a href="${escape(l.url)}" ${external}>${i === 0 ? 'Paper' : 'Project page'}</a>`).join('');

  function renderPublications() {
    const papers = content.publications.filter(p => activeYear === 'all' || venueShort(p).includes(activeYear));
    $('#publication-grid').innerHTML = papers.map(p => `<article class="publication-card">
      <a class="paper-image" href="#paper/${p.slug}" data-paper="${p.slug}" aria-label="Read ${escape(p.title)}"><img src="assets/${p.image}" alt="Visual overview of ${escape(p.title)}" loading="lazy"></a>
      <div class="paper-body"><p class="paper-venue">${venueShort(p)} ${badge(p)}</p><h2 class="paper-title"><a href="#paper/${p.slug}" data-paper="${p.slug}">${escape(p.title)}</a></h2><p class="paper-authors">${p.authors}</p><div class="paper-links">${paperLinks(p)}<a href="#paper/${p.slug}" data-paper="${p.slug}">Details</a></div></div>
    </article>`).join('');
    $('#research-status').textContent = `${papers.length} publications shown${activeYear === 'all' ? '' : ' for ' + activeYear}.`;
  }
  $$('.research-year').forEach(button => {
    const count = content.publications.filter(p => button.dataset.year === 'all' || venueShort(p).includes(button.dataset.year)).length;
    $('.year-count', button).textContent = String(count).padStart(2, '0');
  });
  renderPublications();
  const newsSource = document.createElement('div');
  newsSource.innerHTML = content.news;
  const months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
  $$('h4', newsSource).forEach((heading, index) => {
    const year = heading.textContent.trim();
    const list = heading.nextElementSibling;
    const entries = $$('li', list);
    const tab = document.createElement('button');
    tab.id = 'news-tab-' + year;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'news-panel-' + year);
    tab.setAttribute('aria-selected', index === 0);
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.dataset.panel = year;
    tab.innerHTML = `<span class="tab-label" data-label="${year}"><span>${year}</span></span><span>${String(entries.length).padStart(2, '0')}</span>`;
    $('.news-tabs').append(tab);
    const panel = document.createElement('div');
    panel.id = 'news-panel-' + year;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    panel.hidden = index !== 0;
    panel.className = 'news-panel';
    panel.innerHTML = '<ul class="news-list">' + entries.map(entry => {
      const month = $('strong', entry).textContent.trim();
      const text = $('span', entry);
      const actions = $$('a', text).map(link => {
        const label = link.textContent.replace(/[()]/g, '').trim();
        const title = label === 'Link' ? 'Read more' : label === 'Project Page' ? 'Project page' : label;
        const action = `<a class="news-link" href="${escape(link.href)}" ${external}>${escape(title)}</a>`;
        link.remove();
        return action;
      }).join('');
      return `<li class="news-item"><time class="news-month" datetime="${year}-${months[month]}">${month}</time><div class="news-item-body"><p>${text.innerHTML.trim()}</p>${actions ? `<div class="news-actions">${actions}</div>` : ''}</div></li>`;
    }).join('') + '</ul>';
    $('#news-panels').append(panel);
  });

  for (const id of ['education', 'work-experience', 'awards']) {
    const panel = document.createElement('div');
    panel.id = 'panel-' + id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'tab-' + id);
    panel.tabIndex = 0;
    panel.hidden = false;
    panel.innerHTML = `<ol class="activity-records">${content.sections[id].map((record, i) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = record;
      const p = $('p', wrapper);
      let date = '';
      if (id === 'awards') {
        const em = $('em', p);
        if (em) { date = em.textContent; em.remove(); }
        p.innerHTML = p.innerHTML.replace(/[,\s]+$/, '');
      } else {
        const chunks = p.innerHTML.split(/<br\s*\/?\s*>/i);
        date = chunks.pop();
        p.innerHTML = chunks.join('<br>');
      }
      const titleElement = $('strong', p);
      const title = titleElement ? titleElement.textContent.trim() : '';
      if (titleElement) titleElement.remove();
      const description = p.innerHTML.replace(/^(?:\s|,|<br\s*\/?>)+/gi, '').trim();
      const dateNode = document.createElement('div');
      dateNode.innerHTML = date;
      const continued = $('em', dateNode);
      const note = continued && continued.textContent.startsWith('Continued') ? continued.textContent : '';
      if (note) continued.remove();
      const dateText = dateNode.textContent.replace(/[,\s]+$/, '').trim();
      const dateParts = dateText.split(';').map(text => text.trim()).filter(Boolean);
      return `<li class="activity-record"><span class="record-number">0${i + 1}</span><div class="record-main"><h2 class="record-title">${escape(title)}</h2>${description ? `<div class="record-description">${description}</div>` : ''}<p class="record-date">${dateParts.map(text => `<span>${escape(text)}</span>`).join('')}</p>${note ? `<p class="record-note">${escape(note)}</p>` : ''}</div></li>`;
    }).join('')}</ol>`;
    if (id === 'education') $('#education-records').innerHTML = panel.innerHTML;
    else if (id === 'work-experience') $('#experience-records').innerHTML = panel.innerHTML;
    else $('#activity-panels').append(panel);
  }
  function appendActivityPanel(id, markup) {
    const panel = document.createElement('div');
    panel.id = 'panel-' + id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'tab-' + id);
    panel.tabIndex = 0;
    panel.hidden = true;
    panel.innerHTML = markup;
    $('#activity-panels').append(panel);
  }
  appendActivityPanel('projects', '<div class="project-list">' + content.sections.projects.map((record, i) => {
    const node = document.createElement('div'); node.innerHTML = record;
    const paragraph = $('p', node);
    const titleNode = $('strong', paragraph);
    const title = titleNode.textContent;
    titleNode.remove();
    const dateNode = $('em', paragraph);
    const date = dateNode.textContent;
    dateNode.remove();
    const description = paragraph.innerHTML.replace(/^(?:\s|<br\s*\/?>)+/gi, '').replace(/(?:\s|<br\s*\/?>)+$/gi, '');
    return `<article class="project-card"><span class="project-index">PROJECT / 0${i + 1}</span><h2 class="project-title">${escape(title)}</h2><div class="project-description">${description}</div><p class="project-date">${escape(date)}</p></article>`;
  }).join('') + '</div>');
  appendActivityPanel('skills', '<div class="skills-grid">' + content.sections.skills.map(s => {
    const node = document.createElement('div'); node.innerHTML = s;
    const [label, ...value] = node.textContent.split(':');
    return `<article class="skill-card"><h2>${escape(label.trim())}</h2><div class="skill-tags">${value.join(':').trim().split(',').map(t => `<span>${escape(t.trim())}</span>`).join('')}</div></article>`;
  }).join('') + '</div>');

  function selectTab(group, panelId, focus = false) {
    $$('[role=tab]', group).forEach(tab => {
      const selected = tab.dataset.panel === panelId;
      tab.setAttribute('aria-selected', selected);
      tab.tabIndex = selected ? 0 : -1;
      const panel = $('#' + tab.getAttribute('aria-controls'));
      const changed = panel.hidden;
      panel.hidden = !selected;
      if (selected && changed) revealContent(panel);
      if (selected && focus) tab.focus();
    });
  }
  $$('.tabs').forEach(group => {
    const tabs = $$('[role=tab]', group);
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(group, tab.dataset.panel));
      tab.addEventListener('keydown', event => {
        let next = i;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault(); selectTab(group, tabs[next].dataset.panel, true);
      });
    });
  });
  $$('.research-year').forEach(button => button.addEventListener('click', () => {
    if (activeYear === button.dataset.year) return;
    activeYear = button.dataset.year;
    $$('.research-year').forEach(item => item.setAttribute('aria-pressed', item === button));
    renderPublications();
    revealContent($('#publication-grid'));
  }));

  function renderPaper(slug) {
    const p = content.publications.find(p => p.slug === slug);
    if (!p) return;
    $('#paper-detail').innerHTML = `<header class="paper-heading"><p class="paper-venue">${venueShort(p)} ${badge(p)}</p><h1 id="paper-title">${escape(p.title)}</h1><p class="detail-authors">${p.authors}</p><p class="small-note">${escape(p.venue)}</p><div class="paper-links">${paperLinks(p)}</div></header><img class="detail-image" src="assets/${p.image}" alt="Visual overview of ${escape(p.title)}"><h2>Abstract</h2><p class="abstract">${escape(p.abstract)}</p>${p.citation ? `<section class="citation"><button class="citation-toggle" type="button" aria-expanded="false" aria-controls="citation-panel"><span>Cite this work</span><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></button><div class="citation-panel" id="citation-panel" hidden><div class="citation-toolbar"><span>BibTeX</span><button class="copy-button" type="button">Copy BibTeX</button></div><pre class="citation-code" tabindex="0" aria-label="BibTeX citation"><code>${escape(p.citation)}</code></pre><span class="sr-only" id="copy-status" role="status"></span></div></section>` : ''}`;
    const citationToggle = $('.citation-toggle');
    const citationPanel = $('#citation-panel');
    if (citationToggle) citationToggle.addEventListener('click', () => {
      const expanded = citationToggle.getAttribute('aria-expanded') === 'true';
      citationToggle.setAttribute('aria-expanded', String(!expanded));
      citationPanel.hidden = expanded;
    });
    const copy = $('.copy-button');
    const copyStatus = $('#copy-status');
    const citationCode = $('.citation-code code');
    if (copy) copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(p.citation);
        copy.textContent = 'Copied';
        copyStatus.textContent = 'BibTeX copied to clipboard.';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(citationCode);
        const selection = window.getSelection();
        if (selection) { selection.removeAllRanges(); selection.addRange(range); }
        copy.textContent = 'Copy manually';
        copyStatus.textContent = 'Citation selected. Use your device’s copy command.';
      }
    });
  }
  const aliases = {publications:'research',journey:'activities',education:'background',experience:'background','work-experience':'background',awards:'activities',projects:'activities',skills:'activities'};
  const activityAliases = {journey:'awards',awards:'awards',projects:'projects',skills:'skills'};
  function route(initial = false) {
    let hash = location.hash.slice(1) || 'about';
    const requestedPaper = hash.startsWith('paper/') ? hash.slice(6) : null;
    const paper = requestedPaper && content.publications.some(p => p.slug === requestedPaper) ? requestedPaper : null;
    const viewId = requestedPaper ? (paper ? 'paper' : 'research') : (aliases[hash] || hash);
    const view = $('.view#' + (['about','research','news','background','activities','paper'].includes(viewId) ? viewId : 'about'));
    const previousView = $$('.view').find(s => !s.hidden);
    $$('.view').forEach(s => { s.hidden = s !== view; });
    $$('.glass-nav a').forEach(a => { const active = a.hash === '#' + (paper ? 'research' : view.id); a.classList.toggle('active', active); if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.body.dataset.view = view.id;
    const more = $('.nav-more');
    more.classList.toggle('active', ['background','activities'].includes(view.id));
    more.open = false;
    updateNavigationGlass(!initial);
    if (['education','experience','work-experience'].includes(hash)) selectTab($('.background-tabs'), hash === 'education' ? 'education' : 'experience');
    if (activityAliases[hash]) selectTab($('.activity-tabs'), activityAliases[hash]);
    if (paper) renderPaper(paper);
    document.title = view.id === 'about' ? 'Jongmin Gim — Computer Vision & Generative AI' : `${paper ? content.publications.find(p => p.slug === paper)?.title || 'Research' : ({research:'Research',news:'News',background:'Education & Experience',activities:'Academic Activities'})[view.id]} — Jongmin Gim`;
    if (!initial) {
      window.scrollTo({top:0,behavior:'instant'});
      $('#main').focus({preventScroll:true});
      if (previousView !== view || paper) revealContent(view);
    }
  }

  $('#copyright-year').textContent = new Date().getFullYear();
  window.addEventListener('hashchange',()=>route());
  route(true);
})();
