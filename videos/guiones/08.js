// 8. "Este video te va a doler" — la suma de todo
const K = CFG.corte;
const L1 = -K * 2 * 4, L2 = -K * 24, L3 = -K * 2 * 3, TOT = L1 + L2 + L3;
const lineas = [
  ['Te clavan 2 por semana', L1],
  ['Se va 1 de la fila por día', L2],
  ['3 clientes que no volvieron', L3],
];
function cuenta(G, lt, upto, at0 = 0) {
  lineas.slice(0, upto).forEach(([t, v], i) => {
    const y = 520 + i * 230, a = i === upto - 1 ? at0 : -1;
    G.txt(lt, t, { x: 100, y: y - 50, size: 62, align: 'left', stagger: 0, at: a, maxW: 840, weight: 800 });
    G.cash(lt, i === upto - 1 ? 0 : v, v, { x: 100 + 420, y: y + 45, size: 120, at: a, dur: .6, glow: false });
  });
  G.txt(lt, '_por_ _mes_', { x: 860, y: 360, size: 48, stagger: 0, weight: 700 });
}

VIDEO({
  title: 'Te va a doler',
  theme: 'red',
  scenes: [
    { vo: `Si sos barbero, este video te va a doler.`, d: 2.0, shake: 22, shakeDur: .6, sfx: [[0, 'glass'], [0, 'boom']], draw(G, lt) {
      G.stack(lt, [['Si sos barbero,', { size: 96 }], ['*este* *video* *te* *va* *a* *doler.*', { size: 112, at: .3, boxColor: G.C.red }]], { y: 800 });
    } },
    { vo: `Hacé la cuenta conmigo.`, d: 1.5, theme: 'neutral', sfx: [[0, 'pop']], draw(G, lt) {
      G.emoji(lt, '🧮', G.CX, 720, 260, { bob: 8 });
      G.txt(lt, 'Hacé la cuenta *conmigo.*', { y: 1060, size: 100, at: .2 });
    } },
    { vo: `Te clavan dos por semana: ${P(-L1)} por mes.`, d: 3.0, sfx: [[0, 'hit']], draw(G, lt) { cuenta(G, lt, 1); } },
    { vo: `Se te va uno de la fila por día: ${P(-L2)}.`, d: 3.0, sfx: [[0, 'hit']], draw(G, lt) { cuenta(G, lt, 2); } },
    { vo: `Tres clientes que no volvieron: ${P(-L3)}.`, d: 3.0, sfx: [[0, 'hit']], draw(G, lt) { cuenta(G, lt, 3); } },
    { vo: `Total: ${P(-TOT)} por mes.`, d: 3.0, shake: 40, shakeDur: 1, sfx: [[0, 'boom'], [0, 'error']], draw(G, lt) {
      cuenta(G, lt, 3, -1);
      G.ctx.fillStyle = '#fff'; G.ctx.fillRect(100, 1200, 820 * G.E.out(G.prog(lt, 0, .3)), 8);
      G.cash(lt, 0, TOT, { y: 1340, size: 180, at: .2, dur: .9, sub: 'POR MES' });
      G.txt(lt, `_Ejemplo_ _con_ _corte_ _a_ _${G.money(K)}_`, { y: 1520, size: 34, weight: 600, stagger: 0 });
    } },
    { vo: `Sin contar las horas contestando guasap.`, d: 2.0, theme: 'neutral', sfx: [[0, 'pop']], draw(G, lt) {
      G.stack(lt, [['Sin contar las horas', { size: 84 }], ['contestando _WhatsApp._', { size: 84, at: .3 }]], { y: 820 });
      G.emoji(lt, '🙃', G.CX, 1150, 150, { at: .7 });
    } },
    { vo: `La app que uso para frenar eso sale ${P(CFG.mensual)} por mes.`, d: 3.0, theme: 'green', sfx: [[0, 'whoosh']], draw(G, lt) {
      G.txt(lt, `La app que uso para frenar eso sale *${G.money(CFG.mensual)}* por mes.`, { y: 300, size: 72 });
      G.phone(lt, G.CX, 1060, 1.2, (c, l) => {
        G.UI.header('Resumen del mes', 'Barbería Tomás');
        G.UI.row(176, 'Turnos', 'con seña', '0 clavadas', G.C.green);
        G.UI.row(272, 'Fila', 'virtual', '0 se fueron', G.C.green);
        G.UI.row(368, 'Volvieron', '', '+2 clientes', G.C.green);
        G.UI.row(464, 'Caja', '', 'al día', G.C.blue);
      }, { at: .2 });
    } },
    { vo: `Un corte.`, d: 1.6, theme: 'yellow', shake: 20, sfx: [[0, 'boom'], [.1, 'snip']], draw(G, lt) {
      G.emoji(lt, '✂️', G.CX, 760, 320, { rot: Math.sin(lt * 10) * .2 });
      G.txt(lt, '*UN* *CORTE.*', { y: 1140, size: 180 });
    } },
    { vo: `Si te recupera uno solo, ya está pagada.`, d: 2.8, theme: 'green', sfx: [[0, 'pop'], [1.2, 'check']], draw(G, lt) {
      G.stack(lt, [['Si te recupera *uno* *solo,*', { size: 90 }], ['ya está +pagada.+', { size: 110, at: .5 }]], { y: 600 });
      const tilt = .25 * (1 - G.E.elastic(G.prog(lt, .6, 1.2)));
      G.withT(G.CX, 1100, 1, tilt, 1, () => {
        G.ctx.fillStyle = '#fff'; G.ctx.fillRect(-360, -8, 720, 16);
        G.ctx.font = `120px "Noto Color Emoji"`; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'alphabetic';
        G.ctx.fillText('✂️', -280, -20); G.ctx.fillText('📱', 280, -20);
      });
      G.ctx.fillStyle = '#fff'; G.ctx.beginPath(); G.ctx.moveTo(G.CX, 1110); G.ctx.lineTo(G.CX - 60, 1230); G.ctx.lineTo(G.CX + 60, 1230); G.ctx.fill();
      G.check(lt, G.CX, 1380, 70, 1.2);
    } },
    { vo: `Poné tus números en los comentarios, y te hago la cuenta.`, d: 3.0, theme: 'yellow', sfx: [[0, 'pop'], [.8, 'pop']], draw(G, lt) {
      G.stack(lt, [['Poné tus números en los comentarios', { size: 82 }], ['y *te* *hago* *la* *cuenta.*', { size: 96, at: .4 }]], { y: 720 });
      G.arrowDown(lt, G.CX, 1170, .8);
      G.txt(lt, CFG.usuario, { y: 1420, size: 40, weight: 700, color: '#C9C9D6', at: 1, stagger: 0 });
    } },
    { d: 1.0, shake: 22, sfx: [[0, 'glass']], draw(G, lt) {
      G.stack(lt, [['Si sos barbero,', { size: 96 }], ['*este* *video* *te* *va* *a* *doler.*', { size: 112, stagger: 0, boxColor: G.C.red }]], { y: 800 });
    } },
  ],
});
