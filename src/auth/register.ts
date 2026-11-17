import { signInWithGoogle, initAuth, subscribeAuth } from "../auth";
import { showError, hideError, setLoading } from "./ui";

initAuth();

subscribeAuth((state) => {
  if (state.user && !state.loading) {
    window.location.href = "/auth/dashboard.html";
  }
});

document.getElementById("google-register-btn")?.addEventListener("click", async () => {
  hideError("register-error");

  const termsChecked = (document.getElementById("terms-check") as HTMLInputElement).checked;
  if (!termsChecked) {
    showError("register-error", "Please accept the Terms and Privacy Policy to continue.");
    return;
  }

  setLoading("google-register-btn", true, "Redirecting to Google...");

  const { error } = await signInWithGoogle();

  if (error) {
    setLoading("google-register-btn", false);
    showError("register-error", error);
  }
});

document.getElementById("login-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/login.html";
});

document.getElementById("back-home")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});
