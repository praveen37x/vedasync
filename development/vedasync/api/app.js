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
  currentUser: null, // Stores { id, name, email } when logged in

  // Advanced Astrosage-grade state:
  showConnections: true,
  exploreMode: false,
  showTransits: false,
  transitDate: null,
  activeLens: "all",
  selectedEntity: null, // { type: 'house' | 'planet', id: string, houseNum: number }
  activeConnection: null,
  activeDashaPeriod: null,
  yogaFilter: "all",
  synastryView: "side",
  computedConnections: null
};

// Global safe event binding helper to prevent crashes if elements are out of sync/cached
function safeBind(el, event, callback) {
  if (!el) return;
  if (el instanceof NodeList || Array.isArray(el)) {
    el.forEach(item => { if (item) item.addEventListener(event, callback); });
  } else {
    el.addEventListener(event, callback);
  }
}

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

  // Chart Elements & Advanced Toolbar
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

  // Advanced Visualizer Toolbar Elements
  btnExploreMode: document.getElementById("btn-explore-mode"),
  toggleConnections: document.getElementById("toggle-connections"),
  toggleTransits: document.getElementById("toggle-transits"),
  transitDateContainer: document.getElementById("transit-date-container"),
  transitDatePicker: document.getElementById("transit-date-picker"),
  btnClearHighlights: document.getElementById("btn-clear-highlights"),
  btnShareChart: document.getElementById("btn-share-chart"),
  lensPills: document.querySelectorAll(".lens-pill"),
  exploreStatusBanner: document.getElementById("explore-status-banner"),
  exploreBannerText: document.getElementById("explore-banner-text"),
  legendTransitItem: document.getElementById("legend-transit-item"),

  // Connection Floating Card
  connectionFloatingCard: document.getElementById("connection-floating-card"),
  connCardType: document.getElementById("conn-card-type"),
  connCardTitle: document.getElementById("conn-card-title"),
  connCardMeaning: document.getElementById("conn-card-meaning"),
  btnCloseConnCard: document.getElementById("btn-close-conn-card"),
  btnExplainConn: document.getElementById("btn-explain-conn"),

  // Life Area Lens Summary
  lifeAreaCard: document.getElementById("life-area-card"),
  lifeCardIcon: document.getElementById("life-card-icon"),
  lifeCardTitle: document.getElementById("life-card-title"),
  lifeCardHousesBadge: document.getElementById("life-card-houses-badge"),
  lifeCardMeaning: document.getElementById("life-card-meaning"),
  lifeCardGrid: document.getElementById("life-card-grid"),
  lifeCardYogas: document.getElementById("life-card-yogas"),

  // Unified Inspect Panel
  unifiedInspectPanel: document.getElementById("unified-inspect-panel"),
  inspectHeader: document.getElementById("inspect-header"),
  inspectBadge: document.getElementById("inspect-badge"),
  inspectTitle: document.getElementById("inspect-title"),
  btnCloseInspect: document.getElementById("btn-close-inspect"),
  inspectBody: document.getElementById("inspect-body"),
  inspectDefaultView: document.getElementById("inspect-default-view"),

  // Dasha Timeline Elements
  dashaTimelineContainer: document.getElementById("dasha-timeline-container"),
  dashaActiveBadge: document.getElementById("dasha-active-badge"),
  dashaActiveLabel: document.getElementById("dasha-active-label"),
  dashaDetailCard: document.getElementById("dasha-detail-card"),

  // Yoga Finder Elements
  yogaGrid: document.getElementById("yoga-grid"),
  yogaFilterPills: document.querySelectorAll(".yoga-filter-pills .filter-pill"),

  // Synastry Mode Elements
  synastryVisualizerPanel: document.getElementById("synastry-visualizer-panel"),
  synastryP1Title: document.getElementById("synastry-p1-title"),
  synastryP2Title: document.getElementById("synastry-p2-title"),
  btnSynastrySide: document.getElementById("btn-synastry-side"),
  btnSynastryStack: document.getElementById("btn-synastry-stack"),
  synastryChartsContainer: document.getElementById("synastry-charts-container"),
  synastrySvgChartA: document.getElementById("synastry-svg-chart-a"),
  synastrySvgChartB: document.getElementById("synastry-svg-chart-b"),
  synastryInteractionCard: document.getElementById("synastry-interaction-card"),
  synastryInteractionText: document.getElementById("synastry-interaction-text"),

  // Modals
  snapshotModal: document.getElementById("snapshot-modal"),
  btnCloseSnapshot: document.getElementById("btn-close-snapshot"),
  snapshotCanvas: document.getElementById("snapshot-canvas"),
  btnDownloadSnapshot: document.getElementById("btn-download-snapshot"),
  btnCopySnapshot: document.getElementById("btn-copy-snapshot"),

  remediesModal: document.getElementById("remedies-modal"),
  btnCloseRemedies: document.getElementById("btn-close-remedies"),
  remediesModalTitle: document.getElementById("remedies-modal-title"),
  remediesModalSubtitle: document.getElementById("remedies-modal-subtitle"),
  remediesBody: document.getElementById("remedies-body"),

  connectionExplainModal: document.getElementById("connection-explain-modal"),
  btnCloseExplain: document.getElementById("btn-close-explain"),
  explainTypeBadge: document.getElementById("explain-type-badge"),
  explainTitleText: document.getElementById("explain-title-text"),
  explainSourceMeaning: document.getElementById("explain-source-meaning"),
  explainAiText: document.getElementById("explain-ai-text"),

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
    try {
      localStorage.setItem("vedasync_last_profile", JSON.stringify({ name, dob, tob, pob }));
    } catch(e) {}

    // Sync profile to database if user is logged in
    if (state.currentUser) {
      saveProfileToDatabase(name, dob, tob, pob);
    }

    // Update UI elements with profile details safely
    if (els.displayUserName) els.displayUserName.textContent = profile.name;
    if (els.userInitial) els.userInitial.textContent = (profile.name || "A").charAt(0).toUpperCase();
    
    // Format birth details string
    const dateFormatted = new Date(profile.dob).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    if (els.displayUserBirth) els.displayUserBirth.textContent = `${dateFormatted} • ${profile.tob}`;

    // Update compatibility form (Self)
    if (els.milanP1Name) els.milanP1Name.value = profile.name;
    if (els.milanP1Details) els.milanP1Details.value = `${dateFormatted} (${profile.tob})`;

    // Transition panels: hide landing page, show app interface
    const landing = document.getElementById("landing-page");
    const app = document.getElementById("app-interface");
    if (landing) {
      landing.classList.remove("active");
      landing.style.display = "none";
    }
    if (app) {
      app.classList.remove("hidden");
      app.style.display = "flex";
    }

    // Load user dashboard modules
    loadDashboardModules();
    
    // Switch directly to Lagna Kundli view
    switchTab("tab-chart");
    
    showToast(`Welcome ${profile.name}. Your natal coordinates have been cast.`, "success");
  } catch (err) {
    console.error("Error casting birth coordinates:", err);
    showToast("Error casting birth coordinates. Check input values.", "error");
  }
}

function loadDashboardModules() {
  // Reset chart selection to Lagna on reload
  state.chartType = "lagna";
  if (els.selectChartType) els.selectChartType.value = "lagna";
  if (els.chartTitleHeader) els.chartTitleHeader.textContent = "Lagna Kundli (D1)";

  // 1. Initialise Chat History
  if (state.currentUser) {
    // If logged in, we let syncUserDataFromDB fetch and render the messages
    if (els.chatMessages) els.chatMessages.innerHTML = "";
  } else {
    const cachedHistory = localStorage.getItem(`vedasync_chat_history_${state.userProfile.dob}`);
    if (cachedHistory) {
      state.chatHistory = JSON.parse(cachedHistory);
      renderChatMessages();
    } else {
      state.chatHistory = [];
      if (els.chatMessages) els.chatMessages.innerHTML = "";
      addInitialAstrologerGreeting();
    }
  }

  // 2. Render Lagna chart with Drishti & Connections
  drawLagnaChart();

  // 3. Render planetary table
  renderPlanetaryTable();

  // 4. Update core attributes display
  if (els.natalLagnaVal) els.natalLagnaVal.textContent = state.userProfile.lagna.rashi.split(" ")[0];
  if (els.natalNakshatraVal) els.natalNakshatraVal.textContent = state.userProfile.nakshatra.name;
  if (els.natalLordVal) els.natalLordVal.textContent = state.userProfile.nakshatra.lord;
  if (els.natalRashiVal) els.natalRashiVal.textContent = state.userProfile.moonSign.name.split(" ")[0];

  // 5. Render Dasha Timeline & Yoga Finder
  renderDashaTimeline();
  renderYogaFinder("all");
  renderInspectPanel(null); // Default view

  // 6. Reset compatibility screen results
  if (els.milanResultPanel) els.milanResultPanel.classList.add("hidden");
  if (els.milanP2Name) els.milanP2Name.value = "";
  if (els.milanP2Date) els.milanP2Date.value = "";
  if (els.milanP2Time) els.milanP2Time.value = "";

  // 7. Initialize advanced feature listeners
  initAdvancedFeaturesListeners();

  // Open Lagna Kundli view by default so user immediately sees their chart
  switchTab("tab-chart");
}

let advancedListenersInitialized = false;
function initAdvancedFeaturesListeners() {
  if (advancedListenersInitialized) return;
  advancedListenersInitialized = true;

  // 1. Explore Connections button
  safeBind(els.btnExploreMode, "click", toggleExploreMode);

  // 2. Connections layer toggle switch
  safeBind(els.toggleConnections, "change", (e) => {
    toggleConnections(e.target.checked);
  });

  // 3. Gochar Transits toggle switch
  safeBind(els.toggleTransits, "change", (e) => {
    toggleTransits(e.target.checked);
  });

  // 4. Transit Date Picker
  safeBind(els.transitDatePicker, "change", (e) => {
    state.transitDate = e.target.value ? new Date(e.target.value + "T12:00:00") : new Date();
    drawLagnaChart();
  });

  // 5. Clear highlights / Reset view
  safeBind(els.btnClearHighlights, "click", clearHighlights);

  // 6. Share Snapshot
  safeBind(els.btnShareChart, "click", generateShareableSnapshot);

  // 7. Life Area Lens pills
  els.lensPills.forEach(pill => {
    safeBind(pill, "click", () => {
      const lensKey = pill.getAttribute("data-lens");
      setLifeAreaLens(lensKey);
    });
  });

  // 8. Close Connection Card
  safeBind(els.btnCloseConnCard, "click", hideConnectionCard);

  // 9. Explain Connection with AI Guru
  safeBind(els.btnExplainConn, "click", () => {
    if (state.activeConnection) {
      explainConnectionWithAI(state.activeConnection);
    }
  });

  // 10. Close Inspect Panel
  safeBind(els.btnCloseInspect, "click", closeInspectPanel);

  // 11. Yoga Filter Pills
  els.yogaFilterPills.forEach(pill => {
    safeBind(pill, "click", () => {
      els.yogaFilterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.getAttribute("data-filter");
      renderYogaFinder(filter);
    });
  });

  // 12. Synastry View Toggle (Side-by-side vs Stacked)
  safeBind(els.btnSynastrySide, "click", () => {
    if (els.btnSynastrySide) els.btnSynastrySide.classList.add("active");
    if (els.btnSynastryStack) els.btnSynastryStack.classList.remove("active");
    if (els.synastryChartsContainer) {
      els.synastryChartsContainer.classList.remove("stacked");
      els.synastryChartsContainer.classList.add("side-by-side");
    }
  });

  safeBind(els.btnSynastryStack, "click", () => {
    if (els.btnSynastryStack) els.btnSynastryStack.classList.add("active");
    if (els.btnSynastrySide) els.btnSynastrySide.classList.remove("active");
    if (els.synastryChartsContainer) {
      els.synastryChartsContainer.classList.remove("side-by-side");
      els.synastryChartsContainer.classList.add("stacked");
    }
  });

  // 13. Snapshot Modal actions
  safeBind(els.btnCloseSnapshot, "click", () => {
    if (els.snapshotModal) els.snapshotModal.classList.remove("active");
  });

  safeBind(els.btnDownloadSnapshot, "click", () => {
    const canvas = els.snapshotCanvas;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `vedasync-${state.userProfile.name.toLowerCase().replace(/\s+/g, "_")}-kundli.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    showToast("Chart Snapshot downloaded successfully!", "success");
  });

  safeBind(els.btnCopySnapshot, "click", async () => {
    const canvas = els.snapshotCanvas;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          showToast("Snapshot copied to clipboard!", "success");
        } else if (navigator.share) {
          const file = new File([blob], "vedasync-kundli.png", { type: "image/png" });
          await navigator.share({
            title: `${state.userProfile.name}'s Kundli Chart`,
            text: `Vedic Astrological Alignment from Vedasync.`,
            files: [file]
          });
        } else {
          showToast("Clipboard image copying not supported in this browser.", "error");
        }
      });
    } catch (err) {
      console.warn(err);
      showToast("Could not copy snapshot automatically.", "error");
    }
  });

  // 14. Remedies Modal Close
  safeBind(els.btnCloseRemedies, "click", () => {
    if (els.remediesModal) els.remediesModal.classList.remove("active");
  });

  // 15. Connection Explain Modal Close
  safeBind(els.btnCloseExplain, "click", () => {
    if (els.connectionExplainModal) els.connectionExplainModal.classList.remove("active");
  });
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
 * With Interactive Drishti & Connections Layer, Gochar Transits,
 * and Selection Highlight System
 * ------------------------------------------------------------- */

// North Indian House Polygons & Centroids
const NORTH_HOUSE_POLYGONS = [
  { h: 1, points: "150,5 222.5,77.5 150,150 77.5,77.5", cx: 150, cy: 77.5, name: "Tanu" },
  { h: 2, points: "5,5 150,5 77.5,77.5", cx: 77.5, cy: 30, name: "Dhana" },
  { h: 3, points: "5,5 77.5,77.5 5,150", cx: 30, cy: 77.5, name: "Sahaja" },
  { h: 4, points: "5,150 77.5,77.5 150,150 77.5,222.5", cx: 77.5, cy: 150, name: "Sukha" },
  { h: 5, points: "5,150 77.5,222.5 5,295", cx: 30, cy: 222.5, name: "Putra" },
  { h: 6, points: "5,295 77.5,222.5 150,295", cx: 77.5, cy: 270, name: "Ari" },
  { h: 7, points: "150,150 222.5,222.5 150,295 77.5,222.5", cx: 150, cy: 222.5, name: "Kalatra" },
  { h: 8, points: "150,295 222.5,222.5 295,295", cx: 222.5, cy: 270, name: "Randhra" },
  { h: 9, points: "295,150 222.5,222.5 295,295", cx: 270, cy: 222.5, name: "Bhagya" },
  { h: 10, points: "150,150 222.5,77.5 295,150 222.5,222.5", cx: 222.5, cy: 150, name: "Karma" },
  { h: 11, points: "295,5 295,150 222.5,77.5", cx: 270, cy: 77.5, name: "Labha" },
  { h: 12, points: "150,5 295,5 222.5,77.5", cx: 222.5, cy: 30, name: "Vyaya" }
];

function drawLagnaChart() {
  const container = els.kundliSvgContainer;
  if (!container || !state.userProfile) return;
  container.innerHTML = "";

  const p = state.userProfile;
  const size = 300;

  // 1. Calculate computed connections and relationships strictly from the astrology engine
  const computed = window.VedasyncEngine.getComputedConnections(p, state.chartType);
  state.computedConnections = computed;

  // 2. Calculate Transits (Gochar) if enabled
  let transitData = null;
  if (state.showTransits) {
    transitData = window.VedasyncEngine.getTransitPositions(state.transitDate || new Date(), p);
    if (els.legendTransitItem) els.legendTransitItem.style.display = "flex";
  } else {
    if (els.legendTransitItem) els.legendTransitItem.style.display = "none";
  }

  let startSignIndex = computed.startSignIndex;
  let activeHouses = computed.activeHouses;

  if (state.chartStyle === "north") {
    // -------------------------------------------------------------
    // NORTH INDIAN INTERACTIVE KUNDLI
    // -------------------------------------------------------------
    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" class="svg-container" id="kundli-svg-root" xmlns="http://www.w3.org/2000/svg">`;

    // Empty space click catcher
    svgHtml += `<rect id="svg-bg-catcher" x="0" y="0" width="${size}" height="${size}" fill="transparent" style="cursor: default;" />`;

    // Outer border & structural geometry
    svgHtml += `<rect x="5" y="5" width="290" height="290" class="chart-border" />`;
    svgHtml += `<line x1="5" y1="5" x2="295" y2="295" class="chart-line" />`;
    svgHtml += `<line x1="5" y1="295" x2="295" y2="5" class="chart-line" />`;
    svgHtml += `<polygon points="150,5 295,150 150,295 5,150" fill="none" class="chart-line" />`;

    // Map planets in their houses
    const planetsInHouses = Array.from({ length: 13 }, () => []);
    let lagnaHouseNum = 1;
    if (state.chartType === "chandra") {
      lagnaHouseNum = p.lagna.rashiIndex - p.moonSign.rashiIndex + 1;
      if (lagnaHouseNum <= 0) lagnaHouseNum += 12;
    }
    planetsInHouses[lagnaHouseNum].push("Asc");

    for (const planet in activeHouses) {
      planetsInHouses[activeHouses[planet]].push(planet);
    }

    // Determine highlight/dim states
    const sel = state.selectedEntity;
    const activeLens = state.activeLens;
    const connectedHouseSet = new Set();
    const connectedPlanetSet = new Set();

    let activeConnectionsList = [];

    if (sel) {
      if (sel.type === "house") {
        connectedHouseSet.add(sel.houseNum);
        activeConnectionsList = computed.connections.filter(c => 
          (c.source.type === "house" && c.source.houseNum === sel.houseNum) ||
          (c.target.type === "house" && c.target.houseNum === sel.houseNum) ||
          (c.source.type === "planet" && c.source.houseNum === sel.houseNum) ||
          (c.targetHouseNum === sel.houseNum)
        );
      } else if (sel.type === "planet") {
        connectedPlanetSet.add(sel.id);
        connectedHouseSet.add(sel.houseNum);
        activeConnectionsList = computed.connections.filter(c => 
          c.source.id === sel.id || c.target.id === sel.id || c.targetHouseNum === sel.houseNum
        );
      }

      activeConnectionsList.forEach(c => {
        if (c.source.houseNum) connectedHouseSet.add(c.source.houseNum);
        if (c.targetHouseNum) connectedHouseSet.add(c.targetHouseNum);
        if (c.source.type === "planet") connectedPlanetSet.add(c.source.id);
        if (c.target.type === "planet") connectedPlanetSet.add(c.target.id);
      });
    } else if (activeLens && activeLens !== "all") {
      const config = window.VedasyncEngine.LIFE_AREA_CONFIG[activeLens];
      if (config) {
        config.houses.forEach(h => connectedHouseSet.add(h));
        config.karakas.forEach(k => connectedPlanetSet.add(k));
        activeConnectionsList = computed.connections.filter(c => 
          config.houses.includes(c.source.houseNum) || config.houses.includes(c.targetHouseNum)
        );
      }
    } else if (state.exploreMode) {
      // In Explore mode with nothing clicked, show all major aspects subtly
      activeConnectionsList = computed.connections.filter(c => c.subType === "aspect" || c.subType === "conjunction");
    }

    // 1. Render Interactive House Polygons
    svgHtml += `<g id="houses-layer">`;
    NORTH_HOUSE_POLYGONS.forEach(hp => {
      let houseClass = "house-polygon";
      if (sel) {
        if (sel.type === "house" && sel.houseNum === hp.h) {
          houseClass += " selected";
        } else if (connectedHouseSet.has(hp.h)) {
          houseClass += " connected-highlight";
        } else {
          houseClass += " dimmed";
        }
      } else if (activeLens && activeLens !== "all") {
        if (connectedHouseSet.has(hp.h)) {
          houseClass += " connected-highlight";
        } else {
          houseClass += " dimmed";
        }
      }

      svgHtml += `<polygon points="${hp.points}" class="${houseClass}" data-house="${hp.h}" />`;
    });
    svgHtml += `</g>`;

    // 2. Render Sign Numbers inside houses
    svgHtml += `<g id="sign-numbers-layer" pointer-events="none">`;
    NORTH_HOUSE_POLYGONS.forEach(hc => {
      const signNum = (startSignIndex + hc.h - 1) % 12 + 1;
      let numX = hc.cx;
      let numY = hc.cy;

      if (hc.h === 1) { numY = 22; }
      else if (hc.h === 2) { numX = 77.5; numY = 16; }
      else if (hc.h === 3) { numX = 16; numY = 77.5; }
      else if (hc.h === 4) { numX = 22; numY = 150; }
      else if (hc.h === 5) { numX = 16; numY = 222.5; }
      else if (hc.h === 6) { numX = 77.5; numY = 286; }
      else if (hc.h === 7) { numY = 278; }
      else if (hc.h === 8) { numX = 222.5; numY = 286; }
      else if (hc.h === 9) { numX = 284; numY = 222.5; }
      else if (hc.h === 10) { numX = 278; numY = 150; }
      else if (hc.h === 11) { numX = 284; numY = 77.5; }
      else if (hc.h === 12) { numX = 222.5; numY = 16; }

      const isDim = (sel && !connectedHouseSet.has(hc.h)) || (activeLens !== "all" && !connectedHouseSet.has(hc.h));
      const dimStyle = isDim ? 'style="opacity: 0.25;"' : '';
      svgHtml += `<text x="${numX}" y="${numY}" text-anchor="middle" class="chart-text-sign" ${dimStyle}>${signNum}</text>`;
    });
    svgHtml += `</g>`;

    // Map planet node coordinates for connector line endpoints
    const planetCoords = {};
    const transitCoords = {};

    // 3. Render Planet Badges
    svgHtml += `<g id="planets-layer">`;
    NORTH_HOUSE_POLYGONS.forEach(hc => {
      const planets = planetsInHouses[hc.h];
      const count = planets.length;

      if (count > 0) {
        planets.forEach((pl, i) => {
          let px = hc.cx;
          let py = hc.cy;

          // Spatial layout around centroid depending on diamond/triangle
          if (count === 1) {
            py = hc.cy + 3;
          } else if (count === 2) {
            py = hc.cy - 7 + (i * 15);
          } else if (count === 3) {
            py = hc.cy - 14 + (i * 14);
          } else {
            // 4+ planets: 2-column distribution
            const col = i % 2 === 0 ? -12 : 12;
            const row = Math.floor(i / 2) * 14 - 10;
            px = hc.cx + col;
            py = hc.cy + row;
          }

          planetCoords[pl] = { x: px, y: py, house: hc.h };

          let plClass = "planet-badge";
          if (sel) {
            if (sel.type === "planet" && sel.id === pl) {
              plClass += " selected";
            } else if (connectedPlanetSet.has(pl)) {
              plClass += " connected-highlight";
            } else {
              plClass += " dimmed";
            }
          } else if (activeLens && activeLens !== "all") {
            if (connectedPlanetSet.has(pl)) {
              plClass += " connected-highlight";
            } else {
              plClass += " dimmed";
            }
          }

          const abbrev = pl === "Asc" ? "As" : pl.substring(0, 2);
          const textColor = pl === "Asc" ? "var(--accent-purple)" : pl === "Sun" || pl === "Moon" ? "var(--gold-light)" : "var(--text-primary)";
          const borderColor = pl === "Asc" ? "var(--accent-purple)" : "rgba(245, 158, 11, 0.4)";

          svgHtml += `
            <g class="${plClass}" data-planet="${pl}" data-house="${hc.h}" transform="translate(${px}, ${py})">
              <rect x="-14" y="-8" width="28" height="16" rx="4" fill="rgba(13, 10, 30, 0.85)" stroke="${borderColor}" stroke-width="1" />
              <text x="0" y="4" text-anchor="middle" fill="${textColor}" font-size="10.5px" font-weight="${pl === 'Asc' ? 'bold' : 'normal'}" font-family="var(--font-sans)">${abbrev}</text>
            </g>
          `;
        });
      }

      // Render Gochar Transit planets if active
      if (transitData && transitData.transitHouses) {
        const transitsInThisHouse = [];
        for (const tPl in transitData.transitHouses) {
          if (transitData.transitHouses[tPl] === hc.h) transitsInThisHouse.push(tPl);
        }

        if (transitsInThisHouse.length > 0) {
          transitsInThisHouse.forEach((tPl, tIdx) => {
            const tx = hc.cx + (tIdx % 2 === 0 ? 18 : -18);
            const ty = hc.cy + 18 + (Math.floor(tIdx / 2) * 12);
            transitCoords[tPl] = { x: tx, y: ty, house: hc.h };

            const tAbbrev = tPl.substring(0, 2);
            svgHtml += `
              <g class="transit-badge" data-transit="${tPl}" transform="translate(${tx}, ${ty})">
                <rect x="-15" y="-7" width="30" height="13" rx="3" fill="rgba(6, 182, 212, 0.25)" stroke="#06B6D4" stroke-width="1" />
                <text x="0" y="3" text-anchor="middle" fill="#06B6D4" font-size="8.5px" font-weight="bold" font-family="var(--font-sans)">T-${tAbbrev}</text>
              </g>
            `;
          });
        }
      }
    });
    svgHtml += `</g>`;

    // 4. Render Animated Connector Lines Layer (Drishti, Lordships, Conjunctions)
    if (state.showConnections && activeConnectionsList.length > 0) {
      svgHtml += `<g id="connections-layer">`;
      activeConnectionsList.forEach(conn => {
        let x1, y1, x2, y2;

        // Source coordinates
        if (conn.source.type === "planet" && planetCoords[conn.source.id]) {
          x1 = planetCoords[conn.source.id].x;
          y1 = planetCoords[conn.source.id].y;
        } else if (conn.source.houseNum) {
          x1 = NORTH_HOUSE_POLYGONS[conn.source.houseNum - 1].cx;
          y1 = NORTH_HOUSE_POLYGONS[conn.source.houseNum - 1].cy;
        } else {
          x1 = 150; y1 = 150;
        }

        // Target coordinates
        if (conn.target.type === "planet" && planetCoords[conn.target.id]) {
          x2 = planetCoords[conn.target.id].x;
          y2 = planetCoords[conn.target.id].y;
        } else if (conn.targetHouseNum) {
          x2 = NORTH_HOUSE_POLYGONS[conn.targetHouseNum - 1].cx;
          y2 = NORTH_HOUSE_POLYGONS[conn.targetHouseNum - 1].cy;
        } else {
          x2 = 150; y2 = 150;
        }

        // Skip degenerate point lines
        if (Math.abs(x1 - x2) < 2 && Math.abs(y1 - y2) < 2) return;

        // Curve lines slightly for elegance and avoiding collision
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curveOffset = Math.min(22, dist * 0.12);
        const nx = -dy / dist;
        const ny = dx / dist;
        const cx = midX + nx * curveOffset;
        const cy = midY + ny * curveOffset;

        let lineClass = "line-aspect";
        if (conn.subType === "conjunction") lineClass = "line-conjunction";
        else if (conn.subType === "lordship") lineClass = "line-lordship";

        svgHtml += `
          <path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" 
                class="${lineClass}" 
                data-conn-id="${conn.id}" 
                fill="none" 
                pointer-events="stroke" />
        `;
      });
      svgHtml += `</g>`;
    }

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;

    // Attach interactive click & hover handlers
    attachKundliInteractions(computed, activeConnectionsList);

  } else {
    // -------------------------------------------------------------
    // SOUTH INDIAN INTERACTIVE KUNDLI
    // -------------------------------------------------------------
    const boxCoords = [
      { r: 0, c: 1, s: 1, name: "Ar" }, { r: 0, c: 2, s: 2, name: "Ta" }, { r: 0, c: 3, s: 3, name: "Ge" },
      { r: 1, c: 3, s: 4, name: "Ca" }, { r: 2, c: 3, s: 5, name: "Le" }, { r: 3, c: 3, s: 6, name: "Vi" },
      { r: 3, c: 2, s: 7, name: "Li" }, { r: 3, c: 1, s: 8, name: "Sc" }, { r: 3, c: 0, s: 9, name: "Sa" },
      { r: 2, c: 0, s: 10, name: "Cp" }, { r: 1, c: 0, s: 11, name: "Aq" }, { r: 0, c: 0, s: 12, name: "Pi" }
    ];

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" class="svg-container" id="kundli-svg-root">`;
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

    const planetsInSigns = Array.from({ length: 12 }, () => []);
    let lagnaSignIndex = p.lagna.rashiIndex;
    if (state.chartType === "navamsha") lagnaSignIndex = p.lagna.navRashiIndex;
    planetsInSigns[lagnaSignIndex].push("Asc");

    for (const planet in p.planets) {
      let rashiIdx = (state.chartType === "navamsha") ? p.navamshaRashiIndices[planet] : Math.floor(p.planets[planet] / 30);
      planetsInSigns[rashiIdx].push(planet);
    }

    boxCoords.forEach(box => {
      const bx = box.c * boxW + 5;
      const by = box.r * boxW + 5;
      svgHtml += `<text x="${bx + 8}" y="${by + 16}" fill="var(--text-dark)" font-family="var(--font-outfit)" font-size="10px" font-weight="bold">${box.name}</text>`;

      if (box.s === lagnaSignIndex + 1) {
        svgHtml += `<line x1="${bx}" y1="${by}" x2="${bx + boxW}" y2="${by + boxW}" stroke="rgba(139, 92, 246, 0.3)" stroke-width="1.5" />`;
      }

      const planets = planetsInSigns[box.s - 1];
      if (planets.length > 0) {
        const cellCenter = bx + boxW / 2;
        const offsetStep = 12;
        const totalHeight = (planets.length - 1) * offsetStep;
        const startY = by + boxW / 2 - totalHeight / 2 + 5;

        planets.forEach((pl, i) => {
          const abbrev = pl === "Asc" ? "As" : pl.substring(0, 2);
          const color = pl === "Asc" ? "var(--accent-purple)" : pl === "Sun" || pl === "Moon" ? "var(--gold-light)" : "var(--text-primary)";
          svgHtml += `<text x="${cellCenter}" y="${startY + (i * offsetStep)}" text-anchor="middle" fill="${color}" font-size="10px" font-family="var(--font-sans)">${abbrev}</text>`;
        });
      }
    });

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
  }
}

/**
 * Attaches click, hover, and dismiss handlers on the interactive Kundli SVG
 */
function attachKundliInteractions(computed, activeConnectionsList) {
  const container = els.kundliSvgContainer;
  if (!container) return;

  // 1. Click empty space clears highlights
  const bgCatcher = container.querySelector("#svg-bg-catcher");
  if (bgCatcher) {
    bgCatcher.addEventListener("click", () => {
      clearHighlights();
    });
  }

  // 2. Click house polygons
  container.querySelectorAll(".house-polygon").forEach(poly => {
    poly.addEventListener("click", (e) => {
      e.stopPropagation();
      const h = parseInt(poly.getAttribute("data-house"));
      selectHouse(h);
    });
  });

  // 3. Click planet badges
  container.querySelectorAll(".planet-badge").forEach(badge => {
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      const pl = badge.getAttribute("data-planet");
      const h = parseInt(badge.getAttribute("data-house"));
      selectPlanet(pl, h);
    });
  });

  // 4. Click Gochar transit badges
  container.querySelectorAll(".transit-badge").forEach(tBadge => {
    tBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      const pl = tBadge.getAttribute("data-transit");
      showToast(`Transit ${pl} (Gochar) in House ${state.userProfile.planetHouses[pl]} relative to birth coordinates.`, "success");
    });
  });

  // 5. Connector line hover and click
  container.querySelectorAll("#connections-layer path").forEach(path => {
    const connId = path.getAttribute("data-conn-id");
    const conn = activeConnectionsList.find(c => c.id === connId);
    if (!conn) return;

    path.addEventListener("mouseenter", (e) => {
      showConnectionCard(conn, e);
    });

    path.addEventListener("click", (e) => {
      e.stopPropagation();
      showConnectionCard(conn, e);
    });
  });
}

/**
 * House selection handler
 */
function selectHouse(h) {
  state.selectedEntity = { type: "house", id: `h${h}`, houseNum: h };
  renderInspectPanel("house", h);
  drawLagnaChart();

  if (state.exploreMode && els.exploreBannerText) {
    const hd = state.computedConnections.houseData[h];
    els.exploreBannerText.textContent = `House ${h} (${hd.signName.split(" ")[0]}): Ruled by ${hd.lord} in House ${hd.lordPlacementHouse}. Occupants: ${hd.occupants.join(", ") || "None"}. Aspects received: ${hd.aspectsReceived.map(a => a.planet).join(", ") || "None"}. Chain: ${[h, hd.lordPlacementHouse, ...hd.connectedHouses].join(" → ")}`;
  }
}

/**
 * Planet selection handler
 */
function selectPlanet(pl, h) {
  state.selectedEntity = { type: "planet", id: pl, houseNum: h };
  renderInspectPanel("planet", pl);
  drawLagnaChart();

  if (state.exploreMode && els.exploreBannerText) {
    const p = state.userProfile;
    const aspectOffsets = PLANET_ASPECT_OFFSETS[pl] || [7];
    const aspectHouses = aspectOffsets.map(off => {
      let t = (h + off - 1) % 12;
      return t === 0 ? 12 : t;
    });
    els.exploreBannerText.textContent = `${pl} placed in House ${h}. Aspects: House ${aspectHouses.join(", ")}. Chain: ${[h, ...aspectHouses].join(" → ")}`;
  }
}

/**
 * Clears all active highlights and resets view
 */
function clearHighlights() {
  state.selectedEntity = null;
  state.activeConnection = null;
  state.activeLens = "all";

  // Reset lens pills
  if (els.lensPills) {
    els.lensPills.forEach(p => {
      if (p.getAttribute("data-lens") === "all") p.classList.add("active");
      else p.classList.remove("active");
    });
  }

  // Hide floating card
  hideConnectionCard();

  // Hide life area card
  if (els.lifeAreaCard) els.lifeAreaCard.classList.add("hidden");

  // Reset inspect panel to default cosmic coordinates view
  renderInspectPanel(null);

  // Redraw chart in clean state
  drawLagnaChart();

  if (state.exploreMode && els.exploreBannerText) {
    els.exploreBannerText.textContent = "Click any house or planet to trace its aspects, lordships, and conjunction chains.";
  }
}

/**
 * Toggles "Show Connections" layer
 */
function toggleConnections(enable) {
  state.showConnections = enable;
  drawLagnaChart();
  showToast(`Connections layer turned ${enable ? "ON" : "OFF"}.`, "success");
}

/**
 * Toggles "Explore Connections" Signature Mode
 */
function toggleExploreMode() {
  state.exploreMode = !state.exploreMode;
  if (els.btnExploreMode) {
    els.btnExploreMode.classList.toggle("active", state.exploreMode);
  }
  if (els.exploreStatusBanner) {
    els.exploreStatusBanner.classList.toggle("hidden", !state.exploreMode);
  }

  if (state.exploreMode) {
    state.showConnections = true;
    if (els.toggleConnections) els.toggleConnections.checked = true;
    showToast("Explore Connections mode activated. Click any planet or house to explore.", "success");
  } else {
    clearHighlights();
    showToast("Explore Connections mode deactivated.", "success");
  }
  drawLagnaChart();
}

/**
 * Toggles Gochar Transits overlay
 */
function toggleTransits(enable) {
  state.showTransits = enable;
  if (els.transitDateContainer) {
    els.transitDateContainer.classList.toggle("hidden", !enable);
  }
  drawLagnaChart();
  showToast(`Live planetary transits (Gochar) ${enable ? "enabled" : "hidden"}.`, "success");
}

/**
 * Sets Life Area Lens (Career, Marriage, Finance, etc.)
 */
function setLifeAreaLens(lensKey) {
  state.activeLens = lensKey;
  state.selectedEntity = null;

  if (els.lensPills) {
    els.lensPills.forEach(pill => {
      pill.classList.toggle("active", pill.getAttribute("data-lens") === lensKey);
    });
  }

  if (lensKey === "all") {
    if (els.lifeAreaCard) els.lifeAreaCard.classList.add("hidden");
    drawLagnaChart();
    return;
  }

  const yogas = window.VedasyncEngine.detectYogas(state.userProfile);
  const analysis = window.VedasyncEngine.analyzeLifeArea(lensKey, state.userProfile, yogas);

  if (analysis && els.lifeAreaCard) {
    els.lifeAreaCard.classList.remove("hidden");
    els.lifeCardIcon.textContent = analysis.icon;
    els.lifeCardTitle.textContent = analysis.title;
    els.lifeCardHousesBadge.textContent = `Houses: ${analysis.houses.join(", ")}`;
    els.lifeCardMeaning.textContent = analysis.meaning;

    // Render house pills in life area card
    let gridHtml = "";
    analysis.houseBreakdown.forEach(hb => {
      gridHtml += `
        <div class="life-house-pill font-outfit">
          <span class="life-house-h">House ${hb.house} (${hb.sign})</span>
          <span class="life-house-desc">Lord: ${hb.lord} in H${hb.lordPlacement} • ${hb.occupants.length > 0 ? hb.occupants.join(", ") : "Empty"}</span>
        </div>
      `;
    });
    els.lifeCardGrid.innerHTML = gridHtml;

    // Render yogas pills
    if (analysis.relevantYogas.length > 0) {
      els.lifeCardYogas.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 600; color: var(--gold-light); margin-bottom: 4px;">Beneficial Yogas for this Life Theme:</div>
        <div class="yoga-footer-pills font-outfit">
          ${analysis.relevantYogas.map(y => `<span class="yoga-pill" style="background: rgba(245, 158, 11, 0.2); color: var(--gold-light); font-weight: 600;">${y.name}</span>`).join('')}
        </div>
      `;
    } else {
      els.lifeCardYogas.innerHTML = "";
    }
  }

  drawLagnaChart();
  showToast(`Applied ${analysis.title} Life Lens.`, "success");
}

/**
 * Shows floating connection details card on line hover/click
 */
function showConnectionCard(conn, mouseEvent) {
  state.activeConnection = conn;
  const card = els.connectionFloatingCard;
  if (!card) return;

  els.connCardType.textContent = conn.type;
  els.connCardTitle.textContent = conn.title;
  els.connCardMeaning.textContent = conn.meaning;
  card.classList.remove("hidden");
}

function hideConnectionCard() {
  if (els.connectionFloatingCard) {
    els.connectionFloatingCard.classList.add("hidden");
  }
}

/**
 * Unified Inspect Panel Component (House & Planet Reusable Component)
 */
function renderInspectPanel(mode, entityId) {
  const panel = els.unifiedInspectPanel;
  const header = els.inspectHeader;
  const badge = els.inspectBadge;
  const title = els.inspectTitle;
  const body = els.inspectBody;
  const defView = els.inspectDefaultView;

  if (!panel) return;

  if (!mode || !entityId) {
    if (header) header.style.display = "none";
    if (body) body.style.display = "none";
    if (defView) defView.style.display = "block";
    return;
  }

  if (defView) defView.style.display = "none";
  if (header) header.style.display = "flex";
  if (body) body.style.display = "block";

  const p = state.userProfile;
  const computed = state.computedConnections || window.VedasyncEngine.getComputedConnections(p, state.chartType);
  const yogas = window.VedasyncEngine.detectYogas(p);

  if (mode === "house") {
    const h = parseInt(entityId);
    const hd = computed.houseData[h];
    const sign = hd.signName;
    const lord = hd.lord;
    const lordHouse = hd.lordPlacementHouse;
    const occupants = hd.occupants.length > 0 ? hd.occupants.join(", ") : "None";
    const aspectsReceived = hd.aspectsReceived.map(a => `${a.planet} (${a.offset}th aspect)`).join(", ") || "None";
    const connectedChain = [h, lordHouse, ...hd.connectedHouses].filter((v, i, a) => a.indexOf(v) === i);
    const relevantYogas = yogas.filter(y => y.houses && y.houses.includes(h));

    badge.textContent = `HOUSE ${h}`;
    const houseSanskritNames = [
      "Tanu Bhava (Self / Vitality / Personality)", 
      "Dhana Bhava (Wealth / Family / Speech)", 
      "Sahaja Bhava (Courage / Younger Siblings / Enterprise)", 
      "Sukha Bhava (Mother / Happiness / Vehicles / Land)", 
      "Putra Bhava (Children / Intellect / Purva Punya)", 
      "Ari Bhava (Debts / Diseases / Daily Service)", 
      "Kalatra Bhava (Spouse / Business Partnerships)", 
      "Randhra Bhava (Longevity / Occult / Transformation)", 
      "Dharma Bhava (Higher Wisdom / Guru / Bhagya)", 
      "Karma Bhava (Career / Status / Executive Power)", 
      "Labha Bhava (Gains / Network / Aspiration Fulfillment)", 
      "Vyaya Bhava (Expenditure / Foreign Travel / Moksha)"
    ];
    title.textContent = houseSanskritNames[h - 1];

    body.innerHTML = `
      <div class="inspect-grid font-outfit">
        <div class="inspect-attr-box"><span class="inspect-attr-label">Sign (Rashi)</span><span class="inspect-attr-val">${sign}</span></div>
        <div class="inspect-attr-box"><span class="inspect-attr-label">House Lord</span><span class="inspect-attr-val">${lord}</span></div>
        <div class="inspect-attr-box"><span class="inspect-attr-label">Lord's Placement</span><span class="inspect-attr-val">House ${lordHouse}</span></div>
        <div class="inspect-attr-box"><span class="inspect-attr-label">Occupants</span><span class="inspect-attr-val">${occupants}</span></div>
        <div class="inspect-attr-box" style="grid-column: 1 / -1;"><span class="inspect-attr-label">Aspects Received (Graha Drishti)</span><span class="inspect-attr-val">${aspectsReceived}</span></div>
      </div>

      <div class="inspect-chain-box font-outfit">
        <div class="chain-title">Connected Houses Influence Chain:</div>
        <div class="chain-nodes">
          ${connectedChain.map((node, i) => `
            <span class="chain-pill">H${node}</span>
            ${i < connectedChain.length - 1 ? '<span class="chain-arrow">→</span>' : ''}
          `).join('')}
        </div>
      </div>

      ${relevantYogas.length > 0 ? `
        <div class="pada-drilldown-card font-outfit">
          <div class="pada-title">Active Planetary Yogas in House ${h}:</div>
          <div class="yoga-footer-pills" style="margin-top: 6px;">
            ${relevantYogas.map(y => `<span class="yoga-pill" style="background: rgba(245, 158, 11, 0.15); color: var(--gold-light); font-weight: 600;">${y.name}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="inspect-actions font-outfit">
        <button class="btn-api-key" id="btn-inspect-highlight-chain" style="font-size: 0.78rem;">Highlight Chain</button>
        <button class="btn-api-key" id="btn-inspect-view-remedies" style="font-size: 0.78rem;">Remedies for ${lord}</button>
        <button class="btn-gold" id="btn-inspect-ask-ai" style="padding: 6px 14px; font-size: 0.78rem;">Ask AI Guru</button>
      </div>
    `;

    document.getElementById("btn-inspect-highlight-chain")?.addEventListener("click", () => selectHouse(h));
    document.getElementById("btn-inspect-view-remedies")?.addEventListener("click", () => openRemediesModal(lord));
    document.getElementById("btn-inspect-ask-ai")?.addEventListener("click", () => askAiGuruAboutHouse(h, sign, lord, lordHouse));

  } else if (mode === "planet") {
    const pl = entityId;
    const plHouse = p.planetHouses[pl];
    const plSign = p.planetSigns[pl];
    const long = p.planets[pl] || 0;
    const degVal = Math.floor(long % 30);
    const minVal = Math.round((long % 1) * 60);

    const ownedHouses = [];
    const startSignIdx = p.lagna.rashiIndex;
    for (let i = 1; i <= 12; i++) {
      const sIdx = (startSignIdx + i - 1) % 12;
      if (SIGN_LORDS[sIdx] === pl) ownedHouses.push(i);
    }

    const aspectOffsets = PLANET_ASPECT_OFFSETS[pl] || [7];
    const housesAspected = aspectOffsets.map(off => {
      let t = (plHouse + off - 1) % 12;
      return t === 0 ? 12 : t;
    });

    const conjunct = [];
    for (const other in p.planetHouses) {
      if (other !== pl && p.planetHouses[other] === plHouse) conjunct.push(other);
    }

    // Precise Nakshatra and Pada drill-down
    const padaInfo = window.VedasyncEngine.getNakshatraPadaDetail(long);
    const relevantYogas = yogas.filter(y => y.planets && y.planets.includes(pl));
    const connectedChain = [plHouse, ...ownedHouses, ...housesAspected].filter((v, i, a) => a.indexOf(v) === i);

    badge.textContent = `PLANET`;
    title.textContent = `${pl} (${padaInfo.nakshatraLord} lorded)`;

    body.innerHTML = `
      <div class="inspect-grid font-outfit">
        <div class="inspect-attr-box"><span class="inspect-attr-label">Sign (Rashi)</span><span class="inspect-attr-val">${plSign} (${degVal}° ${minVal}')</span></div>
        <div class="inspect-attr-box"><span class="inspect-attr-label">Placed in</span><span class="inspect-attr-val">House ${plHouse}</span></div>
        <div class="inspect-attr-box"><span class="inspect-attr-label">Houses Ruled</span><span class="inspect-attr-val">${ownedHouses.length > 0 ? ownedHouses.map(h => `H${h}`).join(", ") : "Shadow Node"}</span></div>
        <div class="inspect-attr-box"><span class="inspect-attr-label">Aspects Cast (Drishti)</span><span class="inspect-attr-val">${housesAspected.map(h => `H${h}`).join(", ")}</span></div>
        <div class="inspect-attr-box" style="grid-column: 1 / -1;"><span class="inspect-attr-label">Conjunctions (Yuti)</span><span class="inspect-attr-val">${conjunct.length > 0 ? conjunct.join(", ") : "None in same house"}</span></div>
      </div>

      <!-- Nakshatra & Pada Drill-Down (Bonus feature) -->
      <div class="pada-drilldown-card font-outfit">
        <div class="pada-title">Nakshatra & Pada Drill-down:</div>
        <div class="pada-detail-text">
          <strong>${padaInfo.nakshatraName}</strong> (Pada ${padaInfo.pada} • ${padaInfo.purushartha} Purushartha)
          <br>Navamsha Sign: <strong>${padaInfo.navamshaSign}</strong> (Lord: ${padaInfo.navamshaRuler})
          <br>Sound Syllable: <em>${padaInfo.akshara}</em> • Gana: ${padaInfo.gana} • Nadi: ${padaInfo.nadi}
          <br><span style="color: var(--gold-light); margin-top: 4px; display: inline-block;">Karmic Theme:</span> ${padaInfo.karmicTheme}
        </div>
      </div>

      <div class="inspect-chain-box font-outfit">
        <div class="chain-title">${pl}'s Cosmic Network Chain:</div>
        <div class="chain-nodes">
          ${connectedChain.map((node, i) => `
            <span class="chain-pill">H${node}</span>
            ${i < connectedChain.length - 1 ? '<span class="chain-arrow">→</span>' : ''}
          `).join('')}
        </div>
      </div>

      ${relevantYogas.length > 0 ? `
        <div class="pada-drilldown-card font-outfit" style="background: rgba(139, 92, 246, 0.08); border-color: rgba(139, 92, 246, 0.2);">
          <div class="pada-title" style="color: var(--accent-purple);">Yogas Involving ${pl}:</div>
          <div class="yoga-footer-pills" style="margin-top: 6px;">
            ${relevantYogas.map(y => `<span class="yoga-pill" style="background: rgba(139, 92, 246, 0.2); color: #fff; font-weight: 600;">${y.name}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="inspect-actions font-outfit">
        <button class="btn-api-key" id="btn-inspect-highlight-chain" style="font-size: 0.78rem;">Highlight on Chart</button>
        <button class="btn-api-key" id="btn-inspect-view-remedies" style="font-size: 0.78rem;">View Remedies</button>
        <button class="btn-gold" id="btn-inspect-ask-ai" style="padding: 6px 14px; font-size: 0.78rem;">Ask AI Guru</button>
      </div>
    `;

    document.getElementById("btn-inspect-highlight-chain")?.addEventListener("click", () => selectPlanet(pl, plHouse));
    document.getElementById("btn-inspect-view-remedies")?.addEventListener("click", () => openRemediesModal(pl));
    document.getElementById("btn-inspect-ask-ai")?.addEventListener("click", () => askAiGuruAboutPlanet(pl, plHouse, plSign, ownedHouses));
  }
}

function closeInspectPanel() {
  renderInspectPanel(null);
  clearHighlights();
}

function askAiGuruAboutHouse(h, sign, lord, lordHouse) {
  switchTab("tab-chat");
  if (els.chatInput) {
    els.chatInput.value = `Please explain the significance of House ${h} in ${sign}, ruled by ${lord} placed in House ${lordHouse} in my Kundli.`;
    if (els.chatForm) els.chatForm.dispatchEvent(new Event("submit"));
  }
}

function askAiGuruAboutPlanet(pl, house, sign, owned) {
  switchTab("tab-chat");
  if (els.chatInput) {
    els.chatInput.value = `Explain the impact of ${pl} placed in House ${house} (${sign}), which rules House ${owned.join(", ")} in my birth chart.`;
    if (els.chatForm) els.chatForm.dispatchEvent(new Event("submit"));
  }
}

/**
 * -------------------------------------------------------------
 * 5. INTERACTIVE VIMSHOTTARI DASHA TIMELINE
 * -------------------------------------------------------------
 */
function renderDashaTimeline() {
  const container = els.dashaTimelineContainer;
  const activeLabel = els.dashaActiveLabel;
  const detailCard = els.dashaDetailCard;
  if (!container || !state.userProfile) return;

  const dashaData = window.VedasyncEngine.calculateVimshottariDasha(state.userProfile, new Date());
  const activePeriod = dashaData.activePeriod;

  if (activePeriod && activeLabel) {
    activeLabel.textContent = `Current: ${activePeriod.mahadasha} - ${activePeriod.antardasha} - ${activePeriod.pratyantar}`;
  }

  // Render Mahadasha horizontal blocks
  let html = `<div class="dasha-track">`;
  dashaData.mahadashas.forEach((md, idx) => {
    const isAct = md.isCurrent ? "active" : "";
    html += `
      <div class="dasha-m-block ${isAct}" data-m-idx="${idx}">
        <div class="dasha-m-header">
          <span class="dasha-pl-name" style="color: ${md.color};">${md.planet}</span>
          <span class="dasha-duration font-outfit">${md.durationYears} yrs</span>
        </div>
        <div class="dasha-dates font-outfit">${md.startDate.split("-")[0]} - ${md.endDate.split("-")[0]}</div>
        ${md.isCurrent ? '<span class="dasha-current-badge">CURRENT</span>' : ''}
      </div>
    `;
  });
  html += `</div>`;

  // Sub-track for Antardashas
  const activeMIdx = dashaData.mahadashas.findIndex(m => m.isCurrent);
  const selectedM = dashaData.mahadashas[activeMIdx >= 0 ? activeMIdx : 0];

  html += `<div class="dasha-sub-track" id="dasha-sub-track">`;
  selectedM.antardashas.forEach((ad, adIdx) => {
    const isAdAct = ad.isCurrent ? "active" : "";
    html += `
      <div class="dasha-ad-block ${isAdAct}" data-m-idx="${activeMIdx >= 0 ? activeMIdx : 0}" data-ad-idx="${adIdx}">
        <span style="color: ${ad.color}; font-weight: 600;">${ad.planet}</span>
        <span style="font-size: 0.68rem; color: var(--text-dark); margin-left: 4px;">${ad.startDate.substring(5)}</span>
      </div>
    `;
  });
  html += `</div>`;

  container.innerHTML = html;

  if (activePeriod && detailCard) {
    renderDashaDetailCard(activePeriod);
  }

  // Click listeners on Mahadashas
  container.querySelectorAll(".dasha-m-block").forEach(block => {
    block.addEventListener("click", () => {
      container.querySelectorAll(".dasha-m-block").forEach(b => b.classList.remove("active"));
      block.classList.add("active");
      const mIdx = parseInt(block.getAttribute("data-m-idx"));
      const md = dashaData.mahadashas[mIdx];

      const subTrack = document.getElementById("dasha-sub-track");
      if (subTrack) {
        let subHtml = "";
        md.antardashas.forEach((ad, adIdx) => {
          subHtml += `
            <div class="dasha-ad-block ${ad.isCurrent ? "active" : ""}" data-m-idx="${mIdx}" data-ad-idx="${adIdx}">
              <span style="color: ${ad.color}; font-weight: 600;">${ad.planet}</span>
              <span style="font-size: 0.68rem; color: var(--text-dark); margin-left: 4px;">${ad.startDate.substring(5)}</span>
            </div>
          `;
        });
        subTrack.innerHTML = subHtml;
        bindSubTrackListeners(md);
      }

      // Highlight on main Kundli chart
      selectPlanet(md.planet, md.housePlaced);

      renderDashaDetailCard({
        mahadasha: md.planet,
        antardasha: md.antardashas[0].planet,
        pratyantar: md.antardashas[0].pratyantardashas[0].planet,
        startDate: md.startDate,
        endDate: md.endDate,
        housePlaced: md.housePlaced,
        housesRuled: md.housesRuled,
        housesAspected: md.housesAspected,
        connectedChain: [md.housePlaced, ...md.housesRuled, ...md.housesAspected].filter((v, i, a) => a.indexOf(v) === i)
      });
    });
  });

  bindSubTrackListeners(selectedM);
}

function bindSubTrackListeners(md) {
  const subTrack = document.getElementById("dasha-sub-track");
  if (!subTrack) return;

  subTrack.querySelectorAll(".dasha-ad-block").forEach(adBlock => {
    adBlock.addEventListener("click", () => {
      subTrack.querySelectorAll(".dasha-ad-block").forEach(b => b.classList.remove("active"));
      adBlock.classList.add("active");
      const adIdx = parseInt(adBlock.getAttribute("data-ad-idx"));
      const ad = md.antardashas[adIdx];

      selectPlanet(ad.planet, ad.housePlaced);

      renderDashaDetailCard({
        mahadasha: md.planet,
        antardasha: ad.planet,
        pratyantar: ad.pratyantardashas[0].planet,
        startDate: ad.startDate,
        endDate: ad.endDate,
        housePlaced: ad.housePlaced,
        housesRuled: md.housesRuled,
        housesAspected: md.housesAspected,
        connectedChain: [md.housePlaced, ad.housePlaced, ...md.housesRuled, ...md.housesAspected].filter((v, i, a) => a.indexOf(v) === i)
      });
    });
  });
}

function renderDashaDetailCard(period) {
  const card = els.dashaDetailCard;
  if (!card) return;

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 8px;">
      <h4 style="color: var(--gold-light); font-size: 1rem;">${period.mahadasha} Mahadasha • ${period.antardasha} Antardasha</h4>
      <span style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 6px;">Period: ${period.startDate} to ${period.endDate}</span>
    </div>
    <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 8px;">
      Lord <strong>${period.mahadasha}</strong> is placed in House <strong>${period.housePlaced}</strong>, rules House <strong>${period.housesRuled.join(", ") || "None"}</strong>, and projects Graha Drishti onto House <strong>${period.housesAspected.join(", ")}</strong>.
    </p>
    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
      <span style="font-size: 0.72rem; color: var(--accent-purple); font-weight: 600;">Active House Chain:</span>
      ${period.connectedChain.map((h, i) => `
        <span style="padding: 2px 7px; background: rgba(139, 92, 246, 0.2); border-radius: 4px; font-size: 0.75rem; font-weight: 600;">H${h}</span>
        ${i < period.connectedChain.length - 1 ? '<span style="color: var(--gold-light); font-size: 0.7rem;">→</span>' : ''}
      `).join('')}
    </div>
  `;
}

/**
 * -------------------------------------------------------------
 * 6. AUTHENTIC YOGA FINDER
 * -------------------------------------------------------------
 */
function renderYogaFinder(category = "all") {
  const grid = els.yogaGrid;
  if (!grid || !state.userProfile) return;

  const yogas = window.VedasyncEngine.detectYogas(state.userProfile);
  const filtered = category === "all" ? yogas : yogas.filter(y => y.category.toLowerCase().includes(category.toLowerCase()));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="yoga-empty-state font-outfit">
        <h4 style="color: var(--gold-light); margin-bottom: 6px;">No Major ${category === "all" ? "" : category} Yogas Detected</h4>
        <p style="font-size: 0.82rem; color: var(--text-dark);">Your chart coordinates were scanned across Parashari combinations. Minor or heavily disputed combinations are excluded to ensure strict traditional authenticity.</p>
      </div>
    `;
    return;
  }

  let html = "";
  filtered.forEach(y => {
    html += `
      <div class="glass-card yoga-card" data-yoga-id="${y.id}">
        <div class="yoga-card-top">
          <span class="yoga-cat-badge">${y.category}</span>
          <span class="yoga-strength-badge font-outfit">${y.strength} Strength</span>
        </div>
        <div class="yoga-title font-outfit">${y.name}</div>
        <div class="yoga-sanskrit font-outfit">${y.sanskrit}</div>
        <div class="yoga-meaning font-outfit">${y.meaning}</div>
        <div class="yoga-footer-pills font-outfit">
          ${y.planets.map(p => `<span class="yoga-pill">${p}</span>`).join('')}
          ${y.houses.map(h => `<span class="yoga-pill" style="background: rgba(139, 92, 246, 0.15); color: var(--accent-purple);">H${h}</span>`).join('')}
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;

  // Add click listener to highlight on chart
  grid.querySelectorAll(".yoga-card").forEach(card => {
    card.addEventListener("click", () => {
      const yId = card.getAttribute("data-yoga-id");
      const yoga = filtered.find(y => y.id === yId);
      if (yoga) {
        highlightYogaOnChart(yoga);
        showToast(`Highlighted ${yoga.name} on Kundli chart.`, "success");
        els.kundliSvgContainer.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}

function highlightYogaOnChart(yoga) {
  state.selectedEntity = { type: "yoga", id: yoga.id, planets: yoga.planets, houses: yoga.houses };
  drawLagnaChart();

  // If inspect panel open, show first planet of yoga
  if (yoga.planets && yoga.planets.length > 0) {
    renderInspectPanel("planet", yoga.planets[0]);
  }
}

/**
 * -------------------------------------------------------------
 * 7. SYNASTRY / DUAL-CHART COMPATIBILITY VISUALIZER
 * -------------------------------------------------------------
 */
function renderSynastryVisualizer(profileA, profileB) {
  const panel = els.synastryVisualizerPanel;
  const containerA = els.synastrySvgChartA;
  const containerB = els.synastrySvgChartB;
  if (!panel || !containerA || !containerB) return;

  panel.style.display = "block";
  const p1Title = els.synastryP1Title || document.getElementById("synastry-p1-title");
  const p2Title = els.synastryP2Title || document.getElementById("synastry-p2-title");
  if (p1Title) p1Title.textContent = `${profileA.name} (Self)`;
  if (p2Title) p2Title.textContent = `${profileB.name}`;

  // Render miniature North Indian charts for both partners
  renderMiniChart(containerA, profileA, "A");
  renderMiniChart(containerB, profileB, "B");

  // Calculate cross-chart connections
  const crossConnections = window.VedasyncEngine.calculateSynastryConnections(profileA, profileB);
  state.crossConnections = crossConnections;

  if (els.synastryInteractionText) {
    if (crossConnections.length > 0) {
      els.synastryInteractionText.innerHTML = `
        <strong>${crossConnections.length} Cross-Chart Connections Detected:</strong>
        <br>${crossConnections.slice(0, 3).map(c => c.meaning).join("<br>")}
      `;
    } else {
      els.synastryInteractionText.textContent = "Click any planet in Partner A or Partner B to explore inter-chart planetary harmonic bonds.";
    }
  }
}

function renderMiniChart(container, profile, chartTag) {
  container.innerHTML = "";
  const size = 280;
  const startSignIndex = profile.lagna.rashiIndex;
  const activeHouses = profile.planetHouses;

  let svgHtml = `<svg viewBox="0 0 ${size} ${size}" class="svg-container">`;
  svgHtml += `<rect x="5" y="5" width="270" height="270" class="chart-border" />`;
  svgHtml += `<line x1="5" y1="5" x2="275" y2="275" class="chart-line" />`;
  svgHtml += `<line x1="5" y1="275" x2="275" y2="5" class="chart-line" />`;
  svgHtml += `<polygon points="140,5 275,140 140,275 5,140" fill="none" class="chart-line" />`;

  const miniPolys = [
    { h: 1, cx: 140, cy: 75 }, { h: 2, cx: 75, cy: 30 }, { h: 3, cx: 30, cy: 75 },
    { h: 4, cx: 75, cy: 140 }, { h: 5, cx: 30, cy: 205 }, { h: 6, cx: 75, cy: 250 },
    { h: 7, cx: 140, cy: 205 }, { h: 8, cx: 205, cy: 250 }, { h: 9, cx: 250, cy: 205 },
    { h: 10, cx: 205, cy: 140 }, { h: 11, cx: 250, cy: 75 }, { h: 12, cx: 205, cy: 30 }
  ];

  const planetsInHouses = Array.from({ length: 13 }, () => []);
  planetsInHouses[1].push("Asc");
  for (const pl in activeHouses) {
    planetsInHouses[activeHouses[pl]].push(pl);
  }

  miniPolys.forEach(mp => {
    const signNum = (startSignIndex + mp.h - 1) % 12 + 1;
    svgHtml += `<text x="${mp.cx}" y="${mp.cy - 12}" text-anchor="middle" class="chart-text-sign" font-size="11px">${signNum}</text>`;

    const planets = planetsInHouses[mp.h];
    if (planets.length > 0) {
      planets.forEach((pl, i) => {
        const abbrev = pl === "Asc" ? "As" : pl.substring(0, 2);
        const color = chartTag === "A" ? "var(--gold-light)" : "var(--accent-purple)";
        svgHtml += `
          <g class="synastry-planet-node" data-chart="${chartTag}" data-planet="${pl}" data-house="${mp.h}">
            <text x="${mp.cx}" y="${mp.cy + (i * 12) + 2}" text-anchor="middle" fill="${color}" font-size="10px" font-weight="bold">${abbrev}</text>
          </g>
        `;
      });
    }
  });

  svgHtml += `</svg>`;
  container.innerHTML = svgHtml;

  // Add click handlers on synastry planet nodes
  container.querySelectorAll(".synastry-planet-node").forEach(node => {
    node.addEventListener("click", () => {
      const pl = node.getAttribute("data-planet");
      const h = parseInt(node.getAttribute("data-house"));
      selectSynastryPlanet(chartTag, pl, h);
    });
  });
}

function selectSynastryPlanet(chartTag, planetName, houseNum) {
  const otherTag = chartTag === "A" ? "B" : "A";
  const cross = (state.crossConnections || []).filter(c => 
    (c.source.chart === chartTag && c.source.planet === planetName) ||
    (c.target.chart === chartTag && c.target.planet === planetName)
  );

  if (els.synastryInteractionText) {
    if (cross.length > 0) {
      els.synastryInteractionText.innerHTML = `
        <h4 style="color: var(--gold-light); margin-bottom: 4px;">Partner ${chartTag}'s ${planetName} (House ${houseNum})</h4>
        ${cross.map(c => `<div style="margin-top: 4px;"><strong>${c.title}:</strong> ${c.meaning}</div>`).join('')}
      `;
    } else {
      els.synastryInteractionText.innerHTML = `Partner ${chartTag}'s ${planetName} in House ${houseNum} forms independent harmonious dignity with partner's astrological chart.`;
    }
  }
}

/**
 * -------------------------------------------------------------
 * 8. SHAREABLE SNAPSHOT GENERATOR
 * -------------------------------------------------------------
 */
function generateShareableSnapshot() {
  const svg = document.getElementById("kundli-svg-root");
  const canvas = els.snapshotCanvas;
  if (!svg || !canvas) return;

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    canvas.width = 600;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 720);
    grad.addColorStop(0, "#06060c");
    grad.addColorStop(0.5, "#0d0a1e");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 720);

    // Decorative golden border
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 570, 690);

    // Header branding
    ctx.fillStyle = "#FBBF24";
    ctx.font = "bold 22px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("VEDASYNC", 300, 50);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText("Vedic Astrological Kundli Coordinates", 300, 70);

    // User details
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 15px 'Outfit', sans-serif";
    ctx.fillText(`${state.userProfile.name} • ${state.userProfile.dob} (${state.userProfile.tob})`, 300, 100);

    // Draw chart SVG image in center
    ctx.drawImage(img, 130, 125, 340, 340);

    // Connection or highlight summary banner
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(40, 485, 520, 140);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
    ctx.strokeRect(40, 485, 520, 140);

    ctx.fillStyle = "#FBBF24";
    ctx.font = "bold 14px 'Outfit', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Astrological Alignment & Drishti Analysis", 60, 515);

    ctx.fillStyle = "#CBD5E1";
    ctx.font = "12px 'Inter', sans-serif";
    let summaryText = "Planetary coordinates cast using Nirayana Lahiri Sidereal ephemeris with exact degree house aspects.";
    if (state.selectedEntity) {
      if (state.selectedEntity.type === "house") {
        summaryText = `Highlighted: House ${state.selectedEntity.houseNum} (${state.userProfile.lagna.rashi.split(" ")[0]} Ascendant). Explored house rulership and Graha Drishti connections.`;
      } else if (state.selectedEntity.type === "planet") {
        summaryText = `Highlighted: ${state.selectedEntity.id} stationed in House ${state.selectedEntity.houseNum}. Full planetary aspects and lordship network traced.`;
      }
    }
    ctx.fillText(summaryText.substring(0, 80), 60, 545);
    ctx.fillText(summaryText.substring(80, 160), 60, 565);

    // Footer
    ctx.fillStyle = "#64748B";
    ctx.font = "italic 11px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Generated with Mathematical Precision by Vedasync • Vedic AI Platform", 300, 680);

    URL.revokeObjectURL(url);

    // Open snapshot modal
    if (els.snapshotModal) els.snapshotModal.classList.add("active");
  };

  img.src = url;
}

/**
 * -------------------------------------------------------------
 * 9. TRADITIONAL REMEDIES PANEL
 * -------------------------------------------------------------
 */
function openRemediesModal(planetName) {
  const modal = els.remediesModal;
  const body = els.remediesBody;
  const title = els.remediesModalTitle;
  if (!modal || !body) return;

  const targetPlanets = planetName ? [planetName] : ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  title.textContent = planetName ? `Traditional Remedies for ${planetName}` : "Classical Planetary Remedies";

  let html = "";
  targetPlanets.forEach(pl => {
    const rem = window.VedasyncEngine.getTraditionalRemedies(pl);
    if (!rem) return;

    html += `
      <div class="remedy-card font-outfit">
        <div class="remedy-planet-header">${pl} (Graha Shanti)</div>
        <div class="remedy-row"><span class="remedy-label">Gemstone:</span> ${rem.gemstone}</div>
        <div class="remedy-row"><span class="remedy-label">Mantra:</span> <em>${rem.mantra}</em></div>
        <div class="remedy-row"><span class="remedy-label">Day & Time:</span> ${rem.day}</div>
        <div class="remedy-row"><span class="remedy-label">Deity:</span> ${rem.deity}</div>
        <div class="remedy-row"><span class="remedy-label">Charity:</span> ${rem.charity}</div>
        <div class="remedy-row"><span class="remedy-label">Rudraksha:</span> ${rem.rudraksha}</div>
      </div>
    `;
  });

  body.innerHTML = html;
  modal.classList.add("active");
}

/**
 * -------------------------------------------------------------
 * 10. GROUNDED AI CONNECTION EXPLAINER
 * -------------------------------------------------------------
 */
function explainConnectionWithAI(conn) {
  const modal = els.connectionExplainModal;
  if (!modal) return;

  els.explainTypeBadge.textContent = conn.type;
  els.explainTitleText.textContent = conn.title;
  els.explainSourceMeaning.textContent = conn.meaning;
  modal.classList.add("active");

  const aiBox = els.explainAiText;
  aiBox.innerHTML = `<div class="loading-spinner"></div> Generating deep Vedic astrological synthesis...`;

  setTimeout(() => {
    let deepText = ``;
    if (conn.subType === "aspect") {
      deepText = `According to Brihat Parashara Hora Shastra, when ${conn.source.label} casts Graha Drishti onto House ${conn.targetHouseNum}, it energizes the underlying bhava with its natural vibrations. Because ${conn.source.label} governs key life principles in your chart, its aspect transforms this house into an active arena of karmic evolution.`;
    } else if (conn.subType === "conjunction") {
      deepText = `A classical Yuti (conjunction) signifies a confluence of elemental energies. Here, ${conn.source.label} and ${conn.target.label} occupy the same astronomical sign, causing their planetary rays to blend. Their mutual friendship, dignity, and natural karakas dictate whether this combination acts as a stabilizing force or requires patient self-discipline.`;
    } else {
      deepText = `Lordship (Bhava Adhipati) connections represent the pipeline of cosmic energy. The lord of a house represents the owner of that estate: where the lord goes, the destiny of that house follows. In your chart, this lordship connection grounds the outcomes firmly into the target house.`;
    }
    aiBox.innerHTML = deepText;
  }, 400);
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
    state.selectedPartnerProfile = p2Profile;
    renderSynastryVisualizer(state.userProfile, p2Profile);
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

