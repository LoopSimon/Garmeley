var analyticsScript = document.createElement('script');
analyticsScript.defer = true;
analyticsScript.setAttribute('data-domain', 'www.garmeleywiki.com');
analyticsScript.src = 'https://plausible.io/js/plausible.js';
document.head.appendChild(analyticsScript);

var plausibleScript = document.createElement('script');
plausibleScript.async = true;
plausibleScript.src = 'https://plausible.io/js/pa-cWwjMjmnSKaXQDhQiZdMs.js';
document.head.appendChild(plausibleScript);

var plausibleInit = document.createElement('script');
plausibleInit.textContent = `
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
`;
document.head.appendChild(plausibleInit);

// Fix wiki links for the custom domain (wiki.garmeley.com).
// Obsidian Publish serves <base href="https://publish.obsidian.md">, so the raw href of an
// internal link resolves to publish.obsidian.md/<Page> ("Not found!") for middle-click,
// "Open link in new tab" and "Copy link address". Left-click and Ctrl+click already work,
// because Publish handles those itself. This asks Publish for the real page URL (the same
// one Ctrl+click opens) and puts it on the link just before the browser uses it, then puts
// the original back before a normal left-click so in-page navigation keeps working.
(function () {
  function linkOf(e) {
    var t = e.target;
    return t && t.closest ? t.closest('a.internal-link') : null;
  }
  function restore(a) {
    if (a && a.hasAttribute('data-orig-href')) {
      a.setAttribute('href', a.getAttribute('data-orig-href'));
    }
  }
  function realUrl(a) {
    var url = null, orig = window.open;
    window.open = function (u) { url = String(u); return null; };
    try {
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }));
    } finally {
      window.open = orig;
    }
    return url;
  }
  function fix(a) {
    if (!a) return;
    if (!a.hasAttribute('data-orig-href')) a.setAttribute('data-orig-href', a.getAttribute('href') || '');
    restore(a);
    var url = realUrl(a);
    if (url) a.setAttribute('href', url);
  }
  document.addEventListener('contextmenu', function (e) { fix(linkOf(e)); }, true);
  document.addEventListener('mousedown', function (e) {
    var a = linkOf(e);
    if (!a) return;
    if (e.button === 1) fix(a);
    else if (e.button === 0) restore(a);
  }, true);
})();
