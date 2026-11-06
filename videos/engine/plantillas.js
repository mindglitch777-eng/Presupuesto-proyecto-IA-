// Plantillas de escena: cada función devuelve una escena lista. Los guiones se arman combinándolas.
(function () {
  const G = ENG, C = G.C;
  const K = CFG.corte;

  // ---------- pantallas de la app (dentro del celular) ----------
  const SCREENS = {
    sena(c, l) {
      G.UI.header('Reservá tu turno', 'Barbería Tomás');
      G.UI.row(176, '10:00', 'Sábado · Corte', 'TU TURNO', C.blue);
      c.fillStyle = '#fff'; G.rr(16, 290, G.PW - 32, 310, 22); c.fill();
      G.UI.label(338, 'Para confirmar, dejá una seña', '#555', 22);
      G.UI.big(410, G.money(CFG.sena), '#111', 76);
      G.UI.label(472, 'Alias: barberia.tomas', '#2979FF', 24);
      const ok = l > 1.5;
      G.UI.button(505, ok ? '✓ Seña recibida' : 'Ya transferí', ok ? C.green : '#111', G.prog(l, 1.35, .3));
      G.UI.tap(200, 545, G.prog(l, 1.35, .4));
      if (ok) { G.UI.big(680, 'TURNO', C.green, 44); G.UI.big(730, 'CONFIRMADO', C.green, 44); }
    },
    reserva(c, l) {
      G.UI.header('Elegí tu horario', 'Barbería Tomás · Hoy');
      const ok = l > 1.4;
      G.UI.slots(190, ['10:00', '10:30', '11:00', '11:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], [0, 1, 3, 5, 8, 9], 7, ok ? 1 : 0);
      G.UI.tap(26 + 120 + 54, 190 + 152 + 32, G.prog(l, 1.25, .4));
      if (ok) { G.UI.button(520, '✓ Reservado 16:30', C.green); G.UI.label(640, 'Te esperamos, Juan', '#555', 26); }
    },
    agenda(c, l) {
      G.UI.header('Agenda · Hoy', 'Barbería Tomás');
      [['16:00', 'Nico'], ['17:00', 'Martín G.'], ['17:30', 'Lucas'], ['18:00', 'Martín R.'], ['18:30', 'Fede']]
        .forEach((r, i) => G.UI.row(176 + i * 96, r[0], r[1], '✓', C.green, G.prog(l, .2 + i * .12, .2)));
      if (l > 1.4) {
        const sh = Math.sin(l * 60) * 12 * Math.max(0, 1 - (l - 1.4) * 3);
        c.save(); c.translate(sh, 0); c.fillStyle = '#111'; G.rr(26, 670, G.PW - 52, 110, 22); c.fill();
        G.UI.label(708, '⛔ 17:00 ya está ocupado', '#FF6B6B', 26); G.UI.label(746, 'Elegí otro horario', '#fff', 22); c.restore();
      }
    },
    fila(c, l) {
      G.UI.header('Tu lugar en la fila', 'Barbería Tomás');
      const pos = l < 1 ? 3 : l < 1.8 ? 2 : 1;
      G.UI.label(250, 'VAS', '#888', 30);
      G.UI.big(375, pos + 'º', pos === 1 ? C.green : '#111', 200);
      G.UI.label(505, pos === 1 ? '¡Te toca! Vení ahora' : `faltan ~${pos * 12} min`, pos === 1 ? C.green : '#555', 34);
      [0, 1, 2, 3].forEach(i => { c.fillStyle = i < 4 - pos ? '#D5D7DD' : (i === 4 - pos ? C.green : '#111'); c.beginPath(); c.arc(110 + i * 60, 610, 20, 0, 7); c.fill(); });
    },
    caja(c, l) {
      G.UI.header('Caja de hoy', 'Barbería Tomás');
      const taps = [.8, 1.2, 1.6].filter(x => l > x).length;
      G.UI.label(230, 'ENTRÓ HOY', '#888', 24);
      G.UI.big(310, G.money(K * (9 + taps)), '#111', 74);
      G.UI.button(395, '+ Corte ' + G.money(K), C.green, Math.max(...[.8, 1.2, 1.6].map(x => G.prog(l, x - .1, .25))));
      [.8, 1.2, 1.6].forEach(x => G.UI.tap(200, 435, G.prog(l, x - .1, .35)));
      G.UI.button(495, '+ Barba', '#111');
      G.UI.row(610, 'Efectivo', '', G.money(K * 5), '#111'); G.UI.row(706, 'Transf.', '', G.money(K * (4 + taps)), C.blue);
    },
    ficha(c, l) {
      G.UI.header('Lucas M.', 'Ficha de cliente');
      G.UI.label(196, 'Viene cada 15 días · último 12/10', '#888', 20);
      [['Corte', 'Degradé bajo'], ['Costado', 'Máquina 1'], ['Arriba', 'Tijera, corto'], ['Barba', 'Perfilada']]
        .forEach((r, i) => G.UI.row(232 + i * 96, r[0], '', r[1], '#111', G.prog(l, .5 + i * .3, .2)));
    },
    notas(c, l) {
      G.UI.header('Lucas M.', 'Notas');
      c.fillStyle = '#FFF6CC'; G.rr(16, 180, G.PW - 32, 170, 18); c.fill();
      G.UI.label(235, 'Hincha de Boca', '#111', 32); G.UI.label(290, 'No hablar de Madrid', '#C62828', 28);
    },
    puntos(c, l) {
      G.UI.header('Tu tarjeta de puntos', 'Barbería Tomás');
      const on = 3 + (l > 1.2 ? 2 : 0);
      for (let i = 0; i < 10; i++) {
        const x = 50 + (i % 5) * 62, y = 210 + Math.floor(i / 5) * 72;
        c.fillStyle = i < on ? (i >= 3 ? C.yellow : '#111') : '#E3E4E8'; c.beginPath(); c.arc(x + 26, y + 26, 26, 0, 7); c.fill();
      }
      G.UI.label(400, l > 1.2 ? '+2 por venir un martes' : '3 de 10', l > 1.2 ? '#C79A00' : '#555', 28);
      G.UI.label(450, 'Al 10º corte, uno gratis', '#111', 24);
      G.qr(110, 500, 180, 4);
    },
    reactivar(c, l) {
      G.UI.header('Hace rato que no vienen', 'Clientes');
      [['Juan', '63 días'], ['Lucas', '41 días'], ['Nico', '38 días'], ['Fede', '35 días']]
        .forEach((r, i) => G.UI.row(176 + i * 96, r[0], '', r[1], i === 0 ? C.red : C.yellow, G.prog(l, .3 + i * .2, .2), i === 0));
      G.UI.button(580, 'Escribirle por WhatsApp', C.wa, G.prog(l, 1.5, .3));
      G.UI.tap(200, 620, G.prog(l, 1.5, .4));
    },
    resumen(c, l) {
      G.UI.header('Resumen del mes', 'Barbería Tomás');
      [['Turnos', 'con seña', '0 faltas'], ['Fila', 'virtual', '0 se fueron'], ['Volvieron', '', '+2 clientes'], ['Caja', '', 'al día']]
        .forEach((r, i) => G.UI.row(176 + i * 96, r[0], r[1], r[2], i === 3 ? C.blue : C.green, G.prog(l, .3 + i * .25, .2)));
    },
    tour(c, l) {
      const i = Math.min(3, Math.floor(l / .85)), k = ['agenda', 'fila', 'caja', 'ficha'][i];
      SCREENS[k](c, l - i * .85 + 2);
    },
  };

  // ---------- plantillas ----------
  const T = {};
  // gancho: palabras gigantes que caen de golpe
  T.hook = ({ vo, lines, theme = 'rojo', emoji, d = 2.2, sfx = [], top = 'arriba' }) => ({
    vo, d, theme, tr: 'zoom', shake: 26, shakeDur: .7, sfx: [[0, 'boom'], ...lines.slice(1).map((_, i) => [.3 + i * .3, 'hit']), ...sfx],
    draw(G, lt) {
      G.rays(lt, G.CX, 860, G.PAL[theme][0], { a: .18 });
      if (emoji) G.emoji(lt, emoji, G.CX, 420, 220, { at: .05, bob: 8 });
      const y0 = 860 - (lines.length - 1) * 120;
      lines.forEach((ln, i) => G.slam(lt, ln.t, { y: y0 + i * 240, at: i * .3, size: ln.size || 190, color: ln.color || '#fff', box: ln.box || null, rot: i % 2 ? .03 : -.035 }));
      G.burst(lt, .05, G.CX, 860);
    },
  });
  // frase fuerte: textos apilados
  T.text = ({ vo, lines, theme = 'violeta', emoji, d = 2.2, sfx = [], y = 820 }) => ({
    vo, d, theme, sfx: [[0, 'pop'], ...sfx],
    draw(G, lt) {
      if (emoji) G.emoji(lt, emoji, G.CX, y - 420, 200, { bob: 8 });
      G.stack(lt, lines.map(([s, o], i) => [s, { size: 100, at: i * .35, ...(o || {}) }]), { y });
    },
  });
  // palabra gigante sola
  T.slam = ({ vo, t, sub, theme = 'amarillo', d = 1.6, box = C.yellow, color = '#000', sfx = [] }) => ({
    vo, d, theme, shake: 30, shakeDur: .5, sfx: [[0, 'boom'], ...sfx],
    draw(G, lt) {
      G.rays(lt, G.CX, 860, box, { a: .25 });
      G.slam(lt, t, { y: 860, size: 210, box, color });
      if (sub) G.txt(lt, sub, { y: 1080, size: 72, at: .35 });
      G.burst(lt, .05, G.CX, 860);
    },
  });
  // número de plata que corre, con rayos y explosión
  T.stat = ({ vo, label, from = 0, to, sub, theme, d = 2.4, sfx = [], pie = true }) => {
    const neg = to < 0; theme = theme || (neg ? 'rojo' : 'verde');
    return {
      vo, d, theme, shake: neg ? 30 : 0, shakeDur: 1.1, sfx: [[.15, 'ticks:12:0.07'], [1.1, neg ? 'boom' : 'cash'], ...sfx],
      draw(G, lt) {
        G.rays(lt, G.CX, 900, neg ? C.red : C.green, { a: .2 });
        if (label) G.txt(lt, label, { y: 560, size: 84 });
        G.cash(lt, from, to, { y: 900, size: 210, at: .15, dur: .95, sub });
        G.burst(lt, 1.1, G.CX, 900, neg ? [C.red, '#FF6D00', '#fff'] : [C.green, C.yellow, '#00E5FF', '#fff']);
        if (pie) G.txt(lt, `_Ejemplo_ _con_ _corte_ _a_ _${G.money(K)}_`, { y: 1530, size: 32, weight: 600, stagger: 0, stroke: false });
      },
    };
  };
  // número cualquiera (no plata)
  T.num = ({ vo, label, from = 0, to, unit = '', theme = 'rojo', d = 2.2, color = C.red, sfx = [] }) => ({
    vo, d, theme, sfx: [[.1, 'ticks:14:0.07'], [1.1, 'hit'], ...sfx],
    draw(G, lt) {
      G.rays(lt, G.CX, 900, color, { a: .18 });
      if (label) G.txt(lt, label, { y: 560, size: 80 });
      const n = Math.round(G.lerp(from, to, G.E.out(G.prog(lt, .1, 1))));
      G.slam(lt, `${n}${unit}`, { y: 900, size: 300, color, rot: 0 });
    },
  });
  // cuenta: renglones que se suman y total gigante
  T.calc = ({ vo, rows, total, theme = 'rojo', d = 5, sfx = [] }) => ({
    vo, d, theme, sfx: [...rows.map((_, i) => [.2 + i * .7, 'hit']), [.3 + rows.length * .7, 'boom'], ...sfx], shake: 0,
    draw(G, lt) {
      G.txt(lt, '_por_ _mes_', { x: 860, y: 330, size: 46, stagger: 0 });
      rows.forEach(([lab, v], i) => {
        const y = 470 + i * 220, at = .2 + i * .7;
        G.txt(lt, lab, { x: 90, y: y - 48, size: 58, align: 'left', at, stagger: 0, weight: 800, maxW: 860 });
        G.cash(lt, 0, v, { x: 510, y: y + 42, size: 112, at, dur: .5, glow: false });
      });
      const ta = .3 + rows.length * .7, y = 470 + rows.length * 220 + 40;
      if (lt > ta) {
        G.ctx.fillStyle = '#fff'; G.ctx.fillRect(90, y - 100, 840 * G.E.out(G.prog(lt, ta, .25)), 8);
        G.rays(lt, G.CX, y + 40, C.red, { at: ta, a: .2 });
        G.cash(lt, 0, total, { y: y + 40, size: 175, at: ta, dur: .8, sub: 'POR MES' });
        G.burst(lt, ta + .8, G.CX, y + 40, [C.red, '#FF6D00', '#fff']);
      }
    },
  });
  // comparación SIN / CON
  T.versus = ({ vo, title = 'MIRÁ LA DIFERENCIA', left, right, theme = 'violeta', d = 4.2, sfx = [] }) => ({
    vo, d, theme, sfx: [[0, 'whoosh'], [.3, 'hit'], ...[0, 1, 2, 3, 4, 5].map(i => [.45 + i * .22, 'pop', .6]), ...sfx],
    draw(G, lt) {
      G.slam(lt, title, { y: 250, size: 80, rot: 0 });
      G.versus(lt, { at: .1, left, right });
    },
  });
  // el celular con una pantalla de la app
  T.phone = ({ vo, title, screen, theme = 'azul', d = 3.2, sfx = [], s = 1.38, y = 1050 }) => ({
    vo, d, theme, sfx: [[.1, 'whoosh'], [1.4, 'pop'], [1.6, 'check'], ...sfx],
    draw(G, lt) {
      if (title) G.txt(lt, title, { y: 270, size: 78 });
      G.rays(lt, G.CX, y, G.PAL[theme][1], { a: .14, at: .2 });
      G.phone(lt, G.CX, y, s, SCREENS[screen], { at: .1 });
    },
  });
  // lista con emojis
  T.list = ({ vo, title, items, theme = 'violeta', d = 3.4, sfx = [] }) => ({
    vo, d, theme, sfx: [...items.map((_, i) => [.3 + i * .5, 'pop']), ...sfx],
    draw(G, lt) {
      if (title) G.slam(lt, title, { y: 300, size: 92, rot: 0 });
      const y0 = 560, step = Math.min(240, 900 / items.length);
      items.forEach(([e, t], i) => {
        const at = .3 + i * .5, y = y0 + i * step;
        G.emoji(lt, e, 170, y, 120, { at });
        G.txt(lt, t, { x: 270, y, size: 68, at: at + .05, align: 'left', maxW: 640, stagger: .02 });
      });
    },
  });
  // cierre con llamado a la acción
  T.cta = ({ vo, top = 'Comentá', word = 'BARBER', sub = 'y te la paso gratis', theme = 'amarillo', d = 3.2 }) => ({
    vo, d, theme, sfx: [[0, 'boom'], [.35, 'hit'], [.8, 'cash']],
    draw(G, lt) {
      G.rays(lt, G.CX, 820, C.yellow, { a: .25 });
      G.txt(lt, top, { y: 560, size: 104 });
      G.slam(lt, word, { y: 790, size: 230, box: C.yellow, color: '#000', at: .3 });
      G.txt(lt, sub, { y: 1010, size: 76, at: .6 });
      G.arrowDown(lt, G.CX, 1200, .8);
      G.txt(lt, CFG.usuario, { y: 1330, size: 42, weight: 700, color: '#E0E0EA', at: .9, stagger: 0 });
      G.confetti(lt, .3);
    },
  });

  // ---------- escenas con personajes ----------
  const FX = {};
  FX.banco = (G, n = 4, y = 1120, col = '#5A5A6E') => {
    G.ctx.fillStyle = '#2A2A36'; G.rr(120, y + 120, 760, 40, 14); G.ctx.fill();
    for (let i = 0; i < n; i++) G.person(200 + i * 200, y, .8, col);
  };
  FX.seVa = (G, lt, at) => {
    const p = G.prog(lt, at, .9); if (p <= 0) return;
    const x = p < .45 ? G.lerp(1200, 900, G.E.out(p / .45)) : G.lerp(900, 1250, G.E.inOut((p - .45) / .55));
    G.person(x, 1000, 1.05, p > .45 ? C.red : '#fff');
    if (p > .2 && p < .7) G.emoji(lt, '😒', x, 760, 110, { at: at + .2 });
  };
  FX.split = (G, lt, sab = 12, mar = 0, k = 1) => {
    const c = G.ctx;
    c.fillStyle = 'rgba(255,23,68,.18)'; c.fillRect(0, 380, 540, 1100);
    c.fillStyle = 'rgba(0,229,255,.10)'; c.fillRect(540, 380, 540, 1100);
    c.fillStyle = '#fff'; c.fillRect(538, 380, 4, 1100);
    G.txt(lt, 'SÁBADO', { x: 270, y: 470, size: 72, stagger: 0, color: C.red });
    G.txt(lt, 'MARTES', { x: 760, y: 470, size: 72, stagger: 0, color: '#9FF' });
    for (let i = 0; i < sab; i++) G.person(90 + (i % 4) * 120 + Math.sin(lt * 9 + i) * 6 * k, 760 + Math.floor(i / 4) * 250, .55, '#fff');
    for (let i = 0; i < mar; i++) G.person(630 + (i % 3) * 120, 760 + Math.floor(i / 3) * 250, .55, C.green);
    if (mar === 0) { G.chair(760, 1060, .55); G.emoji(lt, '🦗', 850, 1240, 90); }
  };
  FX.hoja = (G, x = G.CX, y = 900, s = 1, rot = -.04) => {
    G.withT(x, y, s, rot, 1, () => {
      const c = G.ctx;
      c.fillStyle = C.paper; G.rr(-360, -470, 720, 940, 18); c.fill();
      c.strokeStyle = 'rgba(61,139,255,.35)'; c.lineWidth = 3;
      for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(-340, -380 + i * 62); c.lineTo(340, -380 + i * 62); c.stroke(); }
      c.fillStyle = 'rgba(120,70,20,.25)'; c.beginPath(); c.arc(180, 250, 120, 0, 7); c.fill();
      c.fillStyle = C.paper; c.beginPath(); c.arc(180, 250, 85, 0, 7); c.fill();
      c.fillStyle = '#1b2a6b'; c.font = `italic 600 46px ${G.FONT}`; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      ['16:00  Nico', '17:00  Martín ?', '17:30  Lucas', '17:00  Martín??', '18:30  Fede'].forEach((l, i) => c.fillText(l, -230, -300 + i * 124));
      c.strokeStyle = C.red; c.lineWidth = 8; c.beginPath(); c.ellipse(-20, -176, 260, 60, -.03, 0, 7); c.stroke();
      c.beginPath(); c.ellipse(-20, 72, 260, 60, .03, 0, 7); c.stroke();
    });
  };
  FX.calendario = (G, lt, days, marks) => {
    for (let i = 0; i < 70; i++) {
      const x = 110 + (i % 7) * 115, y = 560 + Math.floor(i / 7) * 82, on = i < days, m = marks.includes(i);
      G.ctx.fillStyle = on ? (m ? C.green : '#2A2A36') : '#15151D'; G.rr(x, y, 100, 70, 12); G.ctx.fill();
    }
  };

  window.T = T; window.SCREENS = SCREENS; window.FX = FX;
})();
