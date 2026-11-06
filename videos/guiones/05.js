// 5. "¿Cuánto ganaste en octubre?" — no saber los números
const K = CFG.corte;
VIDEO({
  title: 'Cuánto ganaste',
  theme: 'neutral',
  scenes: [
    { vo: `¿Cuánto ganaste en octubre?`, d: 1.4, sfx: [[0, 'boom']], draw(G, lt) { G.txt(lt, '¿Cuánto ganaste en *octubre?*', { y: 820, size: 130, stagger: .07 }); } },
    { vo: `Sin mirar.`, d: .9, sfx: [[0, 'hit']], draw(G, lt) { G.txt(lt, '*SIN* *MIRAR.*', { y: 860, size: 170 }); } },
    { d: 2.1, theme: 'yellow', noPunch: true, sfx: [[0, 'tick'], [.7, 'tick'], [1.4, 'tick']], draw(G, lt) {
      const n = 3 - Math.floor(lt / .7), p = (lt % .7) / .7;
      G.withT(G.CX, 900, 1.3 - .3 * G.E.out(p), 0, 1 - p * .6, () => {
        G.ctx.font = `900 520px ${G.FONT}`; G.ctx.fillStyle = '#fff'; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle'; G.ctx.fillText(Math.max(1, n), 0, 0);
      });
    } },
    { vo: `No sabés.`, d: 1.5, theme: 'red', shake: 34, shakeDur: .7, sfx: [[0, 'boom'], [0, 'error']], draw(G, lt) { G.txt(lt, '*NO* *SABÉS.*', { y: 860, size: 180, boxColor: G.C.red }); } },
    { vo: `Efectivo en un cajón. Transferencias por acá. Mercado Pago por allá.`, d: 3.4, theme: 'red', sfx: [[0, 'whoosh'], [.8, 'whoosh'], [1.6, 'whoosh']], draw(G, lt) {
      [['💵', 'Efectivo en un cajón'], ['📲', 'Transferencias por acá'], ['💳', 'Mercado Pago por allá']].forEach(([e, t], i) => {
        const at = i * .8, k = G.prog(lt, at, .4);
        G.emoji(lt, e, 220 + Math.sin(lt * 3 + i) * 20, 520 + i * 320, 170, { at, rot: Math.sin(lt * 4 + i) * .3 });
        G.txt(lt, t, { x: 350, y: 520 + i * 320, size: 72, at: at + .05, align: 'left', maxW: 620, stagger: 0, a: k });
      });
    } },
    { vo: `Y a fin de mes: ¿dónde está la plata?`, d: 2.4, theme: 'red', sfx: [[0, 'pop'], [1.0, 'error']], draw(G, lt) {
      G.txt(lt, 'Y a fin de mes:', { y: 520, size: 84 });
      G.txt(lt, '“¿Dónde está la *plata?*”', { y: 700, size: 110, at: .4 });
      G.emoji(lt, '🗃️', G.CX, 1120, 260, { at: .9, rot: Math.sin(lt * 20) * .05 });
    } },
    { vo: `Ahora anoto cada corte con un toque.`, d: 2.8, theme: 'green', sfx: [[0, 'whoosh'], [1.0, 'pop'], [1.4, 'pop'], [1.8, 'pop']], draw(G, lt) {
      G.txt(lt, 'Ahora anoto cada corte *con* *un* *toque.*', { y: 290, size: 78 });
      G.phone(lt, G.CX, 1020, 1.35, (c, l) => {
        G.UI.header('Caja de hoy', 'Barbería Tomás');
        const taps = [1, 1.4, 1.8].filter(x => l > x).length;
        G.UI.label(230, 'ENTRÓ HOY', '#888', 24);
        G.UI.big(310, G.money(K * (9 + taps)), '#111', 70);
        G.UI.button(400, '+ Corte ' + G.money(K), G.C.green, Math.max(...[1, 1.4, 1.8].map(x => G.prog(l, x - .1, .25))));
        [1, 1.4, 1.8].forEach(x => G.UI.tap(200, 440, G.prog(l, x - .1, .35)));
        G.UI.button(500, '+ Barba', '#111');
        G.UI.label(640, `${9 + taps} cortes · 2 barbas`, '#555', 24);
      }, { at: .1 });
    } },
    { vo: `Y veo cuánto entró hoy, y en toda la semana.`, d: 2.6, theme: 'green', sfx: [[0, 'ticks:12:0.08'], [1.2, 'cash']], draw(G, lt) {
      G.stack(lt, [['Hoy', { size: 70, color: '#C9C9D6' }], ['', { h: 200, draw: y => G.cash(lt, 0, K * 12, { y, size: 190, dur: 1 }) }],
        ['Esta semana', { size: 70, color: '#C9C9D6', at: .5 }], ['', { h: 200, draw: y => G.cash(lt, 0, K * 54, { y, size: 190, at: .5, dur: 1 }) }]], { y: 860, gap: 30 });
    } },
    { vo: `Y sé qué día me conviene abrir.`, d: 2.8, theme: 'green', sfx: [[0, 'rise'], [1.3, 'pop']], draw(G, lt) {
      G.txt(lt, 'Y sé qué día *me* *conviene* abrir.', { y: 400, size: 84 });
      const H = [.35, .4, .55, .5, .8, 1, .2], D = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      H.forEach((h, i) => {
        const p = G.E.back(G.prog(lt, .3 + i * .08, .5)), bh = 560 * h * p, x = 140 + i * 115;
        G.ctx.fillStyle = h === 1 ? G.C.green : h < .3 ? G.C.red : '#3A3A48'; G.rr(x, 1350 - bh, 84, bh, 14); G.ctx.fill();
        G.txt(lt, D[i], { x: x + 42, y: 1400, size: 44, stagger: 0, weight: 800 });
      });
    } },
    { vo: `Respuesta honesta: ¿sabés cuánto ganaste?`, d: 2.6, theme: 'yellow', sfx: [[0, 'pop'], [.7, 'pop']], draw(G, lt) {
      G.stack(lt, [['Respuesta honesta:', { size: 76, color: '#C9C9D6' }], ['¿sabés cuánto *ganaste?*', { size: 104, at: .3 }]], { y: 720 });
      G.arrowDown(lt, G.CX, 1130, .7);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: .9, stagger: 0 });
    } },
    { d: 1.0, sfx: [[0, 'boom']], draw(G, lt) { G.txt(lt, '¿Cuánto ganaste en *octubre?*', { y: 820, size: 130, stagger: 0 }); } },
  ],
});
