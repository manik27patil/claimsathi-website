import { updateProfile, initAuth, subscribeAuth, isProfileComplete, signOut } from "../auth";
import { showError, hideError, setLoading, validateMobile } from "./ui";

initAuth();

subscribeAuth((state) => {
  const loading = document.getElementById("loading-screen");
  const content = document.getElementById("profile-content");

  if (state.loading) return;

  if (!state.user) {
    window.location.href = "/auth/login.html";
    return;
  }

  // If profile is already complete, go to dashboard
  if (isProfileComplete(state.profile)) {
    window.location.href = "/auth/dashboard.html";
    return;
  }

  if (loading) loading.style.display = "none";
  if (content) content.classList.remove("hidden");

  const name = state.profile?.full_name || state.user.email?.split("@")[0] || "Policyholder";
  const welcomeEl = document.getElementById("welcome-name");
  if (welcomeEl) welcomeEl.textContent = name;
});

document.getElementById("profile-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError("profile-error");

  const mobile = (document.getElementById("mobile") as HTMLInputElement).value.trim();
  const country = (document.getElementById("country") as HTMLSelectElement).value;

  if (!validateMobile(mobile)) {
    showError("profile-error", "Please enter a valid mobile number (10-13 digits).");
    return;
  }
  if (!country) {
    showError("profile-error", "Please select your country.");
    return;
  }

  setLoading("profile-btn", true, "Saving...");

  const { error } = await updateProfile({ mobile_number: mobile, country });

  if (error) {
    setLoading("profile-btn", false);
    showError("profile-error", error);
    return;
  }

  window.location.href = "/auth/dashboard.html";
});
