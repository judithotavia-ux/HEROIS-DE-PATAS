// ============================================================
// ENTRADA DE TECLADO
// ============================================================
HDP.Input = {
    keys: {},
    pressedOnce: {},

    init() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key]) this.pressedOnce[e.key] = true;
            this.keys[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
        });
        window.addEventListener('keyup', (e) => { this.keys[e.key] = false; });
        window.addEventListener('blur', () => { this.keys = {}; });
    },

    isDown(...names) { return names.some(n => this.keys[n]); },

    // Usados pelos botões de toque (mobile) para simular teclas —
    // reaproveita exatamente a mesma lógica de keydown/keyup do teclado,
    // então o resto do jogo não precisa saber de onde a entrada veio.
    simulateDown(key) {
        if (!this.keys[key]) this.pressedOnce[key] = true;
        this.keys[key] = true;
    },
    simulateUp(key) { this.keys[key] = false; },

    consumePressed(...names) {
        for (const n of names) {
            if (this.pressedOnce[n]) { this.pressedOnce[n] = false; return true; }
        }
        return false;
    },

    clearFrame() { this.pressedOnce = {}; }
};
