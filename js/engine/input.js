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

    consumePressed(...names) {
        for (const n of names) {
            if (this.pressedOnce[n]) { this.pressedOnce[n] = false; return true; }
        }
        return false;
    },

    clearFrame() { this.pressedOnce = {}; }
};
