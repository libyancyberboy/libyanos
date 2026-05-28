const appShell = document.getElementById("appShell");
const bottomNav = document.getElementById("bottomNav");
const screens = document.querySelectorAll("[data-screen]");
const toast = document.getElementById("toast");
const adTrack = document.querySelector("[data-ad-track]");
const adDots = document.querySelectorAll("[data-ad-dot]");
const profileKey = "alabli.profile";
let toastTimer;
let adIndex = 0;
let scrollPauseTimer;

const defaultProfile = {
  name: "أحمد اللافي",
  phone: "0912345678",
  city: "طرابلس",
  sport: "لاعب كرة قدم",
  level: "متوسط · جناح أيمن",
  notifications: true,
  publicProfile: true,
};

function vibrate() {
  if (navigator.vibrate) navigator.vibrate(10);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function getProfile() {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(profileKey) || "{}") };
  } catch {
    return { ...defaultProfile };
  }
}

function saveProfile(profile) {
  localStorage.setItem(profileKey, JSON.stringify({ ...getProfile(), ...profile, loggedIn: true }));
}

function isLoggedIn() {
  return getProfile().loggedIn === true;
}

function firstName(name) {
  return (name || defaultProfile.name).trim().split(/\s+/)[0] || "لاعب";
}

function fillForm(form, profile) {
  if (!form) return;
  Object.entries(profile).forEach(([key, value]) => {
    const input = form.elements[key];
    if (!input) return;
    if (input.type === "checkbox") {
      input.checked = Boolean(value);
    } else {
      input.value = value || "";
    }
  });
}

function updateProfileUi() {
  const profile = getProfile();
  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = profile.name;
  });
  document.querySelectorAll("[data-profile-phone]").forEach((node) => {
    node.textContent = profile.phone;
  });
  document.querySelectorAll("[data-profile-city]").forEach((node) => {
    node.textContent = profile.city;
  });
  document.querySelectorAll("[data-profile-sport]").forEach((node) => {
    node.textContent = profile.sport;
  });
  document.querySelectorAll("[data-profile-greeting]").forEach((node) => {
    node.textContent = `مرحباً ${firstName(profile.name)}`;
  });
  fillForm(document.querySelector("[data-profile-form]"), profile);
}

function openScreen(name) {
  if (!document.querySelector(`[data-screen="${name}"]`)) return;

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  appShell.classList.toggle("route-login", name === "login");
  appShell.classList.toggle("route-details", name === "details");
  appShell.classList.toggle("route-checkout", name === "checkout");
  appShell.classList.toggle("route-edit", name === "edit-profile");

  bottomNav.querySelectorAll("[data-tab-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTarget === name);
  });

  if (window.location.hash !== `#${name}`) {
    window.history.replaceState(null, "", `#${name}`);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

function startApp() {
  updateProfileUi();
  const requested = new URLSearchParams(window.location.search).get("screen") || window.location.hash.replace("#", "");
  if (!isLoggedIn()) {
    openScreen("login");
    return;
  }
  openScreen(requested && document.querySelector(`[data-screen="${requested}"]`) ? requested : "home");
}

function setAdSlide(index) {
  if (!adTrack || !adDots.length) return;
  adIndex = (index + adDots.length) % adDots.length;
  adTrack.style.transform = `translateX(-${adIndex * 100}%)`;
  adDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === adIndex);
  });
}

function randomAdIndex() {
  if (!adDots.length) return 0;
  if (adDots.length === 1) return 0;
  let next = Math.floor(Math.random() * adDots.length);
  if (next === adIndex) next = (next + 1) % adDots.length;
  return next;
}

function shuffleAdSlides() {
  if (!adTrack) return;
  const slides = Array.from(adTrack.querySelectorAll(".ad-slide"));
  for (let i = slides.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }
  slides.forEach((slide) => adTrack.appendChild(slide));
}

if (adTrack && adDots.length) {
  shuffleAdSlides();

  adDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      vibrate();
      setAdSlide(Number(dot.dataset.adDot));
    });
  });

  setInterval(() => {
    if (!document.hidden && !document.body.classList.contains("is-scrolling")) {
      setAdSlide(randomAdIndex());
    }
  }, 3600);

  setAdSlide(Math.floor(Math.random() * adDots.length));
}

window.addEventListener("scroll", () => {
  document.body.classList.add("is-scrolling");
  clearTimeout(scrollPauseTimer);
  scrollPauseTimer = setTimeout(() => {
    document.body.classList.remove("is-scrolling");
  }, 160);
}, { passive: true });

window.addEventListener("hashchange", () => {
  const screen = window.location.hash.replace("#", "");
  if (screen) {
    if (!isLoggedIn() && screen !== "login") {
      openScreen("login");
    } else {
      openScreen(screen);
    }
  }
});

document.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const phone = form.elements.phone.value.trim();
  const name = form.elements.name.value.trim() || defaultProfile.name;
  if (phone.replace(/\D/g, "").length < 9) {
    showToast("اكتب رقم هاتف صحيح");
    return;
  }
  saveProfile({ name, phone });
  updateProfileUi();
  vibrate();
  showToast("تم تسجيل الدخول");
  openScreen("home");
});

document.querySelector("[data-demo-login]")?.addEventListener("click", () => {
  saveProfile(defaultProfile);
  updateProfileUi();
  vibrate();
  showToast("تم الدخول التجريبي");
  openScreen("home");
});

document.querySelector("[data-profile-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const profile = {
    name: form.elements.name.value.trim() || defaultProfile.name,
    phone: form.elements.phone.value.trim() || defaultProfile.phone,
    city: form.elements.city.value.trim() || defaultProfile.city,
    sport: form.elements.sport.value,
    level: form.elements.level.value.trim() || defaultProfile.level,
    notifications: form.elements.notifications.checked,
    publicProfile: form.elements.publicProfile.checked,
  };
  saveProfile(profile);
  updateProfileUi();
  vibrate();
  showToast("تم حفظ الملف الشخصي");
  openScreen("profile");
});

document.querySelectorAll("[data-logout]").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.removeItem(profileKey);
    fillForm(document.querySelector("[data-login-form]"), { phone: "", name: "" });
    vibrate();
    showToast("تم تسجيل الخروج");
    openScreen("login");
  });
});

document.querySelectorAll("[data-tab-target]").forEach((button) => {
  button.addEventListener("click", () => {
    vibrate();
    openScreen(button.dataset.tabTarget);
  });
});

document.querySelectorAll("[data-open-details]").forEach((card) => {
  card.addEventListener("click", () => {
    vibrate();
    openScreen("details");
  });
});

document.querySelectorAll(".sport-card").forEach((button) => {
  button.addEventListener("click", () => {
    vibrate();
    document.querySelectorAll(".sport-card").forEach((card) => card.classList.remove("active"));
    button.classList.add("active");
    showToast(`تم اختيار ${button.dataset.filter}`);
  });
});

document.querySelectorAll(".payment").forEach((button) => {
  button.addEventListener("click", () => {
    vibrate();
    document.querySelectorAll(".payment").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".payment > span").forEach((item) => {
      item.innerHTML = "";
    });
    const marker = button.querySelector("span");
    if (marker) marker.innerHTML = '<svg><use href="#i-check"></use></svg>';
  });
});

document.querySelectorAll("[data-confirm-booking]").forEach((button) => {
  button.addEventListener("click", () => {
    vibrate();
    const successCard = document.querySelector(".success-card");
    if (successCard) {
      successCard.classList.add("show");
      successCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    showToast("تم تأكيد الحجز بنجاح");
  });
});

document.querySelectorAll(".club-filter-row button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".club-filter-row button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll(".date-row button:not(.calendar), .time-grid button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".date-row, .time-grid");
    group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    showToast("تم اختيار الموعد");
  });
});

document.querySelectorAll(".search-box input").forEach((input) => {
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const scope = input.closest(".home-content, .clubs-content, .simple-content") || document;
    const items = scope.querySelectorAll(".venue-card, .club-item, .list-card, .match-list article, .booking-ticket");

    items.forEach((item) => {
      const matched = !query || item.textContent.toLowerCase().includes(query);
      item.style.display = matched ? "" : "none";
    });
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && input.value.trim()) {
      showToast(`بحث عن ${input.value.trim()}`);
      input.blur();
    }
  });
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => {
    vibrate();
    showToast(button.dataset.toast);
  });
});

startApp();
