// Shared auth functions used across auth pages loaded in the iframe.
// This script is injected into each auth page's HTML before it's written to the iframe.
// It uses the parent window's supabase client via postMessage communication.

(function () {
  "use strict";

  // ---- Utility ----
  function showError(elId, msg) {
    var el = document.getElementById(elId);
    if (el) {
      el.textContent = msg;
      el.style.display = "block";
    }
  }
  function hideError(elId) {
    var el = document.getElementById(elId);
    if (el) {
      el.style.display = "none";
    }
  }
  function setLoading(btnId, loading, loadingText) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) {
      btn.dataset.originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add("opacity-70", "cursor-wait");
      btn.innerHTML =
        '<svg class="animate-spin h-5 w-5' +
        (loadingText ? " mr-2" : "") +
        '" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>' +
        (loadingText || "");
    } else {
      btn.disabled = false;
      btn.classList.remove("opacity-70", "cursor-wait");
      if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
    }
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validateMobile(mobile) {
    return /^[+]?[0-9]{10,13}$/.test(mobile.replace(/[\s-]/g, ""));
  }

  // ---- Request Supabase client from parent ----
  // The parent window sets up the supabase client and exposes it
  window.csAuth = {
    showError: showError,
    hideError: hideError,
    setLoading: setLoading,
    validateEmail: validateEmail,
    validateMobile: validateMobile,
  };

  // Signal parent that auth page is ready
  window.parent.postMessage({ type: "cs-auth-ready" }, "*");
})();
