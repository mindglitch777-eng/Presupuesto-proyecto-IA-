// 7. "Sábado explotado, martes muerto" — días desparejos
function split(G, lt, sab = 12, mar = 0, k = 1) {
  const c = G.ctx;
  c.fillStyle = 'rgba(255,46,62,.12)'; c.fillRect(0, 380, 540, 1150);
  c.fillStyle = 'rgba(120,120,140,.08)'; c.fillRect(540, 380, 540, 1150);
  c.fillStyle = '#fff'; c.fillRect(538, 380, 4, 1150);
  G.txt(lt, 'SÁBADO', { x: 270, y: 470, size: 70, stagger: 0, color: G.C.red });
  G.txt(lt, 'MARTES', { x: 810, y: 470, size: 70, stagger: 0, color: '#C9C9D6' });
  for (let i = 0; i < sab; i++) {
    const jx = Math.sin(lt * 9 + i) * 6 * k;
    G.person(90 + (i % 4) * 120 + jx, 760 + Math.floor(i / 4) * 260, .55, '#fff');
  }
  for (let i = 0; i < mar; i++) G.person(630 + (i % 3) * 120, 760 + Math.floor(i / 3) * 260, .55, G.C.green);
  if (mar === 0) { G.chair(810, 1080, .55); G.emoji(lt, '🦗', 900, 1260, 90); }
}

VIDEO({
  title: 'Martes muerto',
  theme: 'neutral',
  scenes: [
    { d: 2.0, sfx: [[0, 'boom'], [.1, 'crowd'], [1.0, 'cricket']], draw(G, lt) { split(G, lt); G.txt(lt, '¿Te pasa *esto?*', { y: 260, size: 96 }); } },
    { d: 1.6, theme: 'red', shake: 16, shakeDur: 1.6, sfx: [[0, 'crowd'], [0, 'hit']], draw(G, lt) {
      split(G, lt, 12, 0, 3); G.txt(lt, 'El sábado *no* *das* *abasto.*', { y: 260, size: 86 });
    } },
    { d: 2.0, noPunch: true, sfx: [[0, 'cricket']], draw(G, lt) {
      G.chair(G.CX, 1000, 1.2 + lt * .08); G.emoji(lt, '🦗', 760, 1300, 140, { bob: 6 });
      G.txt(lt, 'El martes mirás *el* *techo.*', { y: 360, size: 96 });
    } },
    { d: 2.0, theme: 'red', shake: 20, sfx: [[0, 'whoosh'], [.5, 'hit']], draw(G, lt) {
      G.stack(lt, [['Y el alquiler', { size: 96 }], ['lo pagás *los* *7* *días.*', { size: 100, at: .4 }]], { y: 600 });
      G.emoji(lt, '🧾', G.CX, 1180 + (1 - G.E.out(G.prog(lt, .4, .5))) * -500, 260, { at: .4, rot: -.15 });
    } },
    { d: 3.2, theme: 'yellow', sfx: [[0, 'whoosh'], [1.4, 'hit']], draw(G, lt) {
      G.stack(lt, [['Lo que hice:', { size: 76, color: '#C9C9D6' }], ['*PUNTOS* *DOBLES* los martes.', { size: 96, at: .3 }]], { y: 360, gap: 24 });
      G.phone(lt, G.CX, 1170, 1.1, (c, l) => {
        G.UI.header('Tu tarjeta de puntos', 'Barbería Tomás');
        for (let i = 0; i < 10; i++) {
          const x = 50 + (i % 5) * 62, y = 210 + Math.floor(i / 5) * 72, on = i < 3 + (l > 1.3 ? 2 : 0);
          c.fillStyle = on ? (i >= 3 ? G.C.yellow : '#111') : '#E3E4E8'; c.beginPath(); c.arc(x + 26, y + 26, 26, 0, 7); c.fill();
        }
        G.UI.label(400, l > 1.3 ? '+2 por venir un martes' : '3 de 10', l > 1.3 ? '#C79A00' : '#555', 26);
        G.qr(110, 450, 180, 4);
      }, { at: .2 });
    } },
    { d: 2.6, theme: 'yellow', sfx: [[0, 'ticks:10:0.12'], [1.3, 'cash']], draw(G, lt) {
      G.stack(lt, [['Al *10º* corte,', { size: 100 }], ['el siguiente es *gratis.*', { size: 96, at: .3 }]], { y: 480, gap: 24 });
      const n = Math.min(10, Math.floor(lt * 8));
      for (let i = 0; i < 10; i++) {
        const x = 150 + (i % 5) * 160, y = 850 + Math.floor(i / 5) * 170;
        G.ctx.fillStyle = i < n ? G.C.yellow : '#2A2A36'; G.ctx.beginPath(); G.ctx.arc(x, y, 60, 0, 7); G.ctx.fill();
        if (i < n) { G.ctx.font = `60px "Noto Color Emoji"`; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle'; G.ctx.fillText('✂️', x, y + 4); }
      }
      if (lt > 1.3) G.emoji(lt, '🎁', G.CX, 1300, 140, { at: 1.3 });
    } },
    { d: 3.0, theme: 'green', sfx: [[.2, 'whoosh'], [.7, 'whoosh'], [1.2, 'whoosh'], [2.0, 'check']], draw(G, lt) {
      const moved = Math.floor(G.clamp((lt - .2) / 1.5) * 5);
      split(G, lt, 12 - moved, moved, .5);
      G.txt(lt, 'Los que pueden venir cualquier día, *eligen* *martes.*', { y: 240, size: 72 });
    } },
    { d: 2.2, theme: 'green', sfx: [[0, 'rise'], [1, 'check']], draw(G, lt) {
      split(G, lt, 7, 5, .3);
      G.txt(lt, '*Más* *parejo.* Menos estrés.', { y: 260, size: 92, boxColor: G.C.green });
    } },
    { d: 2.4, theme: 'yellow', sfx: [[0, 'pop'], [.7, 'pop']], draw(G, lt) {
      G.txt(lt, '¿Cuál es tu *día* *muerto?*', { y: 720, size: 104 });
      G.arrowDown(lt, G.CX, 1130, .7);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: .9, stagger: 0 });
    } },
    { d: 1.0, sfx: [[0, 'boom']], draw(G, lt) { split(G, lt); G.txt(lt, '¿Te pasa *esto?*', { y: 260, size: 96, stagger: 0 }); } },
  ],
});
