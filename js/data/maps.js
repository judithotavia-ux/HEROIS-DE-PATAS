// ============================================================
// MAPAS / FASES — campanha completa de 14 fases jogáveis
// (a "Fase 15 — O Grande Lar" é o final cinematográfico, não um
// mapa jogável: veja js/data/ending.js e HDP.Game.stageComplete)
// ============================================================
HDP.MAPS = {
    floresta: {
        id: 'floresta', name: 'Floresta Encantada', order: 1,
        sky: ['#1a3e2a', '#2d6b3f', '#0d2a1b'], ground: '#2d5016', groundTop: '#3a6b1e',
        decorColor: '#1f4d1f', worldMul: 2.2,
        enemyTypes: ['slime', 'morcego'], enemyCount: 6,
        itemCount: 22, rescueCount: 2,
        platformCount: 5,
        nextMapId: 'vila'
    },
    vila: {
        id: 'vila', name: 'Vila Abandonada', order: 2,
        sky: ['#3e2a1a', '#6b4f2d', '#2a1b0d'], ground: '#4a3520', groundTop: '#6b4f2d',
        decorColor: '#332211', worldMul: 2.6,
        enemyTypes: ['lobo', 'rato'], enemyCount: 8,
        itemCount: 26, rescueCount: 3,
        platformCount: 7,
        nextMapId: 'praia'
    },
    praia: {
        id: 'praia', name: 'Praia Tempestuosa', order: 3,
        sky: ['#1a2e3e', '#2d5a6b', '#0d1a2a'], ground: '#5a4a2d', groundTop: '#7a6740',
        decorColor: '#12303d', worldMul: 2.8,
        enemyTypes: ['caranguejo', 'gaivota'], enemyCount: 9,
        itemCount: 28, rescueCount: 3,
        platformCount: 7,
        nextMapId: 'covil'
    },
    covil: {
        id: 'covil', name: 'Covil Sombrio', order: 4,
        sky: ['#1a0a1a', '#3e1a3e', '#0a050a'], ground: '#2a1a2a', groundTop: '#3e2a3e',
        decorColor: '#150a15', worldMul: 3.0,
        enemyTypes: ['lobo', 'rato', 'morcego'], enemyCount: 8, boss: 'lobo_alfa',
        itemCount: 24, rescueCount: 3,
        platformCount: 8,
        nextMapId: 'caverna'
    },
    caverna: {
        id: 'caverna', name: 'Caverna Misteriosa', order: 5,
        sky: ['#0d0d1a', '#241f3d', '#050508'], ground: '#1f1a2e', groundTop: '#332a4d',
        decorColor: '#14101f', worldMul: 3.0,
        enemyTypes: ['morcego', 'rato'], enemyCount: 7,
        itemCount: 24, rescueCount: 2,
        platformCount: 10,
        nextMapId: 'jardim'
    },
    jardim: {
        id: 'jardim', name: 'Jardim das Flores', order: 6,
        sky: ['#fef6e4', '#f8d9c4', '#f2a9bf'], ground: '#5a8f3c', groundTop: '#7ab84f',
        decorColor: '#3d6b28', worldMul: 2.6,
        enemyTypes: ['slime'], enemyCount: 4,
        itemCount: 26, rescueCount: 4,
        platformCount: 6,
        nextMapId: 'selva'
    },
    selva: {
        id: 'selva', name: 'Selva Amazônica', order: 7,
        sky: ['#0a2e1a', '#1f5c34', '#04140a'], ground: '#2a4a1a', groundTop: '#3d6b28',
        decorColor: '#0d2a12', worldMul: 3.2,
        enemyTypes: ['onca', 'cobra', 'rato'], enemyCount: 10,
        itemCount: 28, rescueCount: 3,
        platformCount: 8,
        nextMapId: 'temporal'
    },
    temporal: {
        id: 'temporal', name: 'Temporal', order: 8,
        sky: ['#1a1f2e', '#33394d', '#0a0d14'], ground: '#2d3140', groundTop: '#454b5e',
        decorColor: '#161922', worldMul: 2.8,
        weather: 'storm',
        enemyTypes: ['lobo', 'morcego'], enemyCount: 8,
        itemCount: 24, rescueCount: 2,
        platformCount: 7,
        nextMapId: 'montanha'
    },
    montanha: {
        id: 'montanha', name: 'Montanha', order: 9,
        sky: ['#3d4a5c', '#6b7a8c', '#1a222e'], ground: '#5c5347', groundTop: '#7a6e5c',
        decorColor: '#3d362c', worldMul: 3.0,
        enemyTypes: ['rato', 'morcego'], enemyCount: 7,
        itemCount: 24, rescueCount: 2,
        platformCount: 12,
        nextMapId: 'cidade_abandonada'
    },
    cidade_abandonada: {
        id: 'cidade_abandonada', name: 'Cidade Abandonada', order: 10,
        sky: ['#2e2a26', '#4d453a', '#141210'], ground: '#3d372e', groundTop: '#5c5445',
        decorColor: '#211d18', worldMul: 3.2,
        enemyTypes: ['lobo', 'rato'], enemyCount: 8,
        itemCount: 24, rescueCount: 6,
        platformCount: 8,
        nextMapId: 'ferrovia'
    },
    ferrovia: {
        id: 'ferrovia', name: 'Ferrovia', order: 11,
        sky: ['#26282e', '#3d4147', '#121316'], ground: '#33332e', groundTop: '#4d4d45',
        decorColor: '#1a1a17', worldMul: 3.2,
        hazard: 'train',
        enemyTypes: ['rato', 'morcego'], enemyCount: 7,
        itemCount: 24, rescueCount: 2,
        platformCount: 9,
        nextMapId: 'cidade_grande'
    },
    cidade_grande: {
        id: 'cidade_grande', name: 'Cidade Grande', order: 12,
        sky: ['#0d1b3d', '#1f3a6b', '#050a1a'], ground: '#26263d', groundTop: '#3d3d5c',
        decorColor: '#161628', worldMul: 3.4,
        enemyTypes: ['lobo', 'rato'], enemyCount: 9,
        itemCount: 26, rescueCount: 3,
        platformCount: 8,
        nextMapId: 'base_capturadores'
    },
    base_capturadores: {
        id: 'base_capturadores', name: 'Base dos Capturadores', order: 13,
        sky: ['#1a1414', '#332020', '#0a0808'], ground: '#2e2626', groundTop: '#4a3a3a',
        decorColor: '#170f0f', worldMul: 3.4,
        enemyTypes: ['capturador'], enemyCount: 10,
        itemCount: 22, rescueCount: 8,
        platformCount: 8,
        nextMapId: 'batalha_final'
    },
    batalha_final: {
        id: 'batalha_final', name: 'Batalha Final', order: 14,
        sky: ['#2e0a0a', '#5c1414', '#140505'], ground: '#3d1a1a', groundTop: '#5c2a2a',
        decorColor: '#1f0a0a', worldMul: 3.4,
        heroSwitch: true,
        enemyTypes: ['capturador', 'lobo'], enemyCount: 9, boss: 'capturador_chefe',
        itemCount: 20, rescueCount: 2,
        platformCount: 8,
        nextMapId: null
    }
};

HDP.MAP_ORDER = [
    'floresta', 'vila', 'praia', 'covil', 'caverna', 'jardim', 'selva', 'temporal',
    'montanha', 'cidade_abandonada', 'ferrovia', 'cidade_grande', 'base_capturadores', 'batalha_final'
];
