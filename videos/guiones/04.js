// 4. "Este se fue. Y este. Y este." — la fila por orden de llegada
function banco(G, n = 4, y = 1120, col = '#5A5A6E') {
  G.ctx.fillStyle = '#2A2A36'; G.rr(120, y + 120, 760, 40, 14); G.ctx.fill();
  for (let i = 0; i < n; i++) G.person(200 + i * 200, y, .8, col);
}
function seVa(G, lt, at, label) {
  // alguien entra por la derecha, mira y se da vuelta
  const p = G.prog(lt, at, .9);
  if (p <= 0) return;
  const x = p < .45 ? G.lerp(1200, 900, G.E.out(p / .45)) : G.lerp(900, 1250, G.E.inOut((p - .45) / .55));
  G.person(x, 1000, 1.05, p > .45 ? G.C.red : '#fff');
  if (p > .2 && p < .7) G.emoji(lt, '😒', x, 760, 110, { at: at + .2 });
}

VIDEO({
  title: 'Este se fue',
  theme: 'red',
  scenes: [
    { d: 1.2, sfx: [[0, 'hit'], [.5, 'door']], draw(G, lt) { banco(G); seVa(G, lt, 0); G.txt(lt, '*ESTE* *SE* *FUE.*', { y: 420, size: 130, stagger: .08 }); } },
    { d: 1.0, sfx: [[0, 'hit'], [.45, 'door']], draw(G, lt) { banco(G); seVa(G, lt, 0); G.txt(lt, '*Y* *ESTE.*', { y: 420, size: 150 }); } },
    { d: 1.0, sfx: [[0, 'hit'], [.45, 'door']], draw(G, lt) { banco(G); seVa(G, lt, 0); G.txt(lt, '*Y* *ESTE.*', { y: 420, size: 170 }); } },
    { d: 2.0, shake: 30, shakeDur: .8, sfx: [[0, 'boom'], [0, 'error']], draw(G, lt) {
      G.cash(lt, 0, -CFG.corte * 3, { y: 820, size: 220, dur: .7 });
      G.txt(lt, 'en *10* *minutos.*', { y: 1080, size: 110, at: .5 });
    } },
    { d: 1.6, sfx: [[0, 'whoosh']], draw(G, lt) {
      G.stack(lt, [['No se van porque', { size: 90 }], ['no quieran *cortarse.*', { size: 96, at: .3 }]], { y: 820 });
    } },
    { d: 2.4, sfx: [[0, 'pop'], [.6, 'hit']], draw(G, lt) {
      banco(G, 4, 1200);
      G.stack(lt, [['Se van porque', { size: 90 }], ['*no* *saben* *cuánto* *falta.*', { size: 100, at: .3 }]], { y: 520 });
      G.withT(G.CX, 860, G.popS(lt, .6) * (1 + .05 * Math.sin(lt * 8)), 0, 1, () => {
        G.ctx.font = `900 280px ${G.FONT}`; G.ctx.fillStyle = G.C.yellow; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle'; G.ctx.fillText('?', 0, 0);
      });
    } },
    { d: 2.0, theme: 'neutral', sfx: [[0, 'whoosh'], [.4, 'pop']], draw(G, lt) {
      G.txt(lt, 'Ahora tengo un *QR* en la puerta.', { y: 360, size: 88 });
      const s = G.popS(lt, .3) * (1 + lt * .05);
      G.withT(G.CX, 980, s, 0, 1, () => G.qr(-230, -230, 460, 9));
      G.txt(lt, 'ANOTATE ACÁ', { y: 1330, size: 64, at: .6, color: G.C.yellow, stagger: 0 });
    } },
    { d: 2.4, theme: 'neutral', sfx: [[0, 'pop'], [.9, 'whoosh']], draw(G, lt) {
      G.stack(lt, [['Escanean, se anotan', { size: 88 }], ['y se van a tomar *un* *café.*', { size: 88, at: .4 }]], { y: 480 });
      const x = G.lerp(G.CX, 1250, G.E.inOut(G.prog(lt, .9, 1.2)));
      G.person(x, 1080, 1.1, '#fff'); G.emoji(lt, '☕', x + 110, 1040, 110, { at: .6 });
    } },
    { d: 3.2, theme: 'green', sfx: [[0, 'whoosh'], [1.0, 'tick'], [1.9, 'tick'], [2.6, 'check']], draw(G, lt) {
      G.txt(lt, 'Y en su celu ve esto:', { y: 280, size: 80 });
      G.phone(lt, G.CX, 1020, 1.35, (c, l) => {
        G.UI.header('Tu lugar en la fila', 'Barbería Tomás');
        const pos = l < 1 ? 3 : l < 1.9 ? 2 : 1;
        G.UI.label(250, 'VAS', '#888', 28);
        G.UI.big(370, pos + 'º', pos === 1 ? G.C.green : '#111', 190);
        G.UI.label(500, pos === 1 ? '¡Te toca! Vení ahora' : `faltan ~${pos * 12} min`, pos === 1 ? G.C.green : '#555', 32);
        [0, 1, 2, 3].forEach(i => { c.fillStyle = i < 4 - pos ? '#D5D7DD' : (i === 4 - pos ? G.C.green : '#111'); c.beginPath(); c.arc(110 + i * 60, 600, 18, 0, 7); c.fill(); });
        G.UI.label(680, 'Te avisamos acá cuando falte poco', '#888', 20);
      }, { at: .1 });
    } },
    { d: 2.0, theme: 'green', sfx: [[0, 'whoosh'], [.8, 'check']], draw(G, lt) {
      G.person(G.lerp(1250, G.CX, G.E.out(G.prog(lt, 0, .8))), 1080, 1.1, G.C.green);
      G.txt(lt, 'Vuelven *justo* cuando les toca.', { y: 460, size: 94, boxColor: G.C.green });
      G.check(lt, G.CX, 1420, 80, .8);
    } },
    { d: 2.2, theme: 'green', sfx: [[0, 'rise'], [.9, 'cash']], draw(G, lt) {
      G.stack(lt, [['El banco vacío.', { size: 96 }], ['La caja *llena.*', { size: 110, at: .4, boxColor: G.C.green }]], { y: 600 });
      G.cash(lt, -CFG.corte * 3, CFG.corte * 3, { y: 1050, size: 200, at: .5, dur: .9, color: lt < .9 ? G.C.red : G.C.green });
    } },
    { d: 2.4, theme: 'yellow', sfx: [[0, 'pop'], [.7, 'pop']], draw(G, lt) {
      G.txt(lt, '¿Atendés por orden *de* *llegada?*', { y: 720, size: 96 });
      G.arrowDown(lt, G.CX, 1130, .7);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: .9, stagger: 0 });
    } },
    { d: .9, sfx: [[0, 'hit']], draw(G, lt) { banco(G); G.txt(lt, '*ESTE* *SE* *FUE.*', { y: 420, size: 130, stagger: 0 }); } },
  ],
});
