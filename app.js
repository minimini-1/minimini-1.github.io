'use strict';
(() => {
  const content = window.SITE_CONTENT;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  $('.skip-link').addEventListener('click', event => { event.preventDefault(); $('#main').focus(); });
  const navigationMore = $('.nav-more');
  document.addEventListener('click', event => { if (!navigationMore.contains(event.target)) navigationMore.open = false; });
  navigationMore.addEventListener('keydown', event => { if (event.key === 'Escape') { navigationMore.open = false; $('summary', navigationMore).focus(); } });
  function alignAboutEdge() {
    const about = $('#about');
    if (about.hidden) return;
    const mobile = window.matchMedia('(max-width:767px)').matches;
    const contentTop = $(mobile ? '.hero-copy' : '.portrait-block').getBoundingClientRect().top;
    const sectionTop = about.getBoundingClientRect().top;
    about.style.setProperty('--about-edge-top', Math.max(mobile ? 0 : 10, Math.round(contentTop - sectionTop - 24)) + 'px');
  }
  const aboutLayoutObserver = new ResizeObserver(alignAboutEdge);
  aboutLayoutObserver.observe($('.about-main'));
  aboutLayoutObserver.observe($('.portrait-block'));
  document.fonts.ready.then(alignAboutEdge);
  let activeYear = 'all';

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
    tab.innerHTML = `${year} <span>${String(entries.length).padStart(2, '0')}</span>`;
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
      $('#' + tab.getAttribute('aria-controls')).hidden = !selected;
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
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    activeYear = chip.dataset.year;
    $$('.chip').forEach(c => { c.classList.toggle('selected', c === chip); c.setAttribute('aria-pressed', c === chip); });
    renderPublications();
  }));

  function renderPaper(slug) {
    const p = content.publications.find(p => p.slug === slug);
    if (!p) return;
    $('#paper-detail').innerHTML = `<header class="paper-heading"><p class="paper-venue">${venueShort(p)} ${badge(p)}</p><h1 id="paper-title">${escape(p.title)}</h1><p class="detail-authors">${p.authors}</p><p class="small-note">${escape(p.venue)}</p><div class="paper-links">${paperLinks(p)}</div></header><img class="detail-image" src="assets/${p.image}" alt="Visual overview of ${escape(p.title)}"><h2>Abstract</h2><p class="abstract">${escape(p.abstract)}</p>${p.citation ? `<details><summary>Cite this work</summary><pre>${escape(p.citation)}</pre><button class="copy-button">Copy BibTeX</button><span class="sr-only" id="copy-status" role="status"></span></details>` : ''}`;
    const copy = $('.copy-button');
    if (copy) copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(p.citation); copy.textContent = 'Copied!'; $('#copy-status').textContent = 'BibTeX copied to clipboard.'; }
      catch { copy.textContent = 'Select the citation to copy'; }
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
    $$('.view').forEach(s => { s.hidden = s !== view; });
    $$('.glass-nav a').forEach(a => { const active = a.hash === '#' + (paper ? 'research' : view.id); a.classList.toggle('active', active); if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.body.dataset.view = view.id;
    if (view.id === 'about') alignAboutEdge();
    const more = $('.nav-more');
    more.classList.toggle('active', ['background','activities'].includes(view.id));
    more.open = false;
    if (['education','experience','work-experience'].includes(hash)) selectTab($('.background-tabs'), hash === 'education' ? 'education' : 'experience');
    if (activityAliases[hash]) selectTab($('.activity-tabs'), activityAliases[hash]);
    if (paper) renderPaper(paper);
    document.title = view.id === 'about' ? 'Jongmin Gim — Computer Vision & Generative AI' : `${paper ? content.publications.find(p => p.slug === paper)?.title || 'Research' : ({research:'Research',news:'News',background:'Education & Experience',activities:'Academic Activities'})[view.id]} — Jongmin Gim`;
    if (!initial) { window.scrollTo({top:0,behavior:'instant'}); $('#main').focus({preventScroll:true}); }
  }

  $('#copyright-year').textContent = new Date().getFullYear();
  window.addEventListener('hashchange',()=>route());
  route(true);
})();
