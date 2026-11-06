// 4. "Este se fue" — la fila por orden de llegada
const K = CFG.corte, C = ENG.C;
const fue = (vo, t, size) => ({ vo, d: 1.1, theme: 'rojo', tr: 'zoom', sfx: [[0, 'hit'], [.45, 'door']], draw(G, lt) { FX.banco(G); FX.seVa(G, lt, 0); G.slam(lt, t, { y: 420, size, box: C.yellow, color: '#000' }); } });
VIDEO({
  title: 'Este se fue',
  scenes: [
    fue(`Este se fue.`, 'ESTE SE FUE.', 140), fue(`Y este.`, 'Y ESTE.', 170), fue(`Y este.`, 'Y ESTE.', 200),
    T.stat({ vo: `${P(K * 3)} en diez minutos.`, label: 'En 10 minutos', to: -K * 3, sub: 'SE FUERON POR LA PUERTA' }),
    T.text({ vo: `No se van por el precio. Se van porque ven la fila y no saben cuánto falta.`, lines: [['No se van por el *precio.*', { size: 92 }], ['Se van por la', { size: 92 }], ['*ESPERA.*', { size: 170, boxColor: C.red }]], theme: 'rojo', d: 3.2 }),
    T.versus({ vo: `Fila en el local, contra fila virtual.`, left: { t: 'FILA EN EL LOCAL', items: ['Ven 4 esperando', 'Se dan vuelta', 'Banco lleno, caja vacía'] }, right: { t: 'FILA VIRTUAL', items: ['Escanean el QR', 'Se van a tomar algo', 'Vuelven cuando les toca'] } }),
    { vo: `Pegás un cu erre en la puerta. Se anotan con el celu.`, d: 2.6, theme: 'cian', sfx: [[.3, 'pop']], draw(G, lt) {
      G.txt(lt, 'Un *QR* en la puerta.', { y: 330, size: 96 });
      G.rays(lt, G.CX, 980, C.yellow, { a: .2 });
      G.withT(G.CX, 980, G.popS(lt, .3) * (1 + lt * .04), 0, 1, () => G.qr(-240, -240, 480, 9));
      G.slam(lt, 'ANOTATE ACÁ', { y: 1330, size: 80, at: .8, box: C.yellow, color: '#000', rot: 0 });
    } },
    T.phone({ vo: `Y ven en vivo en qué lugar van. Tercero, segundo… te toca.`, title: 'Ven su lugar *en* *vivo.*', screen: 'fila', theme: 'verde', d: 3, sfx: [[1, 'tick'], [1.8, 'check']] }),
    T.stat({ vo: `Los ${P(K * 3)} que se iban, ahora se quedan.`, label: 'Ahora se quedan', from: -K * 3, to: K * 3, sub: 'EN TU CAJA', pie: false }),
    T.cta({ vo: `¿Atendés por orden de llegada? Comentá bárber.`, top: '¿Atendés por llegada?', sub: 'y te paso la fila virtual' }),
  ],
});
