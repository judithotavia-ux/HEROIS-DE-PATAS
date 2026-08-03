// ============================================================
// DADOS DOS PERSONAGENS JOGÁVEIS (10 heróis)
// ============================================================
HDP.CHARACTERS = {
    Fifi: {
        id: 'Fifi', name: 'Fifi', species: 'dog', title: '🌟 LÍDER',
        kind: 'quadruped', earType: 'floppy', tailType: 'wag',
        palette: { body: '#8B5A2B', spot: '#6B4226', belly: '#EED2AE' },
        accessory: { type: 'dress', color: '#FF6FA5', trim: '#FFC1DC' },
        portrait: 'assets/characters/fifi.png',
        stats: { hp: 100, attack: 15, defense: 10, speed: 1.15 },
        unlockCost: 0, isDefault: true,
        special: { name: 'Uivo de Liderança', desc: '+50% ataque por 6s', cooldown: 10, duration: 6, effect: 'atkBuff' },
        bio: 'A líder corajosa do grupo. Sempre à frente para proteger seus amigos, com seu vestidinho rosa favorito.'
    },
    Pretinha: {
        id: 'Pretinha', name: 'Pretinha', species: 'dog', title: '🌙 AGILIDADE',
        kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#2C2C34', spot: '#4A4A55', belly: '#6B6B78' },
        accessory: { type: 'bow', color: '#E31C3D' },
        portrait: 'assets/characters/pretinha.png',
        stats: { hp: 80, attack: 20, defense: 8, speed: 1.5 },
        unlockCost: 100, isDefault: false,
        special: { name: 'Investida Sombria', desc: 'Investida que causa dano em área', cooldown: 8, duration: 0.4, effect: 'dash' },
        bio: 'Rápida como a noite, ninguém consegue acompanhar seus passos — nem seu laço vermelho.'
    },
    Safira: {
        id: 'Safira', name: 'Safira', species: 'cat', title: '🎯 EQUILÍBRIO',
        kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#1A1A1A', spot: '#2E2E2E', belly: '#454545' },
        portrait: 'assets/characters/safira.png',
        stats: { hp: 90, attack: 18, defense: 12, speed: 1.3 },
        unlockCost: 150, isDefault: false,
        special: { name: 'Equilíbrio Felino', desc: 'Fica invulnerável por 3s', cooldown: 12, duration: 3, effect: 'invuln' },
        bio: 'Uma gata negra ágil e equilibrada, mestra em desviar de perigos.'
    },
    Spike: {
        id: 'Spike', name: 'Spike', species: 'dog', title: '⚡ VELOCIDADE',
        kind: 'quadruped', earType: 'floppy', tailType: 'curly',
        palette: { body: '#FAFAFA', spot: '#E2E2E2', belly: '#FFFFFF' },
        portrait: 'assets/characters/spike.png',
        stats: { hp: 70, attack: 22, defense: 6, speed: 1.8 },
        unlockCost: 120, isDefault: false,
        special: { name: 'Rajada Veloz', desc: 'Dobra a velocidade de ataque por 5s', cooldown: 9, duration: 5, effect: 'atkSpeed' },
        bio: 'Um poodle branco elétrico, o mais veloz de toda a matilha.'
    },
    Peludinho: {
        id: 'Peludinho', name: 'Peludinho', species: 'cat', title: '🧩 ENIGMAS',
        kind: 'quadruped', earType: 'round', tailType: 'straight',
        palette: { body: '#9E9E9E', spot: '#707070', belly: '#FFFFFF' },
        portrait: 'assets/characters/peludinho.png',
        stats: { hp: 85, attack: 16, defense: 14, speed: 1.1 },
        unlockCost: 80, isDefault: false,
        special: { name: 'Garra Enigmática', desc: 'Atordoa todos os inimigos próximos por 2s', cooldown: 11, duration: 2, effect: 'stun' },
        bio: 'Um gato pensativo e curioso, capaz de resolver qualquer enigma.'
    },
    Amora: {
        id: 'Amora', name: 'Amora', species: 'dog', title: '💚 CURA',
        kind: 'quadruped', earType: 'floppy', tailType: 'curly',
        palette: { body: '#FDFDF8', spot: '#E9E9E0', belly: '#FFFFFF' },
        portrait: 'assets/characters/amora.png',
        stats: { hp: 95, attack: 12, defense: 15, speed: 1.0 },
        unlockCost: 130, isDefault: false,
        special: { name: 'Toque Curativo', desc: 'Recupera 40% do HP máximo', cooldown: 14, duration: 0, effect: 'heal' },
        bio: 'Doce e gentil, sempre cuida dos ferimentos dos amigos.'
    },
    Benjamin: {
        id: 'Benjamin', name: 'Benjamin', species: 'cat', title: '🕵️ ESPIONAGEM',
        kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#FF8C00', spot: '#FFB347', belly: '#FFE4B5' },
        portrait: 'assets/characters/benjamim.png',
        stats: { hp: 88, attack: 19, defense: 9, speed: 1.4 },
        unlockCost: 110, isDefault: false,
        special: { name: 'Ataque Furtivo', desc: 'Próximo ataque é crítico (3x dano)', cooldown: 10, duration: 0, effect: 'crit' },
        bio: 'Um gato laranja astuto, especialista em se infiltrar sem ser visto.'
    },
    Sansao: {
        id: 'Sansao', name: 'Sansão', species: 'dog', title: '💪 FORÇA',
        kind: 'quadruped', earType: 'floppy', tailType: 'wag',
        palette: { body: '#6B4226', spot: '#4A2E18', belly: '#A8785A' },
        portrait: 'assets/characters/sansao.png',
        stats: { hp: 110, attack: 20, defense: 16, speed: 0.9 },
        unlockCost: 95, isDefault: false,
        special: { name: 'Investida Poderosa', desc: 'Investida que esmaga inimigos próximos', cooldown: 9, duration: 0.4, effect: 'dash' },
        bio: 'Forte e leal, empurra pedras e quebra obstáculos para abrir caminho aos amigos.'
    },
    Toto: {
        id: 'Toto', name: 'Totó', species: 'dog', title: '🧭 EXPLORAÇÃO',
        kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#A0754D', spot: '#7A5633', belly: '#E8D3B0' },
        accessory: { type: 'bandana', color: '#3FA84A' },
        portrait: 'assets/characters/toto.png',
        stats: { hp: 80, attack: 14, defense: 8, speed: 1.6 },
        unlockCost: 100, isDefault: false,
        special: { name: 'Faro Explorador', desc: '+60% de velocidade de movimento por 6s', cooldown: 9, duration: 6, effect: 'speedBoost' },
        bio: 'Curioso e destemido, sempre encontra atalhos e segredos escondidos pelo mapa.'
    },
    Zarolho: {
        id: 'Zarolho', name: 'Zarolho', species: 'cat', title: '👁️ PERCEPÇÃO',
        kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#E8963C', spot: '#C97820', belly: '#FCE0B8' },
        eyeStyle: 'asymmetric',
        portrait: 'assets/characters/zarolho.png',
        stats: { hp: 85, attack: 17, defense: 10, speed: 1.2 },
        unlockCost: 140, isDefault: false,
        special: { name: 'Visão Aguçada', desc: 'Revela itens e gaiolas próximas por 8s', cooldown: 12, duration: 8, effect: 'reveal' },
        bio: 'Perdeu parte da visão num resgate, mas nada escapa ao seu outro olho atento — um de seus olhinhos é maior que o outro, e é assim que o reconhecemos.'
    }
};

HDP.CHARACTER_ORDER = ['Fifi', 'Pretinha', 'Safira', 'Spike', 'Peludinho', 'Amora', 'Benjamin', 'Sansao', 'Toto', 'Zarolho'];

// ----- MENTORA (não jogável — aparece nos créditos) -----
HDP.MENTOR = {
    name: 'Maria Estela',
    role: 'A Tutora da Fifi — jamais esquecida',
    quote: '"Seja sempre essa cachorrinha dócil e gentil."',
    verseRef: 'Provérbios 12:10',
    verseText: '"O justo atenta para a vida dos seus animais, mas o coração dos perversos é cruel."',
    // Coloque o arquivo da foto real em web-game/assets/maria-estela.jpg
    photo: 'assets/maria-estela.jpg'
};

HDP.DEVELOPER_CREDIT = 'Desenvolvido por Judith Otavia Margarido de Andrade';

// ----- FINAL DA CAMPANHA (Fase 15 — O Grande Lar, cutscene) -----
HDP.ENDING = {
    title: '🏡 O GRANDE LAR',
    subtitle: 'Vitória! Todos os animais foram adotados e o jardim foi reconstruído.',
    dialogue: 'Seja sempre essa cachorrinha dócil e mansa.',
    signature: '— Maria Estela'
};
