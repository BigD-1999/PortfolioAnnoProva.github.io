// ============================================================================
// ANNO DI PROVA · B016 — script.js
// ----------------------------------------------------------------------------
// Architettura:
//   1. Helpers (h, $, $$)                       — micro-utility DOM
//   2. Render dinamico                           — competenze + UDA da SITE_DATA
//   3. Observers (reveal, bars, counter, nav)    — animazioni allo scroll
//   4. UI interattiva (progress bar, stepper)    — input utente
//   5. Easter eggs (Konami: tema · Matrix: rain) — gioco
//   6. Console footprint                         — saluto agli sviluppatori curiosi
// ----------------------------------------------------------------------------
// Nota: l'ordine è importante.
//   Le funzioni di render DEVONO eseguire prima degli observers, altrimenti
//   gli observers non trovano gli elementi appena generati.
// ============================================================================

(function () {
  'use strict';

  // ==========================================================================
  // 1. HELPERS
  // ==========================================================================

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /**
   * Hyperscript helper: crea un elemento, applica attrs e attacca children.
   * Esempio: h('div', { class: 'foo', 'data-x': 1 }, [h('span', {}, ['ciao'])])
   * I children possono essere stringhe (testo sicuro), Node, o array di entrambi.
   */
  function h(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (val === false || val == null) continue;
      if (key === 'class') el.className = val;
      else if (key === 'html') el.innerHTML = val; // uso esplicito quando serve HTML
      else el.setAttribute(key, val);
    }
    const kids = Array.isArray(children) ? children : [children];
    for (const c of kids) {
      if (c == null || c === false) continue;
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  // ==========================================================================
  // 2. RENDER DINAMICO (da SITE_DATA → DOM)
  // ==========================================================================

  /** Guard: senza SITE_DATA non si va da nessuna parte. */
  if (typeof window.SITE_DATA !== 'object' || window.SITE_DATA === null) {
    console.error(
      '[B016] data.js non caricato o malformato. ' +
      'Verifica che <script src="data.js"></script> sia incluso prima di script.js.'
    );
    return;
  }

  // ----- 2a. Bilancio competenze ------------------------------------------------
  function renderCompetenze() {
    const container = $('#bilancio-grid');
    if (!container) return;

    const competenze = window.SITE_DATA.competenze || [];

    // Funzione locale per una singola bar-row (DRY interno)
    const makeBar = (label, valore, valoreLabel, isEnd) => h('div', { class: 'bar-row' }, [
      h('span', { class: 'bar-label' }, [label]),
      h('div', { class: 'bar-track' }, [
        h('div', {
          class: 'bar-fill' + (isEnd ? ' bar-fill--end' : ''),
          'data-fill': valore
        }, [
          h('span', {}, [valoreLabel || (valore / 20) + '/5'])
        ])
      ])
    ]);

    const cards = competenze.map(function (c) {
      return h('article', { class: 'competenza reveal' }, [
        h('div', { class: 'competenza__head' }, [
          h('span', { class: 'competenza__id' }, [c.id]),
          h('h3', {}, [c.titolo])
        ]),
        h('p', { class: 'competenza__desc' }, [c.descrizione]),
        h('div', { class: 'bars' }, [
          makeBar('Inizio anno', c.inizio.valore, c.inizio.label, false),
          makeBar('Fine anno',   c.fine.valore,   c.fine.label,   true)
        ])
      ]);
    });

    container.replaceChildren.apply(container, cards);
  }

  // ----- 2b. Timeline UDA --------------------------------------------------------
  function renderUDA() {
    const container = $('#timeline-list');
    if (!container) return;

    const uda = window.SITE_DATA.uda || [];

    const articles = uda.map(function (u) {
      const cardChildren = [h('h3', {}, [u.titolo])];
      if (u.descrizione) {
        cardChildren.push(h('p', { class: 'timeline__desc' }, [u.descrizione]));
      }
      return h('article', { class: 'timeline reveal' }, [
        h('div', { class: 'timeline__marker', 'aria-hidden': 'true' }),
        h('div', { class: 'timeline__date' }, [u.periodo]),
        h('div', { class: 'timeline__card' }, cardChildren)
      ]);
    });

    // Preservo la linea della timeline che è il primo figlio
    const line = container.querySelector('.timeline__line');
    const finalChildren = line ? [line].concat(articles) : articles;
    container.replaceChildren.apply(container, finalChildren);
  }

  // Eseguo i render PRIMA degli observers
  renderCompetenze();
  renderUDA();

  // ==========================================================================
  // 3. OBSERVERS (reveal, bars, counter, nav)
  // ==========================================================================

  // ----- 3a. Scroll reveal -------------------------------------------------------
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  // ----- 3b. Riempimento barre del bilancio --------------------------------------
  const barsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fills = $$('.bar-fill', entry.target);
        fills.forEach((fill, i) => {
          const target = fill.getAttribute('data-fill');
          setTimeout(() => {
            fill.style.width = target + '%';
            fill.classList.add('animated');
          }, 200 + i * 250);
        });
        barsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  $$('.competenza').forEach((el) => barsObserver.observe(el));

  // ----- 3c. Counter animato -----------------------------------------------------
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  $$('[data-count]').forEach((el) => counterObserver.observe(el));

  // ----- 3d. Sezione attiva nella nav laterale -----------------------------------
  const navLinks = $$('.side-nav a');
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      });
    },
    { threshold: 0.4 }
  );
  $$('.section').forEach((s) => navObserver.observe(s));

  // ==========================================================================
  // 4. UI INTERATTIVA
  // ==========================================================================

  // ----- 4a. Barra di progresso scroll -------------------------------------------
  const progressBar = $('.scroll-progress .bar');
  if (progressBar) {
    let ticking = false;
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? (scrolled / height) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => { updateProgress(); ticking = false; });
      ticking = true;
    });
    updateProgress();
  }

  // ----- 4b. Smooth scroll + focus accessibile -----------------------------------
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      setTimeout(() => target.focus({ preventScroll: true }), 600);
    });
  });

  // ----- 4c. Stepper lezione Linux -----------------------------------------------
  const steps = $$('.step');
  const panes = $$('.term-pane');
  function activateStep(idx) {
    steps.forEach((s) => {
      const isActive = s.getAttribute('data-step') === String(idx);
      s.classList.toggle('active', isActive);
      s.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panes.forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-pane') === String(idx));
    });
  }
  steps.forEach((step) => {
    step.addEventListener('click', () => {
      activateStep(parseInt(step.getAttribute('data-step'), 10));
    });
    step.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = parseInt(step.getAttribute('data-step'), 10);
      const next = e.key === 'ArrowRight'
        ? Math.min(current + 1, steps.length - 1)
        : Math.max(current - 1, 0);
      activateStep(next);
      steps[next].focus();
    });
  });

  // ==========================================================================
  // 5. EASTER EGGS
  // --------------------------------------------------------------------------
  // Entrambi sono isolati in IIFE separate: se uno fallisce, l'altro vive.
  // Entrambi hanno guardie contro l'attivazione accidentale durante la digitazione
  // in campi di input (per evitare disastri in fase di discussione orale).
  // ==========================================================================

  /** True se il focus è in un campo che accetta testo. */
  function isTypingContext(target) {
    if (!target) return false;
    const tag = target.tagName;
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target.isContentEditable === true
    );
  }

  // --------------------------------------------------------------------------
  // 5a. KONAMI: ↑↑↓↓←→←→BA → toggle tema chiaro/scuro
  // --------------------------------------------------------------------------
  // Il sito è chiaro di default. Konami attiva il "modalità notte".
  // Premuto di nuovo, ripristina il chiaro.
  // --------------------------------------------------------------------------
  (function konamiEgg() {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                 'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    let isDark = false;

    // Palette scura (la stessa della vecchia versione del sito, conservata per nostalgia)
    const darkVars = {
      '--bg':        '#0f1419',
      '--bg-alt':    '#161c23',
      '--bg-card':   '#1a2129',
      '--ink':       '#e8e3d6',
      '--ink-soft':  '#b8b1a0',
      '--ink-muted': '#6b7280',
      '--accent':       '#f5b14e',
      '--accent-soft':  '#f5b14e22',
      '--accent-deep':  '#d4912e',
      '--rule':  '#2a323d',
      '--green': '#7fb069',
      '--red':   '#e07856'
    };

    function applyDark() {
      Object.entries(darkVars).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v);
      });
      isDark = true;
      console.log('%c🌙 Modalità notte attivata. Konami di nuovo per tornare alla carta.',
                  'color:#f5b14e; font-family:monospace; font-weight:bold');
    }

    function applyLight() {
      Object.keys(darkVars).forEach((k) => {
        document.documentElement.style.removeProperty(k);
      });
      isDark = false;
      console.log('%c☀ Tema carta ripristinato.',
                  'color:#a04030; font-family:monospace; font-weight:bold');
    }

    document.addEventListener('keydown', (e) => {
      if (isTypingContext(e.target)) { idx = 0; return; }

      const key = e.key.toLowerCase();
      const expected = seq[idx].toLowerCase();

      if (key === expected) {
        idx++;
        if (idx === seq.length) {
          isDark ? applyLight() : applyDark();
          idx = 0;
        }
      } else {
        // Tolleranza: se ricomincia da capo con la freccia su, non resetto
        idx = (key === seq[0].toLowerCase()) ? 1 : 0;
      }
    });
  })();

  // --------------------------------------------------------------------------
  // 5b. MATRIX RAIN: 50+ pressioni dello stesso tasto in <15s
  // --------------------------------------------------------------------------
  // Guardie:
  //   - ignora se focus in input/textarea/contenteditable
  //   - ignora se sono in uso modificatori (Ctrl/Cmd/Alt) — significa scorciatoia
  //   - richiede stesso tasto consecutivo, finestra temporale 15s
  //   - Esc o click esce
  // --------------------------------------------------------------------------
  (function matrixEgg() {
    const THRESHOLD = 5;
    const WINDOW_MS = 15000;
    let lastKey = null;
    let count = 0;
    let firstTs = 0;
    let isRunning = false;
    let stopFn = null;

    document.addEventListener('keydown', (e) => {
      if (isRunning) {
        if (e.key === 'Escape') stopMatrix();
        return;
      }
      if (isTypingContext(e.target)) { reset(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) { reset(); return; }

      // Solo tasti "stampabili" (lettere/numeri) — niente frecce/F1/etc
      if (e.key.length !== 1) { reset(); return; }

      const now = performance.now();
      if (e.key !== lastKey || (now - firstTs) > WINDOW_MS) {
        // Nuovo conteggio
        lastKey = e.key;
        firstTs = now;
        count = 1;
        return;
      }

      count++;
      console.log("Conta: " + count);
      if (count >= THRESHOLD) {
        startMatrix();
        reset();
      }
    });

    function reset() {
      lastKey = null;
      count = 0;
      firstTs = 0;
    }

    function startMatrix() {
      if (isRunning) return;
      isRunning = true;
      stopFn = runMatrixCanvas();
      console.log('%c🌧 Wake up, Neo... [Esc o click per uscire]',
                  'color:#00ff41; font-family:monospace; font-weight:bold; font-size:14px');
    }

    function stopMatrix() {
      if (!isRunning) return;
      if (stopFn) stopFn();
      stopFn = null;
      isRunning = false;
    }

    /**
     * Disegna la pioggia Matrix su un canvas full-screen overlay.
     * Restituisce una funzione di cleanup che ferma l'animazione e rimuove il canvas.
     */
    function runMatrixCanvas() {
      const canvas = h('canvas', {
        style: 'position:fixed; inset:0; z-index:9999; background:#000; cursor:pointer;'
      });
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');

      function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      const charSize = 16;
      const columns = Math.floor(canvas.width / charSize);
      // Ogni colonna ha la sua "testa" (y in caratteri) e velocità di caduta
      const drops = Array.from({ length: columns }, () => Math.random() * -50);
      const speeds = Array.from({ length: columns }, () => 0.1 + Math.random() * 0.3);

      // Set di caratteri Matrix-style: katakana mezzi-larghezza + cifre + simboli
      const charset = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789@#$%&'.split('');

      let rafId = null;
      function frame() {
        // Trail effect: leggero velo nero per dissolvere progressivamente
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = charSize + 'px JetBrains Mono, monospace';

        for (let i = 0; i < columns; i++) {
          const ch = charset[Math.floor(Math.random() * charset.length)];
          const x = i * charSize;
          const y = drops[i] * charSize;

          // Testa più luminosa (bianca), coda verde Matrix classico
          ctx.fillStyle = '#aaffaa';
          ctx.fillText(ch, x, y);
          ctx.fillStyle = '#00ff41';
          ctx.fillText(ch, x, y - charSize);

          drops[i] += speeds[i];

          // Reset random quando una colonna esce dallo schermo
          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
            speeds[i] = 0.1 + Math.random() * 0.3;
          }
        }

        rafId = requestAnimationFrame(frame);
      }
      frame();

      // Click sul canvas per uscire
      canvas.addEventListener('click', stopMatrix);

      // Cleanup
      return function cleanup() {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        canvas.remove();
        console.log('%c💊 Out of the rabbit hole.',
                    'color:#a04030; font-family:monospace');
      };
    }
  })();

  // ==========================================================================
  // 6. CONSOLE FOOTPRINT
  // ==========================================================================
  console.log(
    '%c// Anno di prova · B016\n' +
    '%c// Laboratori di scienze e tecnologie informatiche\n' +
    '%c// Costruito con HTML + CSS + JavaScript, senza framework.\n' +
    '%c// Dati in data.js · logica in script.js · stile in style.css\n' +
    '%c// Curiosità: prova ↑↑↓↓←→←→BA — o pesta più volte lo stesso tasto.',
    'color:#a04030; font-family:monospace; font-size:14px; font-weight:bold',
    'color:#5a7a3e; font-family:monospace',
    'color:#4a5266; font-family:monospace',
    'color:#4a5266; font-family:monospace',
    'color:#8a8576; font-family:monospace; font-style:italic'
  );

})();
