import { resolveRoute, routes } from "./router";

const contentFrame = document.getElementById("content-frame") as HTMLIFrameElement;
const pageLabel = document.getElementById("page-label") as HTMLElement;
const pageDescription = document.getElementById("page-description") as HTMLElement;
const desktopBtn = document.getElementById("view-desktop") as HTMLButtonElement;
const mobileBtn = document.getElementById("view-mobile") as HTMLButtonElement;
const pageNav = document.getElementById("page-nav") as HTMLElement;
const mobileFrameToggle = document.getElementById("mobile-frame-toggle") as HTMLButtonElement;

let currentPath = "home";
let currentMode: "desktop" | "mobile" = "desktop";

const desktopPages: { path: string; label: string }[] = [
  { path: "home", label: "Home" },
  { path: "how-we-work", label: "How We Work" },
  { path: "fees", label: "Transparent Fees" },
  { path: "contact", label: "Contact" },
  { path: "login", label: "Login" },
  { path: "register-a-claim", label: "Register a Claim" },
  { path: "registration-confirmation", label: "Confirmation" },
  { path: "dashboard", label: "Dashboard" },
  { path: "my-claims", label: "My Claims" },
  { path: "profile-completion", label: "Profile Completion" },
  { path: "admin-portal", label: "Admin Portal" },
  { path: "all-claims-register", label: "All Claims Register" },
  { path: "fee-reconciliation", label: "Fee Reconciliation" },
];

const mobilePages: { path: string; label: string }[] = [
  { path: "home-mobile", label: "Home" },
  { path: "how-we-work-mobile-1", label: "How We Work 1" },
  { path: "how-we-work-mobile-2", label: "How We Work 2" },
  { path: "transparent-fees-mobile", label: "Fees" },
  { path: "contact-mobile", label: "Contact" },
  { path: "login-mobile", label: "Login" },
  { path: "register-new-claim-mobile", label: "Register Claim" },
  { path: "registration-confirmation-mobile", label: "Confirmation" },
  { path: "dashboard-mobile", label: "Dashboard" },
  { path: "my-claims-mobile", label: "My Claims" },
  { path: "profile-completion-mobile", label: "Profile" },
  { path: "admin-portal-mobile", label: "Admin Portal" },
  { path: "all-claims-register-mobile", label: "All Claims" },
  { path: "fee-reconciliation-mobile", label: "Fee Reconciliation" },
];

function renderPageNav() {
  const pages = currentMode === "desktop" ? desktopPages : mobilePages;
  pageNav.innerHTML = "";
  for (const page of pages) {
    const route = routes[page.path];
    const btn = document.createElement("button");
    btn.className = "cs-nav-btn";
    btn.textContent = page.label;
    if (currentPath === page.path || resolveRoute(currentPath).file === route.file) {
      btn.classList.add("cs-nav-btn-active");
    }
    btn.addEventListener("click", () => navigateTo(page.path));
    pageNav.appendChild(btn);
  }
}

async function loadPage(path: string) {
  const route = resolveRoute(path);
  const url = `/pages/${route.file}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
    let html = await res.text();

    // Inject a script into the page HTML that intercepts data-path clicks
    // and posts them to the parent window
    const interceptorScript = `
<script>
(function() {
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
      if (el.tagName === 'A' && el.getAttribute('data-path')) {
        e.preventDefault();
        e.stopPropagation();
        var path = el.getAttribute('data-path');
        window.parent.postMessage({ type: 'cs-navigate', path: path }, '*');
        return;
      }
      el = el.parentElement;
    }
  });
})();
</script>`;

    // Insert interceptor before </body>
    if (html.includes("</body>")) {
      html = html.replace("</body>", interceptorScript + "</body>");
    } else {
      html += interceptorScript;
    }

    // Write to iframe
    const iframeDoc = contentFrame.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
    }

    pageLabel.textContent = route.label;
    pageDescription.textContent = route.description;
  } catch (err) {
    pageLabel.textContent = "Error";
    pageDescription.textContent = "Could not load page. " + String(err);
  }
}

function navigateTo(path: string) {
  // If the path maps to a different group than current, switch mode
  const checkRoute = routes[path];
  if (checkRoute && checkRoute.group !== currentMode) {
    // Try to find equivalent page in the other mode
    const crossMap: Record<string, string> = {
      home: "home-mobile",
      "home-mobile": "home",
      "how-we-work": "how-we-work-mobile-1",
      "how-we-work-mobile-1": "how-we-work",
      "how-we-work-mobile-2": "how-we-work",
      fees: "transparent-fees-mobile",
      "transparent-fees-mobile": "fees",
      contact: "contact-mobile",
      "contact-mobile": "contact",
      login: "login-mobile",
      "login-mobile": "login",
      "register-a-claim": "register-new-claim-mobile",
      "register-new-claim-mobile": "register-a-claim",
      "registration-confirmation": "registration-confirmation-mobile",
      "registration-confirmation-mobile": "registration-confirmation",
      dashboard: "dashboard-mobile",
      "dashboard-mobile": "dashboard",
      "my-claims": "my-claims-mobile",
      "my-claims-mobile": "my-claims",
      "profile-completion": "profile-completion-mobile",
      "profile-completion-mobile": "profile-completion",
      "admin-portal": "admin-portal-mobile",
      "admin-portal-mobile": "admin-portal",
      "all-claims-register": "all-claims-register-mobile",
      "all-claims-register-mobile": "all-claims-register",
      "fee-reconciliation": "fee-reconciliation-mobile",
      "fee-reconciliation-mobile": "fee-reconciliation",
    };
    const equiv = crossMap[path];
    if (equiv) {
      path = equiv;
    }
  }

  currentPath = path;
  const route = resolveRoute(path);
  currentMode = route.group;

  updateModeButtons();
  updateFrameSize();
  loadPage(path);
  renderPageNav();
}

function updateModeButtons() {
  if (currentMode === "desktop") {
    desktopBtn.classList.add("cs-mode-btn-active");
    mobileBtn.classList.remove("cs-mode-btn-active");
  } else {
    mobileBtn.classList.add("cs-mode-btn-active");
    desktopBtn.classList.remove("cs-mode-btn-active");
  }
}

function updateFrameSize() {
  const wrapper = document.getElementById("frame-wrapper") as HTMLElement;
  if (currentMode === "mobile") {
    wrapper.classList.add("cs-frame-mobile");
    wrapper.classList.remove("cs-frame-desktop");
    mobileFrameToggle.style.display = "flex";
  } else {
    wrapper.classList.add("cs-frame-desktop");
    wrapper.classList.remove("cs-frame-mobile");
    mobileFrameToggle.style.display = "none";
  }
}

// Listen for navigation messages from iframe
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "cs-navigate" && e.data.path) {
    navigateTo(e.data.path);
  }
});

// Mode toggle buttons
desktopBtn.addEventListener("click", () => {
  if (currentMode === "mobile") {
    const crossMap: Record<string, string> = {
      "home-mobile": "home",
      "how-we-work-mobile-1": "how-we-work",
      "how-we-work-mobile-2": "how-we-work",
      "transparent-fees-mobile": "fees",
      "contact-mobile": "contact",
      "login-mobile": "login",
      "register-new-claim-mobile": "register-a-claim",
      "registration-confirmation-mobile": "registration-confirmation",
      "dashboard-mobile": "dashboard",
      "my-claims-mobile": "my-claims",
      "profile-completion-mobile": "profile-completion",
      "admin-portal-mobile": "admin-portal",
      "all-claims-register-mobile": "all-claims-register",
      "fee-reconciliation-mobile": "fee-reconciliation",
    };
    const equiv = crossMap[currentPath] || "home";
    navigateTo(equiv);
  }
});

mobileBtn.addEventListener("click", () => {
  if (currentMode === "desktop") {
    const crossMap: Record<string, string> = {
      home: "home-mobile",
      "how-we-work": "how-we-work-mobile-1",
      fees: "transparent-fees-mobile",
      contact: "contact-mobile",
      login: "login-mobile",
      "register-a-claim": "register-new-claim-mobile",
      "registration-confirmation": "registration-confirmation-mobile",
      dashboard: "dashboard-mobile",
      "my-claims": "my-claims-mobile",
      "profile-completion": "profile-completion-mobile",
      "admin-portal": "admin-portal-mobile",
      "all-claims-register": "all-claims-register-mobile",
      "fee-reconciliation": "fee-reconciliation-mobile",
    };
    const equiv = crossMap[currentPath] || "home-mobile";
    navigateTo(equiv);
  }
});

// Mobile frame toggle - expand/collapse the mobile frame
let mobileExpanded = false;
mobileFrameToggle.addEventListener("click", () => {
  mobileExpanded = !mobileExpanded;
  const wrapper = document.getElementById("frame-wrapper") as HTMLElement;
  if (mobileExpanded) {
    wrapper.classList.add("cs-frame-mobile-expanded");
    mobileFrameToggle.querySelector("span")!.textContent = "Collapse";
  } else {
    wrapper.classList.remove("cs-frame-mobile-expanded");
    mobileFrameToggle.querySelector("span")!.textContent = "Expand Width";
  }
});

// Initial load
navigateTo("home");
