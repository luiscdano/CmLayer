(() => {
  const config = window.CMLAYER_ANALYTICS || {};
  const provider = config.provider || "none";
  const ga4Id = config.ga4?.measurementId;

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load analytics"));
      document.head.appendChild(script);
    });

  const initGa4 = () => {
    if (!ga4Id) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ga4Id, { anonymize_ip: true });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`).catch(() => {});
  };

  const initPlausible = () => {
    const domain = config.plausible?.domain;
    if (!domain) return;
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = domain;
    script.src = (config.plausible?.apiHost || "https://plausible.io") + "/js/script.js";
    document.head.appendChild(script);
  };

  if (provider === "ga4") {
    initGa4();
  } else if (provider === "plausible") {
    initPlausible();
  }

  window.cmlayerTrack = (eventName, params = {}) => {
    if (provider === "ga4" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
      return;
    }
    if (provider === "plausible" && typeof window.plausible === "function") {
      window.plausible(eventName, { props: params });
    }
  };
})();
