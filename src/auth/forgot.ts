import { resetPassword } from "../auth";
import { showError, hideError, setLoading, validateEmail } from "./ui";

document.getElementById("forgot-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError("forgot-error");
  hideError("forgot-success");

  const email = (document.getElementById("email") as HTMLInputElement).value.trim();

  if (!validateEmail(email)) {
    showError("forgot-error", "Please enter a valid email address.");
    return;
  }

  setLoading("forgot-btn", true, "Sending link...");

  const { error } = await resetPassword(email);

  setLoading("forgot-btn", false);

  const successEl = document.getElementById("forgot-success");
  const successMsg = document.getElementById("forgot-success-msg");
  const errorEl = document.getElementById("forgot-error");
  const errorMsg = document.getElementById("forgot-error-msg");

  if (error) {
    if (errorMsg) errorMsg.textContent = error;
    if (errorEl) errorEl.style.display = "flex";
    return;
  }

  if (successMsg) successMsg.textContent = "Password reset link sent! Check your email inbox.";
  if (successEl) successEl.style.display = "flex";
});

document.getElementById("login-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/login.html";
});

document.getElementById("back-home")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});
