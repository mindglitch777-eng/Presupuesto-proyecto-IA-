// Motor de animación: dibuja un cuadro de 1080x1920 para un tiempo t.
(function () {
  const W = 1080, H = 1920, CX = 500; // CX corrido a la izquierda: la columna derecha es de los botones de TikTok
  const canvas = document.getElementById('c');
  const mainCtx = canvas.getContext('2d');
  let ctx = mainCtx; // se cambia al buffer mientras se dibuja la escena (para las transiciones)
  const buf = document.createElement('canvas'); buf.width = 1080; buf.height = 1920;
  const bctx = buf.getContext('2d');
  const FONT = '"Inter Display", "Inter", "Noto Color Emoji", sans-serif';
  const C = {
    bg: '#0A0A0F', white: '#FFFFFF', yellow: '#FFD400', red: '#FF2E3E', green: '#1EE88A',
    gray: '#8B8B99', dark: '#15151D', blue: '#3D8BFF', wa: '#25D366', paper: '#F3EAD3',
  };

  // ---------- utilidades ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = {
    out: p => 1 - Math.pow(1 - p, 3),
    inOut: p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
    elastic: p => (p === 0 || p === 1 ? p : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (2 * Math.PI / 3)) + 1),
  };
  const prog = (lt, at, dur) => clamp((lt - at) / dur);
  const money = n => (n < 0 ? '−' : '') + '$' + Math.round(Math.abs(n)).toLocaleString('es-AR');
  // pseudoaleatorio estable (mismo resultado en cada cuadro)
  const rnd = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function withT(x, y, s, rot, a, fn) {
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (s !== 1) ctx.scale(s, s);
    ctx.globalAlpha *= a; fn(); ctx.restore();
  }
  // escala de entrada con rebote
  const popS = (lt, at, d = .28) => { const p = prog(lt, at, d); return p <= 0 ? 0 : E.back(p); };

  // ---------- fondo ----------
  const grain = [];
  for (let k = 0; k < 4; k++) {
    const g = document.createElement('canvas'); g.width = 540; g.height = 960;
    const gx = g.getContext('2d'), im = gx.createImageData(540, 960);
    for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    gx.putImageData(im, 0, 0); grain.push(g);
  }
  // paletas de dos colores por tema (los nombres viejos siguen funcionando)
  const PAL = {
    rojo: ['#FF1744', '#FF6D00'], verde: ['#00E676', '#00B8D4'], amarillo: ['#FFD400', '#FF6D00'], violeta: ['#7C4DFF', '#F50057'],
    azul: ['#2979FF', '#00E5FF'], rosa: ['#FF4081', '#7C4DFF'], naranja: ['#FF6D00', '#FFD400'], cian: ['#00E5FF', '#76FF03'],
  };
  Object.assign(PAL, { red: PAL.rojo, green: PAL.verde, yellow: PAL.amarillo, blue: PAL.azul, neutral: PAL.violeta });
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  function blob(x, y, r, col, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(col, a)); g.addColorStop(.55, rgba(col, a * .35)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function bg(theme = 'violeta', t = 0) {
    const [a, b] = PAL[theme] || PAL.violeta;
    ctx.fillStyle = '#07070C'; ctx.fillRect(0, 0, W, H);
    blob(W * .15 + Math.sin(t * .6) * 220, H * .22 + Math.cos(t * .45) * 220, 950, a, .6);
    blob(W * .9 + Math.cos(t * .5) * 200, H * .78 + Math.sin(t * .7) * 240, 1050, b, .55);
    ctx.save(); ctx.globalAlpha = .055; ctx.fillStyle = '#fff'; ctx.translate(W / 2, H / 2); ctx.rotate(-.5);
    const off = (t * 140) % 170;
    for (let x = -1700 + off; x < 1700; x += 170) ctx.fillRect(x, -1700, 64, 3400);
    ctx.restore();
    const d = ctx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, 900);
    d.addColorStop(0, 'rgba(7,7,12,.55)'); d.addColorStop(1, 'rgba(7,7,12,0)');
    ctx.fillStyle = d; ctx.fillRect(0, 0, W, H);
  }
  function post(t, frame) {
    const v = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = .07; ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(grain[frame % 4], 0, 0, W, H);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  function flash(a, color = '#fff') { if (a <= 0) return; ctx.fillStyle = color; ctx.globalAlpha = a; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }

  // ---------- texto ----------
  // Marcas: *palabra* = caja amarilla, !palabra! = rojo, +palabra+ = verde, _palabra_ = gris
  function parse(str) {
    return str.split(' ').filter(Boolean).map(w => {
      let style = null, m;
      const S = { '*': 'box', '!': 'red', '+': 'green', '_': 'gray' };
      if ((m = w.match(/^([“"¿¡]*)([*!+_])(.+)\2([.,!?:…”"]*)$/))) { style = S[m[2]]; w = m[1] + m[3] + m[4]; }
      return { w, style };
    });
  }
  function layout(str, o) {
    let { size = 100, weight = 900, maxW = 860, lh = 1.12, upper = false } = o;
    for (let tries = 0; tries < 12; tries++) {
      ctx.font = `${weight} ${size}px ${FONT}`;
      const words = parse(upper ? str.toUpperCase() : str);
      const sp = ctx.measureText(' ').width, padX = size * .18;
      words.forEach(o2 => { o2.wd = ctx.measureText(o2.w).width + (o2.style === 'box' ? padX * 2 : 0); });
      if (words.some(w => w.wd > maxW)) { size *= .92; continue; } // una palabra sola no entra: achicar
      const lines = []; let cur = [], cw = 0;
      words.forEach(o2 => {
        if (cur.length && cw + sp + o2.wd > maxW) { lines.push({ ws: cur, w: cw }); cur = []; cw = 0; }
        cw += (cur.length ? sp : 0) + o2.wd; cur.push(o2);
      });
      if (cur.length) lines.push({ ws: cur, w: cw });
      return { lines, size, sp, lineH: size * lh, height: lines.length * size * lh };
    }
  }
  const txtH = (str, o = {}) => layout(str, o).height;
  // apila varios textos centrados verticalmente en "y" sin que se pisen
  function stack(lt, items, { y = 860, gap = 36 } = {}) {
    const hs = items.map(([s, o]) => (o && o.h) || txtH(s, o || {}));
    let yy = y - (hs.reduce((a, b) => a + b, 0) + gap * (items.length - 1)) / 2;
    items.forEach(([s, o], i) => {
      const c = yy + hs[i] / 2;
      if (o && o.draw) o.draw(c); else txt(lt, s, { ...(o || {}), y: c });
      yy += hs[i] + gap;
    });
  }
  function txt(lt, str, o = {}) {
    const {
      x = CX, y = 900, at = 0, color = C.white, weight = 900,
      stagger = .045, strike = null, a = 1, out = null, boxColor = C.yellow, shadow = true, align = 'center', stroke = true,
    } = o;
    if (lt < at) return;
    const fa = out != null ? 1 - prog(lt, out, .2) : 1;
    if (fa <= 0) return;
    const { lines, size, sp, lineH } = layout(str, o);
    ctx.font = `${weight} ${size}px ${FONT}`;
    const y0 = y - (lines.length - 1) * lineH / 2;
    let idx = 0;
    ctx.textBaseline = 'middle';
    lines.forEach((L, li) => {
      let xx = align === 'left' ? x : x - L.w / 2;
      const yy = y0 + li * lineH;
      L.ws.forEach(o2 => {
        const wat = at + idx * stagger, s = popS(lt, wat, .26), p = prog(lt, wat, .12);
        const cx = xx + o2.wd / 2;
        if (s > 0) withT(cx, yy, s, 0, p * a * fa, () => {
          ctx.textAlign = 'center';
          if (o2.style === 'box') {
            ctx.fillStyle = boxColor; rr(-o2.wd / 2, -size * .58, o2.wd, size * 1.12, size * .16); ctx.fill();
            ctx.fillStyle = '#0A0A0F'; ctx.fillText(o2.w, 0, size * .04);
          } else {
            if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.75)'; ctx.shadowBlur = size * .25; ctx.shadowOffsetY = size * .05; }
            ctx.fillStyle = { red: C.red, green: C.green, gray: C.gray }[o2.style] || color;
            if (stroke && shadow) { ctx.lineWidth = size * .09; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.strokeText(o2.w, 0, size * .04); }
            ctx.fillText(o2.w, 0, size * .04);
            ctx.shadowColor = 'transparent';
          }
        });
        xx += o2.wd + sp; idx++;
      });
      if (strike != null) {
        const sp2 = E.out(prog(lt, strike, .25));
        if (sp2 > 0) {
          ctx.strokeStyle = C.red; ctx.lineWidth = size * .12; ctx.lineCap = 'round';
          const sx = (align === 'left' ? x : x - L.w / 2) - 10;
          ctx.beginPath(); ctx.moveTo(sx, yy); ctx.lineTo(sx + (L.w + 20) * sp2, yy); ctx.stroke();
        }
      }
    });
  }
  // número de plata que corre de "from" a "to"
  function cash(lt, from, to, o = {}) {
    let { x = CX, y = 900, size = 170, at = 0, dur = .9, color = null, sub = null, glow = true, maxW = 880 } = o;
    if (lt < at) return;
    const p = E.out(prog(lt, at, dur)), v = lerp(from, to, p);
    const col = color || (to < 0 ? C.red : C.green);
    ctx.font = `900 ${size}px ${FONT}`;
    const wMax = Math.max(ctx.measureText(money(from)).width, ctx.measureText(money(to)).width);
    if (wMax > maxW) size *= maxW / wMax; // el número más largo siempre entra en pantalla
    const s = popS(lt, at, .3) * (1 + .05 * Math.sin(lt * 16) * (1 - p));
    withT(x, y, s, 0, 1, () => {
      ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (glow) { ctx.shadowColor = col; ctx.shadowBlur = 60; }
      ctx.fillStyle = col; ctx.fillText(money(v), 0, 0); ctx.shadowBlur = 0;
      if (sub) { ctx.font = `800 ${size * .32}px ${FONT}`; ctx.fillStyle = C.white; ctx.fillText(sub, 0, size * .78); }
    });
  }
  function emoji(lt, ch, x, y, size, o = {}) {
    const { at = 0, rot = 0, a = 1, bob = 0 } = o;
    const s = popS(lt, at, .3); if (s <= 0) return;
    withT(x, y + Math.sin(lt * 5) * bob, s, rot, a, () => {
      ctx.font = `${size}px "Noto Color Emoji"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ch, 0, 0);
    });
  }

  // ---------- dibujos ----------
  function person(x, y, s = 1, color = C.white, a = 1) {
    withT(x, y, s, 0, a, () => {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(0, -150, 52, 0, Math.PI * 2); ctx.fill();
      rr(-78, -88, 156, 210, 70); ctx.fill();
      rr(-60, 90, 52, 150, 24); ctx.fill(); rr(8, 90, 52, 150, 24); ctx.fill();
    });
  }
  function chair(x, y, s = 1, color = '#2A2A36', accent = C.red, a = 1) {
    withT(x, y, s, 0, a, () => {
      ctx.fillStyle = '#3A3A48'; rr(-120, 210, 240, 30, 15); ctx.fill(); rr(-14, 120, 28, 100, 8); ctx.fill();
      ctx.fillStyle = color; rr(-150, 60, 300, 80, 30); ctx.fill();          // asiento
      rr(-120, -220, 240, 290, 40); ctx.fill();                               // respaldo
      rr(-60, -300, 120, 70, 30); ctx.fill();                                 // apoyacabeza
      ctx.fillStyle = accent; rr(-190, 20, 70, 26, 13); ctx.fill(); rr(120, 20, 70, 26, 13); ctx.fill(); // apoyabrazos
      ctx.fillStyle = 'rgba(255,255,255,.06)'; rr(-100, -200, 80, 240, 30); ctx.fill();
    });
  }
  function check(lt, x, y, r, at = 0, color = C.green) {
    const s = popS(lt, at, .3); if (s <= 0) return; const p = E.out(prog(lt, at + .1, .3));
    withT(x, y, s, 0, 1, () => {
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = '#0A0A0F'; ctx.lineWidth = r * .2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const pts = [[-r * .45, 0], [-r * .12, r * .32], [r * .48, -r * .34]];
      ctx.beginPath(); ctx.moveTo(...pts[0]);
      if (p < .4) ctx.lineTo(lerp(pts[0][0], pts[1][0], p / .4), lerp(pts[0][1], pts[1][1], p / .4));
      else { ctx.lineTo(...pts[1]); const q = (p - .4) / .6; ctx.lineTo(lerp(pts[1][0], pts[2][0], q), lerp(pts[1][1], pts[2][1], q)); }
      ctx.stroke();
    });
  }
  function cross(lt, x, y, r, at = 0) {
    const s = popS(lt, at, .3); if (s <= 0) return;
    withT(x, y, s, 0, 1, () => {
      ctx.fillStyle = C.red; ctx.shadowColor = C.red; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = r * .2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-r * .38, -r * .38); ctx.lineTo(r * .38, r * .38); ctx.moveTo(r * .38, -r * .38); ctx.lineTo(-r * .38, r * .38); ctx.stroke();
    });
  }
  function clock(x, y, r, ang) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#1C1C26'; ctx.strokeStyle = C.white; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.fillStyle = C.gray; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .8, Math.sin(a) * r * .8, 7, 0, 7); ctx.fill(); }
    ctx.lineCap = 'round'; ctx.strokeStyle = C.white; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang / 12 - 1.57) * r * .45, Math.sin(ang / 12 - 1.57) * r * .45); ctx.stroke();
    ctx.strokeStyle = C.red; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang - 1.57) * r * .7, Math.sin(ang - 1.57) * r * .7); ctx.stroke();
    ctx.restore();
  }
  function bubble(lt, x, y, text, o = {}) {
    const { at = 0, w = 560, side = 'left', size = 40, color = '#1F2C34', fg = '#fff', time = '10:4' + Math.floor(rnd(x + y) * 9) } = o;
    const s = popS(lt, at, .25); if (s <= 0) return;
    withT(x, y, s, 0, 1, () => {
      ctx.font = `600 ${size}px ${FONT}`;
      const tw = Math.min(w, ctx.measureText(text).width + 150), h = size * 2.1;
      const bx = side === 'left' ? 0 : -tw;
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30;
      ctx.fillStyle = color; rr(bx, -h / 2, tw, h, 26); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, bx + 32, 2);
      ctx.font = `500 ${size * .55}px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.textAlign = 'right'; ctx.fillText(time, bx + tw - 24, h / 2 - 20);
    });
  }
  function qr(x, y, size, seed = 3) {
    const n = 21, c = size / n;
    ctx.fillStyle = '#fff'; rr(x - 24, y - 24, size + 48, size + 48, 20); ctx.fill();
    ctx.fillStyle = '#0A0A0F';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const corner = (i < 7 && j < 7) || (i > 13 && j < 7) || (i < 7 && j > 13);
      if (corner) continue;
      if (rnd(i * 31 + j * 7 + seed) > .52) ctx.fillRect(x + i * c, y + j * c, c + .5, c + .5);
    }
    [[0, 0], [14, 0], [0, 14]].forEach(([i, j]) => {
      ctx.fillRect(x + i * c, y + j * c, 7 * c, 7 * c); ctx.fillStyle = '#fff'; ctx.fillRect(x + (i + 1) * c, y + (j + 1) * c, 5 * c, 5 * c);
      ctx.fillStyle = '#0A0A0F'; ctx.fillRect(x + (i + 2) * c, y + (j + 2) * c, 3 * c, 3 * c);
    });
  }
  function arrowDown(lt, x, y, at = 0) {
    if (lt < at) return; const b = Math.abs(Math.sin((lt - at) * 6)) * 30;
    withT(x, y + b, popS(lt, at), 0, 1, () => {
      ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(-60, -40); ctx.lineTo(60, -40); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill();
      rr(-22, -110, 44, 80, 10); ctx.fill();
    });
  }
  function progressBar(t, dur) {
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(0, 0, W, 12);
    ctx.fillStyle = C.yellow; ctx.fillRect(0, 0, W * (t / dur), 12);
  }

  // ---------- celular y pantallas de la app ----------
  const PW = 400, PH = 820;
  function phone(lt, x, y, s, screen, o = {}) {
    const { at = 0, rot = 0, dark = false } = o;
    const k = popS(lt, at, .4); if (k <= 0) return;
    const yy = y + (1 - E.out(prog(lt, at, .4))) * 400;
    withT(x, yy, s * k, rot, 1, () => {
      ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = 30;
      ctx.fillStyle = '#050507'; rr(-PW / 2 - 18, -PH / 2 - 18, PW + 36, PH + 36, 64); ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#33333F'; ctx.lineWidth = 4; rr(-PW / 2 - 18, -PH / 2 - 18, PW + 36, PH + 36, 64); ctx.stroke();
      ctx.save(); rr(-PW / 2, -PH / 2, PW, PH, 48); ctx.clip();
      ctx.translate(-PW / 2, -PH / 2);
      ctx.fillStyle = dark ? '#0F1115' : '#F5F6F8'; ctx.fillRect(0, 0, PW, PH);
      screen(ctx, lt - at);
      ctx.restore();
      ctx.fillStyle = '#050507'; rr(-55, -PH / 2 + 12, 110, 30, 15); ctx.fill();
    });
  }
  const UI = {
    header(title, sub = 'Barbería', color = '#111') {
      ctx.fillStyle = color; ctx.fillRect(0, 0, PW, 150);
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.font = `600 20px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(sub, 26, 82);
      ctx.fillStyle = '#fff'; ctx.font = `800 34px ${FONT}`; ctx.fillText(title, 26, 118);
    },
    row(y, left, mid, pill, pillColor = C.green, a = 1, hl = false) {
      ctx.globalAlpha = a;
      ctx.fillStyle = hl ? '#FFF6CC' : '#fff'; rr(16, y, PW - 32, 84, 18); ctx.fill();
      ctx.fillStyle = '#111'; ctx.font = `800 26px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(left, 34, y + 42);
      ctx.fillStyle = '#444'; ctx.font = `600 22px ${FONT}`; ctx.fillText(mid, 122, y + 42);
      if (pill) {
        ctx.font = `800 18px ${FONT}`; const pw = ctx.measureText(pill).width + 28;
        ctx.fillStyle = pillColor; rr(PW - 32 - pw - 8, y + 26, pw, 32, 16); ctx.fill();
        ctx.fillStyle = pillColor === C.yellow ? '#111' : '#fff'; ctx.textAlign = 'center'; ctx.fillText(pill, PW - 40 - pw / 2, y + 43);
      }
      ctx.globalAlpha = 1;
    },
    button(y, label, color = '#111', press = 0) {
      const s = 1 - .06 * Math.sin(clamp(press) * Math.PI);
      ctx.save(); ctx.translate(PW / 2, y + 40); ctx.scale(s, s);
      ctx.fillStyle = color; rr(-(PW - 52) / 2, -40, PW - 52, 80, 22); ctx.fill();
      ctx.fillStyle = color === C.yellow ? '#111' : '#fff'; ctx.font = `800 28px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2);
      ctx.restore();
    },
    big(y, text, color = '#111', size = 64) {
      ctx.fillStyle = color; ctx.font = `900 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, PW / 2, y);
    },
    label(y, text, color = '#666', size = 22, align = 'center', x = null) {
      ctx.fillStyle = color; ctx.font = `700 ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(text, x ?? (align === 'left' ? 26 : PW / 2), y);
    },
    tap(x, y, p) { // círculo de toque del dedo
      if (p <= 0 || p >= 1) return;
      ctx.fillStyle = `rgba(61,139,255,${.45 * (1 - p)})`; ctx.beginPath(); ctx.arc(x, y, 20 + 50 * p, 0, 7); ctx.fill();
    },
    slots(y, slots, taken = [], picked = -1, pickP = 0) { // grilla de horarios
      slots.forEach((s, i) => {
        const cx = 26 + (i % 3) * 120, cy = y + Math.floor(i / 3) * 76;
        const isT = taken.includes(i), isP = i === picked && pickP > 0;
        ctx.fillStyle = isP ? C.green : isT ? '#E3E4E8' : '#fff'; rr(cx, cy, 108, 62, 14); ctx.fill();
        ctx.strokeStyle = isT ? 'transparent' : '#D5D7DD'; ctx.lineWidth = 2; if (!isP) { rr(cx, cy, 108, 62, 14); ctx.stroke(); }
        ctx.fillStyle = isP ? '#fff' : isT ? '#A9ABB3' : '#111'; ctx.font = `800 24px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(s, cx + 54, cy + 32);
      });
    },
  };

  // ---------- efectos ----------
  function rays(lt, x, y, col, o = {}) { // abanico de rayos girando detrás de algo
    const { at = 0, n = 18, r = 1500, a = .22, speed = .35 } = o;
    const p = E.out(prog(lt, at, .45)); if (p <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(lt * speed); ctx.globalAlpha = a * p; ctx.fillStyle = col;
    for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * p, a0, a0 + Math.PI / n); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function burst(lt, at, x, y, cols = [C.yellow, '#FF4081', '#00E5FF', '#fff'], o = {}) { // explosión de partículas
    const { n = 34, spd = 1100, life = .9, size = 20 } = o; const k = lt - at;
    if (k < 0 || k > life) return;
    for (let i = 0; i < n; i++) {
      const ang = rnd(i * 7.3 + at * 13) * Math.PI * 2, v = spd * (.35 + .65 * rnd(i * 3.1 + at));
      const px = x + Math.cos(ang) * v * k, py = y + Math.sin(ang) * v * k + 1100 * k * k, f = 1 - k / life;
      ctx.globalAlpha = f; ctx.fillStyle = cols[i % cols.length];
      ctx.save(); ctx.translate(px, py); ctx.rotate(k * 9 + i); ctx.fillRect(-size * f / 2, -size * f / 4, size * f, size * f / 2); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function confetti(lt, at, o = {}) {
    const { n = 70, dur = 2.6 } = o; const k = lt - at; if (k < 0 || k > dur) return;
    const cols = [C.yellow, '#FF4081', '#00E5FF', '#76FF03', '#fff', '#7C4DFF'];
    for (let i = 0; i < n; i++) {
      const x = rnd(i * 1.7) * W + Math.sin(k * 3 + i) * 40, y = -60 + (350 + 700 * rnd(i * 2.9)) * k;
      ctx.fillStyle = cols[i % cols.length]; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i) * 6));
      ctx.fillRect(-14, -7, 28, 14 * Math.abs(Math.cos(k * 6 + i))); ctx.restore();
    }
  }
  // palabra gigante que cae de golpe
  function slam(lt, text, o = {}) {
    let { x = CX, y = 860, size = 220, at = 0, color = '#fff', box = null, rot = -.035, maxW = 900 } = o;
    const p = prog(lt, at, .2); if (p <= 0) return;
    ctx.font = `900 ${size}px ${FONT}`; let w = ctx.measureText(text).width;
    if (w > maxW) { size *= maxW / w; ctx.font = `900 ${size}px ${FONT}`; w = ctx.measureText(text).width; }
    const s = p < 1 ? lerp(2.4, 1, E.out(p)) : 1 + .018 * Math.sin((lt - at) * 8);
    withT(x, y, s, rot, Math.min(1, p * 3), () => {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (box) { ctx.fillStyle = box; ctx.shadowColor = box; ctx.shadowBlur = 50; rr(-w / 2 - size * .2, -size * .62, w + size * .4, size * 1.2, size * .18); ctx.fill(); ctx.shadowBlur = 0; }
      else { ctx.lineWidth = size * .12; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000'; ctx.strokeText(text, 0, size * .04); }
      ctx.fillStyle = color; ctx.fillText(text, 0, size * .04);
    });
  }
  // pantalla partida SIN / CON con insignia VS
  function versus(lt, o) {
    const { at = 0, left, right, y0 = 430, step = 205 } = o;
    const p = E.out(prog(lt, at, .4)); if (p <= 0) return;
    const n = Math.max(left.items.length, right.items.length);
    const bottom = y0 + 110 + n * step;
    [[left, -1, C.red], [right, 1, C.green]].forEach(([side, dir, col]) => {
      const x0 = dir < 0 ? 30 : 545, w = 420, off = (1 - p) * 700 * dir;
      ctx.save(); ctx.translate(off, 0);
      const g = ctx.createLinearGradient(0, y0, 0, bottom); g.addColorStop(0, rgba(col, .32)); g.addColorStop(1, rgba(col, .06));
      ctx.fillStyle = g; rr(x0, y0, w, bottom - y0, 34); ctx.fill();
      ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = 5; rr(x0, y0, w, bottom - y0, 34); ctx.stroke();
      ctx.fillStyle = col; rr(x0 + 30, y0 - 46, w - 60, 92, 26); ctx.fill();
      ctx.font = `900 50px ${FONT}`; ctx.fillStyle = dir < 0 ? '#fff' : '#05140C'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let tw = ctx.measureText(side.t).width; if (tw > w - 90) ctx.font = `900 ${50 * (w - 90) / tw}px ${FONT}`;
      ctx.fillText(side.t, x0 + w / 2, y0 + 2);
      ctx.restore();
      side.items.forEach((it, i) => {
        const ia = at + .45 + (i * 2 + (dir < 0 ? 0 : 1)) * .22, cy = y0 + 120 + i * step;
        (dir < 0 ? cross : check)(lt, x0 + w / 2, cy, 34, ia);
        txt(lt, it, { x: x0 + w / 2, y: cy + 90, size: 40, maxW: w - 40, at: ia + .05, stagger: .02, weight: 800, color: '#fff' });
      });
    });
    const vs = popS(lt, at + .3, .35);
    if (vs > 0) withT(W / 2 - 3, y0 + 40, vs, Math.sin(lt * 3) * .08, 1, () => {
      ctx.fillStyle = C.yellow; ctx.shadowColor = C.yellow; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#000'; ctx.font = `900 64px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('VS', 0, 4);
    });
  }
  // subtítulos tipo CapCut, palabra por palabra
  function captions(lt, s) {
    if (!s.chunks) return;
    const ch = s.chunks.find(c => lt >= c.start && lt < c.end); if (!ch) return;
    const size = 62, y = 1420, pop = popS(lt, ch.start, .16);
    ctx.font = `900 ${size}px ${FONT}`;
    const ws = ch.words.map(w => ({ ...w, txt: w.w.toUpperCase(), wd: ctx.measureText(w.w.toUpperCase()).width }));
    const sp = size * .3, total = ws.reduce((a, w) => a + w.wd, 0) + sp * (ws.length - 1);
    const k = Math.min(1, 880 / total);
    withT(CX, y, pop * k, 0, 1, () => {
      let x = -total / 2; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
      ws.forEach(w => {
        const on = lt >= w.t - .02 && lt < w.t + Math.max(w.d, .12) + .05, cx = x + w.wd / 2;
        withT(cx, 0, on ? 1.12 : 1, 0, 1, () => {
          ctx.lineWidth = 16; ctx.strokeStyle = '#000'; ctx.strokeText(w.txt, 0, 0);
          ctx.fillStyle = on ? C.yellow : '#fff'; ctx.fillText(w.txt, 0, 0);
        });
        x += w.wd + sp;
      });
    });
  }

  window.ENG = { W, H, CX, C, PAL, rgba, get ctx() { return ctx; }, E, clamp, lerp, prog, money, rnd, rr, withT, popS, bg, post, flash, txt, txtH, stack, cash, emoji,
    person, chair, check, cross, clock, bubble, qr, arrowDown, progressBar, phone, UI, PW, PH, FONT, rays, burst, confetti, slam, versus };

  // ---------- línea de tiempo ----------
  const FPS = 30;
  // marcas para la narración: P(10000) se lee "diez mil pesos", N(14) se lee "catorce"
  window.P = n => `[[${Math.round(n)}]]`;
  window.N = n => `{{${Math.round(n)}}}`;
  const TRS = ['whip-l', 'glitch', 'zoom', 'whip-up', 'iris', 'whip-r', 'spin', 'glitch', 'flash'];
  const TR_SFX = { 'whip-l': 'whoosh', 'whip-r': 'whoosh', 'whip-up': 'whoosh', glitch: 'glitch', iris: 'whoosh', spin: 'whoosh', zoom: 'hit', flash: 'hit' };
  function chunk(words) { // agrupa palabras en frases cortas para los subtítulos
    const out = []; let cur = [];
    words.forEach((w, i) => {
      cur.push(w);
      const chars = cur.reduce((a, x) => a + x.w.length, 0);
      if (cur.length >= 3 || chars > 14 || /[.,!?;:…]$/.test(w.w) || i === words.length - 1) { out.push(cur); cur = []; }
    });
    return out.map((ws, i) => ({ words: ws, start: ws[0].t - .05, end: i < out.length - 1 ? out[i + 1][0].t - .05 : ws[ws.length - 1].t + ws[ws.length - 1].d + .35 }));
  }
  window.VIDEO = function (def) {
    let f0 = 0;
    const vd = window.VO_DUR || [];
    def.scenes.forEach((s, i) => {
      s.voAt = s.voAt ?? .1;
      s.tr = s.tr || (i === 0 ? 'zoom' : TRS[i % TRS.length]);
      if (vd[i]) {
        s.d = Math.max(s.d, s.voAt + vd[i].dur + .18); // la escena dura al menos lo que dura la voz
        if (vd[i].words && vd[i].words.length) s.chunks = chunk(vd[i].words.map(w => ({ ...w, t: w.t + s.voAt })));
      }
      s.frames = Math.round(s.d * FPS); s.f0 = f0; s.start = f0 / FPS; f0 += s.frames;
    });
    def.frames = f0; def.duration = f0 / FPS;
    def.sfxAll = [];
    def.scenes.forEach((s, i) => {
      if (i > 0 && !s.noTrSfx) def.sfxAll.push({ t: s.start, type: TR_SFX[s.tr] || 'whoosh', vol: .7 });
      (s.sfx || []).forEach(([o, type, vol]) => def.sfxAll.push({ t: s.start + o, type, vol: vol ?? 1 }));
    });
    window.DEF = def;
  };
  window.renderFrame = function (frame) {
    const def = window.DEF, t = frame / FPS;
    let si = def.scenes.findIndex(s => frame >= s.f0 && frame < s.f0 + s.frames); if (si < 0) si = def.scenes.length - 1;
    const s = def.scenes[si], lt = t - s.start, theme = s.theme || def.theme || 'violeta';
    // 1) la escena se dibuja en el buffer
    ctx = bctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    bg(theme, t);
    ctx.save();
    const drift = 1 + .04 * (lt / s.d);
    const shake = (s.shake || 0) * Math.max(0, 1 - lt / (s.shakeDur || .5));
    const sx = shake ? (rnd(frame) - .5) * shake * 2 : 0, sy = shake ? (rnd(frame + 99) - .5) * shake * 2 : 0;
    ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(drift, drift); ctx.translate(-W / 2, -H / 2);
    s.draw(ENG, lt, t);
    ctx.restore();
    // 2) se compone en pantalla con la transición de entrada
    ctx = mainCtx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    const p = prog(lt, 0, .3), e = E.out(p), [ca, cb] = PAL[theme] || PAL.violeta;
    ctx.fillStyle = '#07070C'; ctx.fillRect(0, 0, W, H);
    const tr = s.tr;
    if (p >= 1) ctx.drawImage(buf, 0, 0);
    else if (tr.startsWith('whip')) {
      const dx = tr === 'whip-l' ? W : tr === 'whip-r' ? -W : 0, dy = tr === 'whip-up' ? H * .6 : 0, k = 1 - e;
      for (let j = 3; j >= 0; j--) { ctx.globalAlpha = j ? .18 : 1; ctx.drawImage(buf, dx * k * (1 + j * .12), dy * k * (1 + j * .12)); }
      ctx.globalAlpha = 1;
    } else if (tr === 'glitch') {
      ctx.drawImage(buf, 0, 0);
      for (let j = 0; j < 9; j++) {
        const y = rnd(frame * 13 + j) * H, h = 30 + rnd(frame * 7 + j) * 170, dx = (rnd(frame * 3 + j) - .5) * 220 * (1 - p);
        ctx.drawImage(buf, 0, y, W, h, dx, y, W, h);
        ctx.fillStyle = rgba(j % 2 ? ca : cb, .35 * (1 - p)); ctx.fillRect(0, y, W, h * .15);
      }
    } else if (tr === 'iris') {
      ctx.fillStyle = ca; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.arc(CX, 900, 60 + e * 1500, 0, 7); ctx.clip(); ctx.drawImage(buf, 0, 0); ctx.restore();
    } else if (tr === 'spin') {
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate((1 - e) * .5); ctx.scale(.6 + .4 * e, .6 + .4 * e); ctx.drawImage(buf, -W / 2, -H / 2); ctx.restore();
    } else { // zoom y flash
      const z = 1 + .28 * (1 - e);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.drawImage(buf, -W / 2, -H / 2); ctx.restore();
    }
    flash((tr === 'flash' ? .8 : .3) * (1 - prog(lt, 0, .14)));
    captions(lt, s);
    // barra de progreso con degradé
    const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, C.yellow); g.addColorStop(1, '#FF4081');
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(0, 0, W, 12); ctx.fillStyle = g; ctx.fillRect(0, 0, W * (t / def.duration), 12);
    post(t, frame);
  };
})();
