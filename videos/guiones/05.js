// 5. "¿Cuánto ganaste? No sabés."
const K = CFG.corte, C = ENG.C;
VIDEO({
  title: 'Cuánto ganaste',
  scenes: [
    T.hook({ vo: `¿Cuánto ganaste en octubre? Sin mirar.`, theme: 'violeta', emoji: '🤔', lines: [{ t: '¿CUÁNTO GANASTE', size: 120 }, { t: 'EN OCTUBRE?', box: C.yellow, color: '#000', size: 150 }] }),
    { vo: `Tres. Dos. Uno.`, d: 2.1, theme: 'amarillo', sfx: [[0, 'tick'], [.7, 'tick'], [1.4, 'tick']], draw(G, lt) {
      const n = 3 - Math.floor(lt / .7), p = (lt % .7) / .7;
      G.rays(lt, G.CX, 900, C.yellow, { a: .2 });
      G.withT(G.CX, 900, 1.4 - .4 * G.E.out(p), 0, 1 - p * .5, () => { G.ctx.font = `900 560px ${G.FONT}`; G.ctx.fillStyle = '#fff'; G.ctx.textAlign = 'center'; G.ctx.textBaseline = 'middle'; G.ctx.lineWidth = 30; G.ctx.strokeStyle = '#000'; G.ctx.strokeText(Math.max(1, n), 0, 0); G.ctx.fillText(Math.max(1, n), 0, 0); });
    } },
    T.slam({ vo: `No sabés.`, t: 'NO SABÉS.', box: C.red, color: '#fff', theme: 'rojo', d: 1.4 }),
    T.list({ vo: `Efectivo en el cajón, transferencias, Mercado Pago, y el resto de memoria.`, title: 'TU PLATA HOY:', items: [['💵', 'En un cajón'], ['📲', 'Transferencias'], ['💳', 'Mercado Pago'], ['🧠', 'De memoria']], theme: 'rojo' }),
    T.slam({ vo: `Y a fin de mes: ¿dónde está la plata?`, t: '¿Y LA PLATA?', box: C.yellow, d: 1.8 }),
    T.versus({ vo: `De memoria, contra los números en la mano.`, left: { t: 'DE MEMORIA', items: ['No sabés cuánto entró', 'No sabés qué día rinde', 'Subís precios a ciegas'] }, right: { t: 'CON LA APP', items: ['Caja del día al instante', 'Ves tu mejor día', 'Decidís con números'] } }),
    T.phone({ vo: `Cada corte, un toque. Efectivo o transferencia, todo queda registrado.`, title: 'Cada corte, *un* *toque.*', screen: 'caja', theme: 'verde', sfx: [[.8, 'pop'], [1.2, 'pop'], [1.6, 'pop']] }),
    { vo: `Y ves qué día rinde y qué día te conviene cerrar.`, d: 3, theme: 'verde', sfx: [[.2, 'rise'], [1.2, 'hit']], draw(G, lt) {
      G.txt(lt, '¿Qué día *rinde?*', { y: 320, size: 100 });
      const H = [.35, .4, .55, .5, .8, 1, .2], D = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      H.forEach((h, i) => {
        const p = G.E.back(G.prog(lt, .2 + i * .08, .5)), bh = 640 * h * p, x = 140 + i * 115;
        G.ctx.fillStyle = h === 1 ? C.green : h < .3 ? C.red : '#7C4DFF'; G.rr(x, 1350 - bh, 84, bh, 14); G.ctx.fill();
        G.txt(lt, D[i], { x: x + 42, y: 1400, size: 46, stagger: 0, weight: 900 });
      });
      G.burst(lt, 1.2, 140 + 5 * 115 + 42, 710, [C.green, C.yellow, '#fff']);
    } },
    T.slam({ vo: `Lo que no se anota, no existe.`, t: 'SI NO SE ANOTA…', sub: '…no existe.', d: 2 }),
    T.cta({ vo: `Comentá bárber y te la paso.`, sub: 'y te paso la caja' }),
  ],
});
