// 1. "El turno fantasma" — el cliente que reserva y no viene
const K = CFG.corte, C = ENG.C;
VIDEO({
  title: 'El turno fantasma',
  scenes: [
    T.hook({ vo: `Sábado, diez de la mañana. Silla vacía. Te clavaron.`, emoji: '💈', lines: [{ t: 'SÁBADO 10:00', size: 110 }, { t: 'TE CLAVARON.', box: C.yellow, color: '#000' }] }),
    { vo: `Ni avisó. Ni contestó.`, d: 1.8, theme: 'rojo', sfx: [[.1, 'ticks:12:0.1']], draw(G, lt) {
      G.chair(G.CX, 1050, 1.35); G.clock(820, 520, 120, lt * 14);
      G.stack(lt, [['Ni avisó.', { size: 110 }], ['Ni *contestó.*', { size: 110, at: .5 }]], { y: 420 });
    } },
    T.stat({ vo: `Ese turno eran ${P(K)}. A la basura.`, label: 'Un turno fantasma', to: -K, sub: 'QUE NO ENTRARON' }),
    T.calc({ vo: `Tres por semana son doce por mes. ${P(K * 12)} tirados.`, rows: [['3 por semana', -K * 3], ['× 4 semanas', -K * 12]], total: -K * 12, d: 4 }),
    T.stat({ vo: `Y en un año: ${P(K * 144)}. Por gente que ni avisó.`, label: 'EN UN AÑO', from: -K * 12, to: -K * 144, sub: 'POR GENTE QUE NI AVISÓ' }),
    T.versus({ vo: `Mirá la diferencia entre atender sin seña y con seña.`, left: { t: 'SIN SEÑA', items: ['Reserva por WhatsApp', 'No avisa', 'Silla vacía'] }, right: { t: 'CON SEÑA', items: ['Reserva en tu link', 'Deja la seña', 'Viene, o la seña es tuya'] } }),
    T.phone({ vo: `Con la app, tu cliente reserva desde tu link y deja una seña por transferencia. Sin seña, no hay turno.`, title: 'Sin seña, *no* *hay* *turno.*', screen: 'sena', d: 3.4 }),
    T.slam({ vo: `¿Y sabés qué pasa? El que paga seña, viene.`, t: 'VIENE.', sub: 'El que paga seña…', box: C.green }),
    T.stat({ vo: `Y si igual falta, la seña ya es tuya.`, label: 'Y si igual falta…', from: -K, to: CFG.sena, sub: 'YA ES TUYA', pie: false }),
    T.cta({ vo: `Comentá bárber y te la paso para probar gratis ${N(CFG.diasPrueba)} días.`, sub: `gratis ${CFG.diasPrueba} días` }),
  ],
});
