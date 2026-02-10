const scoreEl = document.querySelector("#score");
const perClickEl = document.querySelector("#per-click");
const perSecondEl = document.querySelector("#per-second");
const clickButton = document.querySelector("#click-button");
const floatingPoints = document.querySelector("#floating-points");
const upgradeClickButton = document.querySelector("#upgrade-click");
const upgradeAutoButton = document.querySelector("#upgrade-auto");
const upgradeClickCostEl = document.querySelector("#upgrade-click-cost");
const upgradeAutoCostEl = document.querySelector("#upgrade-auto-cost");
const upgradeClickOwnedEl = document.querySelector("#upgrade-click-owned");
const upgradeAutoOwnedEl = document.querySelector("#upgrade-auto-owned");
const upgradeCritButton = document.querySelector("#upgrade-crit");
const upgradeSpeedButton = document.querySelector("#upgrade-speed");
const upgradeCritCostEl = document.querySelector("#upgrade-crit-cost");
const upgradeSpeedCostEl = document.querySelector("#upgrade-speed-cost");
const upgradeCritOwnedEl = document.querySelector("#upgrade-crit-owned");
const upgradeSpeedOwnedEl = document.querySelector("#upgrade-speed-owned");
const achievementList = document.querySelector("#achievement-list");
const toggleSoundButton = document.querySelector("#toggle-sound");
const resetSaveButton = document.querySelector("#reset-save");
const toggleShopButton = document.querySelector("#toggle-shop");
const walletEl = document.querySelector("#wallet");
const particleCanvas = document.querySelector("#particle-canvas");
const comboLabel = document.querySelector("#combo-label");
const comboFill = document.querySelector("#combo-fill");
const achievementToast = document.querySelector("#achievement-toast");
const playArea = document.querySelector("#play-area");
const shopPanel = document.querySelector("#shop-panel");

const SAVE_KEY = "neon-clicker-save";

// Core game state
const state = {
  score: 0,
  pointsPerClick: 1,
  autoClickers: 0,
  clickUpgradeCost: 10,
  autoUpgradeCost: 25,
  clickUpgradeOwned: 0,
  autoUpgradeOwned: 0,
  critChance: 0,
  critUpgradeCost: 40,
  critUpgradeOwned: 0,
  speedUpgradeCost: 30,
  speedUpgradeOwned: 0,
  clickBurstDuration: 0.4,
  soundEnabled: true,
  totalClicks: 0,
  combo: 1,
  lastClickAt: 0,
  volume: 0.15,
  shopOpen: true,
};

// Achievement definitions
const achievements = [
  { id: "first-click", label: "First tap!", goal: 1, unlocked: false },
  { id: "hundred", label: "100 points", goal: 100, unlocked: false },
  { id: "five-hundred", label: "500 points", goal: 500, unlocked: false },
  { id: "first-auto", label: "Automation online", goalAuto: 1, unlocked: false },
  { id: "combo-five", label: "Combo x5!", goalCombo: 5, unlocked: false },
  { id: "click-fiend", label: "50 clicks", goalClicks: 50, unlocked: false },
];

let audioContext;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Create soft synth-style tones for effects
const playTone = (frequency, duration, type = "sine") => {
  if (!state.soundEnabled) {
    return;
  }

  const context = getAudioContext();
  if (context.state === "suspended") {
    context.resume();
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = state.volume;
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
};

const resizeCanvas = () => {
  const rect = particleCanvas.getBoundingClientRect();
  particleCanvas.width = rect.width * window.devicePixelRatio;
  particleCanvas.height = rect.height * window.devicePixelRatio;
};

const particles = [];
const ctx = particleCanvas.getContext("2d");

const spawnParticles = (amount) => {
  const rect = particleCanvas.getBoundingClientRect();
  for (let i = 0; i < amount; i += 1) {
    particles.push({
      x: rect.width / 2,
      y: rect.height / 2,
      radius: 3 + Math.random() * 4,
      alpha: 1,
      velocityX: (Math.random() - 0.5) * 3,
      velocityY: -2 - Math.random() * 2,
      hue: 150 + Math.random() * 120,
    });
  }
};

const animateParticles = () => {
  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  ctx.save();
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  particles.forEach((particle) => {
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;
    particle.alpha -= 0.02;
    ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.alpha})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  ctx.restore();
  requestAnimationFrame(animateParticles);
};

// Render achievements list
const renderAchievements = () => {
  achievementList.innerHTML = "";
  achievements.forEach((achievement) => {
    const item = document.createElement("li");
    item.className = "achievement-item";
    if (achievement.unlocked) {
      item.classList.add("unlocked");
    }
    item.innerHTML = `
      <span>${achievement.label}</span>
      <span>${achievement.unlocked ? "Unlocked" : "Locked"}</span>
    `;
    achievementList.appendChild(item);
  });
};

const showToast = (message) => {
  achievementToast.textContent = message;
  achievementToast.classList.add("show");
  setTimeout(() => {
    achievementToast.classList.remove("show");
  }, 2000);
};

const updateSoundLabel = () => {
  toggleSoundButton.textContent = `Sound: ${state.soundEnabled ? "On" : "Off"}`;
};

const updateShopState = () => {
  if (state.shopOpen) {
    shopPanel.classList.remove("is-collapsed");
  } else {
    shopPanel.classList.add("is-collapsed");
  }
};

const animatePurchase = (button) => {
  const card = button.closest(".upgrade-card");
  if (!card) {
    return;
  }
  card.classList.remove("purchased");
  void card.offsetWidth;
  card.classList.add("purchased");
  setTimeout(() => {
    card.classList.remove("purchased");
  }, 500);
};

const triggerScreenShake = () => {
  playArea.classList.remove("shake");
  void playArea.offsetWidth;
  playArea.classList.add("shake");
  setTimeout(() => {
    playArea.classList.remove("shake");
  }, 250);
};

const triggerClickBurst = () => {
  clickButton.classList.remove("burst");
  void clickButton.offsetWidth;
  clickButton.classList.add("burst");
  setTimeout(() => {
    clickButton.classList.remove("burst");
  }, 400);
};

// Update UI when state changes
const updateUI = () => {
  const roundedScore = Math.floor(state.score);
  scoreEl.textContent = roundedScore;
  walletEl.textContent = roundedScore;
  perClickEl.textContent = `+${state.pointsPerClick} per click`;
  perSecondEl.textContent = `${state.autoClickers * state.pointsPerClick} / sec`;

  upgradeClickCostEl.textContent = state.clickUpgradeCost;
  upgradeAutoCostEl.textContent = state.autoUpgradeCost;
  upgradeClickOwnedEl.textContent = `Owned: ${state.clickUpgradeOwned}`;
  upgradeAutoOwnedEl.textContent = `Owned: ${state.autoUpgradeOwned}`;
  upgradeCritCostEl.textContent = state.critUpgradeCost;
  upgradeSpeedCostEl.textContent = state.speedUpgradeCost;
  upgradeCritOwnedEl.textContent = `Owned: ${state.critUpgradeOwned}`;
  upgradeSpeedOwnedEl.textContent = `Owned: ${state.speedUpgradeOwned}`;

  upgradeClickButton.disabled = state.score < state.clickUpgradeCost;
  upgradeAutoButton.disabled = state.score < state.autoUpgradeCost;
  upgradeCritButton.disabled = state.score < state.critUpgradeCost;
  upgradeSpeedButton.disabled = state.score < state.speedUpgradeCost;
  updateSoundLabel();
  updateShopState();

  comboLabel.textContent = `Combo x${state.combo}`;
  comboFill.style.width = `${Math.min(100, state.combo * 20)}%`;
  clickButton.style.setProperty("--burst-duration", `${state.clickBurstDuration}s`);
};

// Visual feedback when clicking
const spawnFloatingPoints = (amount, isCrit = false) => {
  const point = document.createElement("span");
  point.className = "floating-point";
  point.textContent = isCrit ? `+${amount} CRIT!` : `+${amount}`;
  if (isCrit) {
    point.style.color = "var(--accent-strong)";
  }
  const offsetX = 40 + Math.random() * 80;
  const offsetY = 40 + Math.random() * 80;
  point.style.left = `${offsetX}px`;
  point.style.top = `${offsetY}px`;
  floatingPoints.appendChild(point);

  setTimeout(() => {
    point.remove();
  }, 1200);
};

// Apply achievements when conditions are met
const checkAchievements = () => {
  achievements.forEach((achievement) => {
    if (achievement.unlocked) {
      return;
    }

    const scoreMet = achievement.goal && state.score >= achievement.goal;
    const autoMet = achievement.goalAuto && state.autoClickers >= achievement.goalAuto;
    const comboMet = achievement.goalCombo && state.combo >= achievement.goalCombo;
    const clickMet = achievement.goalClicks && state.totalClicks >= achievement.goalClicks;

    if (scoreMet || autoMet || comboMet || clickMet) {
      achievement.unlocked = true;
      playTone(720, 0.2, "triangle");
      showToast(`Achievement unlocked: ${achievement.label}`);
    }
  });

  renderAchievements();
};

let saveTimeout;

const saveGame = () => {
  const payload = {
    score: state.score,
    pointsPerClick: state.pointsPerClick,
    autoClickers: state.autoClickers,
    clickUpgradeCost: state.clickUpgradeCost,
    autoUpgradeCost: state.autoUpgradeCost,
    clickUpgradeOwned: state.clickUpgradeOwned,
    autoUpgradeOwned: state.autoUpgradeOwned,
    critChance: state.critChance,
    critUpgradeCost: state.critUpgradeCost,
    critUpgradeOwned: state.critUpgradeOwned,
    speedUpgradeCost: state.speedUpgradeCost,
    speedUpgradeOwned: state.speedUpgradeOwned,
    clickBurstDuration: state.clickBurstDuration,
    achievements,
    soundEnabled: state.soundEnabled,
    totalClicks: state.totalClicks,
    combo: state.combo,
    lastClickAt: state.lastClickAt,
    volume: state.volume,
    shopOpen: state.shopOpen,
  };

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  }, 150);
};

const loadGame = () => {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) {
    return;
  }

  try {
    const payload = JSON.parse(saved);
    state.score = payload.score ?? state.score;
    state.pointsPerClick = payload.pointsPerClick ?? state.pointsPerClick;
    state.autoClickers = payload.autoClickers ?? state.autoClickers;
    state.clickUpgradeCost = payload.clickUpgradeCost ?? state.clickUpgradeCost;
    state.autoUpgradeCost = payload.autoUpgradeCost ?? state.autoUpgradeCost;
    state.clickUpgradeOwned = payload.clickUpgradeOwned ?? state.clickUpgradeOwned;
    state.autoUpgradeOwned = payload.autoUpgradeOwned ?? state.autoUpgradeOwned;
    state.critChance = payload.critChance ?? state.critChance;
    state.critUpgradeCost = payload.critUpgradeCost ?? state.critUpgradeCost;
    state.critUpgradeOwned = payload.critUpgradeOwned ?? state.critUpgradeOwned;
    state.speedUpgradeCost = payload.speedUpgradeCost ?? state.speedUpgradeCost;
    state.speedUpgradeOwned = payload.speedUpgradeOwned ?? state.speedUpgradeOwned;
    state.clickBurstDuration = payload.clickBurstDuration ?? state.clickBurstDuration;
    state.soundEnabled = payload.soundEnabled ?? state.soundEnabled;
    state.totalClicks = payload.totalClicks ?? state.totalClicks;
    state.combo = payload.combo ?? state.combo;
    state.lastClickAt = payload.lastClickAt ?? state.lastClickAt;
    state.volume = payload.volume ?? state.volume;
    state.shopOpen = payload.shopOpen ?? state.shopOpen;

    if (Array.isArray(payload.achievements)) {
      payload.achievements.forEach((savedAchievement) => {
        const match = achievements.find((item) => item.id === savedAchievement.id);
        if (match) {
          match.unlocked = savedAchievement.unlocked;
        }
      });
    }
  } catch (error) {
    console.error("Failed to load save:", error);
  }
};

// Handle clicks
clickButton.addEventListener("click", () => {
  const now = Date.now();
  if (now - state.lastClickAt < 1200) {
    state.combo = Math.min(5, state.combo + 1);
  } else {
    state.combo = 1;
  }
  state.lastClickAt = now;

  const comboBonus = state.combo >= 3 ? 1 : 0;
  const isCrit = Math.random() < state.critChance;
  const critMultiplier = isCrit ? 2 : 1;
  const earned = (state.pointsPerClick + comboBonus) * critMultiplier;
  state.score += earned;
  state.totalClicks += 1;

  spawnFloatingPoints(earned, isCrit);
  spawnParticles(8 + state.combo * 2);
  triggerScreenShake();
  triggerClickBurst();
  playTone(isCrit ? 880 : 420 + state.combo * 25, 0.12);
  updateUI();
  checkAchievements();
  saveGame();
});

// Upgrade: points per click
upgradeClickButton.addEventListener("click", () => {
  if (state.score < state.clickUpgradeCost) {
    return;
  }

  state.score -= state.clickUpgradeCost;
  state.pointsPerClick += 1;
  state.clickUpgradeCost = Math.floor(state.clickUpgradeCost * 1.6);
  state.clickUpgradeOwned += 1;
  spawnParticles(14);
  playTone(520, 0.18, "square");
  animatePurchase(upgradeClickButton);
  updateUI();
  saveGame();
});

// Upgrade: auto clicker
upgradeAutoButton.addEventListener("click", () => {
  if (state.score < state.autoUpgradeCost) {
    return;
  }

  state.score -= state.autoUpgradeCost;
  state.autoClickers += 1;
  state.autoUpgradeCost = Math.floor(state.autoUpgradeCost * 1.7);
  state.autoUpgradeOwned += 1;
  spawnParticles(16);
  playTone(620, 0.2, "square");
  animatePurchase(upgradeAutoButton);
  updateUI();
  checkAchievements();
  saveGame();
});

upgradeCritButton.addEventListener("click", () => {
  if (state.score < state.critUpgradeCost) {
    return;
  }

  state.score -= state.critUpgradeCost;
  state.critChance = Math.min(0.45, state.critChance + 0.05);
  state.critUpgradeCost = Math.floor(state.critUpgradeCost * 1.8);
  state.critUpgradeOwned += 1;
  spawnParticles(18);
  playTone(760, 0.2, "triangle");
  animatePurchase(upgradeCritButton);
  updateUI();
  saveGame();
});

upgradeSpeedButton.addEventListener("click", () => {
  if (state.score < state.speedUpgradeCost) {
    return;
  }

  state.score -= state.speedUpgradeCost;
  state.clickBurstDuration = Math.max(0.2, state.clickBurstDuration - 0.04);
  state.speedUpgradeCost = Math.floor(state.speedUpgradeCost * 1.7);
  state.speedUpgradeOwned += 1;
  spawnParticles(12);
  playTone(640, 0.16, "square");
  animatePurchase(upgradeSpeedButton);
  updateUI();
  saveGame();
});

toggleSoundButton.addEventListener("click", () => {
  state.soundEnabled = !state.soundEnabled;
  updateSoundLabel();
  saveGame();
});

resetSaveButton.addEventListener("click", () => {
  localStorage.removeItem(SAVE_KEY);
  window.location.reload();
});

toggleShopButton.addEventListener("click", () => {
  state.shopOpen = !state.shopOpen;
  updateShopState();
  saveGame();
});

// Auto clicker loop
setInterval(() => {
  if (state.autoClickers === 0) {
    return;
  }

  state.score += state.autoClickers * state.pointsPerClick;
  spawnParticles(4 + state.autoClickers);
  updateUI();
  checkAchievements();
  saveGame();
}, 1000);

setInterval(() => {
  if (state.combo > 1 && Date.now() - state.lastClickAt > 1600) {
    state.combo = 1;
    updateUI();
  }
}, 300);

window.addEventListener("resize", resizeCanvas);

loadGame();
resizeCanvas();
renderAchievements();
updateUI();
requestAnimationFrame(animateParticles);
