// ============================================================
// CONTROLES DE TOQUE (celular/tablet)
// Cria botões virtuais que simulam as mesmas teclas do teclado,
// então HDP.Game não precisa saber se a entrada veio de toque ou não.
// ============================================================
HDP.TouchControls = {
    built: false,

    init(container) {
        if (this.built) return;
        this.built = true;
        this.build(container);
    },

    build(container) {
        const wrap = document.createElement('div');
        wrap.className = 'touch-controls';
        wrap.innerHTML = `
            <div class="touch-pause-btn">⏸</div>
            <div class="touch-move">
                <div class="touch-btn move-btn" data-key="ArrowLeft">◀</div>
                <div class="touch-btn move-btn" data-key="ArrowRight">▶</div>
            </div>
            <div class="touch-actions">
                <div class="row-small">
                    <div class="touch-btn small-btn" data-key="E">🐾</div>
                    <div class="touch-btn small-btn" data-key="K">✨</div>
                    <div class="touch-btn small-btn" data-key="C">🔄</div>
                </div>
                <div class="row-big">
                    <div class="touch-btn big-btn" data-key="J">⚔️</div>
                    <div class="touch-btn big-btn jump-btn" data-key=" ">⤒</div>
                </div>
            </div>
        `;
        container.appendChild(wrap);

        wrap.querySelector('.touch-pause-btn').addEventListener('pointerdown', (e) => {
            e.preventDefault();
            HDP.Game.togglePause();
        }, { passive: false });

        wrap.querySelectorAll('.touch-btn').forEach((btn) => {
            const key = btn.dataset.key;
            const press = (e) => {
                e.preventDefault();
                // Captura o ponteiro para garantir o "pointerup" mesmo se o
                // dedo escorregar para fora do botão; se falhar (raro), o
                // toque ainda deve funcionar normalmente.
                try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
                btn.classList.add('pressed');
                HDP.Input.simulateDown(key);
            };
            const release = (e) => {
                e.preventDefault();
                btn.classList.remove('pressed');
                HDP.Input.simulateUp(key);
            };
            btn.addEventListener('pointerdown', press, { passive: false });
            btn.addEventListener('pointerup', release, { passive: false });
            btn.addEventListener('pointercancel', release, { passive: false });
            btn.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }
};
