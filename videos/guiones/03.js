// 3. "¿Era a las 5 o a las 6?" — el cuaderno
function hoja(G, lt, x = G.CX, y = 860, s = 1, rot = -.04) {
  G.withT(x, y, s, rot, 1, () => {
    const c = G.ctx;
    c.fillStyle = G.C.paper; G.rr(-360, -470, 720, 940, 18); c.fill();
    c.strokeStyle = 'rgba(61,139,255,.35)'; c.lineWidth = 3;
    for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(-340, -380 + i * 62); c.lineTo(340, -380 + i * 62); c.stroke(); }
    c.strokeStyle = 'rgba(255,46,62,.5)'; c.beginPath(); c.moveTo(-250, -470); c.lineTo(-250, 470); c.stroke();
    c.fillStyle = 'rgba(120,70,20,.25)'; c.beginPath(); c.arc(180, 250, 120, 0, 7); c.fill();          // mancha de café
    c.fillStyle = G.C.paper; c.beginPath(); c.arc(180, 250, 85, 0, 7); c.fill();
    c.fillStyle = '#1b2a6b'; c.font = `italic 600 44px ${G.FONT}`; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    const L = ['16:00  Nico', '17:00  Martín ?', '17:30  Lucas (barba)', '18:00  Martín??', '18:30  Fede', '19:00  —'];
    L.forEach((l, i) => c.fillText(l, -230, -300 + i * 124));
    c.strokeStyle = '#1b2a6b'; c.lineWidth = 6;
    c.beginPath(); c.moveTo(-235, -310 + 124 * 3); c.lineTo(120, -330 + 124 * 3); c.stroke();          // tachón
    c.strokeStyle = G.C.red; c.lineWidth = 7; c.beginPath(); c.ellipse(-40, -80, 230, 60, -.05, 0, 7); c.stroke();
  });
}

VIDEO({
  title: 'Era a las 5 o a las 6',
  theme: 'yellow',
  scenes: [
    { d: 1.7, shake: 14, sfx: [[0, 'boom'], [.4, 'hit']], draw(G, lt) {
      hoja(G, lt, G.CX, 1080, .95);
      G.txt(lt, '¿Martín era a las *5* o a las *6?*', { y: 330, size: 96, at: .1 });
    } },
    { d: 1.8, theme: 'red', sfx: [[0, 'whoosh'], [.75, 'hit'], [.75, 'glass', .5]], draw(G, lt) {
      const p = G.E.out(G.prog(lt, 0, .75));
      G.person(G.lerp(-150, 330, p), 1050, 1.3, '#E8E8F0'); G.person(G.lerp(1230, 670, p), 1050, 1.3, '#E8E8F0');
      G.stack(lt, [['Llegan *dos* *Martín*', { size: 100, stagger: .06 }], ['a la misma hora.', { size: 80, at: .3 }]], { y: 470, gap: 24 });
      if (lt > .75) G.emoji(lt, '💥', G.CX, 900, 220, { at: .75 });
    } },
    { d: 1.6, theme: 'red', sfx: [[.2, 'door'], [.7, 'error']], draw(G, lt) {
      G.person(330 - G.E.inOut(G.prog(lt, .2, .8)) * 600, 1050, 1.3, G.C.red);
      G.person(670, 1050, 1.3, '#E8E8F0');
      G.txt(lt, 'Uno se va *caliente.*', { y: 460, size: 104 });
    } },
    { d: 1.8, theme: 'red', shake: 26, sfx: [[0, 'hit'], [.8, 'boom']], draw(G, lt) {
      G.cash(lt, 0, -CFG.corte, { y: 760, size: 220, dur: .5 });
      G.txt(lt, 'y no vuelve *más.*', { y: 1060, size: 110, at: .7 });
      G.cross(lt, G.CX, 1330, 90, .8);
    } },
    { d: 1.5, sfx: [[0, 'whoosh']], draw(G, lt) {
      hoja(G, lt, G.CX, 1100, 1.05 + lt * .1, .02);
      G.txt(lt, 'Y lo peor *no* *es* *eso.*', { y: 330, size: 96 });
    } },
    { d: 3.0, sfx: [[0, 'pop'], [.9, 'pop'], [1.8, 'pop']], draw(G, lt) {
      [['💦', 'Se moja.'], ['🌬️', 'Se pierde.'], ['🤷‍♂️', 'Lo tiene tu socio.']].forEach(([e, t], i) => {
        G.emoji(lt, e, 260, 560 + i * 300, 160, { at: i * .9 });
        G.txt(lt, t, { x: 380, y: 560 + i * 300, size: 84, at: i * .9 + .05, align: 'left', maxW: 600, stagger: 0 });
      });
    } },
    { d: 3.0, theme: 'green', sfx: [[0, 'whoosh'], [1.6, 'error', .6], [2.2, 'pop']], draw(G, lt) {
      G.txt(lt, 'Ahora mi agenda está en el *celu.*', { y: 290, size: 80 });
      G.phone(lt, G.CX, 1020, 1.35, (c, l) => {
        G.UI.header('Agenda · Hoy', 'Barbería Tomás');
        [['16:00', 'Nico', 'OK'], ['17:00', 'Martín G.', 'OK'], ['17:30', 'Lucas', 'BARBA'], ['18:00', 'Martín R.', 'OK'], ['18:30', 'Fede', 'OK']]
          .forEach((r, i) => G.UI.row(176 + i * 96, r[0], r[1], r[2], r[2] === 'BARBA' ? G.C.blue : G.C.green));
        if (l > 1.5) {
          const shake = Math.sin(l * 60) * 10 * Math.max(0, 1 - (l - 1.5) * 3);
          c.save(); c.translate(shake, 0);
          c.fillStyle = '#111'; G.rr(30, 690, G.PW - 60, 96, 20); c.fill();
          G.UI.label(722, '17:00 ya está ocupado', '#FF6B6B', 28); G.UI.label(758, 'Elegí otro horario', '#fff', 22);
          c.restore();
        }
      }, { at: .1 });
    } },
    { d: 2.4, theme: 'green', sfx: [[0, 'pop'], [1.1, 'check']], draw(G, lt) {
      G.stack(lt, [['Un horario ocupado', { size: 90 }], ['*no* *se* *puede* *pisar.*', { size: 100, at: .4, boxColor: G.C.green }]], { y: 760 });
      G.check(lt, G.CX, 1180, 110, 1.1);
    } },
    { d: 2.6, theme: 'yellow', sfx: [[0, 'pop'], [.8, 'pop']], draw(G, lt) {
      G.stack(lt, [['¿Seguís con el *cuaderno?*', { size: 100 }], ['Sin vergüenza, contame', { size: 70, at: .5, color: '#C9C9D6' }]], { y: 760 });
      G.arrowDown(lt, G.CX, 1150, .8);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: 1, stagger: 0 });
    } },
    { d: 1.0, shake: 14, sfx: [[0, 'boom']], draw(G, lt) { hoja(G, lt, G.CX, 1080, .95); } },
  ],
});
