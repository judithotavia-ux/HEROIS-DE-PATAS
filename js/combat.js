// ============================================================
// SISTEMA DE COMBATE (ataque, habilidades especiais, dano)
// ============================================================
HDP.Combat = {
    // Retorna os stats efetivos do jogador considerando buffs ativos
    getEffectiveStats(player) {
        let { attack, defense, speed } = player.stats;
        if (player.buffs.atkBuff) attack *= 1.5;
        if (player.buffs.blessing) { attack *= 1.3; defense *= 1.3; speed *= 1.3; }
        if (player.buffs.speedBoost) speed *= 1.6;
        return { attack, defense, speed };
    },

    updateBuffs(player, delta) {
        for (const key of Object.keys(player.buffs)) {
            player.buffs[key].timer -= delta;
            if (player.buffs[key].timer <= 0) delete player.buffs[key];
        }
        if (player.specialCooldown > 0) player.specialCooldown -= delta;
        if (player.attackCooldown > 0) player.attackCooldown -= delta;
        if (player.hurtTimer > 0) player.hurtTimer -= delta;
    },

    attackIntervalMult(player) { return player.buffs.atkSpeed ? 0.5 : 1; },

    performAttack(player, world, onKill) {
        if (player.attackCooldown > 0) return;
        player.attacking = true;
        player.attackTimer = 0.25;
        player.attackCooldown = HDP.CONST.ATTACK_COOLDOWN * this.attackIntervalMult(player);
        HDP.Audio.hit();

        const range = HDP.CONST.ATTACK_RANGE;
        const ax = player.direction > 0 ? player.x + player.width : player.x - range;
        const ay = player.y + player.height / 2;
        const eff = this.getEffectiveStats(player);
        let crit = !!player.buffs.critNext;
        if (crit) delete player.buffs.critNext;

        for (const enemy of world.enemies) {
            if (!enemy.alive) continue;
            const ex = enemy.x + enemy.width / 2, ey = enemy.y + enemy.height / 2;
            if (HDP.Util.dist(ax + range / 2 * player.direction, ay, ex, ey) < range) {
                this.damageEnemy(enemy, eff.attack, crit, world, player, onKill);
            }
        }
    },

    damageEnemy(enemy, baseAttack, crit, world, player, onKill) {
        let dmg = Math.max(1, Math.round(baseAttack + HDP.Util.rand(0, 5) - enemy.defense * 0.5));
        if (crit) dmg *= 3;
        enemy.hp -= dmg;
        enemy.hurtTimer = 0.15;
        HDP.Particles.spawn(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, crit ? '#ffd700' : '#ff1744', crit ? 20 : 10);
        HDP.Particles.spawnText(enemy.x + enemy.width / 2, enemy.y, `-${dmg}`, crit ? '#ffd700' : '#fff');

        if (enemy.hp <= 0 && enemy.alive) {
            enemy.alive = false;
            world.counters.kills++;
            HDP.Audio.kill();
            HDP.Particles.spawn(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ffb300', enemy.def.boss ? 40 : 20);

            const xpGain = HDP.Evolution.addXP(player.charId, enemy.def.xp);
            HDP.Friendship.add(player.charId, enemy.def.boss ? 15 : 5);
            if (xpGain.leveled) HDP.Audio.levelUp();

            if (Math.random() < 0.45) {
                const dropKind = HDP.Util.choice(['bone', 'coin']);
                world.items.push(HDP.Entities.createItem(dropKind, enemy.x, enemy.y));
            }
            if (typeof onKill === 'function') onKill(enemy, xpGain);
        }
    },

    // Ataque de um inimigo contra o jogador
    enemyAttackPlayer(enemy, player, onDamage) {
        if (player.buffs.invuln) return;
        const eff = this.getEffectiveStats(player);
        const dmg = Math.max(1, Math.round(enemy.attack - eff.defense * 0.4 + HDP.Util.rand(-2, 2)));
        player.hp -= dmg;
        player.hurtTimer = 0.25;
        HDP.Particles.spawn(player.x + player.width / 2, player.y + player.height / 2, '#ff1744', 12);
        HDP.Particles.spawnText(player.x + player.width / 2, player.y, `-${dmg}`, '#ff5555');
        HDP.Audio.hit();
        if (typeof onDamage === 'function') onDamage(dmg);
    },

    useSpecial(player, world) {
        if (player.specialCooldown > 0) return false;
        const sp = player.def.special;
        player.specialCooldown = sp.cooldown;
        HDP.Audio.special();
        HDP.Particles.spawn(player.x + player.width / 2, player.y + player.height / 2, '#7dd3fc', 18);
        HDP.Particles.spawnText(player.x + player.width / 2, player.y - 10, sp.name, '#7dd3fc');

        switch (sp.effect) {
            case 'atkBuff':
            case 'atkSpeed':
            case 'invuln':
            case 'speedBoost':
            case 'reveal':
                player.buffs[sp.effect] = { timer: sp.duration };
                break;
            case 'blessing':
                player.buffs.blessing = { timer: sp.duration };
                player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.25);
                break;
            case 'heal':
                player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.4);
                HDP.Audio.heart();
                break;
            case 'crit':
                player.buffs.critNext = { timer: 6 };
                break;
            case 'dash': {
                const range = 90;
                const ax = player.direction > 0 ? player.x + player.width : player.x - range;
                const eff = this.getEffectiveStats(player);
                for (const enemy of world.enemies) {
                    if (!enemy.alive) continue;
                    if (HDP.Util.dist(ax, player.y + player.height / 2, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2) < range) {
                        this.damageEnemy(enemy, eff.attack * 1.6, false, world, player);
                    }
                }
                player.x += player.direction * 40;
                break;
            }
            case 'stun':
                for (const enemy of world.enemies) {
                    if (enemy.alive) enemy.stunTimer = sp.duration;
                }
                break;
        }
        return true;
    }
};
