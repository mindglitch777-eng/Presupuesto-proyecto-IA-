// 3. "Tu cuaderno te está robando"
const K = CFG.corte, C = ENG.C;
VIDEO({
  title: 'El cuaderno te roba',
  scenes: [
    { vo: `Tu cuaderno te está robando plata.`, d: 2, theme: 'naranja', tr: 'zoom', shake: 20, sfx: [[0, 'boom'], [.4, 'hit']], draw(G, lt) {
      FX.hoja(G, G.CX, 1150, .8 + lt * .03); G.slam(lt, 'TU CUADERNO', { y: 300, size: 140 }); G.slam(lt, 'TE ROBA.', { y: 470, size: 170, at: .4, box: C.red, color: '#fff' });
    } },
    { vo: `Dos Martín anotados a la misma hora.`, d: 2, theme: 'rojo', sfx: [[.2, 'pop']], draw(G, lt) {
      FX.hoja(G, G.CX, 1000, 1 + lt * .08, .02); G.txt(lt, 'Dos Martín. *Misma* *hora.*', { y: 330, size: 90 });
    } },
    { vo: `Llegan los dos. Uno espera, se calienta, y se va.`, d: 2.4, theme: 'rojo', sfx: [[.7, 'hit'], [1.6, 'door']], draw(G, lt) {
      const p = G.E.out(G.prog(lt, 0, .7)), q = G.E.inOut(G.prog(lt, 1.4, .8));
      G.person(G.lerp(-150, 330, p) - q * 700, 1050, 1.3, lt > 1.2 ? C.red : '#fff'); G.person(G.lerp(1230, 670, p), 1050, 1.3, '#fff');
      if (lt > .7 && lt < 1.4) G.emoji(lt, '💥', G.CX, 880, 220, { at: .7 });
      G.txt(lt, 'Uno se va *caliente.*', { y: 420, size: 100, at: 1.2 });
    } },
    T.stat({ vo: `Y no vuelve más. ${P(K)} menos, cada vez.`, label: 'Y no vuelve más', to: -K, sub: 'CADA VEZ' }),
    T.list({ vo: `Y encima el cuaderno se moja, se pierde, no lo ves desde tu casa, y no te dice quién dejó de venir.`, title: 'EL CUADERNO:', items: [['💦', 'Se moja'], ['🌬️', 'Se pierde'], ['🏠', 'No lo ves desde casa'], ['❓', 'No sabés quién no volvió']], theme: 'naranja', d: 4 }),
    T.versus({ vo: `Cuaderno contra app. No hay comparación.`, left: { t: 'CUADERNO', items: ['Horarios pisados', 'Tachones', 'Solo en el local'] }, right: { t: 'APP', items: ['Imposible pisar un turno', 'Todo prolijo', 'Lo ves desde el celu'] } }),
    T.phone({ vo: `En la app, si un horario está ocupado, nadie lo puede reservar. Ni vos por error.`, title: 'Ocupado = *bloqueado.*', screen: 'agenda' }),
    T.slam({ vo: `Cero turnos pisados.`, t: 'CERO PISADOS.', box: C.green, d: 1.6 }),
    T.cta({ vo: `¿Seguís con el cuaderno? Comentá bárber y te paso la app.`, top: '¿Seguís con cuaderno?', sub: 'y te paso la app' }),
  ],
});
