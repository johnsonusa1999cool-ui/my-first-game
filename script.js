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
const dailyMissionList = document.querySelector("#daily-mission-list");
const missionResetEl = document.querySelector("#mission-reset");
const toggleSoundButton = document.querySelector("#toggle-sound");
const resetSaveButton = document.querySelector("#reset-save");
const toggleShopButton = document.querySelector("#toggle-shop");
const walletEl = document.querySelector("#wallet");
const particleCanvas = document.querySelector("#particle-canvas");
const comboLabel = document.querySelector("#combo-label");
const comboFill = document.querySelector("#combo-fill");
const achievementToast = document.querySelector("#achievement-toast");
const achievementRewardPopup = document.querySelector("#achievement-reward-popup");
const achievementRewardLabel = document.querySelector("#achievement-reward-label");
const achievementRewardText = document.querySelector("#achievement-reward-text");
const achievementRewardClose = document.querySelector("#achievement-reward-close");
const playArea = document.querySelector("#play-area");
const shopPanel = document.querySelector("#shop-panel");
const offlinePopup = document.querySelector("#offline-popup");
const offlineEarned = document.querySelector("#offline-earned");
const offlineTime = document.querySelector("#offline-time");
const offlineClaimButton = document.querySelector("#offline-claim");
const prestigeLabel = document.querySelector("#prestige-label");
const openPrestigeButton = document.querySelector("#open-prestige");
const prestigePopup = document.querySelector("#prestige-popup");
const prestigeMessage = document.querySelector("#prestige-message");
const prestigeCancelButton = document.querySelector("#prestige-cancel");
const prestigeConfirmButton = document.querySelector("#prestige-confirm");
const prestigeLevelEl = document.querySelector("#prestige-level");
const prestigeRequirementEl = document.querySelector("#prestige-requirement");
const prestigeCurrentEl = document.querySelector("#prestige-current");
const prestigeRewardEl = document.querySelector("#prestige-reward");
const energyFillEl = document.querySelector("#energy-fill");
const energyStatusEl = document.querySelector("#energy-status");
const reactorStateEl = document.querySelector("#reactor-state");
const reactorTimerEl = document.querySelector("#reactor-boost-timer");

const SAVE_KEY = "neon-clicker-save";
const LAST_PLAYED_KEY = "neon-clicker-last-played";
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
const DAILY_MISSION_KEY = "neon-clicker-daily-missions";
const OVERLOAD_DURATION_MS = 10000;
const ANALYTICS_KEY = "neon-clicker-analytics";
const MAX_ANALYTICS_EVENTS = 200;
const GAME_EVENT_KEY = "neon-clicker-game-events";
const MAX_GAME_EVENTS = 300;
const MAX_PARTICLES = 240;

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
  prestigePoints: 0,
  totalEarnedThisRun: 0,
  energy: 0,
  overloadUntil: 0,
  locale: "ru",
  achievementBoostUntil: 0,
};

let displayedScore = 0;
let offlineCountFrame;
let scorePopTimeout;
let previousScoreLabel = "";
let dailyMissions = [];
let lastMissionSignature = "";
let lastOfflineReward = 0;

const i18n = {
  ru: {
    score: "Очки",
    perClick: "за клик",
    perSecond: " / сек",
    combo: "Комбо",
    energy: "Энергия",
    energyOverload: "ПЕРЕГРУЗ",
    soundOn: "Звук: Вкл",
    soundOff: "Звук: Выкл",
    shop: "Магазин",
    language: "Язык",
    prestigeNeedMore: "Нужно больше очков",
    prestigeAction: "Престиж",
    reactorStable: "Стабильно",
    reactorChargeHint: "Зарядите ядро до перегруза",
    reactorOverloadState: "ПЕРЕГРУЗ x2",
    reactorOverloadTimer: "Перегруз закончится через",
    missionResets: "Сброс",
    missionComplete: "Ежедневное задание выполнено",
    overloadActivated: "Энергоперегруз активирован! x2 к очкам",
    awayFor: "Не в игре",
    points: "очков",
    unlocked: "Открыто",
    claimed: "Получено",
    unclaimed: "Не получено",
    reward: "Награда",
    dailyClicks: "Сделайте 200 кликов",
    dailyScore: "Наберите 15K очков",
    dailyAuto: "Купите 8 автокликеров",
    achievementUnlocked: "Достижение открыто",
    earnMorePrestige: "Наберите больше очков для престижа",
    prestigeConfirm: "Подтвердите сброс престижа за +{gain} очков престижа?",
    prestigeSuccess: "Престиж +{gain}! Постоянный множитель увеличен.",
    offlinePointsSuffix: "очков",
    dailyResetLabel: "Сброс",
    bonusCoins: "бонусных монет",
    tempMultiplier: "к очкам на",
    seconds: "сек",
    permanentClick: "к силе клика навсегда",
    bought: "Куплено",
    crit: "КРИТ!",
    prestigeLabel: "Престиж",
    prestigeLevel: "Уровень престижа",
    requirement: "Требование",
    currentProgress: "Текущий прогресс",
    rewardValue: "Награда",
    scoreSuffix: "очков",
    achievementFirstClick: "Первый клик!",
    achievementClickFiend: "50 кликов",
    achievementTapMachine: "500 кликов",
    achievementHundred: "100 очков",
    achievementFiveK: "5K очков",
    achievementFiftyK: "50K очков",
    achievementUpgradeHunter: "Купить 5 улучшений",
    achievementUpgradeMaster: "Купить 20 улучшений",
    achievementFirstAuto: "Автоматизация включена",
  },
  en: {
    score: "Score",
    perClick: "per click",
    perSecond: " / sec",
    combo: "Combo",
    energy: "Energy",
    energyOverload: "OVERLOAD",
    soundOn: "Sound: On",
    soundOff: "Sound: Off",
    shop: "Shop",
    prestigeNeedMore: "Need more points",
    prestigeAction: "Prestige",
    reactorStable: "Stable",
    reactorChargeHint: "Charge the core to overload",
    reactorOverloadState: "OVERLOAD x2",
    reactorOverloadTimer: "Overload ends in",
    missionComplete: "Daily mission completed",
    overloadActivated: "Energy overload activated! x2 score",
    awayFor: "Away for",
    points: "points",
    unlocked: "Unlocked",
    claimed: "Claimed",
    unclaimed: "Unclaimed",
    reward: "Reward",
    dailyClicks: "Do 200 clicks",
    dailyScore: "Reach 15K score",
    dailyAuto: "Buy 8 auto clickers",
    achievementUnlocked: "Achievement unlocked",
    earnMorePrestige: "Earn more points for prestige",
    prestigeConfirm: "Confirm prestige reset for +{gain} prestige points?",
    prestigeSuccess: "Prestige +{gain}! Permanent multiplier increased.",
    bonusCoins: "bonus coins",
    tempMultiplier: "to score for",
    seconds: "sec",
    permanentClick: "to click power permanently",
    bought: "Bought",
    crit: "CRIT!",
    prestigeLabel: "Prestige",
    prestigeLevel: "Prestige Level",
    requirement: "Requirement",
    currentProgress: "Current",
    rewardValue: "Reward",
    scoreSuffix: "points",
    achievementFirstClick: "First click!",
    achievementClickFiend: "50 clicks",
    achievementTapMachine: "500 clicks",
    achievementHundred: "100 score",
    achievementFiveK: "5K score",
    achievementFiftyK: "50K score",
    achievementUpgradeHunter: "Buy 5 upgrades",
    achievementUpgradeMaster: "Buy 20 upgrades",
    achievementFirstAuto: "Automation online",
  },
};

const normalizeLocale = (value) => (value && i18n[value] ? value : "ru");
const t = (key) => i18n[state.locale]?.[key] ?? i18n.ru[key] ?? key;

const logAnalyticsEvent = (name, payload = {}) => {
  try {
    const now = Date.now();
    const existing = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "[]");
    if (!Array.isArray(existing)) {
      return;
    }
    existing.push({ name, payload, at: now });
    if (existing.length > MAX_ANALYTICS_EVENTS) {
      existing.splice(0, existing.length - MAX_ANALYTICS_EVENTS);
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(existing));
  } catch {
    // noop
  }
};

const storeGameEventLocally = (name, data = {}) => {
  try {
    const existing = JSON.parse(localStorage.getItem(GAME_EVENT_KEY) || "[]");
    if (!Array.isArray(existing)) {
      return;
    }
    existing.push({ name, data, at: Date.now() });
    if (existing.length > MAX_GAME_EVENTS) {
      existing.splice(0, existing.length - MAX_GAME_EVENTS);
    }
    localStorage.setItem(GAME_EVENT_KEY, JSON.stringify(existing));
  } catch {
    // noop
  }
};

const sendGameEvent = (name, data = {}) => {
  console.log("EVENT", name, data);
  storeGameEventLocally(name, data);

  const sdk = window.ysdk;
  if (!sdk || typeof sdk.reportEvent !== "function") {
    return;
  }

  try {
    sdk.reportEvent(name, data);
  } catch (error) {
    console.log("ysdk.reportEvent fallback", error);
  }
};

const safeNumber = (value, fallback = 0, min = -Infinity, max = Infinity) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
};

const applyStaticLocale = () => {
  const labelEl = document.querySelector('.score-card .label');
  if (labelEl) {
    labelEl.textContent = t('score');
  }
  toggleShopButton.textContent = t('shop');
  document.querySelector('.energy-header span').textContent = t('energy');
};

const resolveInitialLocale = () => {
  state.locale = normalizeLocale(window.gameLang);
};

const applyTranslations = (localeInput) => {
  const nextLocale = normalizeLocale(typeof localeInput === "string" ? localeInput : window.gameLang);
  state.locale = nextLocale;
  window.gameLang = nextLocale;
  applyStaticLocale();
  renderAchievements();
  updateUI();
};

window.i18n = i18n;
window.applyTranslations = applyTranslations;

const getAchievementBoostMultiplier = () => (Date.now() < state.achievementBoostUntil ? 1.5 : 1);

const getAchievementRewardDescription = (achievement) => {
  if (achievement.reward.type === "coins") {
    return `+${formatNumber(achievement.reward.amount)} ${t("bonusCoins")}`;
  }
  if (achievement.reward.type === "temp_multiplier") {
    return `x${achievement.reward.multiplier.toFixed(1)} ${t("tempMultiplier")} ${Math.round(achievement.reward.durationMs / 1000)} ${t("seconds")}`;
  }
  return `+${formatNumber(achievement.reward.amount)} ${t("permanentClick")}`;
};

const showAchievementRewardPopup = (achievement) => {
  achievementRewardLabel.textContent = t(achievement.labelKey);
  achievementRewardText.textContent = getAchievementRewardDescription(achievement);
  achievementRewardPopup.classList.remove("closing");
  achievementRewardPopup.classList.add("show");
};

const applyAchievementReward = (achievement) => {
  if (achievement.rewardClaimed) {
    return;
  }

  if (achievement.reward.type === "coins") {
    state.score += achievement.reward.amount;
  }

  if (achievement.reward.type === "temp_multiplier") {
    state.achievementBoostUntil = Math.max(state.achievementBoostUntil, Date.now() + achievement.reward.durationMs);
  }

  if (achievement.reward.type === "permanent_click") {
    state.pointsPerClick += achievement.reward.amount;
  }

  achievement.rewardClaimed = true;
  showAchievementRewardPopup(achievement);
  logAnalyticsEvent("achievement_reward_claimed", { id: achievement.id, reward: achievement.reward.type });
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const buildDailyMissions = () => ([
  { id: "mission-clicks", label: t("dailyClicks"), type: "clicks", target: 200, progress: 0, completed: false },
  { id: "mission-score", label: t("dailyScore"), type: "score", target: 15000, progress: 0, completed: false },
  { id: "mission-auto", label: t("dailyAuto"), type: "auto", target: 8, progress: 0, completed: false },
]);

const getOverloadMultiplier = () => (Date.now() < state.overloadUntil ? 2 : 1);

const getCoreLabel = () => {
  if (getOverloadMultiplier() > 1) {
    const secondsLeft = Math.max(0, Math.ceil((state.overloadUntil - Date.now()) / 1000));
    return { stateLabel: t("reactorOverloadState"), timerLabel: `${t("reactorOverloadTimer")} ${secondsLeft} ${t("seconds")}` };
  }
  return { stateLabel: t("reactorStable"), timerLabel: t("reactorChargeHint") };
};

const refreshEnergyUI = () => {
  energyFillEl.style.width = `${Math.min(100, state.energy)}%`;
  energyStatusEl.textContent = getOverloadMultiplier() > 1 ? t("energyOverload") : `${Math.floor(state.energy)}%`;
  const labels = getCoreLabel();
  reactorStateEl.textContent = labels.stateLabel;
  reactorTimerEl.textContent = labels.timerLabel;
};

const updateDailyMissions = () => {
  dailyMissions.forEach((mission) => {
    if (mission.type === "clicks") {
      mission.progress = state.totalClicks;
    }
    if (mission.type === "score") {
      mission.progress = state.totalEarnedThisRun;
    }
    if (mission.type === "auto") {
      mission.progress = state.autoClickers;
    }

    const wasComplete = mission.completed;
    mission.completed = mission.progress >= mission.target;
    if (!wasComplete && mission.completed) {
      showToast(`${t("missionComplete")}: ${mission.label}`);
      logAnalyticsEvent("daily_mission_completed", { id: mission.id });
    }
  });
};

const renderDailyMissions = () => {
  dailyMissionList.innerHTML = "";
  dailyMissions.forEach((mission) => {
    const li = document.createElement("li");
    li.className = "daily-mission-item";
    if (mission.completed) {
      li.classList.add("completed");
    }
    li.innerHTML = `<span>${mission.label}</span><span>${formatNumber(Math.min(mission.progress, mission.target))}/${formatNumber(mission.target)}</span>`;
    dailyMissionList.appendChild(li);
  });

  const signature = JSON.stringify(dailyMissions.map((mission) => ({ id: mission.id, progress: mission.progress, completed: mission.completed })));
  if (signature !== lastMissionSignature) {
    lastMissionSignature = signature;
    localStorage.setItem(DAILY_MISSION_KEY, JSON.stringify({ day: getTodayKey(), missions: dailyMissions }));
  }

  missionResetEl.textContent = `${t("missionResets")}: ${getTodayKey()}`;
};

const hydrateDailyMissions = () => {
  const raw = localStorage.getItem(DAILY_MISSION_KEY);
  if (!raw) {
    dailyMissions = buildDailyMissions();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed.day !== getTodayKey() || !Array.isArray(parsed.missions)) {
      dailyMissions = buildDailyMissions();
      return;
    }

    const template = buildDailyMissions();
    dailyMissions = template.map((mission) => {
      const saved = parsed.missions.find((item) => item.id === mission.id);
      if (!saved) {
        return mission;
      }
      return { ...mission, progress: saved.progress ?? 0, completed: !!saved.completed };
    });
  } catch {
    dailyMissions = buildDailyMissions();
  }
};

const formatNumber = (value) => {
  const absValue = Math.abs(value);
  if (absValue < 1000) {
    return Math.floor(value).toString();
  }

  const suffixes = [
    { limit: 1e12, suffix: "T" },
    { limit: 1e9, suffix: "B" },
    { limit: 1e6, suffix: "M" },
    { limit: 1e3, suffix: "K" },
  ];

  const matched = suffixes.find((entry) => absValue >= entry.limit);
  const shortValue = value / matched.limit;
  const precision = shortValue >= 100 ? 0 : shortValue >= 10 ? 1 : 2;
  return `${shortValue.toFixed(precision)}${matched.suffix}`;
};

const updateAnimatedScore = () => {
  displayedScore += (state.score - displayedScore) * 0.16;
  if (Math.abs(state.score - displayedScore) < 0.05) {
    displayedScore = state.score;
  }

  const scoreLabel = formatNumber(displayedScore);
  scoreEl.textContent = scoreLabel;
  walletEl.textContent = scoreLabel;

  if (scoreLabel !== previousScoreLabel) {
    previousScoreLabel = scoreLabel;
    scoreEl.classList.remove("score-pop");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("score-pop");
    if (scorePopTimeout) {
      clearTimeout(scorePopTimeout);
    }
    scorePopTimeout = setTimeout(() => {
      scoreEl.classList.remove("score-pop");
    }, 220);
  }
};


const getPrestigeMultiplier = () => 1 + state.prestigePoints * 0.1;

const addScore = (baseAmount) => {
  const boostedAmount = Math.floor(baseAmount * getPrestigeMultiplier() * getOverloadMultiplier() * getAchievementBoostMultiplier());
  state.score += boostedAmount;
  state.totalEarnedThisRun += boostedAmount;
  return boostedAmount;
};

const getPrestigeGain = () => Math.floor(Math.sqrt(state.totalEarnedThisRun / 50000));

const getNextPrestigeRequirement = () => {
  const nextTier = getPrestigeGain() + 1;
  return 50000 * nextTier * nextTier;
};

const updatePrestigeLabel = () => {
  const gain = getPrestigeGain();
  prestigeLabel.textContent = `${t("prestigeLabel")}: ${formatNumber(state.prestigePoints)} (x${getPrestigeMultiplier().toFixed(1)})`;
  prestigeLevelEl.textContent = `${t("prestigeLevel")}: ${formatNumber(state.prestigePoints)}`;
  prestigeRequirementEl.textContent = `${t("requirement")}: ${formatNumber(getNextPrestigeRequirement())} ${t("scoreSuffix")}`;
  prestigeCurrentEl.textContent = `${t("currentProgress")}: ${formatNumber(state.totalEarnedThisRun)}`;
  prestigeRewardEl.textContent = `${t("rewardValue")}: +${(gain * 0.1).toFixed(1)}x`;
  openPrestigeButton.disabled = gain <= 0;
  openPrestigeButton.textContent = gain > 0 ? `${t("prestigeAction")} +${gain}` : t("prestigeNeedMore");
};

const resetProgressForPrestige = () => {
  state.score = 0;
  state.pointsPerClick = 1;
  state.autoClickers = 0;
  state.clickUpgradeCost = 10;
  state.autoUpgradeCost = 25;
  state.clickUpgradeOwned = 0;
  state.autoUpgradeOwned = 0;
  state.critChance = 0;
  state.critUpgradeCost = 40;
  state.critUpgradeOwned = 0;
  state.speedUpgradeCost = 30;
  state.speedUpgradeOwned = 0;
  state.clickBurstDuration = 0.4;
  state.totalClicks = 0;
  state.combo = 1;
  state.totalEarnedThisRun = 0;
  state.achievementBoostUntil = 0;

  achievements.forEach((achievement) => {
    achievement.unlocked = false;
    achievement.rewardClaimed = false;
  });

  renderAchievements();
  updateUI();
  saveGame();
};

// Achievement definitions
const achievements = [
  { id: "first-click", labelKey: "achievementFirstClick", type: "clicks", target: 1, unlocked: false, rewardClaimed: false, reward: { type: "coins", amount: 120 } },
  { id: "click-fiend", labelKey: "achievementClickFiend", type: "clicks", target: 50, unlocked: false, rewardClaimed: false, reward: { type: "temp_multiplier", multiplier: 1.5, durationMs: 12000 } },
  { id: "tap-machine", labelKey: "achievementTapMachine", type: "clicks", target: 500, unlocked: false, rewardClaimed: false, reward: { type: "permanent_click", amount: 1 } },
  { id: "hundred", labelKey: "achievementHundred", type: "score", target: 100, unlocked: false, rewardClaimed: false, reward: { type: "coins", amount: 180 } },
  { id: "five-k", labelKey: "achievementFiveK", type: "score", target: 5000, unlocked: false, rewardClaimed: false, reward: { type: "temp_multiplier", multiplier: 1.5, durationMs: 15000 } },
  { id: "fifty-k", labelKey: "achievementFiftyK", type: "score", target: 50000, unlocked: false, rewardClaimed: false, reward: { type: "permanent_click", amount: 2 } },
  { id: "upgrade-hunter", labelKey: "achievementUpgradeHunter", type: "upgrades", target: 5, unlocked: false, rewardClaimed: false, reward: { type: "coins", amount: 260 } },
  { id: "upgrade-master", labelKey: "achievementUpgradeMaster", type: "upgrades", target: 20, unlocked: false, rewardClaimed: false, reward: { type: "permanent_click", amount: 1 } },
  { id: "first-auto", labelKey: "achievementFirstAuto", type: "auto", target: 1, unlocked: false, rewardClaimed: false, reward: { type: "coins", amount: 220 } },
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
  const availableSlots = Math.max(0, MAX_PARTICLES - particles.length);
  const count = Math.min(amount, availableSlots);
  for (let i = 0; i < count; i += 1) {
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
  updateAnimatedScore();
  requestAnimationFrame(animateParticles);
};



const getTotalUpgradesBought = () =>
  state.clickUpgradeOwned +
  state.autoUpgradeOwned +
  state.critUpgradeOwned +
  state.speedUpgradeOwned;

const getAchievementProgress = (achievement) => {
  if (achievement.type === "clicks") {
    return { current: state.totalClicks, target: achievement.target };
  }
  if (achievement.type === "score") {
    return { current: state.score, target: achievement.target };
  }
  if (achievement.type === "upgrades") {
    return { current: getTotalUpgradesBought(), target: achievement.target };
  }
  if (achievement.type === "auto") {
    return { current: state.autoClickers, target: achievement.target };
  }
  return { current: 0, target: achievement.target };
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
    const progress = getAchievementProgress(achievement);
    const progressLabel = achievement.unlocked ? t("unlocked") : `${formatNumber(Math.min(progress.current, progress.target))}/${formatNumber(progress.target)}`;
    item.innerHTML = `
      <div class="achievement-main-row">
        <span>${t(achievement.labelKey)}</span>
        <span>${progressLabel}</span>
      </div>
      <div class="achievement-reward-row">
        <span class="achievement-reward-text">${t("reward")}: ${getAchievementRewardDescription(achievement)}</span>
        <span class="achievement-claim-state ${achievement.rewardClaimed ? "claimed" : "unclaimed"}">${achievement.rewardClaimed ? t("claimed") : t("unclaimed")}</span>
      </div>
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
  toggleSoundButton.textContent = state.soundEnabled ? t("soundOn") : t("soundOff");
};


const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const animateOfflineRewardValue = (target) => {
  if (offlineCountFrame) {
    cancelAnimationFrame(offlineCountFrame);
  }

  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(progress);
    const currentValue = Math.floor(target * eased);
    offlineEarned.textContent = `${formatNumber(currentValue)} ${t("points")}`;

    if (progress < 1) {
      offlineCountFrame = requestAnimationFrame(tick);
      return;
    }

    offlineEarned.textContent = `${formatNumber(target)} ${t("points")}`;
  };

  offlineCountFrame = requestAnimationFrame(tick);
};


const showOfflinePopup = (earned, offlineSeconds) => {
  animateOfflineRewardValue(earned);
  if (offlineSeconds > 0) {
    const hours = Math.floor(offlineSeconds / 3600);
    const minutes = Math.floor((offlineSeconds % 3600) / 60);
    offlineTime.textContent = `${t("awayFor")} ${hours}h ${minutes}m`;
  } else {
    offlineTime.textContent = "";
  }

  offlinePopup.classList.remove("closing");
  offlinePopup.classList.add("show");
};

const checkOfflineEarnings = () => {
  const lastPlayedRaw = localStorage.getItem(LAST_PLAYED_KEY);
  if (!lastPlayedRaw) {
    return;
  }

  const lastPlayed = Number(lastPlayedRaw);
  if (Number.isNaN(lastPlayed)) {
    return;
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - lastPlayed) / 1000));
  const effectiveSeconds = Math.min(elapsedSeconds, MAX_OFFLINE_SECONDS);
  const passivePerSecond = state.autoClickers * state.pointsPerClick;
  const offlineEarned = Math.floor(effectiveSeconds * passivePerSecond);

  if (offlineEarned > 0) {
    const finalOfflineEarned = addScore(offlineEarned);
    lastOfflineReward = finalOfflineEarned;
    spawnParticles(24);
    showOfflinePopup(finalOfflineEarned, effectiveSeconds);
  }
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

const triggerCriticalShake = () => {
  playArea.classList.remove("crit-shake");
  void playArea.offsetWidth;
  playArea.classList.add("crit-shake");
  setTimeout(() => {
    playArea.classList.remove("crit-shake");
  }, 180);
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
  perClickEl.textContent = `+${formatNumber(state.pointsPerClick)} ${t("perClick")}`;
  perSecondEl.textContent = `${formatNumber(state.autoClickers * state.pointsPerClick)}${t("perSecond")}`;

  upgradeClickCostEl.textContent = formatNumber(state.clickUpgradeCost);
  upgradeAutoCostEl.textContent = formatNumber(state.autoUpgradeCost);
  upgradeClickOwnedEl.textContent = `${t("bought")}: ${state.clickUpgradeOwned}`;
  upgradeAutoOwnedEl.textContent = `${t("bought")}: ${state.autoUpgradeOwned}`;
  upgradeCritCostEl.textContent = formatNumber(state.critUpgradeCost);
  upgradeSpeedCostEl.textContent = formatNumber(state.speedUpgradeCost);
  upgradeCritOwnedEl.textContent = `${t("bought")}: ${state.critUpgradeOwned}`;
  upgradeSpeedOwnedEl.textContent = `${t("bought")}: ${state.speedUpgradeOwned}`;

  upgradeClickButton.disabled = state.score < state.clickUpgradeCost;
  upgradeAutoButton.disabled = state.score < state.autoUpgradeCost;
  upgradeCritButton.disabled = state.score < state.critUpgradeCost;
  upgradeSpeedButton.disabled = state.score < state.speedUpgradeCost;
  updateSoundLabel();
  updateShopState();

  comboLabel.textContent = `${t("combo")} x${state.combo}`;
  comboFill.style.width = `${Math.min(100, state.combo * 20)}%`;
  clickButton.style.setProperty("--burst-duration", `${state.clickBurstDuration}s`);
  updatePrestigeLabel();
  refreshEnergyUI();
  updateDailyMissions();
  renderDailyMissions();
};

// Visual feedback when clicking
const spawnFloatingPoints = (amount, isCrit = false) => {
  const point = document.createElement("span");
  point.className = "floating-point";
  point.textContent = isCrit ? `+${formatNumber(amount)} ${t("crit")}` : `+${formatNumber(amount)}`;
  if (isCrit) {
    point.classList.add("crit");
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

    const progress = getAchievementProgress(achievement);
    if (progress.current >= progress.target) {
      achievement.unlocked = true;
      playTone(720, 0.2, "triangle");
      showToast(`${t("achievementUnlocked")}: ${t(achievement.labelKey)}`);
      applyAchievementReward(achievement);
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
    prestigePoints: state.prestigePoints,
    totalEarnedThisRun: state.totalEarnedThisRun,
    energy: state.energy,
    overloadUntil: state.overloadUntil,
    achievementBoostUntil: state.achievementBoostUntil,
  };

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    localStorage.setItem(LAST_PLAYED_KEY, String(Date.now()));
  }, 150);
};

const loadGame = () => {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) {
    return;
  }

  try {
    const payload = JSON.parse(saved);
    state.score = safeNumber(payload.score, state.score, 0);
    state.pointsPerClick = safeNumber(payload.pointsPerClick, state.pointsPerClick, 1);
    state.autoClickers = safeNumber(payload.autoClickers, state.autoClickers, 0);
    state.clickUpgradeCost = safeNumber(payload.clickUpgradeCost, state.clickUpgradeCost, 1);
    state.autoUpgradeCost = safeNumber(payload.autoUpgradeCost, state.autoUpgradeCost, 1);
    state.clickUpgradeOwned = safeNumber(payload.clickUpgradeOwned, state.clickUpgradeOwned, 0);
    state.autoUpgradeOwned = safeNumber(payload.autoUpgradeOwned, state.autoUpgradeOwned, 0);
    state.critChance = safeNumber(payload.critChance, state.critChance, 0, 0.45);
    state.critUpgradeCost = safeNumber(payload.critUpgradeCost, state.critUpgradeCost, 1);
    state.critUpgradeOwned = safeNumber(payload.critUpgradeOwned, state.critUpgradeOwned, 0);
    state.speedUpgradeCost = safeNumber(payload.speedUpgradeCost, state.speedUpgradeCost, 1);
    state.speedUpgradeOwned = safeNumber(payload.speedUpgradeOwned, state.speedUpgradeOwned, 0);
    state.clickBurstDuration = safeNumber(payload.clickBurstDuration, state.clickBurstDuration, 0.1, 1);
    state.soundEnabled = payload.soundEnabled ?? state.soundEnabled;
    state.totalClicks = safeNumber(payload.totalClicks, state.totalClicks, 0);
    state.combo = safeNumber(payload.combo, state.combo, 1, 5);
    state.lastClickAt = safeNumber(payload.lastClickAt, state.lastClickAt, 0);
    state.volume = safeNumber(payload.volume, state.volume, 0, 1);
    state.shopOpen = payload.shopOpen ?? state.shopOpen;
    state.prestigePoints = safeNumber(payload.prestigePoints, state.prestigePoints, 0);
    state.totalEarnedThisRun = safeNumber(payload.totalEarnedThisRun, state.totalEarnedThisRun, 0);
    state.energy = safeNumber(payload.energy, state.energy, 0, 100);
    state.overloadUntil = safeNumber(payload.overloadUntil, state.overloadUntil, 0);
    state.achievementBoostUntil = safeNumber(payload.achievementBoostUntil, state.achievementBoostUntil, 0);

    if (Array.isArray(payload.achievements)) {
      payload.achievements.forEach((savedAchievement) => {
        const match = achievements.find((item) => item.id === savedAchievement.id);
        if (match) {
          match.unlocked = savedAchievement.unlocked;
          match.rewardClaimed = savedAchievement.rewardClaimed ?? (savedAchievement.unlocked ? true : false);
        }
      });
    }
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
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
  const finalEarned = addScore(earned);
  state.totalClicks += 1;
  sendGameEvent("click", { totalClicks: state.totalClicks, earned: finalEarned, crit: isCrit });

  state.energy = Math.min(100, state.energy + 7 + state.combo * 0.8);
  if (state.energy >= 100) {
    state.energy = 0;
    state.overloadUntil = Date.now() + OVERLOAD_DURATION_MS;
    spawnParticles(24);
    showToast(t("overloadActivated"));
    logAnalyticsEvent("energy_overload_activated", { combo: state.combo, totalClicks: state.totalClicks });
  }

  spawnFloatingPoints(finalEarned, isCrit);
  spawnParticles(8 + state.combo * 2);
  triggerScreenShake();
  if (isCrit) {
    triggerCriticalShake();
  }
  triggerClickBurst();
  playTone(isCrit ? 880 : 420 + state.combo * 25, 0.12);
  updateUI();
  checkAchievements();
  saveGame();
  if (state.totalClicks % 25 === 0) {
    logAnalyticsEvent("click_batch", { totalClicks: state.totalClicks, score: state.score });
  }
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
  logAnalyticsEvent("upgrade_purchase", { type: "click", owned: state.clickUpgradeOwned });
  sendGameEvent("upgrade_buy", { type: "click", level: state.clickUpgradeOwned });
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
  logAnalyticsEvent("upgrade_purchase", { type: "auto", owned: state.autoUpgradeOwned });
  sendGameEvent("upgrade_buy", { type: "auto", level: state.autoUpgradeOwned });
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
  logAnalyticsEvent("upgrade_purchase", { type: "crit", owned: state.critUpgradeOwned });
  sendGameEvent("upgrade_buy", { type: "crit", level: state.critUpgradeOwned });
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
  logAnalyticsEvent("upgrade_purchase", { type: "speed", owned: state.speedUpgradeOwned });
  sendGameEvent("upgrade_buy", { type: "speed", level: state.speedUpgradeOwned });
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

openPrestigeButton.addEventListener("click", () => {
  const gain = getPrestigeGain();
  if (gain <= 0) {
    showToast(t("earnMorePrestige"));
    return;
  }
  prestigeMessage.textContent = `Вы уверены? Это сбросит прогресс. Вы получите +${gain} очков престижа.`;
  prestigePopup.classList.add("show");
});

prestigeCancelButton.addEventListener("click", () => {
  prestigePopup.classList.remove("show");
});

prestigeConfirmButton.addEventListener("click", () => {
  const gain = getPrestigeGain();
  if (gain <= 0) {
    prestigePopup.classList.remove("show");
    return;
  }

  const approved = window.confirm(t("prestigeConfirm").replace("{gain}", gain));
  if (!approved) {
    return;
  }

  state.prestigePoints += gain;
  sendGameEvent("prestige", { gain, prestigePoints: state.prestigePoints });
  prestigePopup.classList.remove("show");
  showToast(t("prestigeSuccess").replace("{gain}", gain));
  resetProgressForPrestige();
});

achievementRewardClose.addEventListener("click", () => {
  achievementRewardPopup.classList.add("closing");
  setTimeout(() => {
    achievementRewardPopup.classList.remove("show");
    achievementRewardPopup.classList.remove("closing");
  }, 180);
});

offlineClaimButton.addEventListener("click", () => {
  if (lastOfflineReward > 0) {
    sendGameEvent("offline_claim", { reward: lastOfflineReward });
    lastOfflineReward = 0;
  }

  if (offlineCountFrame) {
    cancelAnimationFrame(offlineCountFrame);
  }
  offlinePopup.classList.add("closing");
  setTimeout(() => {
    offlinePopup.classList.remove("show");
    offlinePopup.classList.remove("closing");
  }, 220);
});

window.addEventListener("contextmenu", (event) => {
  event.preventDefault();
}, { passive: false });

window.addEventListener("selectstart", (event) => {
  event.preventDefault();
}, { passive: false });

window.addEventListener("beforeunload", () => {
  localStorage.setItem(LAST_PLAYED_KEY, String(Date.now()));
});

// Auto clicker loop
setInterval(() => {
  if (state.autoClickers === 0) {
    return;
  }

  addScore(state.autoClickers * state.pointsPerClick);
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

  if (state.overloadUntil && Date.now() > state.overloadUntil) {
    state.overloadUntil = 0;
    updateUI();
  }

  if (state.achievementBoostUntil && Date.now() > state.achievementBoostUntil) {
    state.achievementBoostUntil = 0;
    updateUI();
  }

  refreshEnergyUI();
}, 300);

window.addEventListener("resize", resizeCanvas);

resolveInitialLocale();
hydrateDailyMissions();
loadGame();
checkOfflineEarnings();
displayedScore = state.score;
resizeCanvas();
renderAchievements();
applyStaticLocale();
updateUI();
saveGame();
sendGameEvent("session_start", { locale: state.locale });
requestAnimationFrame(animateParticles);
