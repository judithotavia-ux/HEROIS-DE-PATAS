// ============================================================
// BOOTSTRAP: inicialização e ligação dos eventos de UI
// ============================================================
(function () {
    function start() {
        HDP.Game.init(document.getElementById('game-canvas'));
        HDP.SaveManager.load();
        HDP.UI.refreshMainMenu();
        HDP.UI.renderCharacters();
        HDP.UI.renderMaps('maps-grid');

        // ----- MENU PRINCIPAL -----
        document.getElementById('btn-new-game').addEventListener('click', () => {
            HDP.Audio.init();
            HDP.Audio.click();
            HDP.UI.hideAllScreens();
            document.getElementById('game-container').classList.remove('hidden');
            HDP.Game.startMap(HDP.Progress.currentMapId || 'floresta');
        });
        document.getElementById('btn-characters').addEventListener('click', () => HDP.UI.openScreen('characters-screen'));
        document.getElementById('btn-maps').addEventListener('click', () => HDP.UI.openScreen('maps-screen'));
        document.getElementById('btn-inventory').addEventListener('click', () => HDP.UI.openScreen('inventory-screen'));
        document.getElementById('btn-missions').addEventListener('click', () => HDP.UI.openScreen('missions-screen'));
        document.getElementById('btn-credits').addEventListener('click', () => HDP.UI.openScreen('credits-screen'));
        document.getElementById('btn-reset').addEventListener('click', () => {
            if (confirm('Apagar todo o progresso salvo? Esta ação não pode ser desfeita.')) {
                HDP.SaveManager.resetAll();
                HDP.UI.refreshMainMenu();
                HDP.UI.renderCharacters();
                HDP.UI.renderMaps('maps-grid');
                HDP.Audio.click();
            }
        });

        // ----- BOTÕES DE VOLTAR -----
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => HDP.UI.openScreen('main-menu'));
        });

        // ----- PAUSA -----
        document.getElementById('btn-resume').addEventListener('click', () => HDP.Game.togglePause());
        document.getElementById('btn-save').addEventListener('click', () => HDP.Game.saveNow());
        document.getElementById('btn-missions-pause').addEventListener('click', () => HDP.UI.openScreen('missions-screen'));
        document.getElementById('btn-menu').addEventListener('click', () => {
            HDP.SaveManager.save();
            HDP.UI.backToMainMenu();
        });

        // ----- GAME OVER -----
        document.getElementById('go-retry').addEventListener('click', () => {
            document.getElementById('game-over').classList.remove('active');
            HDP.Game.startMap(HDP.Game.world.mapId);
        });
        document.getElementById('go-menu').addEventListener('click', () => HDP.UI.backToMainMenu());

        // ----- FINAL DA CAMPANHA -----
        document.getElementById('ending-credits-btn').addEventListener('click', () => {
            HDP.UI.backToMainMenu();
            HDP.UI.openScreen('credits-screen');
        });
        document.getElementById('ending-menu-btn').addEventListener('click', () => HDP.UI.backToMainMenu());

        console.log('🐾 Heróis de Patas - Web Edition carregado!');
        console.log('🎮 Controles: Setas/WASD mover, Espaço pular, J atacar, K especial, E resgatar, C trocar herói, P pausar, I inventário, M missões');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
