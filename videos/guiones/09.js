// 9. "Como la otra vez" — acordarte del corte de cada cliente
function globo(G, lt, text, at = 0) {
  const s = G.popS(lt, at, .3); if (s <= 0) return;
  G.withT(G.CX, 560, s, -.03, 1, () => {
    const c = G.ctx; c.fillStyle = '#fff'; G.rr(-420, -170, 840, 300, 60); c.fill();
    c.beginPath(); c.moveTo(-120, 120); c.lineTo(-200, 230); c.lineTo(-20, 125); c.fill();
  });
  G.txt(lt, text, { y: 540, size: 84, color: '#0A0A0F', shadow: false, at, maxW: 740 });
}

VIDEO({
  title: 'Como la otra vez',
  theme: 'blue',
  scenes: [
    { vo: `Hacémelo como la otra vez.`, d: 1.7, sfx: [[0, 'pop'], [0, 'hit']], draw(G, lt) { globo(G, lt, '“Hacémelo como la otra vez.”'); G.person(G.CX - 120, 1150, 1.2, '#fff'); } },
    { d: 1.8, noPunch: true, sfx: [[.3, 'tick'], [1.2, 'tick']], draw(G, lt) {
      G.withT(G.CX, 900, 1 + lt * .15, 0, 1, () => {
        const c = G.ctx; c.fillStyle = '#F2C9A0'; c.beginPath(); c.arc(0, 0, 260, 0, 7); c.fill();
        c.fillStyle = '#0A0A0F'; c.beginPath(); c.arc(-90, -30, 26, 0, 7); c.arc(90, -30, 26, 0, 7); c.fill();
        c.fillRect(-70, 110, 140, 14);
      });
      G.txt(lt, '…', { y: 1340, size: 200, at: .4 });
    } },
    { vo: `¿Era un uno o un dos al costado? ¿Bajo, o medio?`, d: 2.2, theme: 'red', sfx: [[0, 'pop'], [.3, 'pop'], [.6, 'pop'], [.9, 'pop']], draw(G, lt) {
      G.stack(lt, [['¿Era un *1* o un *2* al costado?', { size: 88 }], ['¿Bajo o *medio?*', { size: 96, at: .6 }]], { y: 560 });
      for (let i = 0; i < 8; i++) G.txt(lt, '?', { x: 130 + G.rnd(i) * 760, y: 900 + ((lt * 400 + i * 150) % 600), size: 120, color: G.C.yellow, at: .2 + i * .1, stagger: 0 });
    } },
    { vo: `Le errás por medio número, y no vuelve.`, d: 2.4, theme: 'red', shake: 26, shakeDur: .8, sfx: [[0, 'hit'], [.8, 'error']], draw(G, lt) {
      G.stack(lt, [['Le errás por medio número', { size: 86 }], ['y *no* *vuelve.*', { size: 110, at: .4, boxColor: G.C.red }]], { y: 600 });
      G.cash(lt, 0, -CFG.corte, { y: 1050, size: 180, at: .8, dur: .4 });
    } },
    { vo: `Ahora cada cliente tiene su ficha.`, d: 3.4, theme: 'neutral', sfx: [[0, 'whoosh'], [1.2, 'pop'], [1.5, 'pop'], [1.8, 'pop'], [2.1, 'pop']], draw(G, lt) {
      G.txt(lt, 'Ahora cada cliente tiene *su* *ficha.*', { y: 290, size: 80 });
      G.phone(lt, G.CX, 1030, 1.35, (c, l) => {
        G.UI.header('Lucas M.', 'Ficha de cliente');
        G.UI.label(200, 'Viene cada 15 días · último: 12/10', '#888', 20);
        [['Corte', 'Degradé bajo'], ['Costado', 'Máquina 1'], ['Arriba', 'Tijera, corto'], ['Barba', 'Perfilada']].forEach((r, i) => {
          G.UI.row(240 + i * 96, r[0], '', r[1], '#111', G.prog(l, 1.1 + i * .3, .2));
        });
      }, { at: .1 });
    } },
    { vo: `Hasta anoto de qué cuadro es.`, d: 2.6, theme: 'yellow', sfx: [[0, 'pop'], [1.0, 'pop']], draw(G, lt) {
      G.txt(lt, 'Hasta anoto *de* *qué* *cuadro* es.', { y: 420, size: 88 });
      G.phone(lt, G.CX, 1180, 1.05, (c, l) => {
        G.UI.header('Lucas M.', 'Notas');
        c.fillStyle = '#FFF6CC'; G.rr(16, 180, G.PW - 32, 150, 18); c.fill();
        G.UI.label(230, 'Hincha de Boca', '#111', 30); G.UI.label(280, 'No hablar de Madrid 😅', '#B34', 26);
      }, { at: .4 });
    } },
    { vo: `Lo de siempre. Perfecto.`, d: 2.2, theme: 'green', sfx: [[0, 'hit'], [.5, 'cash']], draw(G, lt) {
      G.txt(lt, '“Lo de siempre” → *perfecto.*', { y: 600, size: 100, boxColor: G.C.green });
      G.check(lt, G.CX, 1020, 130, .5);
    } },
    { vo: `¿Te pasó? Contame.`, d: 2.4, theme: 'yellow', sfx: [[0, 'pop'], [.7, 'pop']], draw(G, lt) {
      G.txt(lt, '¿Te pasó? *Contame.*', { y: 720, size: 110 });
      G.arrowDown(lt, G.CX, 1130, .7);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: .9, stagger: 0 });
    } },
    { d: 1.0, sfx: [[0, 'pop']], draw(G, lt) { globo(G, lt, '“Hacémelo como la otra vez.”'); G.person(G.CX - 120, 1150, 1.2, '#fff'); } },
  ],
});
