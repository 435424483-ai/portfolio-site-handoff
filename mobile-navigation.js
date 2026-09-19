(() => {
  if (!matchMedia('(pointer: coarse)').matches) return;
  const isDetail = /\/work\/[^/]+\/(?:index\.html)?$/.test(location.pathname);
  if (!isDetail) return;
  const home = new URL('../../index.html#work', location.href);
  const detailURL = location.href;
  const markReturn = () => {
    try { sessionStorage.setItem('chen-yue-return-home', '1'); } catch {}
  };
  let internalReferrer = false;
  try { internalReferrer = new URL(document.referrer).origin === location.origin; } catch {}
  // Directly shared detail pages have no homepage behind them. Add that route
  // once, without trapping Back or accumulating entries on reload/Forward.
  if (!internalReferrer && !history.state?.portfolioDetail) {
    history.replaceState({ portfolioHome: true }, '', home.href);
    history.pushState({ portfolioDetail: true }, '', detailURL);
  }
  addEventListener('popstate', () => {
    if (history.state?.portfolioHome) {
      markReturn();
      location.reload();
    }
  });
  let returning = false;
  const returnHome = () => {
    if (returning) return;
    returning = true;
    markReturn();
    // Replace only the current detail, so Back never loops through it.
    location.replace(home.href);
  };
  const back = document.createElement('a');
  back.className = 'mobile-home-link';
  back.href = new URL('../../index.html#intro', location.href).href;
  back.textContent = '← 返回首页';
  back.addEventListener('click', event => { event.preventDefault(); markReturn(); location.replace(back.href); });
  document.body.append(back);
  // Supplement browser Back where a webview delivers edge touches to the page.
  // Do not intercept vertical scrolling, pinch zoom, galleries or native Back.
  let start = null;
  addEventListener('touchstart', event => {
    start = null;
    if (event.touches.length !== 1 || document.querySelector('dialog[open]')) return;
    const touch = event.touches[0];
    const scale = visualViewport?.scale || 1;
    const left = visualViewport?.offsetLeft || 0;
    if ((touch.clientX - left) * scale > 22) return;
    start = { x: touch.clientX, y: touch.clientY, scale, time: performance.now() };
  }, { passive: true });
  addEventListener('touchmove', event => {
    if (!start) return;
    if (event.touches.length !== 1 || Math.abs(event.touches[0].clientY - start.y) * start.scale > 35) start = null;
  }, { passive: true });
  addEventListener('touchcancel', () => { start = null; }, { passive: true });
  addEventListener('touchend', event => {
    const origin = start;
    start = null;
    if (!origin || !event.changedTouches.length) return;
    const touch = event.changedTouches[0];
    const dx = (touch.clientX - origin.x) * origin.scale;
    const dy = Math.abs(touch.clientY - origin.y) * origin.scale;
    if (dx > 75 && dy < 35 && performance.now() - origin.time < 900) returnHome();
  }, { passive: true });
})();
