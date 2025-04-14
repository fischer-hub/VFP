
export const SaveManager = {
  save(data) {
    data.SAVE_KEY = `VFP${Date.now()}`
    console.log(`Saving gamestate to localstorage with key ${data.SAVE_KEY} ..`)
    localStorage.setItem(data.SAVE_KEY, JSON.stringify(data));
  },

  load(SAVE_KEY) {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  clear() {
    localStorage.removeItem(SAVE_KEY);
  },

  hasSave() {
    return !!localStorage.getItem(SAVE_KEY);
  },
  
  loadLatest() {
    const items = { ...localStorage };
    var keys = Object.keys(items);
    var savegames = keys.filter(item => item.startsWith('VFP'));
    savegames.sort();
    console.log(`Loading latest savegame with with SAVE_KEY ${savegames.at(-1)} ..`)
    const raw = localStorage.getItem(savegames.at(-1));
    return raw ? JSON.parse(raw) : null;
  }
};
