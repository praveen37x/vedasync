/**
 * Vedasync Main Application Coordinator
 * Manages UI interactions, canvas starlight background, SVGs, and state.
 */

// Application State
const state = {
  userProfile: null,
  activeTab: "tab-chat",
  chartStyle: "north", // "north" or "south"
  chartType: "lagna",  // "lagna", "chandra", or "navamsha"
  chatHistory: [],
  selectedPartnerProfile: null,
  currentUser: null // Stores { id, name, email } when logged in
};

// DOM Elements
const els = {
  starfield: document.getElementById("starfield"),
  landingPage: document.getElementById("landing-page"),
  appInterface: document.getElementById("app-interface"),
  birthForm: document.getElementById("birth-details-form"),
  skipDetailsBtn: document.getElementById("btn-skip-details"),
  editBirthBtn: document.getElementById("btn-edit-birth"),
  navBtns: document.querySelectorAll(".nav-btn"),
  tabPanels: document.querySelectorAll(".tab-panel"),
  
  // User Profile Displays
  userInitial: document.getElementById("user-initial"),
  displayUserName: document.getElementById("display-user-name"),
  displayUserBirth: document.getElementById("display-user-birth"),

  // Chat Elements
  chatMessages: document.getElementById("chat-messages"),
  chatForm: document.getElementById("chat-input-form"),
  chatInput: document.getElementById("chat-user-message"),
  chatModeLabel: document.getElementById("chat-mode-label"),
  clearChatBtn: document.getElementById("btn-clear-chat-history"),
  quickChips: document.querySelectorAll(".chip-btn"),
  btnMicInput: document.getElementById("btn-mic-input"),

  // Chart Elements
  chartStyleNorth: document.getElementById("btn-style-north"),
  chartStyleSouth: document.getElementById("btn-style-south"),
  kundliSvgContainer: document.getElementById("kundli-svg-container"),
  planetaryCoordinatesTbody: document.getElementById("planetary-coordinates-tbody"),
  natalLagnaVal: document.getElementById("natal-lagna-val"),
  natalNakshatraVal: document.getElementById("natal-nakshatra-val"),
  natalLordVal: document.getElementById("natal-lord-val"),
  natalRashiVal: document.getElementById("natal-rashi-val"),
  selectChartType: document.getElementById("select-chart-type"),
  btnPrintReport: document.getElementById("btn-print-report"),
  chartTitleHeader: document.getElementById("chart-title-header"),

  // Milan Elements
  milanForm: document.getElementById("milan-form"),
  milanP1Name: document.getElementById("milan-p1-name"),
  milanP1Details: document.getElementById("milan-p1-details"),
  milanP2Name: document.getElementById("milan-p2-name"),
  milanP2Date: document.getElementById("milan-p2-date"),
  milanP2Time: document.getElementById("milan-p2-time"),
  milanResultPanel: document.getElementById("milan-result-panel"),
  milanScoreVal: document.getElementById("milan-score-val"),
  milanVerdictTitle: document.getElementById("milan-verdict-title"),
  milanVerdictDesc: document.getElementById("milan-verdict-desc"),
  gunaTbody: document.getElementById("guna-tbody"),

  // Panchang Elements
  panTodayDate: document.getElementById("panchang-today-date"),
  panVarVal: document.getElementById("pan-var-val"),
  panTithiVal: document.getElementById("pan-tithi-val"),
  navLagnaVal: document.getElementById("natal-lagna-val"),
  panNakVal: document.getElementById("pan-nak-val"),
  panYogaVal: document.getElementById("pan-yoga-val"),
  panKaranaVal: document.getElementById("pan-karana-val"),
  panSunVal: document.getElementById("pan-sun-val"),
  panAbhijitTime: document.getElementById("pan-abhijit-time"),
  panRahuTime: document.getElementById("pan-rahu-time"),

  // Settings Modal Elements
  settingsModal: document.getElementById("settings-modal"),
  openSettingsBtn: document.getElementById("btn-open-settings"),
  closeSettingsBtn: document.getElementById("btn-close-settings"),
  saveApiKeyBtn: document.getElementById("btn-save-api-key"),
  clearApiKeyBtn: document.getElementById("btn-clear-api-key"),
  apiKeyInput: document.getElementById("gemini-api-key"),
  apiStatusDot: document.getElementById("api-status-dot"),
  apiStatusText: document.getElementById("api-status-text"),
  
  // Auth Elements
  authModal: document.getElementById("auth-modal"),
  loginPanel: document.getElementById("login-panel"),
  registerPanel: document.getElementById("register-panel"),
  loginForm: document.getElementById("login-form"),
  registerForm: document.getElementById("register-form"),
  btnHeaderAuth: document.getElementById("btn-header-auth"),
  headerUserBadge: document.getElementById("header-user-badge"),
  headerUsername: document.getElementById("header-username"),
  btnLogout: document.getElementById("btn-logout"),
  linkToRegister: document.getElementById("link-to-register"),
  linkToLogin: document.getElementById("link-to-login"),
  btnCloseAuthLogin: document.getElementById("btn-close-auth-login"),
  btnCloseAuthRegister: document.getElementById("btn-close-auth-register"),

  // Wallet Elements
  headerWalletBadge: document.getElementById("header-wallet-badge"),
  headerWalletBalance: document.getElementById("header-wallet-balance"),
  guruWalletBalance: document.getElementById("guru-wallet-balance"),
  btnRechargeWalletTrigger: document.getElementById("btn-recharge-wallet-trigger"),
  rechargeModal: document.getElementById("recharge-modal"),
  btnCloseRecharge: document.getElementById("btn-close-recharge"),
  rechargeForm: document.getElementById("recharge-form"),
  rechargeCustomAmount: document.getElementById("recharge-custom-amount"),
  packageCards: document.querySelectorAll(".package-card"),

  // Booking Elements
  bookingModal: document.getElementById("booking-modal"),
  btnCloseBooking: document.getElementById("btn-close-booking"),
  bookingForm: document.getElementById("booking-form"),
  btnBookGuruTrigger: document.getElementById("btn-book-guru-trigger"),
  astrologersList: document.getElementById("astrologers-list"),
  bookingsList: document.getElementById("bookings-list"),

  // Contact Elements
  contactUsForm: document.getElementById("contact-us-form"),

  // Horoscope Elements
  zodiacCards: document.querySelectorAll(".zodiac-card"),
  horoscopeModal: document.getElementById("horoscope-modal"),
  btnCloseHoroscope: document.getElementById("btn-close-horoscope"),
  horoscopeTitle: document.getElementById("horoscope-title"),
  horoscopeDate: document.getElementById("horoscope-date"),
  horoscopeCareer: document.getElementById("horoscope-career"),
  horoscopeLove: document.getElementById("horoscope-love"),
  horoscopeHealth: document.getElementById("horoscope-health"),

  // Simulated Consult Overlays
  simCallOverlay: document.getElementById("sim-call-overlay"),
  simCallName: document.getElementById("sim-call-name"),
  simCallStatus: document.getElementById("sim-call-status"),
  simCallTimer: document.getElementById("sim-call-timer"),
  simCallRate: document.getElementById("sim-call-rate"),
  btnEndSimCall: document.getElementById("btn-end-sim-call"),

  // Simulated Chat Overlays
  simChatOverlay: document.getElementById("sim-chat-overlay"),
  simChatName: document.getElementById("sim-chat-name"),
  simChatTimer: document.getElementById("sim-chat-timer"),
  simChatMessages: document.getElementById("sim-chat-messages"),
  simChatForm: document.getElementById("sim-chat-form"),
  simChatInput: document.getElementById("sim-chat-input"),
  btnCloseSimChat: document.getElementById("btn-close-sim-chat"),
  guruFilterBtns: document.querySelectorAll(".guru-filter-btn"),

  // Toast notifications
  toastContainer: document.getElementById("toast-container"),
  logoHomeBtn: document.getElementById("btn-home-logo"),

  // Fictional/Custom Modals
  astrologerProfileModal: document.getElementById("astrologer-profile-modal"),
  btnCloseAstrologerProfile: document.getElementById("btn-close-astrologer-profile"),
  btnProfileChatNow: document.getElementById("btn-profile-chat-now"),
  btnProfileCallNow: document.getElementById("btn-profile-call-now"),

  subscriptionCheckoutModal: document.getElementById("subscription-checkout-modal"),
  btnCloseCheckout: document.getElementById("btn-close-checkout"),
  btnCheckoutUpi: document.getElementById("btn-checkout-upi"),
  btnCheckoutCard: document.getElementById("btn-checkout-card"),
  checkoutUpiPanel: document.getElementById("checkout-upi-panel"),
  checkoutCardPanel: document.getElementById("checkout-card-panel"),
  btnSimulateUpiSuccess: document.getElementById("btn-simulate-upi-success"),
  checkoutCardForm: document.getElementById("checkout-card-form"),

  careersModal: document.getElementById("careers-modal"),
  btnCloseCareers: document.getElementById("btn-close-careers"),
  careersForm: document.getElementById("careers-form"),

  aboutModal: document.getElementById("about-modal"),
  btnCloseAbout: document.getElementById("btn-close-about"),

  // Navigation Links
  linkNavAstrologers: document.getElementById("link-nav-astrologers"),
  linkNavPricing: document.getElementById("link-nav-pricing"),
  linkNavCareers: document.getElementById("link-nav-careers"),
  linkNavAbout: document.getElementById("link-nav-about"),

  linkFootAstrologers: document.getElementById("link-foot-astrologers"),
  linkFootPricing: document.getElementById("link-foot-pricing"),
  linkFootCareers: document.getElementById("link-foot-careers"),
  linkFootAbout: document.getElementById("link-foot-about")
};

/* -------------------------------------------------------------
 * 1. STARLIGHT ANIMATION (Twinkling particles on Canvas)
 * ------------------------------------------------------------- */
function initStarfield() {
  const canvas = els.starfield;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  let shootingStars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Generate star coordinates
  const starCount = Math.min(180, Math.floor((canvas.width * canvas.height) / 8000));
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      twinkleSpeed: 0.005 + Math.random() * 0.015,
      twinkleDir: Math.random() > 0.5 ? 1 : -1
    });
  }

  // Draw loop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    stars.forEach(star => {
      // Adjust alpha for twinkling
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha >= 1) {
        star.alpha = 1;
        star.twinkleDir = -1;
      } else if (star.alpha <= 0.1) {
        star.alpha = 0.1;
        star.twinkleDir = 1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.shadowBlur = star.alpha > 0.7 ? 4 : 0;
      ctx.shadowColor = "#FFF";
      ctx.fill();
    });
    ctx.shadowBlur = 0; // reset

    // Trigger Shooting Stars occasionally
    if (Math.random() < 0.0006 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        dx: 4 + Math.random() * 6,
        dy: 2 + Math.random() * 3,
        length: 80 + Math.random() * 100,
        opacity: 1
      });
    }

    // Draw shooting stars
    shootingStars.forEach((ss, idx) => {
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.length, ss.y - ss.length * (ss.dy/ss.dx));
      gradient.addColorStop(0, `rgba(245, 158, 11, ${ss.opacity})`);
      gradient.addColorStop(0.1, `rgba(255, 255, 255, ${ss.opacity * 0.8})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.length, ss.y - ss.length * (ss.dy/ss.dx));
      ctx.stroke();

      // Update positions
      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.opacity -= 0.02;

      // Clean up dead shooting stars
      if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
        shootingStars.splice(idx, 1);
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* -------------------------------------------------------------
 * 2. APPLICATION INITIALIZATION & CORE HANDLERS
 * ------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initStarfield();
  checkApiKeyStatus();
  loadPanchangData();

  // Safe event binding helper to prevent crashes if elements are out of sync/cached
  const safeBind = (el, event, callback) => {
    if (el) el.addEventListener(event, callback);
  };

  // Check active user session on startup
  checkUserSession();

  // Settings Modal Bindings
  safeBind(els.openSettingsBtn, "click", openSettings);
  safeBind(els.closeSettingsBtn, "click", closeSettings);
  safeBind(els.saveApiKeyBtn, "click", saveApiKey);
  safeBind(els.clearApiKeyBtn, "click", clearApiKey);
  safeBind(els.settingsModal, "click", (e) => {
    if (e.target === els.settingsModal) closeSettings();
  });

  // Auth Bindings
  safeBind(els.btnHeaderAuth, "click", openAuthModal);
  safeBind(els.btnCloseAuthLogin, "click", closeAuthModal);
  safeBind(els.btnCloseAuthRegister, "click", closeAuthModal);
  safeBind(els.linkToRegister, "click", (e) => { e.preventDefault(); showRegisterPanel(); });
  safeBind(els.linkToLogin, "click", (e) => { e.preventDefault(); showLoginPanel(); });
  safeBind(els.loginForm, "submit", handleLoginSubmit);
  safeBind(els.registerForm, "submit", handleRegisterSubmit);
  safeBind(els.btnLogout, "click", handleLogout);
  safeBind(els.authModal, "click", (e) => {
    if (e.target === els.authModal) closeAuthModal();
  });

  // FAQ Accordion Listeners
  document.querySelectorAll(".accordion-header").forEach(header => {
    safeBind(header, "click", () => {
      const item = header.parentElement;
      const content = item.querySelector(".accordion-content");
      const isActive = item.classList.contains("active");
      
      // Close all items
      document.querySelectorAll(".accordion-item").forEach(accItem => {
        accItem.classList.remove("active");
        accItem.querySelector(".accordion-content").style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Plan Selection Redirects
  document.querySelectorAll(".select-free-plan-btn").forEach(btn => {
    safeBind(btn, "click", () => {
      if (els.birthForm) els.birthForm.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll(".select-premium-plan-btn").forEach(btn => {
    safeBind(btn, "click", () => {
      window.openCheckoutModal();
    });
  });

  // Web Speech API Voice mic hookup
  let recognition = null;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      if (els.btnMicInput) els.btnMicInput.classList.add("recording");
      showToast("Microphone active... Speak now.", "success");
    };
    
    recognition.onend = () => {
      if (els.btnMicInput) els.btnMicInput.classList.remove("recording");
    };
    
    recognition.onerror = (e) => {
      console.error(e);
      if (els.btnMicInput) els.btnMicInput.classList.remove("recording");
      showToast("Speech capture error. Try again.", "error");
    };
    
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (els.chatInput) els.chatInput.value = transcript;
      showToast("Voice recorded.", "success");
    };
  }

  safeBind(els.btnMicInput, "click", () => {
    if (!recognition) {
      showToast("Voice typing is not supported by your current browser. Try Chrome.", "error");
      return;
    }
    if (els.btnMicInput && els.btnMicInput.classList.contains("recording")) {
      recognition.stop();
    } else if (recognition) {
      recognition.start();
    }
  });

  // Chart Selector change listener
  safeBind(els.selectChartType, "change", (e) => {
    state.chartType = e.target.value;
    const titleMap = {
      lagna: "Lagna Kundli (D1)",
      chandra: "Chandra Kundli (Moon)",
      navamsha: "Navamsha Kundli (D9)"
    };
    if (els.chartTitleHeader) els.chartTitleHeader.textContent = titleMap[state.chartType];
    if (state.userProfile) {
      drawLagnaChart();
      renderPlanetaryTable();
    }
  });

  // PDF Report trigger
  safeBind(els.btnPrintReport, "click", () => {
    window.print();
  });

  // Home logo returns to landing or resets
  safeBind(els.logoHomeBtn, "click", () => {
    if (state.userProfile) {
      if (els.landingPage) els.landingPage.classList.remove("active");
      if (els.appInterface) els.appInterface.classList.remove("hidden");
    } else {
      if (els.appInterface) els.appInterface.classList.add("hidden");
      if (els.landingPage) els.landingPage.classList.add("active");
    }
  });

  // Edit birth details resets back to landing page
  safeBind(els.editBirthBtn, "click", () => {
    if (els.appInterface) els.appInterface.classList.add("hidden");
    if (els.landingPage) els.landingPage.classList.add("active");
    if (state.userProfile) {
      const nameInput = document.getElementById("birth-name");
      const dateInput = document.getElementById("birth-date");
      const timeInput = document.getElementById("birth-time");
      const placeInput = document.getElementById("birth-place");
      if (nameInput) nameInput.value = state.userProfile.name;
      if (dateInput) dateInput.value = state.userProfile.dob;
      if (timeInput) timeInput.value = state.userProfile.tob;
      if (placeInput) placeInput.value = state.userProfile.pob;
    }
  });

  // Form submission (Cast Natal Chart)
  safeBind(els.birthForm, "submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("birth-name");
    const dateInput = document.getElementById("birth-date");
    const timeInput = document.getElementById("birth-time");
    const placeInput = document.getElementById("birth-place");
    
    const name = nameInput ? nameInput.value : "";
    const dob = dateInput ? dateInput.value : "";
    const tob = timeInput ? timeInput.value : "";
    const pob = placeInput ? placeInput.value : "";

    initializeUserProfile(name, dob, tob, pob);
  });

  // Skip details button (use current date-time fallback)
  safeBind(els.skipDetailsBtn, "click", () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dob = `${yyyy}-${mm}-${dd}`;
    
    const hrs = String(today.getHours()).padStart(2, "0");
    const mins = String(today.getMinutes()).padStart(2, "0");
    const tob = `${hrs}:${mins}`;

    initializeUserProfile("Seeker", dob, tob, "Local Coordinates");
  });

  // Navigation panel button clicks
  els.navBtns.forEach(btn => {
    safeBind(btn, "click", () => {
      const targetTab = btn.getAttribute("data-target");
      switchTab(targetTab);
    });
  });

  // Chart Style Toggles
  safeBind(els.chartStyleNorth, "click", () => {
    if (els.chartStyleNorth) els.chartStyleNorth.classList.add("active");
    if (els.chartStyleSouth) els.chartStyleSouth.classList.remove("active");
    state.chartStyle = "north";
    if (state.userProfile) drawLagnaChart();
  });

  safeBind(els.chartStyleSouth, "click", () => {
    if (els.chartStyleSouth) els.chartStyleSouth.classList.add("active");
    if (els.chartStyleNorth) els.chartStyleNorth.classList.remove("active");
    state.chartStyle = "south";
    if (state.userProfile) drawLagnaChart();
  });

  // Chat form submit
  safeBind(els.chatForm, "submit", handleSendMessage);

  // Chat chips clicks
  els.quickChips.forEach(chip => {
    safeBind(chip, "click", () => {
      const queryText = chip.getAttribute("data-query");
      if (els.chatInput) els.chatInput.value = queryText;
      if (els.chatForm) els.chatForm.dispatchEvent(new Event("submit"));
    });
  });

  // Clear chat history
  safeBind(els.clearChatBtn, "click", () => {
    if (confirm("Are you sure you want to clear your chat history?")) {
      state.chatHistory = [];
      localStorage.removeItem(`vedasync_chat_history_${state.userProfile.dob}`);
      
      if (state.currentUser) {
        clearChatFromDatabase();
      }

      if (els.chatMessages) els.chatMessages.innerHTML = "";
      addInitialAstrologerGreeting();
      
      if (state.currentUser && state.chatHistory.length > 0) {
        saveChatMessageToDatabase("model", state.chatHistory[0].parts[0].text);
      }
      
      showToast("Chat history cleared.", "success");
    }
  });

  // Milan form submit
  safeBind(els.milanForm, "submit", handleCompatibilitySubmit);

  // Fictional / Custom Modals close bindings
  safeBind(els.btnCloseAstrologerProfile, "click", () => els.astrologerProfileModal.classList.remove("active"));
  safeBind(els.btnCloseCheckout, "click", () => els.subscriptionCheckoutModal.classList.remove("active"));
  safeBind(els.btnCloseCareers, "click", () => els.careersModal.classList.remove("active"));
  safeBind(els.btnCloseAbout, "click", () => els.aboutModal.classList.remove("active"));

  // Checkout panels toggles
  safeBind(els.btnCheckoutUpi, "click", () => showCheckoutPanel("upi"));
  safeBind(els.btnCheckoutCard, "click", () => showCheckoutPanel("card"));
  safeBind(els.btnSimulateUpiSuccess, "click", simulateSubscriptionSuccess);
  safeBind(els.checkoutCardForm, "submit", handleCardSubscriptionSubmit);

  // Careers form submit
  safeBind(els.careersForm, "submit", handleCareersSubmit);

  // Header & Footer Nav Actions
  const handleNavAstrologers = (e) => {
    e.preventDefault();
    if (state.userProfile) {
      switchTab("tab-gurus");
    } else {
      showToast("Please enter birth details first.", "success");
      els.landingPage.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavPricing = (e) => {
    e.preventDefault();
    const pricingSection = document.querySelector(".pricing-grid");
    if (pricingSection) pricingSection.scrollIntoView({ behavior: "smooth" });
  };

  safeBind(els.linkNavAstrologers, "click", handleNavAstrologers);
  safeBind(els.linkFootAstrologers, "click", handleNavAstrologers);
  safeBind(els.linkNavPricing, "click", handleNavPricing);
  safeBind(els.linkFootPricing, "click", handleNavPricing);

  safeBind(els.linkNavCareers, "click", (e) => { e.preventDefault(); openCareersModal(); });
  safeBind(els.linkFootCareers, "click", (e) => { e.preventDefault(); openCareersModal(); });
  safeBind(els.linkNavAbout, "click", (e) => { e.preventDefault(); openAboutModal(); });
  safeBind(els.linkFootAbout, "click", (e) => { e.preventDefault(); openAboutModal(); });

  // Wallet and Booking click bindings
  safeBind(els.btnRechargeWalletTrigger, "click", openRechargeModal);
  safeBind(els.btnCloseRecharge, "click", closeRechargeModal);
  safeBind(els.rechargeForm, "submit", handleRechargeSubmit);

  safeBind(els.btnBookGuruTrigger, "click", openBookingModal);
  safeBind(els.btnCloseBooking, "click", closeBookingModal);
  safeBind(els.bookingForm, "submit", handleBookingSubmit);

  // Package Cards wallet recharge selections
  els.packageCards.forEach(card => {
    safeBind(card, "click", () => {
      els.packageCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      if (els.rechargeCustomAmount) {
        els.rechargeCustomAmount.value = card.getAttribute("data-amount");
      }
    });
  });

  // Astrologer Specialty Filters
  els.guruFilterBtns.forEach(btn => {
    safeBind(btn, "click", () => {
      els.guruFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const spec = btn.getAttribute("data-specialty");
      renderAstrologers(spec);
    });
  });

  // Simulated Overlay actions
  safeBind(els.btnEndSimCall, "click", endSimulatedCall);
  safeBind(els.btnCloseSimChat, "click", endSimulatedChat);
  safeBind(els.simChatForm, "submit", handleSimChatSubmit);
});

/* -------------------------------------------------------------
 * 3. USER PROFILE STATE MANAGEMENT
 * ------------------------------------------------------------- */
function initializeUserProfile(name, dob, tob, pob) {
  try {
    const profile = window.VedasyncEngine.getBirthProfile(name, dob, tob, pob);
    state.userProfile = profile;

    // Save profile to local storage for quick reloading
    localStorage.setItem("vedasync_last_profile", JSON.stringify({ name, dob, tob, pob }));

    // Sync profile to database if user is logged in
    if (state.currentUser) {
      saveProfileToDatabase(name, dob, tob, pob);
    }

    // Update UI elements with profile details
    els.displayUserName.textContent = profile.name;
    els.userInitial.textContent = profile.name.charAt(0).toUpperCase();
    
    // Format birth details string
    const dateFormatted = new Date(profile.dob).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    els.displayUserBirth.textContent = `${dateFormatted} • ${profile.tob}`;

    // Update compatibility form (Self)
    els.milanP1Name.value = profile.name;
    els.milanP1Details.value = `${dateFormatted} (${profile.tob})`;

    // Transition panels
    els.landingPage.classList.remove("active");
    els.appInterface.classList.remove("hidden");

    // Load user dashboard modules
    loadDashboardModules();
    showToast(`Welcome ${profile.name}. Your natal coordinates have been cast.`, "success");
  } catch (err) {
    console.error(err);
    showToast("Error casting birth coordinates. Check input values.", "error");
  }
}

function loadDashboardModules() {
  // Reset chart selection to Lagna on reload
  state.chartType = "lagna";
  els.selectChartType.value = "lagna";
  els.chartTitleHeader.textContent = "Lagna Kundli (D1)";

  // 1. Initialise Chat History
  if (state.currentUser) {
    // If logged in, we let syncUserDataFromDB fetch and render the messages
    els.chatMessages.innerHTML = "";
  } else {
    const cachedHistory = localStorage.getItem(`vedasync_chat_history_${state.userProfile.dob}`);
    if (cachedHistory) {
      state.chatHistory = JSON.parse(cachedHistory);
      renderChatMessages();
    } else {
      state.chatHistory = [];
      els.chatMessages.innerHTML = "";
      addInitialAstrologerGreeting();
    }
  }

  // 2. Render Lagna chart
  drawLagnaChart();

  // 3. Render planetary table
  renderPlanetaryTable();

  // 4. Update core attributes display
  els.natalLagnaVal.textContent = state.userProfile.lagna.rashi.split(" ")[0];
  els.natalNakshatraVal.textContent = state.userProfile.nakshatra.name;
  els.natalLordVal.textContent = state.userProfile.nakshatra.lord;
  els.natalRashiVal.textContent = state.userProfile.moonSign.name.split(" ")[0];

  // 5. Reset compatibility screen results
  els.milanResultPanel.classList.add("hidden");
  els.milanP2Name.value = "";
  els.milanP2Date.value = "";
  els.milanP2Time.value = "";

  // Go to Chat view by default
  switchTab("tab-chat");
}

function switchTab(tabId) {
  els.navBtns.forEach(btn => {
    if (btn.getAttribute("data-target") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  els.tabPanels.forEach(panel => {
    if (panel.id === tabId) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });

  state.activeTab = tabId;

  // Sync wallet, astrologers directory, and bookings lists if Consult Gurus tab is loaded
  if (tabId === "tab-gurus" && state.currentUser) {
    loadWalletBalance();
    renderAstrologers("all");
    loadUserBookings();
  }
}

/* -------------------------------------------------------------
 * 4. KUNDLI CHART DRAWING MODULE (North and South SVGs)
 * ------------------------------------------------------------- */
function drawLagnaChart() {
  const container = els.kundliSvgContainer;
  container.innerHTML = ""; // Clear existing

  const p = state.userProfile;
  const size = 300;

  // Determine starting reference sign index and active houses based on chart selection
  let startSignIndex = p.lagna.rashiIndex;
  let activeHouses = p.planetHouses;

  if (state.chartType === "chandra") {
    startSignIndex = p.moonSign.rashiIndex;
    activeHouses = p.chandraHouses;
  } else if (state.chartType === "navamsha") {
    startSignIndex = p.lagna.navRashiIndex;
    activeHouses = p.navamshaHouses;
  }

  if (state.chartStyle === "north") {
    // North Indian Chart: Diamond-based structure
    // Top-middle is House 1. Counter-clockwise order.
    const houseCoords = [
      { h: 1, cx: 150, cy: 85, align: "middle" },
      { h: 2, cx: 80, cy: 50, align: "start" },
      { h: 3, cx: 50, cy: 80, align: "start" },
      { h: 4, cx: 85, cy: 150, align: "start" },
      { h: 5, cx: 50, cy: 220, align: "start" },
      { h: 6, cx: 80, cy: 250, align: "start" },
      { h: 7, cx: 150, cy: 215, align: "middle" },
      { h: 8, cx: 220, cy: 250, align: "end" },
      { h: 9, cx: 250, cy: 220, align: "end" },
      { h: 10, cx: 215, cy: 150, align: "end" },
      { h: 11, cx: 250, cy: 80, align: "end" },
      { h: 12, cx: 220, cy: 50, align: "end" }
    ];

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" class="svg-container">`;
    // Outer border
    svgHtml += `<rect x="5" y="5" width="290" height="290" class="chart-border" />`;
    // Diagonals
    svgHtml += `<line x1="5" y1="5" x2="295" y2="295" class="chart-line" />`;
    svgHtml += `<line x1="5" y1="295" x2="295" y2="5" class="chart-line" />`;
    // Inner diamond
    svgHtml += `<polygon points="150,5 295,150 150,295 5,150" fill="none" class="chart-line" />`;

    // Map planets in their houses
    const planetsInHouses = Array.from({ length: 13 }, () => []);
    
    // Position Lagna (Ascendant) in the correct house box
    let lagnaHouseNum = 1;
    if (state.chartType === "chandra") {
      // In Moon chart, Lagna moves relative to Moon sign
      lagnaHouseNum = p.lagna.rashiIndex - p.moonSign.rashiIndex + 1;
      if (lagnaHouseNum <= 0) lagnaHouseNum += 12;
    }
    planetsInHouses[lagnaHouseNum].push("Asc");

    for (const planet in activeHouses) {
      planetsInHouses[activeHouses[planet]].push(planet);
    }

    // Render numbers and planets
    houseCoords.forEach(hc => {
      // Sign number mapping
      const signNum = (startSignIndex + hc.h - 1) % 12 + 1;
      
      // Draw sign number in the corner
      let numX = hc.cx;
      let numY = hc.cy;
      if (hc.h === 1) { numY = hc.cy - 20; }
      else if (hc.h === 7) { numY = hc.cy + 25; }
      else if (hc.h === 4) { numX = hc.cx - 20; }
      else if (hc.h === 10) { numX = hc.cx + 20; }
      else if ([2, 3, 5, 6].includes(hc.h)) { numX = hc.cx - 15; numY = hc.cy - 10; }
      else if ([8, 9, 11, 12].includes(hc.h)) { numX = hc.cx + 15; numY = hc.cy - 10; }

      svgHtml += `<text x="${numX}" y="${numY}" text-anchor="middle" class="chart-text-sign">${signNum}</text>`;

      // Render planets inside house
      const planets = planetsInHouses[hc.h];
      if (planets.length > 0) {
        let textAnchor = "middle";
        if (hc.align === "start") textAnchor = "start";
        if (hc.align === "end") textAnchor = "end";

        // Stack planets vertically if multiple
        const offsetStep = 13;
        const totalHeight = (planets.length - 1) * offsetStep;
        let startY = hc.cy - totalHeight / 2 + 3;

        if (hc.h === 1) startY += 8;
        if (hc.h === 7) startY -= 8;

        planets.forEach((pl, i) => {
          const abbrev = pl === "Asc" ? "As" : pl.substring(0, 2);
          const color = pl === "Asc" ? "var(--accent-purple)" : pl === "Sun" || pl === "Moon" ? "var(--gold-light)" : "var(--text-primary)";
          const fontWeight = pl === "Asc" ? "bold" : "normal";

          svgHtml += `<text x="${hc.cx}" y="${startY + (i * offsetStep)}" text-anchor="${textAnchor}" fill="${color}" font-weight="${fontWeight}" class="chart-text-planets">${abbrev}</text>`;
        });
      }
    });

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;

  } else {
    // South Indian Chart: Fixed Box Grid (12 Outer Boxes)
    const boxCoords = [
      { r: 0, c: 1, s: 1, name: "Ar" },  // Aries
      { r: 0, c: 2, s: 2, name: "Ta" },  // Taurus
      { r: 0, c: 3, s: 3, name: "Ge" },  // Gemini
      { r: 1, c: 3, s: 4, name: "Ca" },  // Cancer
      { r: 2, c: 3, s: 5, name: "Le" },  // Leo
      { r: 3, c: 3, s: 6, name: "Vi" },  // Virgo
      { r: 3, c: 2, s: 7, name: "Li" },  // Libra
      { r: 3, c: 1, s: 8, name: "Sc" },  // Scorpio
      { r: 3, c: 0, s: 9, name: "Sa" },  // Sagittarius
      { r: 2, c: 0, s: 10, name: "Cp" }, // Capricorn
      { r: 1, c: 0, s: 11, name: "Aq" }, // Aquarius
      { r: 0, c: 0, s: 12, name: "Pi" }  // Pisces
    ];

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" class="svg-container">`;
    svgHtml += `<rect x="5" y="5" width="290" height="290" class="chart-border" />`;

    const boxW = 72.5;
    
    svgHtml += `<line x1="${boxW+5}" y1="5" x2="${boxW+5}" y2="295" class="chart-line" />`;
    svgHtml += `<line x1="${boxW*2+5}" y1="5" x2="${boxW*2+5}" y2="295" class="chart-line" />`;
    svgHtml += `<line x1="${boxW*3+5}" y1="5" x2="${boxW*3+5}" y2="295" class="chart-line" />`;

    svgHtml += `<line x1="5" y1="${boxW+5}" x2="295" y2="${boxW+5}" class="chart-line" />`;
    svgHtml += `<line x1="5" y1="${boxW*2+5}" x2="295" y2="${boxW*2+5}" class="chart-line" />`;
    svgHtml += `<line x1="5" y1="${boxW*3+5}" x2="295" y2="${boxW*3+5}" class="chart-line" />`;

    svgHtml += `<rect x="${boxW+5.5}" y="${boxW+5.5}" width="${boxW*2-1}" height="${boxW*2-1}" fill="rgba(6, 6, 12, 0.9)" />`;
    svgHtml += `<text x="150" y="145" text-anchor="middle" fill="var(--gold-light)" font-family="var(--font-display)" font-size="15px" font-weight="bold">Vedasync</text>`;
    
    const chartLabels = {
      lagna: `Lagna: ${p.lagna.rashi.split(" ")[0]}`,
      chandra: `Chandra: ${p.moonSign.name.split(" ")[0]}`,
      navamsha: `Navamsha D9 Chart`
    };
    svgHtml += `<text x="150" y="165" text-anchor="middle" fill="var(--text-dark)" font-family="var(--font-sans)" font-size="10px">${chartLabels[state.chartType]}</text>`;

    // Map planets in sign indices (0 to 11)
    const planetsInSigns = Array.from({ length: 12 }, () => []);
    
    // Set Lagna position sign number based on chart selection
    let lagnaSignIndex = p.lagna.rashiIndex;
    if (state.chartType === "navamsha") lagnaSignIndex = p.lagna.navRashiIndex;

    planetsInSigns[lagnaSignIndex].push("Asc");
    
    // Place planets in boxes depending on their coordinate signs
    for (const planet in p.planets) {
      let rashiIdx;
      if (state.chartType === "navamsha") {
        rashiIdx = p.navamshaRashiIndices[planet];
      } else {
        rashiIdx = Math.floor(p.planets[planet] / 30);
      }
      planetsInSigns[rashiIdx].push(planet);
    }

    // Render box details
    boxCoords.forEach(box => {
      const bx = box.c * boxW + 5;
      const by = box.r * boxW + 5;

      svgHtml += `<text x="${bx + 8}" y="${by + 16}" fill="var(--text-dark)" font-family="var(--font-outfit)" font-size="10px" font-weight="bold">${box.name}</text>`;

      // Draw diagonal line in the Lagna box
      if (box.s === lagnaSignIndex + 1) {
        svgHtml += `<line x1="${bx}" y1="${by}" x2="${bx + boxW}" y2="${by + boxW}" stroke="rgba(139, 92, 246, 0.3)" stroke-width="1.5" />`;
      }

      // Draw planets
      const planets = planetsInSigns[box.s - 1];
      if (planets.length > 0) {
        const cellCenter = bx + boxW / 2;
        const offsetStep = 12;
        const totalHeight = (planets.length - 1) * offsetStep;
        const startY = by + boxW / 2 - totalHeight / 2 + 5;

        planets.forEach((pl, i) => {
          const abbrev = pl === "Asc" ? "As" : pl.substring(0, 2);
          const color = pl === "Asc" ? "var(--accent-purple)" : pl === "Sun" || pl === "Moon" ? "var(--gold-light)" : "var(--text-primary)";
          const fontWeight = pl === "Asc" ? "bold" : "normal";

          svgHtml += `<text x="${cellCenter}" y="${startY + (i * offsetStep)}" text-anchor="middle" fill="${color}" font-weight="${fontWeight}" font-size="10px" font-family="var(--font-sans)">${abbrev}</text>`;
        });
      }
    });

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
  }
}

function renderPlanetaryTable() {
  const tbody = els.planetaryCoordinatesTbody;
  tbody.innerHTML = ""; // Clear existing

  const p = state.userProfile;

  // Add Lagna details
  let tr = document.createElement("tr");
  if (state.chartType === "navamsha") {
    // Show Navamsha values
    tr.innerHTML = `
      <td style="color: var(--accent-purple); font-weight: 600;">Lagna (Asc)</td>
      <td>${p.lagna.navRashiName}</td>
      <td>-</td>
      <td>1</td>
    `;
  } else {
    tr.innerHTML = `
      <td style="color: var(--accent-purple); font-weight: 600;">Lagna (Asc)</td>
      <td>${p.lagna.rashi}</td>
      <td>${Math.floor(p.lagna.degrees % 30)}° ${Math.round((p.lagna.degrees % 1) * 60)}'</td>
      <td>${state.chartType === "chandra" ? (p.lagna.rashiIndex - p.moonSign.rashiIndex + 12) % 12 + 1 : 1}</td>
    `;
  }
  tbody.appendChild(tr);

  // Add Planet details
  for (const planet in p.planets) {
    const long = p.planets[planet];
    let rashiName, house;

    if (state.chartType === "chandra") {
      rashiName = p.planetSigns[planet];
      house = p.chandraHouses[planet];
    } else if (state.chartType === "navamsha") {
      rashiName = p.planetNavSigns[planet];
      house = p.navamshaHouses[planet];
    } else {
      rashiName = p.planetSigns[planet];
      house = p.planetHouses[planet];
    }

    const degVal = Math.floor(long % 30);
    const minVal = Math.round((long % 1) * 60);

    const trPlanet = document.createElement("tr");
    trPlanet.innerHTML = `
      <td style="font-weight: 500;">${planet}</td>
      <td>${rashiName}</td>
      <td>${state.chartType === "navamsha" ? "-" : `${degVal}° ${minVal}'`}</td>
      <td>${house}</td>
    `;
    tbody.appendChild(trPlanet);
  }
}

/* -------------------------------------------------------------
 * 5. COSMIC CHAT CONTROLLER & GEMINI API CORE
 * ------------------------------------------------------------- */
function addInitialAstrologerGreeting() {
  const text = window.VedasyncAPI.getInitialGreeting(state.userProfile);
  appendMessageBubble("model", text);
  
  // Initialize chat history array
  state.chatHistory.push({
    role: "model",
    parts: [{ text: text }]
  });
}

function renderChatMessages() {
  els.chatMessages.innerHTML = "";
  state.chatHistory.forEach(msg => {
    appendMessageBubble(msg.role, msg.parts[0].text);
  });
}

function formatMarkdown(text) {
  // Simple custom formatter to render basic markdown safe HTML in chat bubbles
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold (**text** or __text__)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Headers (### Header)
  formatted = formatted.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  formatted = formatted.replace(/^#### (.*?)$/gm, "<h4>$1</h4>");
  
  // Bullet lists (• text or * text)
  formatted = formatted.replace(/^• (.*?)$/gm, "<li>$1</li>");
  formatted = formatted.replace(/^\* (.*?)$/gm, "<li>$1</li>");
  
  // Wrap lists
  formatted = formatted.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
  
  // Remove consecutive redundant tags caused by regex line matches
  formatted = formatted.replace(/<\/ul>\s*<ul>/g, "");

  // Newlines to breaks
  formatted = formatted.replace(/\n/g, "<br>");
  
  return formatted;
}

function appendMessageBubble(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${role === "model" ? "astrologer" : "user"}`;

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "msg-bubble";
  bubbleDiv.innerHTML = formatMarkdown(text);

  const timeDiv = document.createElement("div");
  timeDiv.className = "msg-time";
  timeDiv.textContent = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  msgDiv.appendChild(bubbleDiv);
  msgDiv.appendChild(timeDiv);
  els.chatMessages.appendChild(msgDiv);
  
  // Scroll to bottom
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
}

async function handleSendMessage(e) {
  e.preventDefault();
  const text = els.chatInput.value.trim();
  if (!text || !state.userProfile) return;

  // Clear input field
  els.chatInput.value = "";

  // Append user message
  appendMessageBubble("user", text);
  state.chatHistory.push({
    role: "user",
    parts: [{ text: text }]
  });

  // If user is logged in, save user message to DB
  if (state.currentUser) {
    saveChatMessageToDatabase("user", text);
  }

  // Append typing indicator bubble
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-msg astrologer typing-indicator-msg";
  typingDiv.innerHTML = `
    <div class="msg-bubble">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  els.chatMessages.appendChild(typingDiv);
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;

  // Disable text inputs temporarily
  els.chatInput.disabled = true;
  document.getElementById("btn-send-message").disabled = true;

  try {
    const aiResponse = await window.VedasyncAPI.sendMessageToGemini(state.chatHistory, state.userProfile);
    
    // Remove typing indicator
    const indicator = els.chatMessages.querySelector(".typing-indicator-msg");
    if (indicator) indicator.remove();

    // Append AI response
    appendMessageBubble("model", aiResponse);
    state.chatHistory.push({
      role: "model",
      parts: [{ text: aiResponse }]
    });

    // If user is logged in, save AI response to DB
    if (state.currentUser) {
      saveChatMessageToDatabase("model", aiResponse);
    }

    // Save to local cache
    localStorage.setItem(`vedasync_chat_history_${state.userProfile.dob}`, JSON.stringify(state.chatHistory));
  } catch (error) {
    console.error(error);
    const indicator = els.chatMessages.querySelector(".typing-indicator-msg");
    if (indicator) indicator.remove();
    showToast("Failed to fetch response.", "error");
  } finally {
    // Re-enable controls
    els.chatInput.disabled = false;
    document.getElementById("btn-send-message").disabled = false;
    els.chatInput.focus();
  }
}

/* -------------------------------------------------------------
 * 6. COMPATIBILITY MATCHING (KUNDLI MILAN)
 * ------------------------------------------------------------- */
function handleCompatibilitySubmit(e) {
  e.preventDefault();
  if (!state.userProfile) return;

  const p2Name = els.milanP2Name.value;
  const p2Date = els.milanP2Date.value;
  const p2Time = els.milanP2Time.value;

  try {
    const p2Profile = window.VedasyncEngine.getBirthProfile(p2Name, p2Date, p2Time, "Local Partner Coordinates");
    const report = window.VedasyncEngine.calculateCompatibility(state.userProfile, p2Profile);

    // Render results in UI
    els.milanScoreVal.textContent = report.totalScore;
    
    // Set score circle glow/color based on points
    const circle = document.querySelector(".score-circle");
    if (report.totalScore >= 22) {
      circle.style.borderColor = "var(--accent-green)";
      circle.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.4)";
    } else if (report.totalScore >= 18) {
      circle.style.borderColor = "var(--gold-primary)";
      circle.style.boxShadow = "0 0 20px var(--gold-glow)";
    } else {
      circle.style.borderColor = "var(--accent-red)";
      circle.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.4)";
    }

    // Set texts
    const verdict = report.summary.split(".");
    els.milanVerdictTitle.textContent = verdict[0];
    els.milanVerdictDesc.textContent = verdict[1] || "";

    // Fill table
    els.gunaTbody.innerHTML = "";
    const kootaLabels = {
      varna: { name: "Varna", sig: "Mental Alignment / Ego" },
      vashya: { name: "Vashya", sig: "Mutual Attraction / Dominance" },
      tara: { name: "Tara", sig: "Destiny / Longevity / Health" },
      yoni: { name: "Yoni", sig: "Physical Compatibility / Intimacy" },
      maitri: { name: "Maitri", sig: "Intellectual Harmony / Friendship" },
      gana: { name: "Gana", sig: "Temperament & Behaviors" },
      bhakoot: { name: "Bhakoot", sig: "Emotional / Heart Bonding" },
      nadi: { name: "Nadi", sig: "Genetics / Offspring / Health" }
    };

    for (const key in report.breakdown) {
      const details = report.breakdown[key];
      const labels = kootaLabels[key];
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="guna-name">${labels.name}</td>
        <td>${labels.sig}</td>
        <td class="guna-score">${details.max}</td>
        <td class="guna-score font-outfit" style="color: ${details.secured === 0 ? "var(--accent-red)" : details.secured === details.max ? "var(--accent-green)" : "var(--gold-light)"}">${details.secured}</td>
        <td class="guna-desc">${details.description}</td>
      `;
      els.gunaTbody.appendChild(tr);
    }

    els.milanResultPanel.classList.remove("hidden");
    showToast(`Compatibility Matching calculated: ${report.totalScore}/36 Gunas`, "success");
    
    // Smooth scroll down to result panel
    els.milanResultPanel.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error(error);
    showToast("Error computing compatibility chart.", "error");
  }
}

/* -------------------------------------------------------------
 * 7. PANCHANG DATA MODULE
 * ------------------------------------------------------------- */
function loadPanchangData() {
  const pan = window.VedasyncEngine.calculateTodayPanchang();
  
  // Format Today's Header Date
  const dateFormatted = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  els.panTodayDate.textContent = dateFormatted;

  els.panVarVal.textContent = pan.weekday;
  els.panTithiVal.textContent = pan.tithi;
  els.panNakVal.textContent = pan.nakshatra;
  els.panYogaVal.textContent = pan.yoga;
  els.panKaranaVal.textContent = pan.karana;
  els.panSunVal.textContent = pan.sunSign.split(" ")[0];
  
  els.panAbhijitTime.textContent = pan.abhijitMuhurta;
  els.panRahuTime.textContent = pan.rahuKaal;
}

/* -------------------------------------------------------------
 * 8. API SETTINGS / MODALS / TOAST NOTIFICATIONS
 * ------------------------------------------------------------- */
function openSettings() {
  const key = localStorage.getItem("vedasync_gemini_key");
  if (key) els.apiKeyInput.value = key;
  else els.apiKeyInput.value = "";

  updateSettingsModalIndicator();
  els.settingsModal.classList.add("active");
}

function closeSettings() {
  els.settingsModal.classList.remove("active");
}

function saveApiKey() {
  const key = els.apiKeyInput.value.trim();
  if (key) {
    localStorage.setItem("vedasync_gemini_key", key);
    showToast("Gemini API Key configured successfully.", "success");
  } else {
    localStorage.removeItem("vedasync_gemini_key");
    showToast("API Key cleared. Switching back to Simulated Mode.", "success");
  }

  checkApiKeyStatus();
  closeSettings();

  // If chat is open, reload the mode label
  if (state.userProfile) {
    els.chatModeLabel.textContent = key ? "Real-time Consultations (Gemini Pro)" : "Simulated Mode (Vedic Intel)";
  }
}

function clearApiKey() {
  localStorage.removeItem("vedasync_gemini_key");
  els.apiKeyInput.value = "";
  showToast("API Key removed.", "success");
  checkApiKeyStatus();
  updateSettingsModalIndicator();
  
  if (state.userProfile) {
    els.chatModeLabel.textContent = "Simulated Mode (Vedic Intel)";
  }
}

function checkApiKeyStatus() {
  const key = localStorage.getItem("vedasync_gemini_key");
  if (key) {
    els.chatModeLabel.textContent = "Real-time Consultations (Gemini Pro)";
  } else {
    els.chatModeLabel.textContent = "Simulated Mode (Vedic Intel)";
  }
}

function updateSettingsModalIndicator() {
  const key = localStorage.getItem("vedasync_gemini_key");
  if (key) {
    els.apiStatusDot.className = "indicator-dot active";
    els.apiStatusText.textContent = "API Live (Using custom Gemini integration)";
  } else {
    els.apiStatusDot.className = "indicator-dot simulated";
    els.apiStatusText.textContent = "Simulated Intelligence (API key missing)";
  }
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  // Custom Icon based on type
  let iconHtml = "";
  if (type === "success") {
    iconHtml = `<svg class="icon-small" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  } else {
    iconHtml = `<svg class="icon-small" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
  }

  toast.innerHTML = `${iconHtml}<span>${message}</span>`;
  els.toastContainer.appendChild(toast);

  // Fade out toast after 4s
  setTimeout(() => {
    toast.style.animation = "toastIn 0.3s reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* -------------------------------------------------------------
 * 9. AUTHENTICATION & DATABASE SYNCHRONIZATION
 * ------------------------------------------------------------- */
function openAuthModal() {
  showLoginPanel();
  els.authModal.classList.add("active");
}

function closeAuthModal() {
  els.authModal.classList.remove("active");
}

function showLoginPanel() {
  els.loginPanel.classList.remove("hidden");
  els.registerPanel.classList.add("hidden");
}

function showRegisterPanel() {
  els.loginPanel.classList.add("hidden");
  els.registerPanel.classList.remove("hidden");
}

function checkUserSession() {
  const cachedUser = localStorage.getItem("vedasync_user");
  if (cachedUser) {
    try {
      state.currentUser = JSON.parse(cachedUser);
      updateAuthUI();
      // Load user profile and chat history from DB
      syncUserDataFromDB();
    } catch (e) {
      console.error("Error reading user session", e);
      localStorage.removeItem("vedasync_user");
    }
  }
}

function updateAuthUI() {
  if (state.currentUser) {
    els.btnHeaderAuth.classList.add("hidden");
    els.headerUserBadge.classList.remove("hidden");
    els.headerUsername.innerHTML = state.currentUser.name + (state.currentUser.premium ? ' <span class="premium-badge">PRO</span>' : '');
    els.headerWalletBadge.classList.remove("hidden");
    loadWalletBalance();
  } else {
    els.btnHeaderAuth.classList.remove("hidden");
    els.headerUserBadge.classList.add("hidden");
    els.headerWalletBadge.classList.add("hidden");
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      state.currentUser = data.user;
      localStorage.setItem("vedasync_user", JSON.stringify(data.user));
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome back, ${data.user.name}!`, "success");
      
      // Clean forms
      els.loginForm.reset();
      
      // Fetch profile and chat history
      await syncUserDataFromDB();
    } else {
      showToast(data.error || "Login failed", "error");
    }
  } catch (err) {
    console.error("Login fetch error:", err);
    // Offline / Cold-start fallback
    const localUsers = JSON.parse(localStorage.getItem("vedasync_local_users") || "[]");
    const localMatched = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (localMatched) {
      state.currentUser = localMatched;
      localStorage.setItem("vedasync_user", JSON.stringify(localMatched));
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome back, ${localMatched.name}! (Offline Mode)`, "success");
      els.loginForm.reset();
      await syncUserDataFromDB();
    } else {
      showToast("Server connection error during login.", "error");
    }
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      showToast("Registration successful! Please sign in.", "success");
      els.registerForm.reset();
      showLoginPanel();
    } else {
      showToast(data.error || "Registration failed", "error");
    }
  } catch (err) {
    console.error("Registration fetch error:", err);
    // Offline / Cold-start fallback registration
    try {
      const localUsers = JSON.parse(localStorage.getItem("vedasync_local_users") || "[]");
      const existing = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        showToast("Email already registered locally. Please sign in.", "error");
      } else {
        const newUser = { id: Date.now(), name, email, premium: 0 };
        localUsers.push(newUser);
        localStorage.setItem("vedasync_local_users", JSON.stringify(localUsers));
        showToast("Registration successful (Local Mode)! Please sign in.", "success");
        els.registerForm.reset();
        showLoginPanel();
      }
    } catch(e) {
      showToast("Server connection error during registration.", "error");
    }
  }
}

function handleLogout() {
  state.currentUser = null;
  state.userProfile = null;
  state.chatHistory = [];
  localStorage.removeItem("vedasync_user");
  localStorage.removeItem("vedasync_last_profile");
  
  updateAuthUI();
  
  // Reset interface
  els.appInterface.classList.add("hidden");
  els.landingPage.classList.add("active");
  
  // Clear forms
  if (els.birthForm) els.birthForm.reset();
  if (els.milanForm) els.milanForm.reset();
  els.chatMessages.innerHTML = "";
  
  showToast("Logged out successfully.", "success");
}

async function saveProfileToDatabase(name, dob, tob, pob) {
  try {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.currentUser.id,
        name,
        dob,
        tob,
        pob
      })
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Database profile sync error:", result.error);
    }
  } catch (err) {
    console.error("Database connection error while saving profile:", err);
  }
}

async function saveChatMessageToDatabase(role, message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.currentUser.id,
        role,
        message
      })
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Database chat sync error:", result.error);
    }
  } catch (err) {
    console.error("Database connection error while saving chat message:", err);
  }
}

async function clearChatFromDatabase() {
  try {
    const response = await fetch(`/api/chat?user_id=${state.currentUser.id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Database clear chat error:", result.error);
    }
  } catch (err) {
    console.error("Database connection error while clearing chat:", err);
  }
}

async function syncUserDataFromDB() {
  if (!state.currentUser) return;
  
  try {
    // 1. Fetch birth profile
    const profileRes = await fetch(`/api/profile?user_id=${state.currentUser.id}`);
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      const p = profileData.profile;
      // Initialize profile locally (casts charts and loads dashboard)
      initializeUserProfile(p.name, p.dob, p.tob, p.pob);
    } else {
      // Profile not found in database, check if there's a cached one locally as fallback
      const localProfile = localStorage.getItem("vedasync_last_profile");
      if (localProfile) {
        const p = JSON.parse(localProfile);
        initializeUserProfile(p.name, p.dob, p.tob, p.pob);
      }
    }
    
    // 2. Fetch chat history
    if (state.userProfile) {
      const chatRes = await fetch(`/api/chat?user_id=${state.currentUser.id}`);
      if (chatRes.ok) {
        const chatData = await chatRes.json();
        if (chatData.history && chatData.history.length > 0) {
          state.chatHistory = chatData.history;
          renderChatMessages();
        } else {
          // Empty chat history in DB, initialize with greeting
          state.chatHistory = [];
          els.chatMessages.innerHTML = "";
          addInitialAstrologerGreeting();
          // Save greeting to DB
          saveChatMessageToDatabase("model", state.chatHistory[0].parts[0].text);
        }
      }
    }
  } catch (err) {
    console.error("Error syncing user data from database:", err);
    showToast("Offline mode: using local cache.", "error");
  }
}

/* -------------------------------------------------------------
 * 10. DAILY HOROSCOPES MODULE
 * ------------------------------------------------------------- */
const horoscopeData = {
  Aries: {
    name: "Mesha (Aries)",
    symbol: "♈",
    career: "A sudden alignment of Jupiter indicates high professional progress. You may get recognized by seniors. Avoid hasty financial decisions.",
    love: "Venus brings warmth. Today is ideal to clear up past misunderstandings with your partner. Single Aries may find a new spark.",
    health: "High energy levels are indicated, but watch out for minor headaches. Balance your workload with visual relaxation."
  },
  Taurus: {
    name: "Vrishabha (Taurus)",
    symbol: "♉",
    career: "Patience pays off. A slow start to the day will resolve into a major achievement by afternoon. Good day for investments.",
    love: "Communication is key. Talk about your future plans openly. An unexpected gesture from your lover will make you smile.",
    health: "Pay attention to your diet. Avoid cold drinks or spicy food as throat issues or minor acidity might crop up."
  },
  Gemini: {
    name: "Mithuna (Gemini)",
    symbol: "♊",
    career: "Mercury brings creative intelligence. You will solve a complex task with ease. Collaborative work holds extra success today.",
    love: "An exciting phase. Mutual trust will increase. A short trip or dinner date will strengthen your emotional bond.",
    health: "Mental stress might feel slightly elevated. Take breaks and practice breathing exercises to stay grounded."
  },
  Cancer: {
    name: "Karka (Cancer)",
    symbol: "♋",
    career: "Focus on organizing your tasks. Avoid office politics. Financially, it is a stable day; long-term planning is favored.",
    love: "Emotional security is highlighted. Your family and partner will stand by you. Express your feelings without hesitation.",
    health: "You feel physically fit. However, make sure you maintain a consistent sleep cycle to keep your immunity high."
  },
  Leo: {
    name: "Simha (Leo)",
    symbol: "♌",
    career: "The Sun boosts your authority. You will lead discussions successfully. A new opportunity might request your attention.",
    love: "Passionate exchanges are on the horizon. Be expressive, but remember to listen to your partner's opinions too.",
    health: "Stamina is excellent. It is a good day to resume physical exercise or outdoor activities to burn off excess energy."
  },
  Virgo: {
    name: "Kanya (Virgo)",
    symbol: "♍",
    career: "Attention to detail will save the day. Re-check your reports. A colleague will seek your expert guidance.",
    love: "A calm day. You will enjoy peaceful moments with your partner. Deep conversations will enhance your intellectual sync.",
    health: "Watch out for digestive sensitivity. Drink plenty of water and prefer light home-cooked meals today."
  },
  Libra: {
    name: "Tula (Libra)",
    symbol: "♎",
    career: "Balance is your superpower. You will resolve a conflict in your team. Financial gains from past investments are likely.",
    love: "Harmony prevails. A wonderful day to plan a surprise. Single Librans will experience a meaningful conversation.",
    health: "You feel light and active. Gentle yoga or stretching exercises will help you maintain flexibility."
  },
  Scorpio: {
    name: "Vrishchika (Scorpio)",
    symbol: "♏",
    career: "Intense focus will lead to breakthrough ideas. Trust your intuition. A long-pending project will gain momentum.",
    love: "Deep emotional connections are highlighted. You and your partner will share intense, romantic feelings today.",
    health: "Physical vitality is good, but make sure to rest your eyes. Avoid screen usage late into the night."
  },
  Sagittarius: {
    name: "Dhanu (Sagittarius)",
    symbol: "♐",
    career: "Jupiter favors expansion. A great day to sign new agreements or expand your business vision. Good fortunes are ahead.",
    love: "Optimism and joy. Your partner will appreciate your sense of humor and enthusiasm. An open, honest talk is favored.",
    health: "Watch out for muscular stiffness. Make sure to stay active and do basic warm-ups before physical tasks."
  },
  Capricorn: {
    name: "Makara (Capricorn)",
    symbol: "♑",
    career: "Saturn demands hard work, but ensures steady progress. Focus on foundational tasks. Budget planning goes smoothly.",
    love: "Commitment and stability. You will take key life decisions with your partner. Trust is at an all-time high.",
    health: "Prioritize bone health. Ensure proper calcium intake and maintain good posture during long working hours."
  },
  Aquarius: {
    name: "Kumbha (Aquarius)",
    symbol: "♒",
    career: "An innovative day. Your unique ideas will capture attention. A financial reward or token of appreciation is indicated.",
    love: "Freedom and trust. Giving space to your partner will make the bond stronger. A friend might introduce someone interesting.",
    health: "Energy levels fluctuate. Don't push yourself too hard. Get adequate rest to stay mentally alert."
  },
  Pisces: {
    name: "Meena (Pisces)",
    symbol: "♓",
    career: "Trust your creative instincts. A spiritual approach to a problem will yield practical solutions. Expenses require tracking.",
    love: "Romantic daydreams. You will feel highly connected to your partner. Sharing dreams will deepen your emotional roots.",
    health: "You may feel slightly lethargic. Practicing meditation or walking in nature will recharge your spiritual batteries."
  }
};

function openHoroscopeModal(sign) {
  const data = horoscopeData[sign];
  if (!data) return;

  els.horoscopeTitle.textContent = `${data.symbol} ${data.name} Horoscope`;
  
  const today = new Date();
  els.horoscopeDate.textContent = today.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  els.horoscopeCareer.textContent = data.career;
  els.horoscopeLove.textContent = data.love;
  els.horoscopeHealth.textContent = data.health;

  els.horoscopeModal.classList.add("active");
}

function closeHoroscopeModal() {
  els.horoscopeModal.classList.remove("active");
}

/* -------------------------------------------------------------
 * 11. CONTACT US FORM SUBMISSION
 * ------------------------------------------------------------- */
async function handleContactUsSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const subject = document.getElementById("contact-subject").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message })
    });

    const result = await response.json();
    if (response.ok) {
      showToast("Thank you! Your message has been sent to Guruji.", "success");
      els.contactUsForm.reset();
    } else {
      showToast(result.error || "Failed to send message.", "error");
    }
  } catch (err) {
    console.error("Contact us form error:", err);
    showToast("Server connection error. Try again later.", "error");
  }
}

/* -------------------------------------------------------------
 * 12. VIRTUAL WALLET SYSTEM
 * ------------------------------------------------------------- */
async function loadWalletBalance() {
  if (!state.currentUser) return;
  
  try {
    const response = await fetch(`/api/wallet?user_id=${state.currentUser.id}`);
    if (response.ok) {
      const data = await response.json();
      const bal = parseFloat(data.balance).toFixed(2);
      els.headerWalletBalance.textContent = bal;
      els.guruWalletBalance.textContent = bal;
      localStorage.setItem(`vedasync_wallet_${state.currentUser.id}`, bal);
    }
  } catch (err) {
    console.error("Wallet loading error:", err);
    const cachedBal = localStorage.getItem(`vedasync_wallet_${state.currentUser.id}`) || "100.00";
    els.headerWalletBalance.textContent = parseFloat(cachedBal).toFixed(2);
    els.guruWalletBalance.textContent = parseFloat(cachedBal).toFixed(2);
  }
}

function openRechargeModal() {
  if (!state.currentUser) {
    showToast("Please Sign In first to recharge your wallet.", "error");
    openAuthModal();
    return;
  }
  els.rechargeCustomAmount.value = "";
  els.packageCards.forEach(c => c.classList.remove("selected"));
  els.rechargeModal.classList.add("active");
}

function closeRechargeModal() {
  els.rechargeModal.classList.remove("active");
}

async function handleRechargeSubmit(e) {
  e.preventDefault();
  if (!state.currentUser) return;

  const amount = parseFloat(els.rechargeCustomAmount.value);
  if (isNaN(amount) || amount <= 0) {
    showToast("Please enter a valid amount.", "error");
    return;
  }

  try {
    const response = await fetch("/api/wallet/recharge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.currentUser.id,
        amount: amount
      })
    });

    const result = await response.json();
    if (response.ok) {
      showToast(`Success! Charged ₹${amount.toFixed(2)} to your wallet.`, "success");
      closeRechargeModal();
      
      const newBal = parseFloat(result.balance).toFixed(2);
      els.headerWalletBalance.textContent = newBal;
      els.guruWalletBalance.textContent = newBal;
      localStorage.setItem(`vedasync_wallet_${state.currentUser.id}`, newBal);
      
      if (state.activeTab === "tab-gurus") {
        loadUserBookings();
      }
    } else {
      showToast(result.error || "Recharge failed.", "error");
    }
  } catch (err) {
    console.error("Recharge fetch error:", err);
    // Offline / Cold-start fallback
    const currentBal = parseFloat(els.headerWalletBalance.textContent) || 100.0;
    const newBal = (currentBal + amount).toFixed(2);
    els.headerWalletBalance.textContent = newBal;
    els.guruWalletBalance.textContent = newBal;
    localStorage.setItem(`vedasync_wallet_${state.currentUser.id}`, newBal);
    closeRechargeModal();
    showToast(`Charged ₹${amount.toFixed(2)} to your wallet (Local Mode).`, "success");
  }
}

/* -------------------------------------------------------------
 * 13. DIRECT APPOINTMENTS / GURUJI BOOKINGS
 * ------------------------------------------------------------- */
function openBookingModal() {
  if (!state.currentUser) {
    showToast("Please Sign In first to schedule consultations.", "error");
    openAuthModal();
    return;
  }
  els.bookingForm.reset();
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  document.getElementById("booking-date").value = `${yyyy}-${mm}-${dd}`;

  els.bookingModal.classList.add("active");
}

function closeBookingModal() {
  els.bookingModal.classList.remove("active");
}

async function handleBookingSubmit(e) {
  e.preventDefault();
  if (!state.currentUser) return;

  const astrologer = document.getElementById("booking-guru-name").value;
  const date = document.getElementById("booking-date").value;
  const time = document.getElementById("booking-time").value;
  const mode = document.getElementById("booking-mode").value;
  const query = document.getElementById("booking-query").value.trim();

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.currentUser.id,
        astrologer_name: astrologer,
        date,
        time,
        mode,
        query
      })
    });

    const result = await response.json();
    if (response.ok) {
      showToast("Appointment scheduled successfully!", "success");
      closeBookingModal();
      loadUserBookings();
    } else {
      showToast(result.error || "Failed to schedule.", "error");
    }
  } catch (err) {
    console.error("Booking error:", err);
    // Offline / Cold-start fallback
    const localBookings = JSON.parse(localStorage.getItem(`vedasync_bookings_${state.currentUser.id}`) || "[]");
    localBookings.unshift({
      astrologer_name: astrologer,
      date,
      time,
      mode,
      query,
      status: "Scheduled",
      created_at: new Date().toISOString()
    });
    localStorage.setItem(`vedasync_bookings_${state.currentUser.id}`, JSON.stringify(localBookings));
    showToast("Appointment scheduled successfully (Local Mode)!", "success");
    closeBookingModal();
    renderBookings(localBookings);
  }
}

async function loadUserBookings() {
  if (!state.currentUser) return;

  try {
    const response = await fetch(`/api/bookings?user_id=${state.currentUser.id}`);
    if (response.ok) {
      const data = await response.json();
      renderBookings(data.bookings);
      localStorage.setItem(`vedasync_bookings_${state.currentUser.id}`, JSON.stringify(data.bookings));
    }
  } catch (err) {
    console.error("Load bookings error:", err);
    const localBookings = JSON.parse(localStorage.getItem(`vedasync_bookings_${state.currentUser.id}`) || "[]");
    renderBookings(localBookings);
  }
}

function renderBookings(bookings) {
  els.bookingsList.innerHTML = "";
  if (!bookings || bookings.length === 0) {
    els.bookingsList.innerHTML = `
      <div style="text-align: center; color: var(--text-dark); padding: 30px 10px; font-size: 0.9rem;">
        No scheduled sessions found.
      </div>
    `;
    return;
  }

  bookings.forEach(b => {
    const dateFormatted = new Date(b.date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    
    const div = document.createElement("div");
    div.className = "booking-item glass-card";
    div.innerHTML = `
      <div class="booking-item-header">
        <h4>${b.astrologer_name}</h4>
        <span class="booking-status-badge ${b.status.toLowerCase()}">${b.status}</span>
      </div>
      <div class="booking-item-body">
        <strong>Mode:</strong> ${b.mode}<br>
        <strong>Query:</strong> "${b.query}"
      </div>
      <div class="booking-meta-line font-outfit">
        📅 ${dateFormatted} • 🕒 ${b.time}
      </div>
    `;
    els.bookingsList.appendChild(div);
  });
}

/* -------------------------------------------------------------
 * 14. ASTROLOGERS DIRECTORY (ASTROTALK STYLE)
 * ------------------------------------------------------------- */
const astrologersData = [
  {
    name: "Acharya Vashishta",
    specialty: "Vedic",
    rating: "4.9",
    reviews: "1,240",
    price: 15,
    languages: "English, Hindi, Sanskrit",
    experience: "18 yrs",
    status: "online",
    readings: "12,400+",
    response: "12s",
    repeat: "42%",
    bio: "Acharya Vashishta is a highly respected authority on traditional Vedic Jyotish, Lagna Kundli calculations, and Nakshatra readings. An alumnus of BHU, Varanasi, he brings 18+ years of experience offering practical remedial solutions and career alignment analysis.",
    review: "Pandit ji's career predictions were incredibly accurate. His recommended remedies for Saturn Dasha brought tremendous peace and clarity."
  },
  {
    name: "Yogini Maitreyi",
    specialty: "Tarot",
    rating: "4.9",
    reviews: "820",
    price: 15,
    languages: "English, Hindi, Bengali",
    experience: "10 yrs",
    status: "online",
    readings: "7,800+",
    response: "15s",
    repeat: "38%",
    bio: "Yogini Maitreyi integrates the mathematical houses of the Vedic chart with the intuitive guidance of Tarot cards and Energy Chakras. She specializes in relationship compatibility, emotional wellness, and life path transitions.",
    review: "Maitreyi has a very calming presence. Her combined Tarot-astrology reading about my relationship dynamics was spot on!"
  },
  {
    name: "Dr. Radhakrishnan",
    specialty: "Numerology",
    rating: "4.8",
    reviews: "956",
    price: 12,
    languages: "English, Tamil",
    experience: "15 yrs",
    status: "online",
    readings: "9,600+",
    response: "18s",
    repeat: "35%",
    bio: "Dr. Radhakrishnan is a seasoned Numerologist and Lal Kitab specialist. He holds a PhD in Astro-Sciences and specializes in financial prospects, name corrections, and simple, low-cost domestic remedies.",
    review: "Dr. Radhakrishnan's name-spelling correction guidance worked wonders for my business venture. He's very analytical."
  },
  {
    name: "Guru Kripacharya",
    specialty: "Vastu",
    rating: "4.8",
    reviews: "612",
    price: 20,
    languages: "Hindi, Marathi",
    experience: "20 yrs",
    status: "busy",
    readings: "11,200+",
    response: "25s",
    repeat: "46%",
    bio: "Guru Kripacharya is an expert Vastu Shastra consultant and Krishnamurti Paddhati (KP System) astrologer. He uses precise planetary sub-lords to predict event timing and helps optimize residential and office energy flows.",
    review: "His Vastu advice for my new apartment immediately changed the energy of our home. He is extremely precise with timing."
  },
  {
    name: "Aura Shruti",
    specialty: "Palmistry",
    rating: "4.7",
    reviews: "542",
    price: 15,
    languages: "English, Gujarati",
    experience: "7 yrs",
    status: "online",
    readings: "4,100+",
    response: "14s",
    repeat: "29%",
    bio: "Aura Shruti matches the planetary placements of your birth chart with palm line analysis (Hastarekha) and face reading. She is warm, friendly, and excels at discovering hidden natural talents.",
    review: "Loved the session! She is very sweet and pinpointed my passion for creative writing just by looking at my palm lines and chart."
  }
];

function renderAstrologers(filterSpecialty = "all") {
  els.astrologersList.innerHTML = "";
  
  const filtered = astrologersData.filter(ast => {
    if (filterSpecialty === "all") return true;
    return ast.specialty.toLowerCase() === filterSpecialty.toLowerCase();
  });

  filtered.forEach(ast => {
    const card = document.createElement("div");
    card.className = "astrologer-card glass-card";
    
    let statusClass = "offline";
    if (ast.status === "online") statusClass = "online";
    if (ast.status === "busy") statusClass = "busy";

    card.innerHTML = `
      <div class="astrologer-profile astrologer-profile-clickable" data-name="${ast.name}">
        <div class="astrologer-avatar-wrapper">
          <div class="user-avatar" style="width: 50px; height: 50px; background: rgba(255,255,255,0.05); font-weight: bold; color: var(--gold-light); display: flex; align-items: center; justify-content: center;">
            ${ast.name.charAt(0)}
          </div>
          <span class="status-dot ${statusClass}"></span>
        </div>
        <div class="astrologer-details">
          <h4>${ast.name}</h4>
          <div class="astrologer-specialty">${ast.specialty} • Exp: ${ast.experience}</div>
          <div class="astrologer-submeta font-outfit">
            <span class="astrologer-rating">★ ${ast.rating} (${ast.reviews})</span>
            <span class="astrologer-price">₹${ast.price}/min</span>
          </div>
        </div>
      </div>
      <div class="astrologer-actions font-outfit">
        <button class="btn-consult-action chat btn-chat-guru" data-name="${ast.name}" data-price="${ast.price}">
          <span>Chat Now</span>
        </button>
        <button class="btn-consult-action call btn-call-guru" data-name="${ast.name}" data-price="${ast.price}">
          <span>Call Now</span>
        </button>
      </div>
    `;
    els.astrologersList.appendChild(card);
  });

  // Bind clicks on profile area to open detailed modal
  document.querySelectorAll(".astrologer-profile-clickable").forEach(el => {
    el.addEventListener("click", () => {
      const name = el.getAttribute("data-name");
      openAstrologerProfileModal(name);
    });
  });

  document.querySelectorAll(".btn-chat-guru").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      startConsultation("Chat", name, price);
    });
  });

  document.querySelectorAll(".btn-call-guru").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      startConsultation("Voice Call", name, price);
    });
  });
}

/* -------------------------------------------------------------
 * 15. SIMULATED LIVE CONSULTATIONS (WALLET DETRACTION)
 * ------------------------------------------------------------- */
let activeConsultSession = null;

async function startConsultation(mode, name, rate) {
  if (!state.currentUser) {
    showToast("Please Sign In first to consult with Gurujis.", "error");
    openAuthModal();
    return;
  }

  try {
    const res = await fetch(`/api/wallet?user_id=${state.currentUser.id}`);
    if (res.ok) {
      const data = await res.json();
      const balance = parseFloat(data.balance);
      
      if (balance < rate) {
        showToast(`Insufficient balance. Minimum ₹${rate} required to connect.`, "error");
        openRechargeModal();
        return;
      }
    } else {
      showToast("Could not verify wallet balance. Try again.", "error");
      return;
    }
  } catch (err) {
    showToast("Connection error verifying wallet balance.", "error");
    return;
  }

  activeConsultSession = {
    mode,
    name,
    rate,
    secondsElapsed: 0,
    intervalId: null
  };

  showToast(`Initiating simulated ${mode} session with ${name}...`, "success");

  if (mode === "Voice Call") {
    els.simCallName.textContent = name;
    els.simCallRate.textContent = rate;
    els.simCallStatus.textContent = "Calling Guruji...";
    els.simCallTimer.textContent = "00:00";
    els.simCallOverlay.classList.add("active");
    
    setTimeout(() => {
      if (!activeConsultSession || activeConsultSession.mode !== "Voice Call") return;
      els.simCallStatus.textContent = "Live Consultation";
      startConsultationTimer(mode);
    }, 2500);

  } else {
    els.simChatName.textContent = name;
    document.getElementById("sim-chat-timer").textContent = "00:00";
    els.simChatMessages.innerHTML = "";
    els.simChatOverlay.classList.add("active");
    
    setTimeout(() => {
      if (!activeConsultSession || activeConsultSession.mode !== "Chat") return;
      appendSimChatBubble("astrologer", `Pranam. I am ${name}. How may I guide you on your destiny and life path today?`);
      startConsultationTimer(mode);
    }, 1500);
  }
}

function startConsultationTimer(mode) {
  if (!activeConsultSession) return;

  const updateDisplays = () => {
    if (!activeConsultSession) return;
    const mins = String(Math.floor(activeConsultSession.secondsElapsed / 60)).padStart(2, "0");
    const secs = String(activeConsultSession.secondsElapsed % 60).padStart(2, "0");
    const timeStr = `${mins}:${secs}`;
    
    if (mode === "Voice Call") {
      els.simCallTimer.textContent = timeStr;
    } else {
      document.getElementById("sim-chat-timer").textContent = timeStr;
    }
  };

  activeConsultSession.intervalId = setInterval(async () => {
    if (!activeConsultSession) return;

    activeConsultSession.secondsElapsed++;
    updateDisplays();

    if (activeConsultSession.secondsElapsed % 60 === 0) {
      const deductionAmount = activeConsultSession.rate;
      
      try {
        const response = await fetch("/api/wallet/deduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: state.currentUser.id,
            amount: deductionAmount
          })
        });
        
        const result = await response.json();
        if (response.ok) {
          showToast(`Wallet deducted ₹${deductionAmount} for active consult.`, "success");
          
          const newBal = parseFloat(result.balance).toFixed(2);
          els.headerWalletBalance.textContent = newBal;
          els.guruWalletBalance.textContent = newBal;

          if (parseFloat(result.balance) < activeConsultSession.rate) {
            showToast("Wallet balance low! Disconnecting session.", "error");
            if (mode === "Voice Call") endSimulatedCall();
            else endSimulatedChat();
          }
        }
      } catch (err) {
        console.error("Wallet deduction tick error:", err);
      }
    }
  }, 1000);
}

function endSimulatedCall() {
  if (activeConsultSession) {
    clearInterval(activeConsultSession.intervalId);
    
    const seconds = activeConsultSession.secondsElapsed;
    const minutesLeftover = seconds % 60;
    
    if (seconds > 0 && seconds < 60) {
      deductFinalMinuteCharge(activeConsultSession.rate);
    } else if (minutesLeftover >= 15) {
      deductFinalMinuteCharge(activeConsultSession.rate);
    }

    showToast(`Voice Consultation ended. Duration: ${Math.ceil(seconds / 60)} min(s).`, "success");
    activeConsultSession = null;
  }
  els.simCallOverlay.classList.remove("active");
}

function endSimulatedChat() {
  if (activeConsultSession) {
    clearInterval(activeConsultSession.intervalId);
    
    const seconds = activeConsultSession.secondsElapsed;
    const minutesLeftover = seconds % 60;
    
    if (seconds > 0 && seconds < 60) {
      deductFinalMinuteCharge(activeConsultSession.rate);
    } else if (minutesLeftover >= 15) {
      deductFinalMinuteCharge(activeConsultSession.rate);
    }

    showToast(`Chat Consultation ended. Duration: ${Math.ceil(seconds / 60)} min(s).`, "success");
    activeConsultSession = null;
  }
  els.simChatOverlay.classList.remove("active");
}

async function deductFinalMinuteCharge(rate) {
  if (!state.currentUser) return;
  try {
    const response = await fetch("/api/wallet/deduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.currentUser.id,
        amount: rate
      })
    });
    if (response.ok) {
      const data = await response.json();
      const newBal = parseFloat(data.balance).toFixed(2);
      els.headerWalletBalance.textContent = newBal;
      els.guruWalletBalance.textContent = newBal;
    }
  } catch (err) {
    console.error("Final deduction error:", err);
  }
}

function appendSimChatBubble(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `chat-msg ${role === "astrologer" ? "astrologer" : "user"}`;
  bubble.innerHTML = `
    <div class="msg-bubble" style="background: ${role === "astrologer" ? "rgba(139,92,246,0.06)" : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"}; border-color: ${role === "astrologer" ? "rgba(139,92,246,0.15)" : "transparent"}; color: ${role === "astrologer" ? "var(--text-primary)" : "#06060c"}; text-align: left; padding: 12px 16px; border-radius: 12px; max-width: 80%;">
      ${text}
    </div>
    <div style="font-size: 0.65rem; color: var(--text-dark); margin-top: 4px; ${role === 'user' ? 'text-align: right;' : ''}">
      ${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
    </div>
  `;
  els.simChatMessages.appendChild(bubble);
  els.simChatMessages.scrollTop = els.simChatMessages.scrollHeight;
}

const simConsultResponses = [
  "Based on your calculated Lagna, the position of Saturn in your 10th house calls for extreme discipline in your career. You will see major improvements after late 2026.",
  "Your Chandra chart indicates strong emotional sensitivity. To bring harmony, I suggest reading Shiva Chalisa or fasting on Mondays.",
  "The current transit of Rahu across your sun sign might cause temporary confusion. Meditate for 10 minutes daily and keep your intentions clear.",
  "The Ashtakoota compatibility details you submitted show high Maitri and Bhakoot agreement. This indicates strong long-term understanding and mutual trust.",
  "Your Navamsha segment highlights hidden potentials in creative writing and counseling. You should consider exploring these fields alongside your primary occupation.",
  "For Vastu balancing, ensure that the northeast direction of your workspace is kept clutter-free and has light colors like yellow or cream.",
  "Your birth chart numbers suggest that the number 7 will bring good fortune during the upcoming cycle. Key decisions should be scheduled accordingly."
];

function handleSimChatSubmit(e) {
  e.preventDefault();
  const text = els.simChatInput.value.trim();
  if (!text || !activeConsultSession) return;

  els.simChatInput.value = "";
  appendSimChatBubble("user", text);

  // Initialize chat history array for this session if it doesn't exist
  if (!activeConsultSession.chatHistory) {
    activeConsultSession.chatHistory = [
      { role: "model", parts: [{ text: `Pranam. I am ${activeConsultSession.name}. How may I guide you on your destiny and life path today?` }] }
    ];
  }
  activeConsultSession.chatHistory.push({ role: "user", parts: [{ text: text }] });

  // Show typing indicator in overlay chat
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-msg astrologer typing-indicator-msg";
  typingBubble.innerHTML = `
    <div class="msg-bubble" style="background: rgba(139,92,246,0.06); padding: 12px 16px; border-radius: 12px; max-width: 80%;">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  els.simChatMessages.appendChild(typingBubble);
  els.simChatMessages.scrollTop = els.simChatMessages.scrollHeight;

  setTimeout(async () => {
    if (!activeConsultSession) return;

    let reply = "";
    const apiKey = localStorage.getItem("vedasync_gemini_key");
    if (apiKey) {
      try {
        reply = await window.VedasyncAPI.sendMessageToGemini(activeConsultSession.chatHistory, state.userProfile, activeConsultSession.name);
      } catch (err) {
        console.error(err);
        reply = "I apologize, my connection to the cosmos was interrupted. " + simConsultResponses[Math.floor(Math.random() * simConsultResponses.length)];
      }
    } else {
      reply = simConsultResponses[Math.floor(Math.random() * simConsultResponses.length)] + `\n\n*(Note: Configure a Gemini API key in settings to enable live AI dialogues with ${activeConsultSession.name})*`;
    }

    // Remove typing indicator
    const indicator = els.simChatMessages.querySelector(".typing-indicator-msg");
    if (indicator) indicator.remove();

    appendSimChatBubble("astrologer", reply);
    if (activeConsultSession) {
      activeConsultSession.chatHistory.push({ role: "model", parts: [{ text: reply }] });
    }
  }, 1200);
}

/* -------------------------------------------------------------
 * 16. EXPERT PROFILE & CAREERS & SUBSCRIPTION CHECKOUT ACTIONS
 * ------------------------------------------------------------- */
function openAstrologerProfileModal(name) {
  const ast = astrologersData.find(a => a.name === name);
  if (!ast) return;

  const avatar = document.getElementById("astrologer-profile-avatar");
  const dName = document.getElementById("astrologer-profile-name");
  const specialty = document.getElementById("astrologer-profile-specialty");
  const readings = document.getElementById("astrologer-profile-readings");
  const responseTime = document.getElementById("astrologer-profile-response");
  const repeatRate = document.getElementById("astrologer-profile-repeat");
  const languages = document.getElementById("astrologer-profile-languages");
  const rate = document.getElementById("astrologer-profile-rate");
  const bio = document.getElementById("astrologer-profile-bio");
  const review = document.getElementById("astrologer-profile-review");
  const statusDot = document.getElementById("astrologer-profile-status-dot");
  const statusText = document.getElementById("astrologer-profile-status-text");

  avatar.textContent = ast.name.charAt(0);
  dName.textContent = ast.name;
  specialty.textContent = `${ast.specialty} Specialist • ${ast.experience} Experience`;
  readings.textContent = ast.readings;
  responseTime.textContent = ast.response;
  repeatRate.textContent = ast.repeat;
  languages.textContent = ast.languages;
  rate.textContent = `₹${ast.price}/minute`;
  bio.textContent = ast.bio;
  review.textContent = `"${ast.review}"`;

  statusDot.className = `status-dot ${ast.status}`;
  if (ast.status === "online") {
    statusText.textContent = "Online Now";
    statusText.style.color = "var(--accent-green)";
  } else if (ast.status === "busy") {
    statusText.textContent = "Busy in Session";
    statusText.style.color = "var(--gold-primary)";
  } else {
    statusText.textContent = "Offline";
    statusText.style.color = "var(--text-dark)";
  }

  // Bind actions inside modal
  els.btnProfileChatNow.onclick = () => {
    els.astrologerProfileModal.classList.remove("active");
    startConsultation("Chat", ast.name, ast.price);
  };

  els.btnProfileCallNow.onclick = () => {
    els.astrologerProfileModal.classList.remove("active");
    startConsultation("Voice Call", ast.name, ast.price);
  };

  els.astrologerProfileModal.classList.add("active");
}

function openCareersModal() {
  els.careersForm.reset();
  els.careersModal.classList.add("active");
}

async function handleCareersSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("careers-name").value.trim();
  const email = document.getElementById("careers-email").value.trim();
  const role = document.getElementById("careers-role").value;
  const experience = document.getElementById("careers-experience").value;
  const bio = document.getElementById("careers-bio").value.trim();

  try {
    const response = await fetch("/api/careers/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role, experience, bio })
    });
    const result = await response.json();
    if (response.ok) {
      showToast("Thank you! Your application has been submitted successfully.", "success");
      els.careersModal.classList.remove("active");
    } else {
      showToast(result.error || "Failed to submit application.", "error");
    }
  } catch (err) {
    console.error("Careers submission error:", err);
    showToast("Server connection error during careers application.", "error");
  }
}

function openAboutModal() {
  els.aboutModal.classList.add("active");
}

function showCheckoutPanel(panel) {
  if (panel === "upi") {
    els.btnCheckoutUpi.classList.add("active");
    els.btnCheckoutCard.classList.remove("active");
    els.checkoutUpiPanel.classList.remove("hidden");
    els.checkoutCardPanel.classList.add("hidden");
  } else {
    els.btnCheckoutUpi.classList.remove("active");
    els.btnCheckoutCard.classList.add("active");
    els.checkoutUpiPanel.classList.add("hidden");
    els.checkoutCardPanel.classList.remove("hidden");
  }
}

async function simulateSubscriptionSuccess() {
  if (!state.currentUser) {
    showToast("Please sign in first to subscribe.", "error");
    els.subscriptionCheckoutModal.classList.remove("active");
    openAuthModal();
    return;
  }

  showToast("Processing payment simulation...", "success");
  
  try {
    const response = await fetch("/api/subscription/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: state.currentUser.id, plan_name: "Jyotishi Premium" })
    });
    const result = await response.json();

    if (response.ok) {
      showToast("Payment Successful! Welcome to Jyotishi Premium.", "success");
      state.currentUser.premium = 1;
      localStorage.setItem("vedasync_user", JSON.stringify(state.currentUser));
      updateAuthUI();
      els.subscriptionCheckoutModal.classList.remove("active");
    } else {
      showToast(result.error || "Subscription upgrade failed.", "error");
    }
  } catch (err) {
    console.error("Upgrade error:", err);
    showToast("Server connection error during upgrade.", "error");
  }
}

async function handleCardSubscriptionSubmit(e) {
  e.preventDefault();
  
  const holder = document.getElementById("card-holder").value.trim();
  const number = document.getElementById("card-number").value.trim();
  const expiry = document.getElementById("card-expiry").value.trim();
  const cvv = document.getElementById("card-cvv").value.trim();

  if (!holder || !number || !expiry || !cvv) {
    showToast("Please fill all card fields.", "error");
    return;
  }

  const payBtn = els.checkoutCardForm.querySelector("button[type='submit']");
  payBtn.disabled = true;
  const originalText = payBtn.innerHTML;
  payBtn.innerHTML = "<span>Validating card...</span>";

  setTimeout(async () => {
    payBtn.disabled = false;
    payBtn.innerHTML = originalText;
    await simulateSubscriptionSuccess();
  }, 1500);
}

// Global binding for checkout modal opening
window.openCheckoutModal = function() {
  if (!state.currentUser) {
    showToast("Please sign in first to subscribe.", "error");
    openAuthModal();
    return;
  }
  showCheckoutPanel("upi");
  els.checkoutCardForm.reset();
  els.subscriptionCheckoutModal.classList.add("active");
};

