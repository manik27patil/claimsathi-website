import { updatePassword, initAuth, subscribeAuth } from "../auth";
import { showError, hideError, setLoading, validatePassword } from "./ui";

initAuth();

subscribeAuth((state) => {
  if (state.loading) return;
  if (!state.user) {
    window.location.href = "/auth/login.html";
  }
});

document.getElementById("reset-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError("reset-error");
  hideError("reset-success");

  const password = (document.getElementById("password") as HTMLInputElement).value;
  const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;

  const pwCheck = validatePassword(password);
  if (!pwCheck.valid) {
    showError("reset-error", pwCheck.message);
    return;
  }
  if (password !== confirmPassword) {
    showError("reset-error", "Passwords do not match.");
    return;
  }

  setLoading("reset-btn", true, "Updating...");

  const { error } = await updatePassword(password);

  setLoading("reset-btn", false);

  if (error) {
    showError("reset-error", error);
    return;
  }

  const successEl = document.getElementById("reset-success");
  const successMsg = document.getElementById("reset-success-msg");
  if (successMsg) successMsg.textContent = "Password updated successfully! Redirecting to sign in...";
  if (successEl) successEl.style.display = "flex";

  setTimeout(() => {
    window.location.href = "/auth/login.html";
  }, 1500);
});

document.getElementById("login-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/login.html";
});

document.getElementById("back-home")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});
