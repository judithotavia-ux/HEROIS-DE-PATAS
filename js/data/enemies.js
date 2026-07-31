// ============================================================
// DADOS DE INIMIGOS
// ============================================================
HDP.ENEMY_TYPES = {
    slime: { id: 'slime', name: 'Gosma', kind: 'blob', palette: { body: '#5FD068', spot: '#3FA84A' },
        hp: 22, attack: 6, defense: 2, speedMul: 0.8, xp: 12, size: 26 },
    morcego: { id: 'morcego', name: 'Morcego', kind: 'flyer', palette: { body: '#5B3A70', spot: '#3E2650' },
        hp: 16, attack: 8, defense: 1, speedMul: 1.3, xp: 14, size: 24, flies: true },
    lobo: { id: 'lobo', name: 'Lobo', kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#6B6B6B', spot: '#4A4A4A', belly: '#9A9A9A' },
        hp: 34, attack: 11, defense: 4, speedMul: 1.1, xp: 20, size: 30 },
    rato: { id: 'rato', name: 'Rato Gigante', kind: 'quadruped', earType: 'round', tailType: 'straight',
        palette: { body: '#8A7A6A', spot: '#6B5C4E', belly: '#B5A794' },
        hp: 20, attack: 7, defense: 2, speedMul: 1.2, xp: 13, size: 24 },
    caranguejo: { id: 'caranguejo', name: 'Caranguejo', kind: 'crawler', palette: { body: '#E05D3C', spot: '#B8431F' },
        hp: 26, attack: 9, defense: 6, speedMul: 0.7, xp: 16, size: 26 },
    gaivota: { id: 'gaivota', name: 'Gaivota Feroz', kind: 'flyer', palette: { body: '#E8E8E8', spot: '#C0C0C0' },
        hp: 18, attack: 8, defense: 1, speedMul: 1.4, xp: 15, size: 22, flies: true },
    lobo_alfa: { id: 'lobo_alfa', name: 'Lobo Alfa', kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#2E2E2E', spot: '#1A1A1A', belly: '#555555' },
        hp: 90, attack: 16, defense: 8, speedMul: 1.0, xp: 80, size: 40, boss: true },
    onca: { id: 'onca', name: 'Onça-pintada', kind: 'quadruped', earType: 'round', tailType: 'straight',
        palette: { body: '#E8A33D', spot: '#2A1A0A', belly: '#FCE0B0' },
        hp: 40, attack: 14, defense: 6, speedMul: 1.3, xp: 24, size: 32 },
    cobra: { id: 'cobra', name: 'Cobra', kind: 'serpent', palette: { body: '#4C7A3A', spot: '#7FAF5A' },
        hp: 18, attack: 10, defense: 3, speedMul: 1.0, xp: 16, size: 30 },
    capturador: { id: 'capturador', name: 'Capturador', kind: 'biped',
        palette: { body: '#C99770', hair: '#3A2A1A', clothes: '#3D3D3D' },
        hp: 38, attack: 12, defense: 5, speedMul: 1.0, xp: 26, size: 34 },
    capturador_chefe: { id: 'capturador_chefe', name: 'Chefe dos Capturadores', kind: 'biped',
        palette: { body: '#B98860', hair: '#1A1A1A', clothes: '#7A1F1F' },
        hp: 150, attack: 20, defense: 12, speedMul: 0.9, xp: 160, size: 44, boss: true }
};
