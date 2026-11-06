// 10. "Busco 5 barberías" — fundador, honesto
function casilleros(G, lt, llenos = 0, at = 0) {
  for (let i = 0; i < 5; i++) {
    const x = 130 + i * 160, y = 1150, s = G.popS(lt, at + i * .1);
    if (s <= 0) continue;
    G.withT(x + 60, y, s, 0, 1, () => {
      const on = i < llenos; G.ctx.fillStyle = on ? G.C.yellow : 'transparent';
      G.ctx.strokeStyle = on ? G.C.yellow : '#fff'; G.ctx.lineWidth = 8;
      G.rr(-60, -60, 120, 120, 24); if (on) G.ctx.fill(); G.ctx.stroke();
      if (on) { G.ctx.font = `70px "Noto Color Emoji"`; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle'; G.ctx.fillText('💈', 0, 4); }
    });
  }
}

VIDEO({
  title: 'Busco 5 barberías',
  theme: 'yellow',
  scenes: [
    { vo: `Busco cinco barberías.`, d: 1.6, sfx: [[0, 'boom'], [.4, 'pop'], [.5, 'pop'], [.6, 'pop'], [.7, 'pop'], [.8, 'pop']], draw(G, lt) {
      G.txt(lt, '*BUSCO* *5* *BARBERÍAS.*', { y: 640, size: 150, stagger: .1 }); casilleros(G, lt, 0, .4);
    } },
    { vo: `No para venderles.`, d: 1.6, sfx: [[0, 'pop'], [.5, 'hit']], draw(G, lt) { G.txt(lt, 'No para venderles.', { y: 820, size: 92, strike: .5 }); } },
    { vo: `Soy de Corrientes, y hago aplicaciones.`, d: 2.4, theme: 'blue', sfx: [[0, 'whoosh'], [.6, 'pop']], draw(G, lt) {
      G.stack(lt, [['Soy de *Corrientes*', { size: 100 }], ['y armo apps.', { size: 92, at: .3 }]], { y: 420 });
      G.emoji(lt, '🇦🇷', G.CX, 960, 300, { at: .3 });
      const r = 30 + 20 * Math.abs(Math.sin(lt * 4));
      G.ctx.fillStyle = 'rgba(255,212,0,.6)'; G.ctx.beginPath(); G.ctx.arc(G.CX + 70, 900, r, 0, 7); G.ctx.fill();
    } },
    { vo: `Todos los barberos se quejan de lo mismo.`, d: 2.0, theme: 'neutral', sfx: [[0, 'pop']], draw(G, lt) {
      G.stack(lt, [['Todos los barberos', { size: 96 }], ['se quejan *de* *lo* *mismo:*', { size: 96, at: .3 }]], { y: 820 });
    } },
    { vo: `Me clavan. Contesto guasap todo el día. No sé cuánto gano.`, d: 3.6, theme: 'red', sfx: [[0, 'hit'], [1.1, 'hit'], [2.2, 'hit']], draw(G, lt) {
      G.stack(lt, ['“Me clavan.”', '“Contesto WhatsApp todo el día.”', '“No sé cuánto gano.”'].map((t, i) => [t, { size: 86, at: i * 1.1, stagger: .04 }]), { y: 820, gap: 70 });
    } },
    { vo: `Así que armé esto.`, d: 1.4, theme: 'green', sfx: [[0, 'boom']], draw(G, lt) { G.txt(lt, 'Así que *armé* *esto.*', { y: 860, size: 130 }); } },
    { vo: `Agenda. Fila virtual. Caja del día. Fichas de clientes.`, d: 3.6, theme: 'green', sfx: [[0, 'whoosh'], [.9, 'whoosh'], [1.8, 'whoosh'], [2.7, 'whoosh']], draw(G, lt) {
      const i = Math.min(3, Math.floor(lt / .9));
      const T = ['Agenda', 'Fila virtual', 'Caja del día', 'Fichas de clientes'];
      G.txt(lt, T[i], { y: 290, size: 92, stagger: 0, color: G.C.green });
      G.phone(lt, G.CX, 1040, 1.3, (c, l) => {
        if (i === 0) { G.UI.header('Agenda · Hoy'); ['16:00 Nico', '17:00 Martín', '17:30 Lucas', '18:00 Fede'].forEach((r, k) => G.UI.row(176 + k * 96, r.slice(0, 5), r.slice(6), 'OK')); }
        if (i === 1) { G.UI.header('Fila de espera'); G.UI.label(250, 'ESPERANDO', '#888', 26); G.UI.big(380, '4', '#111', 180); G.UI.label(500, '~35 min de espera', '#555', 28); }
        if (i === 2) { G.UI.header('Caja de hoy'); G.UI.big(300, G.money(CFG.corte * 12), '#111', 64); G.UI.button(380, '+ Corte', G.C.green); G.UI.button(480, '+ Barba', '#111'); }
        if (i === 3) { G.UI.header('Lucas M.', 'Ficha'); [['Corte', 'Degradé bajo'], ['Costado', 'Máquina 1'], ['Barba', 'Perfilada']].forEach((r, k) => G.UI.row(176 + k * 96, r[0], '', r[1], '#111')); }
      });
    } },
    { vo: `Las cinco primeras lo usan gratis ${N(CFG.diasPrueba)} días.`, d: 3.0, theme: 'yellow', sfx: [[.5, 'pop'], [.7, 'pop'], [.9, 'pop'], [1.1, 'pop'], [1.3, 'pop']], draw(G, lt) {
      G.stack(lt, [['Las 5 primeras', { size: 96 }], [`lo usan *gratis* *${CFG.diasPrueba}* *días.*`, { size: 96, at: .3 }]], { y: 620 });
      casilleros(G, lt, Math.floor(G.clamp((lt - .5) / 1) * 5), 0);
    } },
    { vo: `Si les sirve, pagan ${P(CFG.fundador)} por mes, congelado seis meses.`, d: 3.2, theme: 'green', sfx: [[0, 'pop'], [.6, 'cash']], draw(G, lt) {
      G.txt(lt, 'Si les sirve, pagan', { y: 500, size: 88 });
      G.cash(lt, CFG.mensual, CFG.fundador, { y: 760, size: 200, at: .4, dur: .7, sub: 'POR MES' });
      G.txt(lt, 'congelado *6* *meses.*', { y: 1080, size: 90, at: 1.0 });
    } },
    { vo: `Si no les sirve, no pagan nada.`, d: 2.2, theme: 'green', sfx: [[0, 'hit'], [.6, 'check']], draw(G, lt) {
      G.txt(lt, 'Si no les sirve, *no* *pagan* *nada.*', { y: 720, size: 100, boxColor: G.C.green }); G.check(lt, G.CX, 1100, 110, .6);
    } },
    { vo: `Comentá bárber, y te escribo.`, d: 3.0, theme: 'yellow', sfx: [[0, 'boom'], [.8, 'pop']], draw(G, lt) {
      G.stack(lt, [['Comentá', { size: 100 }], ['*BARBER*', { size: 190, at: .2 }], ['y te escribo.', { size: 90, at: .5 }]], { y: 760, gap: 30 });
      G.arrowDown(lt, G.CX, 1240, .8);
      G.txt(lt, CFG.usuario, { y: 1440, size: 40, weight: 700, color: '#C9C9D6', at: 1, stagger: 0 });
    } },
    { d: 1.2, sfx: [[0, 'boom']], draw(G, lt) { G.txt(lt, '*BUSCO* *5* *BARBERÍAS.*', { y: 640, size: 150, stagger: 0 }); casilleros(G, lt, 1, 0); } },
  ],
});
