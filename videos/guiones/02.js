// 2. "47 mensajes" — WhatsApp mientras cortás
const MSG = ['¿tenés turno hoy?', '¿a qué hora cerrás?', '¿y mañana?', 'che estás?', '¿cuánto sale?', '¿me hacés lugar a las 6?',
  'holaa', '¿hay lugar?', '¿atendés el domingo?', '???', '¿barba también?', 'estoy afuera'];
function lluvia(G, lt, n = 12, speed = 1) {
  for (let i = 0; i < n; i++) {
    const at = i * .12 / speed, side = i % 2 ? 'right' : 'left';
    const x = side === 'left' ? 60 + G.rnd(i) * 120 : 940 - G.rnd(i + 5) * 120;
    const y = 220 + ((i * 137) % 1250) + Math.max(0, lt - at) * 40;
    G.bubble(lt, x, y, MSG[i % MSG.length], { at, side, size: 38 });
  }
}

VIDEO({
  title: '47 mensajes',
  theme: 'blue',
  scenes: [
    { d: 1.6, shake: 14, shakeDur: 1.6, sfx: [[0, 'buzz'], [.4, 'buzz'], [.8, 'buzz'], [1.2, 'buzz']], draw(G, lt) {
      lluvia(G, lt, 12, 1.2);
    } },
    { d: 1.6, sfx: [[0, 'hit'], [.3, 'snip'], [.9, 'snip'], [.6, 'buzz', .6]], draw(G, lt) {
      G.ctx.globalAlpha = .35; lluvia(G, lt + 2, 10); G.ctx.globalAlpha = 1;
      G.emoji(lt, '✂️', G.CX, 760, 300, { rot: Math.sin(lt * 14) * .25 });
      G.txt(lt, '*ESTÁS* *CORTANDO.*', { y: 1150, size: 120, stagger: .1 });
    } },
    { d: 2.0, theme: 'red', sfx: [[0, 'ticks:18:0.09'], [1.7, 'hit']], draw(G, lt) {
      G.txt(lt, 'mensajes hoy:', { y: 620, size: 80, color: '#C9C9D6', stagger: 0 });
      const n = Math.round(G.lerp(1, 47, G.E.out(G.prog(lt, 0, 1.6))));
      G.withT(G.CX, 900, G.popS(lt, 0) * (1 + .04 * Math.sin(lt * 30)), 0, 1, () => {
        G.ctx.font = `900 340px ${G.FONT}`; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle';
        G.ctx.fillStyle = G.C.red; G.ctx.shadowColor = G.C.red; G.ctx.shadowBlur = 70; G.ctx.fillText(n, 0, 0); G.ctx.shadowBlur = 0;
      });
      G.emoji(lt, '📱', G.CX, 1260, 160, { at: .2, rot: Math.sin(lt * 40) * .12 });
    } },
    { d: 1.6, sfx: [[0, 'whoosh'], [.9, 'hit']], draw(G, lt) {
      G.emoji(lt, '📱', G.CX + G.E.inOut(G.prog(lt, .5, .6)) * 120, 640 + G.E.inOut(G.prog(lt, .5, .6)) * 220, 260, { rot: G.prog(lt, .5, .6) * 1.4 });
      G.txt(lt, 'Contestás con la mano *con* *gel.*', { y: 1280, size: 90 });
    } },
    { d: 2.0, sfx: [[.3, 'tick'], [1.0, 'tick']], draw(G, lt) {
      const look = G.E.inOut(G.prog(lt, .3, .4));
      [-130, 130].forEach(dx => {
        G.ctx.fillStyle = '#fff'; G.ctx.beginPath(); G.ctx.arc(G.CX + dx, 760, 110, 0, 7); G.ctx.fill();
        G.ctx.fillStyle = '#0A0A0F'; G.ctx.beginPath(); G.ctx.arc(G.CX + dx + 50 * look, 790, 50, 0, 7); G.ctx.fill();
      });
      G.txt(lt, 'El que estás cortando *te* *mira.*', { y: 1120, size: 90, at: .2 });
    } },
    { d: 2.4, theme: 'red', shake: 20, sfx: [[0, 'pop'], [1.1, 'glass'], [1.1, 'error']], draw(G, lt) {
      const broke = lt > 1.1;
      if (!broke) G.bubble(lt, 150, 620, 'bueno, ya reservé en otro lado', { size: 44 });
      else for (let i = 0; i < 9; i++) {
        const p = lt - 1.1; G.ctx.fillStyle = '#1F2C34';
        G.ctx.fillRect(160 + i * 70 + p * (i - 4) * 300, 600 + p * p * 1400 * G.rnd(i), 60, 60);
      }
      G.stack(lt, [['Y el que te escribió', { size: 84, at: .3 }], ['se fue a *otra* *barbería.*', { size: 96, at: .5 }]], { y: 1050 });
      G.cash(lt, 0, -CFG.corte, { y: 1400, size: 140, at: 1.1, dur: .4 });
    } },
    { d: 3.0, theme: 'green', noPunch: false, sfx: [[0, 'whoosh'], [1.6, 'pop'], [1.9, 'check']], draw(G, lt) {
      G.txt(lt, 'Ahora tengo un *link* en la bio.', { y: 290, size: 80 });
      G.phone(lt, G.CX, 1020, 1.35, (c, l) => {
        G.UI.header('Elegí tu horario', 'Barbería Tomás · Hoy');
        const picked = l > 1.6;
        G.UI.slots(190, ['10:00', '10:30', '11:00', '11:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], [0, 1, 3, 5, 8, 9], 7, picked ? 1 : 0);
        G.UI.tap(26 + 1 * 120 + 54, 190 + 2 * 76 + 32, G.prog(l, 1.45, .4));
        if (picked) { G.UI.button(520, '✓ Turno confirmado 16:30', G.C.green); G.UI.label(640, 'Te esperamos, Juan', '#555', 24); }
      }, { at: .1 });
    } },
    { d: 1.8, theme: 'green', sfx: [[0, 'pop'], [.5, 'snip']], draw(G, lt) {
      G.stack(lt, [['El cliente elige *solo.*', { size: 100 }], ['Yo sigo cortando.', { size: 90, at: .5, color: G.C.green }]], { y: 700 });
      G.emoji(lt, '✂️', G.CX, 1150, 220, { at: .5, rot: Math.sin(lt * 4) * .1 });
    } },
    { d: 2.4, theme: 'green', sfx: [[0, 'whoosh'], [.3, 'ticks:10:0.07'], [1.2, 'cash']], draw(G, lt) {
      G.txt(lt, 'mensajes hoy:', { y: 620, size: 80, color: '#C9C9D6', stagger: 0 });
      const n = Math.round(G.lerp(47, 3, G.E.out(G.prog(lt, .3, 1))));
      G.withT(G.CX, 900, G.popS(lt, 0), 0, 1, () => {
        G.ctx.font = `900 340px ${G.FONT}`; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle';
        const col = n > 10 ? G.C.red : G.C.green; G.ctx.fillStyle = col; G.ctx.shadowColor = col; G.ctx.shadowBlur = 70; G.ctx.fillText(n, 0, 0); G.ctx.shadowBlur = 0;
      });
      G.check(lt, G.CX, 1250, 90, 1.2);
    } },
    { d: 2.4, theme: 'yellow', sfx: [[0, 'pop'], [.7, 'pop']], draw(G, lt) {
      G.txt(lt, '¿Cuántos mensajes te llegan *por* *día?*', { y: 720, size: 96 });
      G.arrowDown(lt, G.CX, 1130, .7);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: .9, stagger: 0 });
    } },
    { d: .9, shake: 14, sfx: [[0, 'buzz']], draw(G, lt) { lluvia(G, lt, 6, 2); } },
  ],
});
