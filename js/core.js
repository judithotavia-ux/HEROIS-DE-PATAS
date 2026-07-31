// ============================================================
// HERÓIS DE PATAS - NÚCLEO (namespace global + utilitários)
// ============================================================
window.HDP = window.HDP || {};

HDP.CONST = {
    TILE: 16,               // unidade base do grid de pixel art
    GRAVITY: 1400,
    JUMP_VELOCITY: -620,
    MOVE_SPEED: 220,
    SPRINT_MULT: 1.6,
    ATTACK_RANGE: 46,
    ATTACK_COOLDOWN: 0.35,
    INTERACT_RANGE: 55,
    GROUND_MARGIN: 60,
    SAVE_KEY: 'hdp_save_v1'
};

HDP.Util = {
    clamp(v, min, max) { return Math.max(min, Math.min(max, v)); },
    rand(min, max) { return min + Math.random() * (max - min); },
    randInt(min, max) { return Math.floor(HDP.Util.rand(min, max + 1)); },
    choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    dist(ax, ay, bx, by) { const dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); },
    aabb(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x &&
               a.y < b.y + b.height && a.y + a.height > b.y;
    },
    lerp(a, b, t) { return a + (b - a) * t; },
    formatCount(cur, max) { return `${cur}/${max}`; },
    uid() { return Math.random().toString(36).slice(2, 10); }
};
