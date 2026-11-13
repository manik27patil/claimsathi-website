// Shared auth UI helpers - validation, error display, loading states
// Imported by each auth page module

export function showError(elId: string, msg: string): void {
  const el = document.getElementById(elId);
  if (el) {
    el.textContent = msg;
    el.style.display = "block";
  }
}

export function hideError(elId: string): void {
  const el = document.getElementById(elId);
  if (el) {
    el.style.display = "none";
  }
}

export function setLoading(btnId: string, loading: boolean, loadingText?: string): void {
  const btn = document.getElementById(btnId) as HTMLButtonElement | null;
  if (!btn) return;
  if (loading) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add("opacity-70", "cursor-wait");
    const spinner = '<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>';
    if (loadingText) {
      btn.innerHTML = spinner + '<span>' + loadingText + '</span>';
    } else {
      btn.innerHTML = spinner;
    }
  } else {
    btn.disabled = false;
    btn.classList.remove("opacity-70", "cursor-wait");
    if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
  }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateMobile(mobile: string): boolean {
  return /^[+]?[0-9]{10,13}$/.test(mobile.replace(/[\s-]/g, ""));
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: "Password must be at least 8 characters long." };
  if (!/[A-Za-z]/.test(password)) return { valid: false, message: "Password must contain at least one letter." };
  if (!/[0-9]/.test(password)) return { valid: false, message: "Password must contain at least one number." };
  return { valid: true, message: "" };
}
