// ============================================================
// SISTEMA DE PARTÍCULAS
// ============================================================
HDP.Particles = {
    list: [],

    spawn(x, y, color, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 150;
            this.list.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 1.0,
                size: 2 + Math.random() * 4,
                color
            });
        }
    },

    spawnText(x, y, text, color) {
        this.list.push({ x, y, vx: 0, vy: -40, life: 1.0, maxLife: 1.0, size: 0, color, text });
    },

    update(delta) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const p = this.list[i];
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            if (!p.text) p.vy += 200 * delta;
            p.life -= delta;
            if (p.life <= 0) this.list.splice(i, 1);
        }
    },

    render(ctx) {
        for (const p of this.list) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            if (p.text) {
                ctx.fillStyle = p.color;
                ctx.font = 'bold 14px "Segoe UI", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(p.text, p.x, p.y);
                ctx.textAlign = 'left';
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    },

    clear() { this.list = []; }
};
