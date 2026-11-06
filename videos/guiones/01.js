// 1. "Te clavaron" — el turno que no viene
const K = CFG.corte;
const pie = (G, lt) => G.txt(lt, `_Ejemplo_ _con_ _corte_ _a_ _${G.money(K)}_`, { y: 1480, size: 34, weight: 600, stagger: 0 });

VIDEO({
  title: 'Te clavaron',
  theme: 'red',
  scenes: [
    { d: 1.6, shake: 18, sfx: [[0, 'boom'], [.3, 'hit']], draw(G, lt) {
      G.chair(G.CX, 1080, 1.45 + lt * .05);
      G.stack(lt, [['SÁBADO 10:00', { size: 78, color: '#C9C9D6', stagger: 0 }], ['*TE* *CLAVARON.*', { size: 150, at: .3, stagger: .12 }]], { y: 400, gap: 20 });
    } },
    { d: 1.6, sfx: [[0, 'ticks:13:0.1'], [.85, 'hit']], draw(G, lt) {
      G.clock(G.CX, 760, 230, lt * 18);
      G.txt(lt, 'Llegó a las 10:20', { y: 1190, size: 78, strike: .45, stagger: 0 });
      G.txt(lt, '!Nunca! llegó.', { y: 1350, size: 120, at: .85 });
    } },
    { d: 1.5, shake: 26, sfx: [[0, 'error'], [0, 'hit']], draw(G, lt) {
      G.cash(lt, 0, -K, { y: 820, size: 230, dur: .6, sub: 'un corte que no entró' });
      for (let i = 0; i < 5; i++) G.emoji(lt, '💸', 200 + i * 150, 1250 - lt * 300 * (1 + i % 2), 110, { at: .2 + i * .08, rot: Math.sin(lt * 3 + i) * .4 });
    } },
    { d: 2.0, sfx: [[0, 'hit'], [.4, 'hit'], [.8, 'hit']], draw(G, lt) {
      G.stack(lt, [['Y el martes *otro.*', { size: 86 }], ['Y el jueves *otro.*', { size: 86, at: .6 }]], { y: 480, gap: 24 });
      ['MAR', 'JUE', 'SÁB'].forEach((d, i) => {
        const s = G.popS(lt, i * .4);
        if (s > 0) {
          G.withT(220 + i * 280, 1080, s * .62, 0, 1, () => G.chair(0, 0, 1));
          G.txt(lt, d, { x: 220 + i * 280, y: 800, size: 54, at: i * .4, stagger: 0, color: G.C.red });
        }
      });
    } },
    { d: 2.0, theme: 'yellow', sfx: [[0, 'whoosh']], draw(G, lt) {
      G.emoji(lt, '⏳', G.CX, 560, 200, { bob: 10 });
      G.stack(lt, [['Quedate hasta el final', { size: 82 }], ['que te muestro cuánto es *POR* *AÑO.*', { size: 96, at: .35 }]], { y: 960 });
    } },
    { d: 3.0, sfx: [[.2, 'ticks:16:0.1'], [1.9, 'hit']], draw(G, lt) {
      G.stack(lt, [['Te clavan *3* por semana', { size: 84 }], ['× 4 semanas', { size: 70, at: .25, color: '#C9C9D6' }]], { y: 540, gap: 24 });
      G.cash(lt, 0, -K * 12, { y: 940, size: 200, at: .3, dur: 1.6, sub: 'POR MES' });
      pie(G, lt);
    } },
    { d: 2.6, shake: 40, shakeDur: 1.1, sfx: [[0, 'boom'], [1.1, 'hit']], draw(G, lt) {
      G.cash(lt, -K * 12, -K * 144, { y: 860, size: 205, dur: 1.1 });
      G.txt(lt, '*POR* *AÑO.*', { y: 1120, size: 140, at: 1.1 });
      pie(G, lt);
    } },
    { d: 3.2, theme: 'neutral', sfx: [[.15, 'whoosh'], [1.75, 'pop'], [2.15, 'check']], draw(G, lt) {
      G.txt(lt, 'Ahora el que reserva deja una *seña.*', { y: 300, size: 74 });
      G.phone(lt, G.CX, 1010, 1.35, (c, l) => {
        G.UI.header('Reservá tu turno', 'Barbería Tomás');
        G.UI.row(176, '10:00', 'Sáb · Corte', 'TU TURNO', G.C.blue);
        c.fillStyle = '#fff'; G.rr(16, 290, G.PW - 32, 300, 22); c.fill();
        G.UI.label(340, 'Para confirmar, dejá una seña', '#555', 22);
        G.UI.big(410, G.money(CFG.sena), '#111', 72);
        G.UI.label(470, 'Alias: barberia.tomas', '#3D8BFF', 24);
        const paid = l > 1.6;
        G.UI.button(500, paid ? '✓ Seña recibida' : 'Ya transferí', paid ? G.C.green : '#111', G.prog(l, 1.45, .3));
        G.UI.tap(200, 540, G.prog(l, 1.45, .4));
        if (paid) G.UI.label(660, 'Turno confirmado', G.C.green, 30);
      }, { at: .15 });
    } },
    { d: 2.0, theme: 'green', sfx: [[0, 'pop'], [.5, 'hit'], [.8, 'cash']], draw(G, lt) {
      G.txt(lt, 'El que paga seña…', { y: 560, size: 96 });
      G.txt(lt, '*VIENE.*', { y: 760, size: 200, at: .5, boxColor: G.C.green });
      G.check(lt, G.CX, 1140, 120, .8);
    } },
    { d: 3.0, theme: 'green', sfx: [[.8, 'rise'], [2.0, 'cash']], draw(G, lt) {
      G.stack(lt, [['Y si no viene,', { size: 90 }], ['la seña ya está en +tu+ +cuenta.+', { size: 84, at: .35 }]], { y: 560, gap: 24 });
      G.cash(lt, -K, CFG.sena, { y: 980, size: 210, at: .8, dur: 1.2, color: lt < 1.5 ? G.C.red : G.C.green });
    } },
    { d: 2.6, theme: 'yellow', sfx: [[0, 'pop'], [.7, 'pop']], draw(G, lt) {
      G.txt(lt, '¿Cuántas veces te *clavaron* esta semana?', { y: 720, size: 96 });
      G.arrowDown(lt, G.CX, 1130, .7);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: .9, stagger: 0 });
    } },
    { d: 1.0, shake: 18, sfx: [[0, 'boom']], draw(G, lt) {
      G.chair(G.CX, 1080, 1.45);
      G.stack(lt, [['SÁBADO 10:00', { size: 78, color: '#C9C9D6', stagger: 0 }], ['*TE* *CLAVARON.*', { size: 150, a: 0 }]], { y: 400, gap: 20 });
    } },
  ],
});
