// ============================================================
// FÁBRICAS DE ENTIDADES (jogador, inimigos, gaiolas, itens)
// ============================================================
HDP.Entities = {
    createPlayer(charId, x, groundY) {
        const def = HDP.CHARACTERS[charId];
        const mult = HDP.Evolution.statMultiplier(charId);
        const stats = {
            hp: Math.round(def.stats.hp * mult),
            attack: Math.round(def.stats.attack * mult),
            defense: Math.round(def.stats.defense * mult),
            speed: def.stats.speed
        };
        return {
            type: 'player', charId, def,
            x, y: groundY - 52, width: 34, height: 52,
            velX: 0, velY: 0, grounded: false, direction: 1,
            stats, hp: stats.hp, maxHp: stats.hp,
            walking: false,
            attacking: false, attackTimer: 0, attackCooldown: 0,
            specialCooldown: 0,
            buffs: {}, // { atkBuff: {timer}, atkSpeed: {timer}, invuln:{timer}, blessing:{timer}, critNext:{timer} }
            hurtTimer: 0,
            animT: 0
        };
    },

    createEnemy(typeId, x, groundY) {
        const def = HDP.ENEMY_TYPES[typeId];
        const size = def.size;
        const flies = !!def.flies;
        const y = flies ? groundY - size - HDP.Util.rand(40, 110) : groundY - size;
        return {
            type: 'enemy', typeId, def,
            x, y,
            width: size, height: size,
            velX: (Math.random() > 0.5 ? 1 : -1) * HDP.Util.rand(0.5, 1.2),
            hp: def.hp, maxHp: def.hp,
            attack: def.attack, defense: def.defense,
            alive: true, attackCooldown: 0, hurtTimer: 0,
            animT: Math.random() * 10,
            direction: 1
        };
    },

    createRescueCage(animalDef, x, groundY) {
        return {
            type: 'cage', animalDef,
            x, y: groundY - 28, width: 28, height: 28,
            freed: false
        };
    },

    createItem(kind, x, y) {
        return { type: 'item', kind, x, y, width: 18, height: 18, collected: false };
    },

    createFlag(x, groundY) {
        return { type: 'flag', x, y: groundY - 56, width: 20, height: 56 };
    }
};
