// ============================================================
// LOOP PRINCIPAL DO JOGO
// ============================================================
HDP.Game = {
    canvas: null, ctx: null,
    world: null, player: null,
    running: false, paused: false,
    rafId: null, lastTime: 0,
    message: null, messageTimer: 0, messageColor: '#fff',

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        HDP.Input.init();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width || window.innerWidth;
        this.canvas.height = rect.height || window.innerHeight;
    },

    startMap(mapId) {
        HDP.Audio.init();
        this.resizeCanvas();
        HDP.Progress.currentMapId = mapId;
        HDP.Progress.unlock(mapId);

        this.world = HDP.World.build(mapId, this.canvas.width, this.canvas.height);
        this.player = HDP.Entities.createPlayer(HDP.CharManager.current, 100, this.world.groundY);

        HDP.Particles.clear();
        this.message = null;
        this.running = true;
        this.paused = false;
        this.lastTime = performance.now();

        HDP.UI.hideOverlays();
        HDP.UI.updateHUD(this.player, this.world);
        HDP.UI.updateMissionHUD(mapId);
        HDP.UI.setLocation(this.world.mapDef.name);

        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.loop(this.lastTime);
    },

    loop(timestamp) {
        if (!this.running) return;
        const delta = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        if (!this.paused) {
            this.update(delta);
            this.render();
        }
        HDP.Input.clearFrame();
        this.rafId = requestAnimationFrame((t) => this.loop(t));
    },

    showMessage(text, color) { this.message = text; this.messageTimer = 2.2; this.messageColor = color || '#fff'; },

    update(delta) {
        let player = this.player;
        const world = this.world;
        if (!player || !world) return;

        player.animT += delta;
        HDP.Combat.updateBuffs(player, delta);
        this.handleInput(delta, player, world);
        player = this.player; // handleInput pode ter trocado o herói ativo (tecla C)
        this.updatePlayerPhysics(delta, player, world);
        this.updateEnemies(delta, player, world);
        this.updateItemsAndCages(player, world);
        this.updateWeather(delta, world);
        this.updateHazards(delta, player, world);
        this.syncMissions();
        this.checkFlag(player, world);
        HDP.Particles.update(delta);
        if (this.message) { this.messageTimer -= delta; if (this.messageTimer <= 0) this.message = null; }

        HDP.UI.updateHUD(player, world);
        HDP.UI.updateSpecialIndicator(player);
    },

    handleInput(delta, player, world) {
        const I = HDP.Input;
        let moveX = 0;
        if (I.isDown('ArrowLeft', 'a', 'A')) moveX = -1;
        if (I.isDown('ArrowRight', 'd', 'D')) moveX = 1;
        const sprint = I.isDown('Shift') ? HDP.CONST.SPRINT_MULT : 1;
        const eff = HDP.Combat.getEffectiveStats(player);

        player.velX = moveX * eff.speed * HDP.CONST.MOVE_SPEED * sprint;
        player.walking = moveX !== 0 && player.grounded;
        if (moveX !== 0) player.direction = moveX;

        if (I.consumePressed('ArrowUp', 'w', 'W', ' ') && player.grounded) {
            player.velY = HDP.CONST.JUMP_VELOCITY;
            player.grounded = false;
            HDP.Audio.jump();
        }

        if (I.consumePressed('j', 'J')) {
            HDP.Combat.performAttack(player, world);
        }
        if (I.consumePressed('k', 'K')) {
            const used = HDP.Combat.useSpecial(player, world);
            if (used) this.showMessage(`✨ ${player.def.special.name}!`, '#7dd3fc');
        }
        if (I.consumePressed('e', 'E')) {
            this.tryRescue(player, world);
        }
        if (I.consumePressed('c', 'C')) this.cycleHero();
        if (I.consumePressed('p', 'P')) this.togglePause();
        if (I.consumePressed('i', 'I') && !this.paused) HDP.UI.openScreen('inventory-screen');
        if (I.consumePressed('m', 'M') && !this.paused) HDP.UI.openScreen('missions-screen');

        if (player.attacking) { player.attackTimer -= delta; if (player.attackTimer <= 0) player.attacking = false; }
    },

    updatePlayerPhysics(delta, player, world) {
        player.velY += HDP.CONST.GRAVITY * delta;
        player.prevBottom = player.y + player.height;
        player.x += player.velX * delta;
        player.y += player.velY * delta;
        player.x = HDP.Util.clamp(player.x, 0, world.worldWidth - player.width);
        HDP.World.resolveVertical(player, world);

        if (player.y > this.canvas.height + 150) { this.playerDeath(); return; }
        if (player.hp <= 0) { this.playerDeath(); }
    },

    updateEnemies(delta, player, world) {
        for (const enemy of world.enemies) {
            if (!enemy.alive) continue;
            enemy.animT += delta;
            if (enemy.stunTimer > 0) { enemy.stunTimer -= delta; continue; }

            const dx = player.x - enemy.x, dy = player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = 55 * enemy.def.speedMul;

            if (dist < 300) {
                enemy.x += (dx / (dist || 1)) * speed * delta;
                enemy.direction = dx >= 0 ? 1 : -1;
                if (enemy.def.flies) enemy.y += (dy / (dist || 1)) * speed * 0.6 * delta;
            } else {
                enemy.x += enemy.velX * 55 * delta;
                enemy.direction = enemy.velX >= 0 ? 1 : -1;
                if (enemy.x < 80 || enemy.x > world.worldWidth - 80) enemy.velX *= -1;
            }

            if (enemy.def.flies) {
                enemy.y = HDP.Util.clamp(enemy.y, 40, world.groundY - enemy.height - 20);
            } else {
                enemy.y = world.groundY - enemy.height;
            }
            enemy.x = HDP.Util.clamp(enemy.x, 0, world.worldWidth - enemy.width);

            if (enemy.hurtTimer > 0) enemy.hurtTimer -= delta;
            if (enemy.attackCooldown > 0) enemy.attackCooldown -= delta;

            if (dist < 46 && enemy.attackCooldown <= 0) {
                HDP.Combat.enemyAttackPlayer(enemy, player);
                enemy.attackCooldown = 1.0;
            }
        }
    },

    updateItemsAndCages(player, world) {
        for (const item of world.items) {
            if (item.collected) continue;
            if (HDP.Util.aabb(player, item)) {
                item.collected = true;
                if (item.kind === 'bone') { HDP.Inventory.addBones(1); world.counters.bones++; HDP.Audio.collect(); }
                else if (item.kind === 'coin') { HDP.Inventory.addCoins(10); world.counters.coins++; HDP.Audio.coin(); }
                else if (item.kind === 'gem') { HDP.Inventory.addGems(1); HDP.Inventory.addCoins(5); world.counters.coins += 5; HDP.Audio.coin(); }
                else if (item.kind === 'heart') {
                    HDP.Inventory.addHeart();
                    player.hp = Math.min(player.maxHp, player.hp + Math.round(player.maxHp * 0.2));
                    HDP.Audio.heart();
                }
                HDP.Particles.spawn(item.x + 9, item.y + 9, '#ffb300', 10);
            }
        }
    },

    tryRescue(player, world) {
        for (const cage of world.cages) {
            if (cage.freed) continue;
            if (HDP.Util.dist(player.x + player.width / 2, player.y + player.height / 2, cage.x + cage.width / 2, cage.y + cage.height / 2) < HDP.CONST.INTERACT_RANGE) {
                cage.freed = true;
                world.counters.rescue++;
                HDP.Rescue.record(cage.animalDef, world.mapId);
                HDP.Friendship.add(player.charId, 8);
                HDP.Inventory.addCoins(15);
                HDP.Audio.rescue();
                HDP.Particles.spawn(cage.x + 14, cage.y + 14, '#4caf50', 22);
                this.showMessage(`🐾 ${cage.animalDef.name} resgatado!`, '#4caf50');
                return;
            }
        }
    },

    switchHero(charId) {
        const old = this.player;
        if (!old || old.charId === charId || !HDP.CharManager.isUnlocked(charId)) return;
        HDP.CharManager.setCurrent(charId);
        const fresh = HDP.Entities.createPlayer(charId, old.x, this.world.groundY);
        fresh.y = old.y;
        fresh.velX = old.velX;
        fresh.velY = old.velY;
        fresh.direction = old.direction;
        fresh.grounded = old.grounded;
        this.player = fresh;
        HDP.Particles.spawn(fresh.x + fresh.width / 2, fresh.y + fresh.height / 2, '#7dd3fc', 16);
        HDP.Audio.special();
        this.showMessage(`🔄 Trocou para ${fresh.def.name}!`, '#7dd3fc');
    },

    cycleHero() {
        const order = HDP.CHARACTER_ORDER.filter(id => HDP.CharManager.isUnlocked(id));
        if (order.length < 2) {
            this.showMessage('Nenhum outro herói desbloqueado ainda.', '#ff6b6b');
            return;
        }
        const idx = order.indexOf(this.player.charId);
        this.switchHero(order[(idx + 1) % order.length]);
    },

    updateWeather(delta, world) {
        if (!world.rain) return;
        for (const drop of world.rain) {
            drop.y += drop.speed * delta;
            drop.x -= 60 * delta;
            if (drop.y > world.groundY) {
                drop.y = HDP.Util.rand(-40, 0);
                drop.x = HDP.Util.rand(0, world.worldWidth);
            }
        }
        if (world.lightningFlash > 0) world.lightningFlash -= delta;
        world.weatherTimer -= delta;
        if (world.weatherTimer <= 0) {
            world.lightningFlash = 0.15;
            world.weatherTimer = HDP.Util.rand(4, 9);
            HDP.Audio.thunder();
        }
    },

    updateHazards(delta, player, world) {
        const train = world.train;
        if (!train) return;
        if (train.hitCooldown > 0) train.hitCooldown -= delta;

        if (!train.active) {
            train.timer -= delta;
            if (train.timer <= 1.2 && !train.warning) {
                train.warning = true;
                this.showMessage('🚂 TREM CHEGANDO!', '#ff6b6b');
            }
            if (train.timer <= 0) {
                train.active = true;
                train.dir = Math.random() > 0.5 ? 1 : -1;
                train.x = train.dir > 0 ? -train.width : world.worldWidth + train.width;
                HDP.Audio.thunder();
            }
            return;
        }

        train.x += train.dir * train.speed * delta;

        const trainBox = { x: train.x, y: world.groundY - train.height, width: train.width, height: train.height };
        if (train.hitCooldown <= 0 && HDP.Util.aabb(player, trainBox)) {
            HDP.Combat.enemyAttackPlayer({ attack: 30 }, player);
            player.velY = -260;
            player.grounded = false;
            train.hitCooldown = 1.5;
        }

        const past = train.dir > 0 ? train.x > world.worldWidth + train.width : train.x < -train.width * 2;
        if (past) {
            train.active = false;
            train.warning = false;
            train.timer = HDP.Util.rand(6, 10);
        }
    },

    syncMissions() {
        const rewards = HDP.MissionSystem.syncMap(this.world.mapId, this.world.counters);
        for (const mission of rewards) {
            HDP.Inventory.addCoins(mission.reward.coins || 0);
            HDP.Inventory.addBones(mission.reward.bones || 0);
            HDP.Evolution.addXP(this.player.charId, mission.reward.xp || 0);
            this.showMessage(`✅ Missão concluída: ${mission.label}`, '#4caf50');
        }
        HDP.UI.updateMissionHUD(this.world.mapId);
    },

    checkFlag(player, world) {
        if (!HDP.Util.aabb(player, world.flag)) return;
        if (!HDP.MissionSystem.requiredComplete(world.mapId)) {
            this.showMessage('🚩 Complete as missões obrigatórias!', '#ff6b6b');
            return;
        }
        this.stageComplete();
    },

    stageComplete() {
        this.running = false;
        HDP.Audio.victory();
        HDP.SaveManager.save();
        const mapDef = this.world.mapDef;
        const nextId = mapDef.nextMapId;
        if (nextId) HDP.Progress.unlock(nextId);
        const summary = {
            mapName: mapDef.name,
            nextMapId: nextId,
            coins: HDP.Inventory.coins,
            bones: HDP.Inventory.bones,
            rescued: HDP.Rescue.countTotal(),
            level: HDP.Evolution.getLevel(this.player.charId)
        };
        if (nextId) {
            HDP.UI.showStageClear(summary);
        } else {
            HDP.Audio.levelUp();
            HDP.UI.showEnding(summary);
        }
    },

    playerDeath() {
        if (!this.running) return;
        this.running = false;
        HDP.Audio.gameover();
        HDP.UI.showGameOver();
    },

    togglePause() {
        if (!this.running) return;
        this.paused = !this.paused;
        HDP.UI.showPause(this.paused);
    },

    saveNow() {
        HDP.SaveManager.save();
        this.showMessage('💾 Jogo salvo!', '#4caf50');
        HDP.Audio.collect();
    },

    stop() {
        this.running = false;
        if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    },

    drawRevealGlow(ctx, ent, pulse, color) {
        const cx = ent.x + ent.width / 2, cy = ent.y + ent.height / 2;
        const r = ent.width * 0.9 + pulse * 6;
        ctx.save();
        ctx.globalAlpha = 0.35 + pulse * 0.25;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    // ------------------------------------------------------------------
    render() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        const world = this.world, player = this.player;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);

        const [c1, c2, c3] = world.mapDef.sky;
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, c1); grad.addColorStop(0.5, c2); grad.addColorStop(1, c3);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        const camX = HDP.World.getCameraX(player.x, W, world.worldWidth);

        // decoração de fundo com parallax
        for (const d of world.decor) {
            const sx = d.x - camX * d.parallax;
            if (sx < -80 || sx > W + 80) continue;
            ctx.fillStyle = world.mapDef.decorColor;
            ctx.fillRect(sx, world.groundY - d.h, d.w, d.h);
        }

        ctx.save();
        ctx.translate(-camX, 0);

        // chão
        ctx.fillStyle = world.mapDef.ground;
        ctx.fillRect(0, world.groundY, world.worldWidth, 50);
        ctx.fillStyle = world.mapDef.groundTop;
        for (let x = 0; x < world.worldWidth; x += 16) {
            const h = 3 + Math.sin(x * 0.05 + performance.now() / 900) * 2;
            ctx.fillRect(x, world.groundY - h, 3, h);
        }

        // plataformas
        for (const plat of world.platforms) {
            ctx.fillStyle = world.mapDef.ground;
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = world.mapDef.groundTop;
            ctx.fillRect(plat.x, plat.y, plat.width, 4);
        }

        const revealing = !!player.buffs.reveal;
        const revealPulse = 0.5 + Math.sin(performance.now() / 150) * 0.5;

        // gaiolas
        for (const cage of world.cages) {
            if (cage.freed) continue;
            if (revealing) this.drawRevealGlow(ctx, cage, revealPulse, '#4caf50');
            HDP.Sprites.drawCage(ctx, cage.x, cage.y, cage.width, cage.height);
            HDP.Sprites.draw(ctx, cage.animalDef, cage.x + 4, cage.y + 3, cage.width - 6, cage.height - 6, { facing: 1 });
        }

        // itens
        for (const item of world.items) {
            if (item.collected) continue;
            if (revealing) this.drawRevealGlow(ctx, item, revealPulse, '#ffd700');
            HDP.Sprites.drawItem(ctx, item.kind, item.x, item.y, item.width, item.height, performance.now() / 1000);
        }

        // inimigos
        for (const enemy of world.enemies) {
            if (!enemy.alive) continue;
            HDP.Sprites.draw(ctx, enemy.def, enemy.x, enemy.y, enemy.width, enemy.height, {
                facing: enemy.direction, walking: true, t: enemy.animT, hurt: enemy.hurtTimer > 0
            });
            const hpRatio = enemy.hp / enemy.maxHp;
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4);
            ctx.fillStyle = hpRatio > 0.5 ? '#4caf50' : hpRatio > 0.25 ? '#ff9800' : '#ff1744';
            ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * hpRatio, 4);
            if (enemy.def.boss) { ctx.fillStyle = '#ffd700'; ctx.font = 'bold 11px sans-serif'; ctx.fillText('👑 CHEFE', enemy.x - 6, enemy.y - 14); }
        }

        // jogador
        HDP.Sprites.draw(ctx, player.def, player.x, player.y, player.width, player.height, {
            facing: player.direction, walking: player.walking, t: player.animT, hurt: player.hurtTimer > 0
        });
        if (player.buffs.invuln) {
            ctx.strokeStyle = 'rgba(125,211,252,0.7)'; ctx.lineWidth = 2;
            ctx.strokeRect(player.x - 3, player.y - 3, player.width + 6, player.height + 6);
        }
        if (player.attacking) {
            ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 3;
            const ax = player.direction > 0 ? player.x + player.width : player.x - 44;
            ctx.beginPath(); ctx.arc(ax + 22, player.y + player.height / 2, 30, 0, Math.PI * 2); ctx.stroke();
        }

        // bandeira / portal
        const ready = HDP.MissionSystem.requiredComplete(world.mapId);
        HDP.Sprites.drawFlag(ctx, world.flag.x, world.flag.y, world.flag.width, world.flag.height, performance.now() / 1000, ready);
        ctx.font = '13px sans-serif'; ctx.fillStyle = ready ? '#4caf50' : '#ff6b6b';
        ctx.fillText(ready ? '✨ Pronto!' : '🔒 Missões pendentes', world.flag.x - 30, world.flag.y - 10);

        // trem (obstáculo móvel)
        if (world.train && world.train.active) this.drawTrain(ctx, world.train, world.groundY);

        // chuva
        if (world.rain) {
            ctx.strokeStyle = 'rgba(180,210,255,0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (const d of world.rain) {
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - 6, d.y + 18);
            }
            ctx.stroke();
        }

        HDP.Particles.render(ctx);
        ctx.restore();

        // relâmpago (tela cheia, fora do espaço do mundo)
        if (world.lightningFlash > 0) {
            ctx.fillStyle = `rgba(255,255,255,${Math.min(0.55, world.lightningFlash * 3)})`;
            ctx.fillRect(0, 0, W, H);
        }

        if (this.message) {
            ctx.fillStyle = 'rgba(0,0,0,0.65)';
            ctx.fillRect(W / 2 - 220, 46, 440, 42);
            ctx.fillStyle = this.messageColor;
            ctx.font = 'bold 20px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.message, W / 2, 73);
            ctx.textAlign = 'left';
        }
    },

    drawTrain(ctx, train, groundY) {
        const x = train.x, y = groundY - train.height, w = train.width, h = train.height;
        ctx.fillStyle = '#2a2a2e';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#4a4a52';
        ctx.fillRect(x, y, w, 6);
        ctx.fillStyle = '#7ec8e3';
        for (let i = 0; i < 6; i++) {
            ctx.fillRect(x + 14 + i * (w / 6), y + 14, w / 6 - 16, h * 0.35);
        }
        ctx.fillStyle = '#c94b4b';
        ctx.fillRect(x, y + h - 10, w, 10);
    }
};
