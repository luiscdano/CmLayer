// Optional: set API base when backend is hosted on a different domain.
// Example: window.CMLAYER_API_BASE = "https://api.cmlayer.com";
window.CMLAYER_API_BASE = "";

// Analytics config. Set provider to "ga4" and add your Measurement ID to enable.
// Example: window.CMLAYER_ANALYTICS.ga4.measurementId = "G-XXXXXXXXXX";
window.CMLAYER_ANALYTICS = {
  provider: "ga4",
  ga4: {
    measurementId: "G-HV88FLMSC2"
  },
  plausible: {
    domain: "cmlayer.com",
    apiHost: ""
  }
};
