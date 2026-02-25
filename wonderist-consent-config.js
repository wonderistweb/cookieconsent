// WONDERIST CONSENT CONFIG
// Loaded after silktide-consent-manager.js via jsdelivr CDN

(function () {

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

  function checkSilktide() {
    if (!window.silktideCookieBannerManager ||
        typeof window.silktideCookieBannerManager.updateCookieBannerConfig !== "function") {
      return false;
    }
    return true;
  }

  // Handle [data-stcm-open-preferences] — always register, regardless of Silktide load state
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-stcm-open-preferences]");
    if (trigger) {
      e.preventDefault();
      openSilktidePreferences();
    }
  });

  if (!checkSilktide()) return;

  // GPC active — auto-reject, hide banner, done
  if (navigator.globalPrivacyControl === true) {
    localStorage.setItem("silktideCookieChoice_necessary", "true");
    localStorage.setItem("silktideCookieChoice_analytics", "false");
    localStorage.setItem("silktideCookieChoice_advertising", "false");
    localStorage.setItem("silktideCookieBanner_InitialChoice", "1");

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_rejected_analytics" });
    window.dataLayer.push({ event: "consent_rejected_advertising" });

    window.silktideCookieBannerManager.updateCookieBannerConfig({
      showBanner: false
    });

    return;
  }

  // Normal flow — show consent banner
  window.silktideCookieBannerManager.updateCookieBannerConfig({
    background: { showBackground: true },
    cookieIcon: { colorScheme: "light" },

    cookieTypes: [
      {
        id: "necessary",
        name: "Necessary",
        description: "<p>These cookies are essential for the website to function. They cannot be switched off.</p>",
        required: true
      },
      {
        id: "analytics",
        name: "Analytics",
        description: "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>",
        defaultValue: false,
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
        defaultValue: false,
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

    text: {
      banner: {
        description: "<h3>Cookie Preferences</h3><p>This website uses cookies, pixels, and other tracking technologies to personalize content and analyze how our sites are used. We disclose data about website users to third parties so we can target our ads to you on other websites, and those third parties may use that data for their own purposes. For more information on how we collect, use, and disclose this information, please review our <a href=\"/privacy-policy\" target=\"_blank\">Privacy Policy</a>. Continued use of this site means you consent to our <a href=\"/privacy-policy#cookies\" target=\"_blank\">Cookie Policy</a>. To manage your cookie preferences, please <a href=\"#\" data-stcm-open-preferences=\"true\">click here</a>.</p>",
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

    position: { banner: "bottomLeft" },

    onBackdropOpen: function () {
      document.body.style.overflow = "hidden";
    },
    onBackdropClose: function () {
      document.body.style.overflow = "";
    }
  });

})();
