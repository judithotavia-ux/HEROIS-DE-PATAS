// ============================================================
// MISSÕES (definidas por mapa)
// missionDef: { id, mapId, type, target, label, emoji, required, reward:{coins,bones,xp} }
// type: 'kills' | 'bones' | 'coins' | 'rescue'
// ============================================================
HDP.MISSIONS = [
    // ---- Floresta Encantada ----
    { id: 'floresta_kills', mapId: 'floresta', type: 'kills', target: 5, label: 'Derrote inimigos', emoji: '👾', required: true, reward: { coins: 30, bones: 2, xp: 40 } },
    { id: 'floresta_bones', mapId: 'floresta', type: 'bones', target: 8, label: 'Colete ossos', emoji: '🦴', required: false, reward: { coins: 20, bones: 0, xp: 20 } },
    { id: 'floresta_rescue', mapId: 'floresta', type: 'rescue', target: 1, label: 'Resgate animais', emoji: '🐾', required: true, reward: { coins: 40, bones: 1, xp: 30 } },

    // ---- Vila Abandonada ----
    { id: 'vila_kills', mapId: 'vila', type: 'kills', target: 7, label: 'Derrote inimigos', emoji: '👾', required: true, reward: { coins: 45, bones: 2, xp: 55 } },
    { id: 'vila_coins', mapId: 'vila', type: 'coins', target: 18, label: 'Colete moedas', emoji: '🪙', required: false, reward: { coins: 0, bones: 3, xp: 25 } },
    { id: 'vila_rescue', mapId: 'vila', type: 'rescue', target: 2, label: 'Resgate animais', emoji: '🐾', required: true, reward: { coins: 60, bones: 2, xp: 45 } },

    // ---- Praia Tempestuosa ----
    { id: 'praia_kills', mapId: 'praia', type: 'kills', target: 8, label: 'Derrote inimigos', emoji: '👾', required: true, reward: { coins: 55, bones: 3, xp: 65 } },
    { id: 'praia_bones', mapId: 'praia', type: 'bones', target: 12, label: 'Colete ossos', emoji: '🦴', required: false, reward: { coins: 30, bones: 0, xp: 30 } },
    { id: 'praia_rescue', mapId: 'praia', type: 'rescue', target: 2, label: 'Resgate animais', emoji: '🐾', required: true, reward: { coins: 70, bones: 2, xp: 50 } },

    // ---- Covil Sombrio ----
    { id: 'covil_boss', mapId: 'covil', type: 'kills', target: 9, label: 'Derrote todos, incl. o chefe', emoji: '👹', required: true, reward: { coins: 150, bones: 5, xp: 150 } },
    { id: 'covil_rescue', mapId: 'covil', type: 'rescue', target: 3, label: 'Resgate animais', emoji: '🐾', required: true, reward: { coins: 100, bones: 4, xp: 80 } },

    // ---- Caverna Misteriosa (enigmas, Peludinho ajuda) ----
    { id: 'caverna_kills', mapId: 'caverna', type: 'kills', target: 6, label: 'Derrote inimigos', emoji: '👾', required: true, reward: { coins: 60, bones: 3, xp: 70 } },
    { id: 'caverna_enigma', mapId: 'caverna', type: 'bones', target: 10, label: 'Resolva os enigmas (colete ossos escondidos)', emoji: '🧩', required: false, reward: { coins: 40, bones: 0, xp: 35 } },
    { id: 'caverna_rescue', mapId: 'caverna', type: 'rescue', target: 1, label: 'Resgate na passagem secreta', emoji: '🐾', required: true, reward: { coins: 70, bones: 3, xp: 55 } },

    // ---- Jardim das Flores ----
    { id: 'jardim_amora', mapId: 'jardim', type: 'rescue', target: 1, label: 'Encontre a Amora', emoji: '🌺', required: true, reward: { coins: 50, bones: 2, xp: 45 } },
    { id: 'jardim_doentes', mapId: 'jardim', type: 'rescue', target: 3, label: 'Recupere os animais doentes', emoji: '💊', required: false, reward: { coins: 60, bones: 3, xp: 60 } },

    // ---- Selva Amazônica ----
    { id: 'selva_kills', mapId: 'selva', type: 'kills', target: 8, label: 'Sobreviva às onças e cobras', emoji: '🐆', required: true, reward: { coins: 75, bones: 4, xp: 85 } },
    { id: 'selva_bones', mapId: 'selva', type: 'bones', target: 11, label: 'Colete ossos entre as árvores gigantes', emoji: '🌳', required: false, reward: { coins: 40, bones: 0, xp: 35 } },
    { id: 'selva_rescue', mapId: 'selva', type: 'rescue', target: 2, label: 'Resgate animais na selva', emoji: '🐾', required: true, reward: { coins: 80, bones: 3, xp: 65 } },

    // ---- Temporal ----
    { id: 'temporal_kills', mapId: 'temporal', type: 'kills', target: 6, label: 'Sobreviva à tempestade', emoji: '⛈️', required: true, reward: { coins: 65, bones: 3, xp: 75 } },
    { id: 'temporal_coins', mapId: 'temporal', type: 'coins', target: 14, label: 'Colete moedas na chuva', emoji: '🪙', required: false, reward: { coins: 0, bones: 4, xp: 30 } },
    { id: 'temporal_rescue', mapId: 'temporal', type: 'rescue', target: 1, label: 'Resgate animais', emoji: '🐾', required: true, reward: { coins: 70, bones: 3, xp: 55 } },

    // ---- Montanha ----
    { id: 'montanha_kills', mapId: 'montanha', type: 'kills', target: 5, label: 'Derrote inimigos na escalada', emoji: '👾', required: true, reward: { coins: 65, bones: 3, xp: 75 } },
    { id: 'montanha_bones', mapId: 'montanha', type: 'bones', target: 9, label: 'Colete ossos entre as rochas', emoji: '🪨', required: false, reward: { coins: 35, bones: 0, xp: 30 } },
    { id: 'montanha_rescue', mapId: 'montanha', type: 'rescue', target: 1, label: 'Resgate no penhasco', emoji: '🐾', required: true, reward: { coins: 75, bones: 3, xp: 60 } },

    // ---- Cidade Abandonada ----
    { id: 'cidade_abandonada_caes', mapId: 'cidade_abandonada', type: 'rescue', target: 3, label: 'Resgate cães', emoji: '🐕', required: true, reward: { coins: 60, bones: 3, xp: 60 } },
    { id: 'cidade_abandonada_gatos', mapId: 'cidade_abandonada', type: 'rescue', target: 6, label: 'Resgate gatos', emoji: '🐱', required: true, reward: { coins: 90, bones: 4, xp: 80 } },
    { id: 'cidade_abandonada_kills', mapId: 'cidade_abandonada', type: 'kills', target: 6, label: 'Derrote inimigos', emoji: '👾', required: false, reward: { coins: 40, bones: 0, xp: 40 } },

    // ---- Ferrovia ----
    { id: 'ferrovia_kills', mapId: 'ferrovia', type: 'kills', target: 5, label: 'Derrote inimigos nos trilhos', emoji: '👾', required: true, reward: { coins: 70, bones: 3, xp: 80 } },
    { id: 'ferrovia_bones', mapId: 'ferrovia', type: 'bones', target: 9, label: 'Colete ossos', emoji: '🦴', required: false, reward: { coins: 40, bones: 0, xp: 30 } },
    { id: 'ferrovia_rescue', mapId: 'ferrovia', type: 'rescue', target: 1, label: 'Resgate animais — cuidado com o trem!', emoji: '🚂', required: true, reward: { coins: 85, bones: 3, xp: 65 } },

    // ---- Cidade Grande ----
    { id: 'cidade_grande_kills', mapId: 'cidade_grande', type: 'kills', target: 7, label: 'Missão urbana: proteja os animais de rua', emoji: '🏙️', required: true, reward: { coins: 80, bones: 4, xp: 90 } },
    { id: 'cidade_grande_coins', mapId: 'cidade_grande', type: 'coins', target: 16, label: 'Ajude moradores a coletar doações', emoji: '🪙', required: false, reward: { coins: 0, bones: 4, xp: 35 } },
    { id: 'cidade_grande_rescue', mapId: 'cidade_grande', type: 'rescue', target: 2, label: 'Resgate animais na cidade', emoji: '🐾', required: true, reward: { coins: 90, bones: 4, xp: 70 } },

    // ---- Base dos Capturadores ----
    { id: 'base_kills', mapId: 'base_capturadores', type: 'kills', target: 8, label: 'Elimine os capturadores', emoji: '🕵️', required: true, reward: { coins: 100, bones: 5, xp: 110 } },
    { id: 'base_rescue', mapId: 'base_capturadores', type: 'rescue', target: 6, label: 'Liberte dezenas de animais presos', emoji: '🔓', required: true, reward: { coins: 130, bones: 6, xp: 120 } },
    { id: 'base_bones', mapId: 'base_capturadores', type: 'bones', target: 8, label: 'Colete suprimentos', emoji: '🦴', required: false, reward: { coins: 50, bones: 0, xp: 40 } },

    // ---- Batalha Final ----
    { id: 'final_boss', mapId: 'batalha_final', type: 'kills', target: 10, label: 'Derrote o exército e o Chefe dos Capturadores', emoji: '👑', required: true, reward: { coins: 200, bones: 8, xp: 220 } },
    { id: 'final_rescue', mapId: 'batalha_final', type: 'rescue', target: 2, label: 'Resgate os últimos animais', emoji: '🐾', required: false, reward: { coins: 100, bones: 4, xp: 90 } }
];

HDP.getMissionsForMap = function (mapId) {
    return HDP.MISSIONS.filter(m => m.mapId === mapId);
};
