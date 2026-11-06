// 6. "Hace 63 días que no viene" — el cliente que no vuelve
const K = CFG.corte;
function calendario(G, lt, days, marks) {
  for (let i = 0; i < 70; i++) {
    const x = 110 + (i % 7) * 115, y = 560 + Math.floor(i / 7) * 82;
    const on = i < days;
    G.ctx.fillStyle = on ? (marks.includes(i) ? G.C.green : '#2A2A36') : '#15151D'; G.rr(x, y, 100, 70, 12); G.ctx.fill();
    if (marks.includes(i) && on) { G.ctx.font = `30px "Noto Color Emoji"`; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle'; G.ctx.fillText('✂️', x + 50, y + 36); }
  }
}

VIDEO({
  title: 'Hace 63 días',
  theme: 'blue',
  scenes: [
    { vo: `Juan venía cada quince días.`, d: 1.6, sfx: [[0, 'boom'], [.4, 'ticks:6:0.15']], draw(G, lt) {
      G.txt(lt, 'Juan venía *cada* *15* *días.*', { y: 360, size: 96 });
      calendario(G, lt, Math.min(30, Math.floor(lt * 26)), [0, 14, 28]);
    } },
    { vo: `Hace sesenta y tres que no viene.`, d: 2.2, theme: 'red', sfx: [[0, 'ticks:20:0.08'], [1.6, 'hit']], draw(G, lt) {
      const n = Math.round(G.lerp(0, 63, G.E.out(G.prog(lt, 0, 1.6))));
      G.txt(lt, `Hace *${n}* que no viene.`, { y: 360, size: 96, stagger: 0 });
      calendario(G, lt, 30 + n * 40 / 63, [0, 14, 28]);
    } },
    { vo: `No se quejó. No avisó. Simplemente, no volvió.`, d: 2.2, theme: 'red', sfx: [[0, 'whoosh'], [1.2, 'door']], draw(G, lt) {
      G.person(G.CX, 1100, 1.3, '#fff', 1 - G.prog(lt, .9, 1));
      G.stack(lt, [['No se quejó. No avisó.', { size: 80 }], ['Simplemente *no* *volvió.*', { size: 96, at: .5 }]], { y: 520 });
    } },
    { vo: `Un Juan son veinticuatro cortes por año.`, d: 2.4, sfx: [[0, 'pop'], [.3, 'ticks:24:0.05']], draw(G, lt) {
      G.txt(lt, 'Un Juan son *24* *cortes* por año.', { y: 380, size: 86 });
      for (let i = 0; i < 24; i++) G.emoji(lt, '✂️', 170 + (i % 6) * 135, 640 + Math.floor(i / 6) * 150, 90, { at: .3 + i * .05 });
    } },
    { vo: `${P(K*24)} por año. Un solo cliente.`, d: 1.8, theme: 'green', sfx: [[0, 'cash']], draw(G, lt) {
      G.cash(lt, 0, K * 24, { y: 860, size: 200, dur: .8, sub: 'POR AÑO, UN SOLO CLIENTE' });
    } },
    { vo: `¿Y si son cinco Juanes?`, d: 1.4, theme: 'red', sfx: [[0, 'hit'], [.2, 'pop'], [.35, 'pop'], [.5, 'pop'], [.65, 'pop']], draw(G, lt) {
      G.txt(lt, '¿Y si son *5* *Juanes?*', { y: 480, size: 110 });
      for (let i = 0; i < 5; i++) { const s = G.popS(lt, .2 + i * .15); if (s > 0) G.withT(180 + i * 165, 1050, s * .75, 0, 1, () => G.person(0, 0, 1, '#fff')); }
    } },
    { vo: `${P(K*120)} por año.`, d: 2.2, theme: 'red', shake: 36, shakeDur: .9, sfx: [[0, 'boom'], [0, 'error']], draw(G, lt) {
      G.cash(lt, 0, -K * 120, { y: 820, size: 210, dur: .9, sub: 'POR AÑO' });
      G.txt(lt, `_Ejemplo_ _con_ _corte_ _a_ _${G.money(K)}_`, { y: 1480, size: 34, weight: 600, stagger: 0 });
    } },
    { vo: `Ahora la app me muestra quién hace rato que no viene.`, d: 3.2, theme: 'neutral', sfx: [[0, 'whoosh'], [1.0, 'pop'], [1.3, 'pop'], [1.6, 'pop']], draw(G, lt) {
      G.txt(lt, 'Ahora la app me muestra *quién* *no* *volvió.*', { y: 300, size: 76 });
      G.phone(lt, G.CX, 1020, 1.35, (c, l) => {
        G.UI.header('Hace rato que no vienen', 'Clientes');
        [['Juan', '63 días'], ['Lucas', '41 días'], ['Nico', '38 días'], ['Fede', '35 días'], ['Mati', '33 días']].forEach((r, i) => {
          G.UI.row(176 + i * 96, r[0], '', r[1], i === 0 ? G.C.red : G.C.yellow, G.prog(l, .8 + i * .25, .2), i === 0);
        });
      }, { at: .1 });
    } },
    { vo: `Y le escribo con un toque: che, ¿te guardo un turno?`, d: 2.8, theme: 'green', sfx: [[0, 'pop'], [1.3, 'pop'], [1.6, 'whoosh']], draw(G, lt) {
      G.txt(lt, 'Le escribo con *un* *toque:*', { y: 380, size: 90 });
      G.bubble(lt, 150, 760, 'Che Juan, ¿te guardo un turno el sábado?', { at: .4, size: 40, color: '#005C4B', w: 760 });
      G.withT(G.CX, 1080, G.popS(lt, .9) * (1 - .06 * Math.sin(G.clamp((lt - 1.3) / .3) * Math.PI)), 0, 1, () => {
        G.ctx.fillStyle = G.C.wa; G.rr(-260, -60, 520, 120, 60); G.ctx.fill();
        G.ctx.fillStyle = '#fff'; G.ctx.font = `800 46px ${G.FONT}`; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle'; G.ctx.fillText('Enviar por WhatsApp', 0, 2);
      });
      G.bubble(lt, 940, 1300, 'Daleee, a las 11', { at: 1.9, size: 40, side: 'right' });
    } },
    { vo: `Algunos vuelven.`, d: 2.2, theme: 'green', sfx: [[0, 'hit'], [.5, 'check'], [.8, 'check']], draw(G, lt) {
      G.txt(lt, 'Algunos *vuelven.*', { y: 480, size: 120, boxColor: G.C.green });
      for (let i = 0; i < 5; i++) G.person(180 + i * 165, 1050, .75, i < 2 && lt > .5 + i * .3 ? G.C.green : '#3A3A48');
      G.cash(lt, 0, K * 48, { y: 1380, size: 120, at: 1.0, dur: .8, sub: 'por año con 2 que vuelvan' });
    } },
    { vo: `¿Cuántos Juanes tenés vos?`, d: 2.4, theme: 'yellow', sfx: [[0, 'pop'], [.7, 'pop']], draw(G, lt) {
      G.txt(lt, '¿Cuántos *Juanes* tenés vos?', { y: 720, size: 104 });
      G.arrowDown(lt, G.CX, 1130, .7);
      G.txt(lt, CFG.usuario, { y: 1400, size: 40, weight: 700, color: '#C9C9D6', at: .9, stagger: 0 });
    } },
    { d: 1.0, sfx: [[0, 'boom']], draw(G, lt) { G.txt(lt, 'Juan venía *cada* *15* *días.*', { y: 360, size: 96, stagger: 0 }); calendario(G, lt, 30, [0, 14, 28]); } },
  ],
});
