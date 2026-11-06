// 2. "Sos barbero, no recepcionista" — WhatsApp todo el día
const K = CFG.corte, C = ENG.C;
const MSG = ['¿tenés turno hoy?', '¿a qué hora cerrás?', '¿y mañana?', 'che estás?', '¿cuánto sale?', '¿me hacés lugar?', 'holaa', '¿hay lugar?', '¿barba también?', '???'];
function lluvia(G, lt, n = 10) {
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 'right' : 'left', x = side === 'left' ? 60 + G.rnd(i) * 100 : 940 - G.rnd(i + 5) * 100;
    G.bubble(lt, x, 230 + ((i * 131) % 1150) + lt * 30, MSG[i % MSG.length], { at: i * .09, side, size: 40, color: '#1F2C34' });
  }
}
VIDEO({
  title: 'No recepcionista',
  scenes: [
    { vo: `Cuarenta y siete mensajes por día. Y vos con la tijera en la mano.`, d: 2.4, theme: 'azul', tr: 'zoom', shake: 14, shakeDur: 2, sfx: [[0, 'buzz'], [.4, 'buzz'], [.8, 'buzz'], [1.2, 'boom']], draw(G, lt) {
      lluvia(G, lt); G.slam(lt, '47 MENSAJES', { y: 860, size: 170, at: 1.0, box: C.yellow, color: '#000' });
    } },
    T.list({ vo: `¿Tenés turno? ¿A qué hora? ¿Y mañana? Todo el día lo mismo.`, title: 'TODO EL DÍA:', items: [['💬', '¿Tenés turno?'], ['⏰', '¿A qué hora?'], ['📅', '¿Y mañana?'], ['🔁', 'Y otra vez…']], theme: 'rojo' }),
    T.num({ vo: `Si te lleva dos horas por día, son sesenta horas por mes contestando.`, label: 'Horas por mes contestando', to: 60, unit: ' H' }),
    T.slam({ vo: `Y mientras contestás, el que escribió primero se fue a otra barbería.`, t: 'SE FUE.', sub: 'a otra barbería', box: C.red, color: '#fff', d: 2.2 }),
    T.versus({ vo: `Sin link, sos recepcionista. Con link, el cliente se arregla solo.`, left: { t: 'SIN LINK', items: ['Contestás 47 chats', 'Cortás con el celu en la mano', 'Perdés al que no esperó'] }, right: { t: 'CON LINK', items: ['Ve los horarios libres', 'Reserva solo', 'Vos seguís cortando'] } }),
    T.phone({ vo: `Ponés tu link en Instagram y en WhatsApp. El cliente elige el horario y listo.`, title: 'El cliente *elige* *solo.*', screen: 'reserva' }),
    T.num({ vo: `De cuarenta y siete mensajes, a tres.`, label: 'Mensajes por día', from: 47, to: 3, theme: 'verde', color: C.green, sfx: [[1.1, 'cash']] }),
    T.slam({ vo: `Sos barbero. No recepcionista.`, t: 'BARBERO.', sub: 'No recepcionista.', d: 2 }),
    T.cta({ vo: `Comentá bárber y te paso el link de prueba.`, sub: 'y te paso el link' }),
  ],
});
