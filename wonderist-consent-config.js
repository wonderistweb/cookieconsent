// ─── PART 2: FOOTER CODE (place AFTER the GTM snippet) ──────

// Silktide CDN script should already be loaded:
// <script src="https://cdn.jsdelivr.net/gh/wonderistweb/cookieconsent@main/silktide-consent-manager.js"></script>

(function () {

  // Helper: openSilktidePreferences (unchanged)
  function openSilktidePreferences() {
    var bannerPrefsBtn = document.querySelector("#silktide-banner .preferences");
    if (bannerPrefsBtn) {
      bannerPrefsBtn.click();
      return true;
    }

    var iconBtn = document.querySelector("#silktide-cookie-icon");
    if (iconBtn) {
      iconBtn.click();
      return true;
    }

    return false;
  }

  // Helper: checkSilktide (unchanged)
  function checkSilktide() {
    if (!window.silktideCookieBannerManager ||
        typeof window.silktideCookieBannerManager.updateCookieBannerConfig !== "function") {
      return false;
    }
    return true;
  }

  if (!checkSilktide()) return;

  // If GPC is active, auto-reject and skip the banner entirely
  if (navigator.globalPrivacyControl === true) {
    // Store rejection in localStorage so Silktide knows not to show the banner
    localStorage.setItem("silktideCookieChoice_necessary", "true");
    localStorage.setItem("silktideCookieChoice_analytics", "false");
    localStorage.setItem("silktideCookieChoice_advertising", "false");
    localStorage.setItem("silktideCookieBanner_InitialChoice", "1");

    // Push rejection events to dataLayer for any GTM triggers
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_rejected_analytics" });
    window.dataLayer.push({ event: "consent_rejected_advertising" });

    // Initialize Silktide with banner hidden (it reads localStorage)
    window.silktideCookieBannerManager.updateCookieBannerConfig({
      showBanner: false
    });

    return; // Done — no banner, everything denied
  }

  // Normal flow: show the consent banner
  window.silktideCookieBannerManager.updateCookieBannerConfig({
    background: { showBackground: true },
    cookieIcon: { position: "bottom-left", colorScheme: "light" },

    cookieTypes: [
      {
        id: "necessary",
        name: "Necessary",
        description: "<p>These cookies are essential for the website to function. They cannot be switched off.</p>",
        required: true,
      },
      {
        id: "analytics",
        name: "Analytics",
        description: "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>",
        defaultValue: false, // CHANGED from true → false (deny by default)
        onAccept: function () {
          gtag("consent", "update", { analytics_storage: "granted" });
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "consent_accepted_analytics" });
        },
        onReject: function () {
          gtag("consent", "update", { analytics_storage: "denied" });
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "consent_rejected_analytics" });
        }
      },
      {
        id: "advertising",
        name: "Advertising",
        description: "<p>These cookies provide extra features and personalization to improve your experience. They may be set by us or by partners whose services we use.</p>",
        defaultValue: false, // CHANGED from true → false (deny by default)
        onAccept: function () {
          gtag("consent", "update", {
            ad_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted"
          });
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "consent_accepted_advertising" });
        },
        onReject: function () {
          gtag("consent", "update", {
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
          });
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "consent_rejected_advertising" });
        }
      }
    ],

    // ── Banner text config ──
    // (Preserve your existing text customization below)
    text: {
      banner: {
        description: "<h4>Your Privacy</h4><p>We use cookies to improve your experience, personalize content, and analyze traffic. You can manage your preferences anytime.</p>",
        acceptAllButtonText: "Accept All",
        acceptAllButtonAccessibleLabel: "Accept all cookies",
        rejectNonEssentialButtonText: "Reject Non-Essential",
        rejectNonEssentialButtonAccessibleLabel: "Reject all non-essential cookies",
        preferencesButtonText: "Preferences",
        preferencesButtonAccessibleLabel: "Manage your cookie preferences"
      },
      preferences: {
        title: "Manage Cookie Preferences",
        description: "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Disabling cookies may affect your experience on our site.</p>",
        creditLinkText: "Powered by Silktide",
        creditLinkAccessibleLabel: "Learn more about Silktide Consent Manager"
      }
    },

    position: { banner: "bottom-left" },

    // ── Callbacks ──
    onBackdropOpen: function () {
      document.body.style.overflow = "hidden";
    },
    onBackdropClose: function () {
      document.body.style.overflow = "";
    }
  });

})();

// ─── END PART 2 ─────────────────────────────────────────────