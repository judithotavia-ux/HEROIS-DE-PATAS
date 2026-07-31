// ============================================================
// ANIMAIS RESGATÁVEIS (presos em gaiolas pelo mapa)
// ============================================================
HDP.RESCUE_ANIMALS = [
    { id: 'vira_lata', name: 'Vira-lata Assustado', kind: 'quadruped', earType: 'floppy', tailType: 'straight',
        palette: { body: '#C98A4B', spot: '#A8703A', belly: '#EAD2AE' }, small: true },
    { id: 'gatinho', name: 'Gatinho Perdido', kind: 'quadruped', earType: 'pointy', tailType: 'straight',
        palette: { body: '#9E9E9E', spot: '#787878', belly: '#E0E0E0' }, small: true },
    { id: 'coelhinho', name: 'Coelhinho Ferido', kind: 'quadruped', earType: 'long', tailType: 'puff',
        palette: { body: '#F5EDE0', spot: '#E0D2BC', belly: '#FFFFFF' }, small: true },
    { id: 'passarinho', name: 'Passarinho Machucado', kind: 'flyer', earType: 'none', tailType: 'feather',
        palette: { body: '#6FB3E0', spot: '#4A8FC2', belly: '#D6ECFA' }, small: true },
    { id: 'ourico', name: 'Ouriço Encolhido', kind: 'quadruped', earType: 'round', tailType: 'none',
        palette: { body: '#8B7355', spot: '#5C4A38', belly: '#D2B48C' }, small: true }
];

HDP.getRandomRescueAnimal = function () {
    return HDP.Util.choice(HDP.RESCUE_ANIMALS);
};
