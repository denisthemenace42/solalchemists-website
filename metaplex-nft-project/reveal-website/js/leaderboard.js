// Simple mock leaderboard with local merge
(function initLeaderboard(global){
  function fetchMockLeaderboard(){
    // Mock top players
    return [
      { id: 'u1', name: 'Azoth', level: 6, xp: 80 },
      { id: 'u2', name: 'Nigredo', level: 5, xp: 90 },
      { id: 'u3', name: 'Rubedo', level: 5, xp: 20 },
      { id: 'u4', name: 'Mercury', level: 4, xp: 70 },
      { id: 'u5', name: 'Vitriol', level: 4, xp: 10 },
      { id: 'u6', name: 'Cinnabar', level: 3, xp: 80 },
      { id: 'u7', name: 'Orpiment', level: 3, xp: 60 },
      { id: 'u8', name: 'Antimony', level: 2, xp: 40 },
      { id: 'u9', name: 'Bismuth', level: 2, xp: 20 },
      { id: 'u10', name: 'Salt', level: 2, xp: 10 }
    ];
  }

  function sortEntries(entries){
    return entries.sort((a,b)=>{
      if (b.level !== a.level) return b.level - a.level;
      return b.xp - a.xp;
    });
  }

  function upsertUser(entries, user){
    const idx = entries.findIndex(e=> e.id === user.id);
    if (idx >= 0) entries[idx] = user; else entries.push(user);
  }

  async function getLeaderboard(currentUser){
    const base = fetchMockLeaderboard();
    if (currentUser){
      upsertUser(base, { id: currentUser.userId, name: currentUser.name, level: currentUser.level, xp: currentUser.xp });
    }
    return sortEntries(base).slice(0, 10);
  }

  global.LeaderboardAPI = { getLeaderboard };
})(window);


