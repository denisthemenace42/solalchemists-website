// Quest definitions and helpers
// Each quest: { id, title, description, rewardXp, requiredLevel }

(function initQuestData(global) {
  const QUEST_POOL = [
    // Level 1
    { id: 'q1', title: 'Greet the Alchemy Circle', description: 'Introduce yourself in the community.', rewardXp: 100, requiredLevel: 1 },
    // Level 2
    { id: 'q2', title: 'Stoke the Ethereal Fire', description: 'Share SOL Alchemists with a friend.', rewardXp: 120, requiredLevel: 2 },
    // Level 3 (two concurrent)
    { id: 'q3', title: 'Collect Moon Dew', description: 'Engage with a post: like or retweet.', rewardXp: 150, requiredLevel: 3 },
    { id: 'q4', title: 'Trace a Sigil', description: 'Comment on a community update.', rewardXp: 160, requiredLevel: 3 },
    // Level 4 (three concurrent)
    { id: 'q5', title: 'Refine Base Metals', description: 'Invite two friends to join.', rewardXp: 180, requiredLevel: 4 },
    { id: 'q6', title: 'Harvest Starflowers', description: 'Create a fan post or meme.', rewardXp: 180, requiredLevel: 4 },
    { id: 'q7', title: 'Brew Minor Elixir', description: 'Complete a daily login streak (3 days).', rewardXp: 200, requiredLevel: 4 },
    // Level 5+ (cap 4 concurrent)
    { id: 'q8', title: 'Decode Ancient Runes', description: 'Solve a community puzzle.', rewardXp: 220, requiredLevel: 5 },
    { id: 'q9', title: 'Purify Dragon Scales', description: 'Contribute helpful feedback.', rewardXp: 240, requiredLevel: 5 },
    { id: 'q10', title: 'Calibrate the Alembic', description: 'Help someone onboard a wallet.', rewardXp: 250, requiredLevel: 5 }
  ];

  function xpForLevel(level) {
    return 100 * level;
  }

  function maxConcurrentForLevel(level) {
    if (level <= 1) return 1;
    if (level === 2) return 1;
    if (level === 3) return 2;
    if (level >= 4 && level < 5) return 3;
    return 4; // level 5+
  }

  global.QUEST_POOL = QUEST_POOL;
  global.xpForLevel = xpForLevel;
  global.maxConcurrentForLevel = maxConcurrentForLevel;
})(window);


