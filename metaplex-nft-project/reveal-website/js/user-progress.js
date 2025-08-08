// Simple user progress store with localStorage fallback
(function initProgress(global) {
  const STORAGE_KEY = 'sola:userProgress:v1';

  function load() {
    try {
      const str = localStorage.getItem(STORAGE_KEY);
      if (!str) return null;
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }

  function createInitialState(user) {
    return {
      userId: user?.uid || 'local',
      name: user?.displayName || 'Alchemist',
      level: 1,
      xp: 0,
      activeQuestIds: [],
      completedQuestIds: [],
      // cache available pool by level
      lastUnlockedLevel: 1
    };
  }

  function ensureQuestsForLevel(state) {
    const level = state.level;
    const maxConcurrent = window.maxConcurrentForLevel(level);

    // Remove any active quests above current level (safety)
    state.activeQuestIds = state.activeQuestIds.filter(id => {
      const q = window.QUEST_POOL.find(q => q.id === id);
      return q && q.requiredLevel <= level;
    });

    // If we already have enough active quests, stop
    if (state.activeQuestIds.length >= maxConcurrent) return state;

    // Unlock quests up to the level's cap
    const toUnlock = maxConcurrent - state.activeQuestIds.length;
    const candidates = window.QUEST_POOL.filter(q =>
      q.requiredLevel <= level &&
      !state.activeQuestIds.includes(q.id) &&
      !state.completedQuestIds.includes(q.id)
    ).slice(0, toUnlock);

    state.activeQuestIds.push(...candidates.map(c => c.id));
    state.lastUnlockedLevel = Math.max(state.lastUnlockedLevel, level);
    return state;
  }

  function addXp(state, amount) {
    state.xp += amount;
    // Level up while exceeding threshold; carry over remainder
    while (state.xp >= window.xpForLevel(state.level)) {
      state.xp -= window.xpForLevel(state.level);
      state.level += 1;
      // On level up, we will unlock more quests on next ensureQuestsForLevel
      toastLevelUp(state.level);
    }
    return state;
  }

  function toastLevelUp(level) {
    const el = document.createElement('div');
    el.textContent = `Level Up! You are now Level ${level}`;
    el.style.position = 'fixed';
    el.style.top = '20px';
    el.style.right = '20px';
    el.style.padding = '12px 16px';
    el.style.background = 'linear-gradient(45deg,#ffd700,#ffed4e)';
    el.style.color = '#000';
    el.style.border = '2px solid #000';
    el.style.zIndex = '9999';
    el.style.fontFamily = "'Press Start 2P', cursive";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  function getState(user) {
    const existing = load();
    if (existing && (!user || existing.userId === (user.uid || 'local'))) return existing;
    const fresh = createInitialState(user);
    save(fresh);
    return fresh;
  }

  function completeQuest(state, questId) {
    const quest = window.QUEST_POOL.find(q => q.id === questId);
    if (!quest) return state;
    const idx = state.activeQuestIds.indexOf(questId);
    if (idx === -1) return state;
    state.activeQuestIds.splice(idx, 1);
    if (!state.completedQuestIds.includes(questId)) state.completedQuestIds.push(questId);
    addXp(state, quest.rewardXp);
    ensureQuestsForLevel(state);
    return state;
  }

  global.UserProgressStore = {
    load: getState,
    save,
    ensureQuestsForLevel,
    completeQuest,
  };
})(window);


