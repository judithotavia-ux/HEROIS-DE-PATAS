// ============================================================
// MUNDO / FASE: construção do cenário a partir dos dados do mapa
// ============================================================
HDP.World = {
    build(mapId, canvasWidth, canvasHeight) {
        const mapDef = HDP.MAPS[mapId];
        const groundY = canvasHeight - 50;
        const worldWidth = Math.round(canvasWidth * mapDef.worldMul);

        // --- plataformas flutuantes ---
        const platforms = [];
        for (let i = 0; i < mapDef.platformCount; i++) {
            const x = 250 + (worldWidth - 500) * (i / mapDef.platformCount) + HDP.Util.rand(-40, 40);
            const y = groundY - HDP.Util.rand(90, 220);
            platforms.push({ x, y, width: HDP.Util.rand(90, 160), height: 18 });
        }

        // --- inimigos ---
        const enemies = [];
        for (let i = 0; i < mapDef.enemyCount; i++) {
            const typeId = HDP.Util.choice(mapDef.enemyTypes);
            const x = 220 + i * (worldWidth - 400) / mapDef.enemyCount + HDP.Util.rand(-60, 60);
            enemies.push(HDP.Entities.createEnemy(typeId, x, groundY));
        }
        if (mapDef.boss) {
            enemies.push(HDP.Entities.createEnemy(mapDef.boss, worldWidth - 260, groundY));
        }

        // --- itens ---
        const items = [];
        const itemKinds = ['bone', 'coin', 'heart', 'gem'];
        const weights = [0.42, 0.4, 0.1, 0.08];
        for (let i = 0; i < mapDef.itemCount; i++) {
            const r = Math.random();
            let acc = 0, kind = 'bone';
            for (let k = 0; k < itemKinds.length; k++) {
                acc += weights[k];
                if (r <= acc) { kind = itemKinds[k]; break; }
            }
            const x = 140 + i * (worldWidth - 260) / mapDef.itemCount + HDP.Util.rand(-40, 40);
            const y = groundY - 24 - Math.random() * 140;
            items.push(HDP.Entities.createItem(kind, x, y));
        }

        // --- gaiolas de resgate ---
        const cages = [];
        for (let i = 0; i < mapDef.rescueCount; i++) {
            const animalDef = HDP.getRandomRescueAnimal();
            const x = 300 + (i + 1) * (worldWidth - 600) / (mapDef.rescueCount + 1);
            cages.push(HDP.Entities.createRescueCage(animalDef, x, groundY));
        }

        // --- decoração de fundo (estática) ---
        const decor = [];
        const decorCount = Math.round(worldWidth / 140);
        for (let i = 0; i < decorCount; i++) {
            decor.push({
                x: HDP.Util.rand(0, worldWidth),
                w: HDP.Util.rand(20, 55),
                h: HDP.Util.rand(60, 160),
                parallax: HDP.Util.rand(0.3, 0.6)
            });
        }

        const flag = HDP.Entities.createFlag(worldWidth - 90, groundY);

        // --- clima (tempestade: chuva + relâmpagos) ---
        let rain = null, weatherTimer = 0, lightningFlash = 0;
        if (mapDef.weather === 'storm') {
            rain = [];
            for (let i = 0; i < 90; i++) {
                rain.push({ x: HDP.Util.rand(0, worldWidth), y: HDP.Util.rand(0, canvasHeight), speed: HDP.Util.rand(500, 800) });
            }
            weatherTimer = HDP.Util.rand(3, 6);
        }

        // --- trem (obstáculo móvel) ---
        let train = null;
        if (mapDef.hazard === 'train') {
            train = { active: false, warning: 0, x: 0, dir: 1, width: 260, height: 64, timer: HDP.Util.rand(3, 5), speed: 820, hitCooldown: 0 };
        }

        return {
            mapId, mapDef, groundY, worldWidth,
            platforms, enemies, items, cages, flag, decor,
            rain, weatherTimer, lightningFlash, train,
            counters: { kills: 0, bones: 0, coins: 0, rescue: 0 }
        };
    },

    // Resolve colisão vertical com o chão e plataformas para uma entidade com velY
    resolveVertical(ent, world) {
        ent.grounded = false;
        // chão
        if (ent.y + ent.height >= world.groundY) {
            ent.y = world.groundY - ent.height;
            ent.velY = 0;
            ent.grounded = true;
            return;
        }
        // plataformas (só colide vindo de cima, caindo), usa a posição do
        // frame anterior (ent.prevBottom) para saber se veio de cima
        if (ent.velY >= 0 && ent.prevBottom != null) {
            for (const plat of world.platforms) {
                const withinX = ent.x + ent.width > plat.x && ent.x < plat.x + plat.width;
                const wasAbove = ent.prevBottom <= plat.y + 2;
                const nowTouching = ent.y + ent.height >= plat.y && ent.y + ent.height <= plat.y + plat.height + 20;
                if (withinX && nowTouching && wasAbove) {
                    ent.y = plat.y - ent.height;
                    ent.velY = 0;
                    ent.grounded = true;
                    return;
                }
            }
        }
    },

    getCameraX(playerX, canvasWidth, worldWidth) {
        return HDP.Util.clamp(playerX - canvasWidth / 2, 0, Math.max(0, worldWidth - canvasWidth));
    }
};
