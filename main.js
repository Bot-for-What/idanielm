(() => {
  gsap.registerPlugin(ScrollTrigger);
  const bar = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });

  const dots   = document.querySelectorAll('.dot');
  const panels = document.querySelectorAll('.panel');
  function activateDot(id) {
    dots.forEach(d => d.classList.toggle('active', d.dataset.id === id));
  }
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      document.getElementById(dot.dataset.id)?.scrollIntoView({ behavior: 'smooth' });
      activateDot(dot.dataset.id);
    });
  });

  function updateActiveDotByPosition() {
    const viewportCenter = window.scrollY + window.innerHeight / 2;
    let closestPanel = null;
    let closestDistance = Infinity;
    panels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      const panelCenter = window.scrollY + rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - panelCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPanel = panel;
      }
    });
    if (closestPanel) activateDot(closestPanel.id);
  }
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateActiveDotByPosition();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
  updateActiveDotByPosition();

  const chips = document.querySelectorAll('.chip');
  ScrollTrigger.create({
    trigger: '#skills', start: 'top 75%',
    onEnter:     () => chips.forEach((c, i) => setTimeout(() => c.classList.add('is-open'), i * 70)),
    onLeaveBack: () => chips.forEach(c => c.classList.remove('is-open')),
  });

  const cards = document.querySelectorAll('.card');
  ScrollTrigger.create({
    trigger: '#projects', start: 'top 75%',
    onEnter:     () => cards.forEach((c, i) => setTimeout(() => c.classList.add('is-open'), i * 120)),
    onLeaveBack: () => cards.forEach(c => c.classList.remove('is-open')),
  });

  /* ── PROJECT CARD EXPAND / COLLAPSE WITH SCROLL-TO-TOP ── */
  function scrollCardToTop(card) {
    const rect = card.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - 12;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  function waitForTransition(el, prop) {
    return new Promise(resolve => {
      function handler(e) {
        if (e.propertyName !== prop) return;
        el.removeEventListener('transitionend', handler);
        resolve();
      }
      el.addEventListener('transitionend', handler);
    });
  }

document.querySelectorAll('.card-link:not(.card-link-hide)').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    const openCard = document.querySelector('.card.expanded');

    if (openCard && openCard !== card) {
      const otherDetail = openCard.querySelector('.card-detail');
      otherDetail.style.transition = 'none';   // disable animation just for this instant close
      openCard.classList.remove('expanded');
      void otherDetail.offsetHeight;           // force the browser to apply the change immediately
      otherDetail.style.transition = '';        // restore normal animation for next time
    }

    card.classList.add('expanded');
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.card-link-hide').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    card.classList.remove('expanded');
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── LIGHTBOX ── */
(() => {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">‹</button>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">›</button>
    <button class="lightbox-close" type="button" aria-label="Close">✕</button>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lightbox-img');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  const closeBtn = overlay.querySelector('.lightbox-close');

  let currentGroup = [];
  let currentIndex = 0;

  function updateNavVisibility() {
    const multi = currentGroup.length > 1;
    prevBtn.style.display = multi ? 'flex' : 'none';
    nextBtn.style.display = multi ? 'flex' : 'none';
  }

  function showImage(index) {
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    const target = currentGroup[currentIndex];
    imgEl.src = target.src;
    imgEl.alt = target.alt || '';
  }

  function openLightbox(clickedImg) {
    const card = clickedImg.closest('.card-detail-image-col') || clickedImg.parentElement;
    currentGroup = Array.from(card.querySelectorAll('.card-screenshot'));
    const startIndex = currentGroup.indexOf(clickedImg);
    showImage(startIndex >= 0 ? startIndex : 0);
    updateNavVisibility();
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.card-screenshot').forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
  });

  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('visible')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();

  /* ── SHOW MORE APPS ── */
  const showMoreBtn = document.getElementById('show-more-apps');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const appChipsEl = document.querySelector('.app-chips');
      const isOpen = appChipsEl.classList.toggle('expanded');
      showMoreBtn.classList.toggle('open', isOpen);
      showMoreBtn.innerHTML = isOpen
        ? '− less <span class="show-more-arrow">▾</span>'
        : '+ more <span class="show-more-arrow">▾</span>';
    });
  }

  /* ── THEME TOGGLE ── */
  const themeBtn = document.getElementById('theme-toggle');
  function positionToggle() {
    const nav = document.getElementById('nav');
    const navRect = nav.getBoundingClientRect();
    themeBtn.style.top = (navRect.bottom + 16) + 'px';
  }
  positionToggle();
  window.addEventListener('resize', positionToggle);
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeBtn.textContent = '🌙';
  }
  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    themeBtn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  /* ── SKILLS CHIP INFO ── */
  const chipInfo = {
    'Docker':               'Container platform used to run all self-hosted apps in isolated, portable environments.',
    'Linux':                'Primary OS for all self-hosted infrastructure. Ubuntu-based server environment.',
    'Caddy':                'Reverse proxy handling internal domain routing and automatic HTTPS for all hosted apps.',
    'Technitium':           'Internal DNS server resolving clean domain names like tv.loc across the LAN instead of raw IPs.',
    'Networking':           'LAN configuration, VLAN and interVLAN configuration, and internal routing across the company network.',
    'n8n':                  'Workflow automation tool. Used in the Telegram notification trigger during ticket creation project.',
    'Bash':                 'Used for scripting, scheduled tasks, and server maintenance automation.',
    'Active Directory':     'Windows Server AD managing user accounts, permissions, and authentication across the organization.',
    'Group Policy':         'GPO-based automation for startup scripts, temp file cleanup, shutdown logging, and print access control.',
    'Excel Automation':           'Advanced formula-driven sheets tracked network downtime, patient journeys, print jobs, and vendor tickets across units.',
    'Jellyfin':                   'Media server used to stream signage content across company TVs throughout the company premises.',
    'Vaultwarden':                'Self-hosted Bitwarden-compatible password manager for secure credential sharing.',
    'Paperless-ngx':              'Document management system with OCR — digitises and indexes physical documents for instant search.',
    'Immich':                     'Self-hosted photo and video backup solution replacing Google Photos.',
    'OsTicket':                   'Ticketing system centralising all IT service requests with tracking and accountability.',
    'Snipe-IT':                   'IT asset management tracking all hardware and consumables — who has it, when assigned, full history.',
    'Docassemble':                'Document automation platform turning repetitive manual drafting into guided form-based workflows.',
    'EspoCRM':                    'CRM deployed for front desk call logging — searchable history of all incoming calls.',
    'Linkwarden':                 'Self-hosted bookmark manager for saving and organising internal and external links.',
    'Dockhand':                   'Docker container management interface for monitoring and controlling running services.',
    'Copyparty':                  'Self-hosted file server providing FTP-like access for internal file sharing.',
    'IT-Tools':                   'Collection of useful developer and IT utilities, self-hosted for internal use.',
    'Git':                        'Version control for tracking configuration files, scripts, and deployment changes.',
    'Telegram Integration':       'Used to build notification bots — started with service request alerts, expanded to multiple integrations.',
    'Google Forms':               'Entry point for service requests before osTicket — still used for specific intake workflows.',
    'NocoDB':                     'No-code database interface layered over existing databases for easy data viewing and editing.',
    'Metabase':                   'Business intelligence tool for building internal dashboards and reports from live data.',
    'HMIS':                       'Hospital Management Information System. Provided training, handled issues and vendor co-ordination.',
    'PACS':                       'Picture Archiving and Communication System. Vendor co-ordination for integration, maintain operational status, backup and report generation.',
    'EHR':                        'Electronic Health Record. Vendor co-ordination and report generation.',
    'Lab Equipment Integration':  'Multiple vendor co-ordination during integration process. Provided user training and report generation. ',
    'Microsoft 365':              'Created formula-driven sheets to solve niche hinderances and report submission in Excel. Timely presentations in PowerPoint.',
  };

  let activeBubble = null;
  function clearBubbles() {
    document.querySelectorAll('.chip-bubble').forEach(b => b.remove());
    document.querySelectorAll('.chip.highlighted').forEach(c => c.classList.remove('highlighted'));
    activeBubble = null;
  }

  function showBubble(chip) {
    clearBubbles();
    const name = chip.textContent.trim();
    const info = chipInfo[name];
    if (!info) return;
    const bubble = document.createElement('div');
    bubble.className = 'chip-bubble';
    bubble.textContent = info;
    chip.appendChild(bubble);
    chip.classList.add('highlighted');
    activeBubble = bubble;

    requestAnimationFrame(() => {
      const chipRect = chip.getBoundingClientRect();
      const bubbleWidth = bubble.offsetWidth;
      const bubbleHeight = bubble.offsetHeight;
      const margin = 16;

      // Horizontal clamp
      const center = chipRect.left + chipRect.width / 2;
      const halfWidth = bubbleWidth / 2;
      const leftEdge = center - halfWidth;
      const rightEdge = center + halfWidth;
      let shift = 0;
      if (leftEdge < margin) {
        shift = margin - leftEdge;
      } else if (rightEdge > window.innerWidth - margin) {
        shift = (window.innerWidth - margin) - rightEdge;
      }
      bubble.style.left = `calc(50% + ${shift}px)`;
      bubble.style.setProperty('--arrow-shift', `${shift}px`);

      // Vertical clamp — bubble sits above the chip
      const bubbleTop = chipRect.top - bubbleHeight - 10;
      if (bubbleTop < margin) {
        const scrollAdjust = bubbleTop - margin;
        window.scrollBy({ top: scrollAdjust, behavior: 'smooth' });
      }

      requestAnimationFrame(() => bubble.classList.add('visible'));
    });

    setTimeout(() => {
      bubble.classList.remove('visible');
      setTimeout(() => {
        bubble.remove();
        chip.classList.remove('highlighted');
        if (activeBubble === bubble) activeBubble = null;
      }, 200);
    }, 4000);
  }

  document.querySelectorAll('#skills .chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (chip.classList.contains('highlighted')) {
        clearBubbles();
      } else {
        showBubble(chip);
      }
    });
  });

  document.querySelectorAll('.app-chip').forEach(appChip => {
    appChip.style.cursor = 'pointer';
    appChip.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = appChip.textContent.trim();
      const skillsChips = document.querySelectorAll('#skills .chip');
      let targetChip = null;
      skillsChips.forEach(chip => {
        if (chip.textContent.trim() === name) targetChip = chip;
      });
      if (targetChip) {
        targetChip.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        setTimeout(() => showBubble(targetChip), 900);
      } else {
        document.getElementById('skills').scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => showBubble(appChip), 900);
      }
    });
  });

  document.addEventListener('click', () => clearBubbles());

  /* ── CAREER HISTORY TOGGLE ── */
  const careerToggle = document.getElementById('career-toggle');
  const careerExtra  = document.getElementById('career-extra');
  if (careerToggle && careerExtra) {
    careerToggle.addEventListener('click', () => {
      const isOpen = careerExtra.classList.toggle('open');
      careerToggle.classList.toggle('open', isOpen);
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* ── OBFUSCATED mailto EMAIL ── */
  (() => {
    const user = 'hi';
    const sub = 'idanielm';
    const domain = '.com';
    const link = document.getElementById('contact-email');
    if (link) {
      link.href = `mailto:${user}@${sub}${domain}`;
    }
  })();

  /* ── OBFUSCATED LinkedIn Profile ── */
  (() => {
    const domain = 'www.linkedin.com';
    const profile = 'daniel-marbaniang';
    const link = document.getElementById('linkedin');
    if (link) {
      link.href = `https://${domain}/in/${profile}/`;
    }
  })();

  /* ── OBFUSCATED GitHub Profile ── */
  (() => {
    const hub = 'github.com';
    const git = 'Bot-for-What';
    const link = document.getElementById('github');
    if (link) {
      link.href = `https://${hub}/${git}`;
    }
  })();
  
    /* ── ABOUT FULL STORY TOGGLE ── */
const aboutToggle  = document.getElementById('about-toggle');
const aboutCopy     = document.getElementById('about-copy');
const aboutHook     = document.getElementById('about-hook');
const aboutSection  = document.getElementById('about');

if (aboutToggle && aboutCopy && aboutHook) {
  aboutToggle.addEventListener('click', () => {
    const isOpen = aboutCopy.classList.toggle('open');
    aboutToggle.classList.toggle('open', isOpen);
    aboutHook.classList.toggle('is-hidden', isOpen);
    aboutToggle.innerHTML = isOpen
      ? 'Show Less <span class="about-toggle-arrow">▾</span>'
      : 'Full Story <span class="about-toggle-arrow">▾</span>';

    if (!isOpen) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

})();
