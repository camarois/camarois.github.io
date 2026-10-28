(function () {
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // Language: saved choice, then browser language, then French
  const browser = (navigator.language || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr';
  setLang(store.get('lang') || browser);

  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang;
  }
  document.querySelector('.lang-toggle').addEventListener('click', () => {
    const next = root.dataset.lang === 'fr' ? 'en' : 'fr';
    setLang(next);
    store.set('lang', next);
  });

  // Press G for the control-room palette
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/input|textarea/i.test(document.activeElement.tagName)) return;
    root.dataset.mode = root.dataset.mode === 'grid' ? '' : 'grid';
  });

  // Click the avatar to enlarge it; click anywhere or press Esc to close
  const photo = document.getElementById('photo');
  document.querySelector('.avatar-btn').addEventListener('click', () => photo.showModal());
  photo.addEventListener('click', () => photo.close());

  // Tunes carousel: arrows only show once there is more than one video
  const tunes = document.querySelector('.tunes');
  if (tunes) {
    const track = tunes.querySelector('.tunes-track');
    const items = [...track.children];
    const count = tunes.querySelector('.tunes-count');
    let current = 0;
    const render = () => {
      items.forEach((item, k) => { if (k !== current) item.querySelector('video').pause(); });
      count.textContent = `${current + 1} / ${items.length}`;
    };
    const show = (i) => {
      current = (i + items.length) % items.length;
      track.scrollTo({ left: items[current].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      render();
    };
    if (items.length > 1) {
      tunes.querySelector('.tunes-nav').hidden = false;
      tunes.querySelector('.tunes-prev').addEventListener('click', () => show(current - 1));
      tunes.querySelector('.tunes-next').addEventListener('click', () => show(current + 1));
      // Swiping on touch screens moves the track directly
      let settle;
      track.addEventListener('scroll', () => {
        clearTimeout(settle);
        settle = setTimeout(() => {
          current = Math.round(track.scrollLeft / track.clientWidth);
          render();
        }, 120);
      }, { passive: true });
      render();
    }
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
