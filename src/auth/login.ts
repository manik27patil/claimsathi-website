import { signInWithGoogle, initAuth, subscribeAuth } from "../auth";
import { showError, hideError, setLoading } from "./ui";

initAuth();

subscribeAuth((state) => {
  if (state.user && !state.loading) {
    window.location.href = "/auth/dashboard.html";
  }
});

document.getElementById("google-login-btn")?.addEventListener("click", async () => {
  hideError("login-error");
  setLoading("google-login-btn", true, "Redirecting to Google...");

  const { error } = await signInWithGoogle();

  if (error) {
    setLoading("google-login-btn", false);
    showError("login-error", error);
  }
});

document.getElementById("register-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/register.html";
});

document.getElementById("back-home")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});
