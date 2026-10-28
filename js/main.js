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

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
