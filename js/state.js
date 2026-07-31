// ============================================================
// ESTADO PERSISTENTE DO JOGADOR
// (personagens, inventário, amizade, evolução, resgates, missões,
//  progresso no mundo) + orquestração de salvar/carregar
// ============================================================

// ----- PERSONAGENS -----
// Todos os 10 heróis já começam desbloqueados (sem grind de moedas).
HDP.CharManager = {
    unlocked: HDP.CHARACTER_ORDER.slice(),
    current: 'Fifi',

    unlock(name) {
        if (!this.unlocked.includes(name) && HDP.CHARACTERS[name]) {
            this.unlocked.push(name);
            return true;
        }
        return false;
    },
    isUnlocked(name) { return this.unlocked.includes(name); },
    setCurrent(name) { if (this.isUnlocked(name)) { this.current = name; return true; } return false; },
    // Remove da lista qualquer personagem que não exista mais em HDP.CHARACTERS
    // (ex.: saves antigos de antes de uma reorganização do elenco), garante
    // que todos os heróis atuais estejam sempre desbloqueados (mesmo em saves
    // antigos que só tinham a Fifi) e que o atual seja sempre válido.
    sanitize() {
        this.unlocked = this.unlocked.filter(name => !!HDP.CHARACTERS[name]);
        for (const name of HDP.CHARACTER_ORDER) {
            if (!this.unlocked.includes(name)) this.unlocked.push(name);
        }
        if (!HDP.CHARACTERS[this.current] || !this.isUnlocked(this.current)) {
            this.current = this.unlocked[0];
        }
    },
    getData(name) { return HDP.CHARACTERS[name || this.current] || null; },
    reset() { this.unlocked = HDP.CHARACTER_ORDER.slice(); this.current = 'Fifi'; }
};

// ----- INVENTÁRIO -----
HDP.Inventory = {
    coins: 0, bones: 0, hearts: 3, gems: 0,
    collectedLog: {}, // itemId -> total já coletado (histórico)

    addCoins(n) { this.coins = Math.max(0, this.coins + n); },
    addBones(n) { this.bones = Math.max(0, this.bones + n); this._log('bone', n); },
    addGems(n) { this.gems = Math.max(0, this.gems + n); this._log('gem', n); },
    addHeart(n = 1) { this.hearts += n; this._log('heart', n); },
    useHeart() { if (this.hearts > 0) { this.hearts--; return true; } return false; },
    _log(kind, n) { if (n > 0) this.collectedLog[kind] = (this.collectedLog[kind] || 0) + n; },
    reset() { this.coins = 0; this.bones = 0; this.hearts = 3; this.gems = 0; this.collectedLog = {}; }
};

// ----- AMIZADE -----
HDP.Friendship = {
    levels: {},

    add(name, amount) {
        if (!this.levels[name]) this.levels[name] = 0;
        this.levels[name] = HDP.Util.clamp(this.levels[name] + amount, 0, 100);
        return this.levels[name];
    },
    get(name) { return this.levels[name] || 0; },
    getTitle(name) {
        const l = this.get(name);
        if (l >= 80) return 'Alma Gêmea';
        if (l >= 60) return 'Companheiro';
        if (l >= 40) return 'Melhor Amigo';
        if (l >= 20) return 'Bom Amigo';
        if (l >= 10) return 'Amigo';
        return 'Conhecido';
    },
    reset() { this.levels = {}; }
};

// ----- EVOLUÇÃO (XP / NÍVEL) -----
HDP.Evolution = {
    data: {},

    get(name) {
        if (!this.data[name]) this.data[name] = { level: 1, xp: 0, xpToNext: 100 };
        return this.data[name];
    },
    addXP(name, amount) {
        const d = this.get(name);
        d.xp += amount;
        let leveled = false;
        while (d.xp >= d.xpToNext) {
            d.xp -= d.xpToNext;
            d.level++;
            d.xpToNext = Math.round(d.xpToNext * 1.4);
            leveled = true;
        }
        return { leveled, level: d.level };
    },
    getLevel(name) { return this.get(name).level; },
    getTier(name) {
        const l = this.getLevel(name);
        if (l >= 50) return 'Lendário';
        if (l >= 30) return 'Épico';
        if (l >= 20) return 'Avançado';
        if (l >= 10) return 'Intermediário';
        return 'Iniciante';
    },
    // Bônus percentual de atributos aplicados ao criar o jogador
    statMultiplier(name) { return 1 + (this.getLevel(name) - 1) * 0.04; },
    reset() { this.data = {}; }
};

// ----- RESGATE DE ANIMAIS -----
HDP.Rescue = {
    log: [], // { id, name, mapId, at }

    record(animalDef, mapId) {
        this.log.push({ id: animalDef.id, name: animalDef.name, mapId, at: Date.now() });
    },
    countTotal() { return this.log.length; },
    countForMap(mapId) { return this.log.filter(r => r.mapId === mapId).length; },
    reset() { this.log = []; }
};

// ----- MISSÕES -----
HDP.MissionSystem = {
    progress: {},   // missionId -> número atual
    completed: {},  // missionId -> bool

    getProgress(missionId) { return this.progress[missionId] || 0; },
    isCompleted(missionId) { return !!this.completed[missionId]; },
    // Progresso para exibição: uma missão já concluída sempre mostra "cheia",
    // mesmo que o contador da fase atual (reconstruída ao revisitar o mapa)
    // tenha voltado a zero.
    getDisplayProgress(missionId, target) {
        return this.isCompleted(missionId) ? target : this.getProgress(missionId);
    },

    // Recalcula progresso de todas as missões do mapa a partir do estado atual
    // (chamado a cada frame do jogo — barato o bastante, evita duplicar contadores)
    syncMap(mapId, counters) {
        const rewards = [];
        for (const mission of HDP.getMissionsForMap(mapId)) {
            const value = counters[mission.type] || 0;
            this.progress[mission.id] = value;
            if (!this.completed[mission.id] && value >= mission.target) {
                this.completed[mission.id] = true;
                rewards.push(mission);
            }
        }
        return rewards;
    },

    requiredComplete(mapId) {
        return HDP.getMissionsForMap(mapId)
            .filter(m => m.required)
            .every(m => this.isCompleted(m.id));
    },

    reset() { this.progress = {}; this.completed = {}; }
};

// ----- PROGRESSO NO MUNDO (mapas) -----
HDP.Progress = {
    currentMapId: 'floresta',
    unlockedMaps: ['floresta'],

    unlock(mapId) { if (mapId && !this.unlockedMaps.includes(mapId)) this.unlockedMaps.push(mapId); },
    isUnlocked(mapId) { return this.unlockedMaps.includes(mapId); },
    reset() { this.currentMapId = 'floresta'; this.unlockedMaps = ['floresta']; }
};

// ----- SALVAR / CARREGAR -----
HDP.SaveManager = {
    hasSave() { return !!localStorage.getItem(HDP.CONST.SAVE_KEY); },

    save() {
        const data = {
            version: 1,
            character: HDP.CharManager.current,
            unlockedCharacters: HDP.CharManager.unlocked,
            inventory: {
                coins: HDP.Inventory.coins, bones: HDP.Inventory.bones,
                hearts: HDP.Inventory.hearts, gems: HDP.Inventory.gems,
                collectedLog: HDP.Inventory.collectedLog
            },
            friendship: HDP.Friendship.levels,
            evolution: HDP.Evolution.data,
            rescue: HDP.Rescue.log,
            missions: { progress: HDP.MissionSystem.progress, completed: HDP.MissionSystem.completed },
            progress: { currentMapId: HDP.Progress.currentMapId, unlockedMaps: HDP.Progress.unlockedMaps },
            savedAt: Date.now()
        };
        localStorage.setItem(HDP.CONST.SAVE_KEY, JSON.stringify(data));
        return data;
    },

    load() {
        const raw = localStorage.getItem(HDP.CONST.SAVE_KEY);
        if (!raw) return false;
        try {
            const data = JSON.parse(raw);

            if (Array.isArray(data.unlockedCharacters) && data.unlockedCharacters.length) {
                HDP.CharManager.unlocked = data.unlockedCharacters;
            }
            if (data.character && HDP.CharManager.isUnlocked(data.character)) {
                HDP.CharManager.current = data.character;
            }
            HDP.CharManager.sanitize();
            if (data.inventory) {
                HDP.Inventory.coins = data.inventory.coins || 0;
                HDP.Inventory.bones = data.inventory.bones || 0;
                HDP.Inventory.hearts = data.inventory.hearts != null ? data.inventory.hearts : 3;
                HDP.Inventory.gems = data.inventory.gems || 0;
                HDP.Inventory.collectedLog = data.inventory.collectedLog || {};
            }
            if (data.friendship) HDP.Friendship.levels = data.friendship;
            if (data.evolution) HDP.Evolution.data = data.evolution;
            if (Array.isArray(data.rescue)) HDP.Rescue.log = data.rescue;
            if (data.missions) {
                HDP.MissionSystem.progress = data.missions.progress || {};
                HDP.MissionSystem.completed = data.missions.completed || {};
            }
            if (data.progress) {
                HDP.Progress.currentMapId = data.progress.currentMapId || 'floresta';
                HDP.Progress.unlockedMaps = data.progress.unlockedMaps || ['floresta'];
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    resetAll() {
        HDP.CharManager.reset();
        HDP.Inventory.reset();
        HDP.Friendship.reset();
        HDP.Evolution.reset();
        HDP.Rescue.reset();
        HDP.MissionSystem.reset();
        HDP.Progress.reset();
        localStorage.removeItem(HDP.CONST.SAVE_KEY);
    }
};
