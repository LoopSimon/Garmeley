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