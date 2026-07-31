// ============================================================
// INTERFACE DO USUÁRIO (menus, HUD, telas)
// ============================================================
HDP.UI = {
    el(id) { return document.getElementById(id); },

    // ---------- NAVEGAÇÃO DE TELAS (menu) ----------
    hideAllScreens() { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); },

    openScreen(id) {
        this.hideAllScreens();
        this.el(id).classList.add('active');
        HDP.Audio.click();
        if (id === 'characters-screen') this.renderCharacters();
        if (id === 'maps-screen') this.renderMaps();
        if (id === 'inventory-screen') this.renderInventory();
        if (id === 'missions-screen') this.renderMissions();
        if (id === 'credits-screen') this.renderCredits();
    },

    backToMainMenu() {
        HDP.Game.stop();
        this.el('game-container').classList.add('hidden');
        this.el('pause-overlay').classList.remove('active');
        this.el('game-over').classList.remove('active');
        this.el('stage-clear').classList.remove('active');
        this.openScreen('main-menu');
        this.refreshMainMenu();
    },

    refreshMainMenu() {
        const btn = this.el('btn-new-game');
        btn.textContent = HDP.SaveManager.hasSave() ? '▶ CONTINUAR AVENTURA' : '▶ NOVA AVENTURA';
    },

    // ---------- PERSONAGENS ----------
    renderCharacters() {
        const grid = this.el('characters-grid');
        grid.innerHTML = '';
        for (const name of HDP.CHARACTER_ORDER) {
            const data = HDP.CHARACTERS[name];
            const unlocked = HDP.CharManager.isUnlocked(name);
            const selected = HDP.CharManager.current === name;
            const level = HDP.Evolution.getLevel(name);
            const friend = HDP.Friendship.getTitle(name);

            const avatar = data.portrait
                ? `<img class="char-avatar-img" src="${data.portrait}" alt="${data.name}">`
                : `<span class="char-avatar">${HDP.UI.charEmoji(data)}</span>`;

            const card = document.createElement('div');
            card.className = `char-card${unlocked ? '' : ' locked'}${selected ? ' selected' : ''}`;
            card.innerHTML = `
                ${avatar}
                <div class="char-name">${data.name}</div>
                <div class="char-title">${data.title}</div>
                <div class="char-stats">❤️${data.stats.hp} ⚔️${data.stats.attack} 🛡️${data.stats.defense}</div>
                ${unlocked ? `<div class="char-extra">⭐ Nv.${level} · ${friend}</div>` : `<div class="char-lock">🔒 ${data.unlockCost} moedas</div>`}
            `;
            card.addEventListener('click', () => {
                if (!unlocked) {
                    if (HDP.Inventory.coins >= data.unlockCost) {
                        if (confirm(`Desbloquear ${data.name} por ${data.unlockCost} moedas?`)) {
                            HDP.Inventory.addCoins(-data.unlockCost);
                            HDP.CharManager.unlock(name);
                            HDP.SaveManager.save();
                            this.renderCharacters();
                            HDP.Audio.rescue();
                        }
                    } else {
                        alert(`💰 Você precisa de ${data.unlockCost} moedas para desbloquear ${data.name}!`);
                    }
                    return;
                }
                HDP.CharManager.setCurrent(name);
                HDP.SaveManager.save();
                this.renderCharacters();
                HDP.Audio.click();
            });
            grid.appendChild(card);
        }
        const bioBox = this.el('char-bio');
        if (bioBox) bioBox.textContent = HDP.CharManager.getData().bio;
    },

    charEmoji(data) {
        if (data.species === 'human') return '👩';
        if (data.species === 'cat') return '🐱';
        return '🐕';
    },

    // ---------- MAPAS ----------
    renderMaps(targetId) {
        const grid = this.el(targetId || 'maps-grid');
        if (!grid) return;
        grid.innerHTML = '';
        for (const mapId of HDP.MAP_ORDER) {
            const mapDef = HDP.MAPS[mapId];
            const unlocked = HDP.Progress.isUnlocked(mapId);
            const rescued = HDP.Rescue.countForMap(mapId);
            const card = document.createElement('div');
            card.className = `map-card${unlocked ? '' : ' locked'}`;
            card.style.background = `linear-gradient(135deg, ${mapDef.sky[0]}, ${mapDef.sky[1]})`;
            card.innerHTML = `
                <div class="map-name">${unlocked ? '' : '🔒 '}${mapDef.name}</div>
                <div class="map-meta">👾 ${mapDef.enemyCount}${mapDef.boss ? ' + chefe' : ''} · 🐾 ${rescued}/${mapDef.rescueCount} resgatados</div>
            `;
            if (unlocked) {
                card.addEventListener('click', () => {
                    HDP.Audio.init();
                    HDP.Audio.click();
                    this.hideAllScreens();
                    this.el('game-container').classList.remove('hidden');
                    this.el('pause-overlay').classList.remove('active');
                    HDP.Game.startMap(mapId);
                });
            }
            grid.appendChild(card);
        }
    },

    // ---------- INVENTÁRIO ----------
    renderInventory() {
        this.el('inv-coins').textContent = HDP.Inventory.coins;
        this.el('inv-bones').textContent = HDP.Inventory.bones;
        this.el('inv-hearts').textContent = HDP.Inventory.hearts;
        this.el('inv-gems').textContent = HDP.Inventory.gems;
        this.el('inv-level').textContent = HDP.Evolution.getLevel(HDP.CharManager.current);
        this.el('inv-tier').textContent = HDP.Evolution.getTier(HDP.CharManager.current);
        this.el('inv-friend').textContent = HDP.Friendship.getTitle(HDP.CharManager.current);

        const gallery = this.el('rescue-gallery');
        gallery.innerHTML = '';
        if (HDP.Rescue.log.length === 0) {
            gallery.innerHTML = '<div class="empty-note">🎒 Nenhum animal resgatado ainda</div>';
        } else {
            for (const r of HDP.Rescue.log.slice().reverse()) {
                const div = document.createElement('div');
                div.className = 'inv-item';
                div.innerHTML = `<span class="emoji">🐾</span><span class="qty">${r.name}</span>`;
                gallery.appendChild(div);
            }
        }
    },

    // ---------- MISSÕES ----------
    renderMissions() {
        const container = this.el('missions-list');
        container.innerHTML = '';
        for (const mapId of HDP.MAP_ORDER) {
            const mapDef = HDP.MAPS[mapId];
            const section = document.createElement('div');
            section.className = 'mission-section';
            const missions = HDP.getMissionsForMap(mapId);
            section.innerHTML = `<h3>${HDP.Progress.isUnlocked(mapId) ? '' : '🔒 '}${mapDef.name}</h3>`;
            for (const m of missions) {
                const val = HDP.MissionSystem.getDisplayProgress(m.id, m.target);
                const done = HDP.MissionSystem.isCompleted(m.id);
                const pct = Math.min(100, Math.round((val / m.target) * 100));
                const row = document.createElement('div');
                row.className = `mission-row${done ? ' done' : ''}`;
                row.innerHTML = `
                    <span class="mission-emoji">${m.emoji}</span>
                    <div class="mission-body">
                        <div class="mission-label">${m.label}${m.required ? ' <em>(obrigatória)</em>' : ' <em>(bônus)</em>'}</div>
                        <div class="mission-bar"><div class="mission-bar-fill" style="width:${pct}%"></div></div>
                    </div>
                    <span class="mission-count">${Math.min(val, m.target)}/${m.target}</span>
                `;
                section.appendChild(row);
            }
            container.appendChild(section);
        }
    },

    // ---------- CRÉDITOS ----------
    renderCredits() {
        const mentor = HDP.MENTOR;
        this.el('mentor-name').textContent = mentor.name;
        this.el('mentor-role').textContent = mentor.role;
        this.el('mentor-quote').textContent = mentor.quote;
        this.el('verse-text').textContent = mentor.verseText;
        this.el('verse-ref').textContent = mentor.verseRef;
        this.el('dev-credit').textContent = HDP.DEVELOPER_CREDIT;

        const img = this.el('mentor-photo');
        const fallback = this.el('mentor-photo-fallback');
        img.onload = () => { img.classList.remove('hidden'); fallback.classList.add('hidden'); };
        img.onerror = () => { img.classList.add('hidden'); fallback.classList.remove('hidden'); };
        img.src = mentor.photo;
    },

    // ---------- HUD (durante o jogo) ----------
    updateHUD(player, world) {
        this.el('hud-hp').textContent = Math.max(0, Math.round(player.hp));
        this.el('hud-maxhp').textContent = player.maxHp;
        this.el('hud-level').textContent = HDP.Evolution.getLevel(player.charId);
        this.el('hud-coins').textContent = HDP.Inventory.coins;
        this.el('hud-bones').textContent = HDP.Inventory.bones;
        this.el('hud-gems').textContent = HDP.Inventory.gems;
        const hpBar = this.el('hud-hp-bar');
        if (hpBar) hpBar.style.width = `${HDP.Util.clamp((player.hp / player.maxHp) * 100, 0, 100)}%`;
    },

    setLocation(name) { this.el('hud-location').textContent = name; },

    updateMissionHUD(mapId) {
        const box = this.el('quest-hud');
        box.innerHTML = '';
        for (const m of HDP.getMissionsForMap(mapId)) {
            const val = Math.min(HDP.MissionSystem.getDisplayProgress(m.id, m.target), m.target);
            const done = HDP.MissionSystem.isCompleted(m.id);
            const div = document.createElement('div');
            div.className = `quest-item${done ? ' completed' : ''}`;
            div.innerHTML = `<span class="emoji">${m.emoji}</span><span class="label">${m.label}</span><span class="count">${val}/${m.target}</span>`;
            box.appendChild(div);
        }
    },

    updateSpecialIndicator(player) {
        const box = this.el('special-indicator');
        if (!box) return;
        const sp = player.def.special;
        const ready = player.specialCooldown <= 0;
        box.classList.toggle('ready', ready);
        this.el('special-name').textContent = sp.name;
        this.el('special-status').textContent = ready ? 'PRONTO (K)' : `${player.specialCooldown.toFixed(1)}s`;
    },

    // ---------- OVERLAYS ----------
    hideOverlays() {
        this.el('pause-overlay').classList.remove('active');
        this.el('game-over').classList.remove('active');
        this.el('stage-clear').classList.remove('active');
        this.el('ending-overlay').classList.remove('active');
    },

    showPause(active) {
        this.el('pause-overlay').classList.toggle('active', active);
        if (active) this.renderMaps('pause-maps-grid');
    },

    showGameOver() {
        this.el('game-over').classList.add('active');
    },

    showStageClear(data) {
        this.el('stage-clear-title').textContent = `🏁 ${data.mapName} concluída!`;
        this.el('stage-clear-summary').innerHTML = `
            🪙 Moedas: ${data.coins} &nbsp; 🦴 Ossos: ${data.bones} &nbsp; 🐾 Resgates: ${data.rescued} &nbsp; ⭐ Nível: ${data.level}
        `;
        const btn = this.el('stage-clear-next');
        btn.textContent = `▶ PRÓXIMA FASE: ${HDP.MAPS[data.nextMapId].name}`;
        btn.onclick = () => { this.hideOverlays(); HDP.Game.startMap(data.nextMapId); };
        this.el('stage-clear').classList.add('active');
    },

    // ---------- FINAL DA CAMPANHA (cutscene) ----------
    showEnding(data) {
        const ending = HDP.ENDING;
        this.el('ending-title').textContent = ending.title;
        this.el('ending-subtitle').textContent = ending.subtitle;
        this.el('ending-quote').textContent = `"${ending.dialogue}"`;
        this.el('ending-signature').textContent = ending.signature;
        this.el('ending-stats').innerHTML = `
            🪙 Moedas: ${data.coins} &nbsp; 🦴 Ossos: ${data.bones} &nbsp; 🐾 Animais resgatados: ${data.rescued} &nbsp; ⭐ Nível: ${data.level}
        `;
        const friends = this.el('ending-friends');
        friends.innerHTML = '';
        for (const name of HDP.CHARACTER_ORDER) {
            const span = document.createElement('span');
            span.textContent = this.charEmoji(HDP.CHARACTERS[name]);
            span.title = HDP.CHARACTERS[name].name;
            friends.appendChild(span);
        }
        this.el('ending-overlay').classList.add('active');
    },

    toast(msg) { HDP.Game.showMessage(msg, '#4caf50'); }
};
