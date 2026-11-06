// Motor de animación: dibuja un cuadro de 1080x1920 para un tiempo t.
(function () {
  const W = 1080, H = 1920, CX = 500; // CX corrido a la izquierda: la columna derecha es de los botones de TikTok
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
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
  const THEMES = { red: [255, 46, 62], green: [30, 232, 138], yellow: [255, 212, 0], blue: [61, 139, 255], neutral: [120, 110, 255] };
  function bg(theme = 'neutral', t = 0) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const [r, g, b] = THEMES[theme] || THEMES.neutral;
    const gx = W / 2 + Math.sin(t * .7) * 220, gy = H * .38 + Math.cos(t * .5) * 160;
    const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 1100);
    gr.addColorStop(0, `rgba(${r},${g},${b},.30)`); gr.addColorStop(.5, `rgba(${r},${g},${b},.08)`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    // grilla sutil en movimiento
    ctx.strokeStyle = 'rgba(255,255,255,.035)'; ctx.lineWidth = 2;
    const off = (t * 40) % 120;
    for (let y = -120 + off; y < H; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let x = 0; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
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
      stagger = .045, strike = null, a = 1, out = null, boxColor = C.yellow, shadow = true, align = 'center',
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

  window.ENG = { W, H, CX, C, ctx, E, clamp, lerp, prog, money, rnd, rr, withT, popS, bg, post, flash, txt, txtH, stack, cash, emoji, person, chair, check, cross, clock, bubble, qr, arrowDown, progressBar, phone, UI, PW, PH, FONT };

  // ---------- línea de tiempo ----------
  const FPS = 30;
  // marcas para la narración: P(10000) se lee "diez mil pesos", N(14) se lee "catorce"
  window.P = n => `[[${Math.round(n)}]]`;
  window.N = n => `{{${Math.round(n)}}}`;
  window.VIDEO = function (def) {
    let f0 = 0;
    const vd = window.VO_DUR || [];
    def.scenes.forEach((s, i) => {
      s.voAt = s.voAt ?? .08;
      if (vd[i]) s.d = Math.max(s.d, s.voAt + vd[i].dur + .22); // la escena dura al menos lo que dura la voz
      s.frames = Math.round(s.d * FPS); s.f0 = f0; s.start = f0 / FPS; f0 += s.frames;
    });
    def.frames = f0; def.duration = f0 / FPS;
    def.sfxAll = [];
    def.scenes.forEach(s => (s.sfx || []).forEach(([o, type, vol]) => def.sfxAll.push({ t: s.start + o, type, vol: vol ?? 1 })));
    window.DEF = def;
  };
  window.renderFrame = function (frame) {
    const def = window.DEF, t = frame / FPS;
    let si = def.scenes.findIndex(s => frame >= s.f0 && frame < s.f0 + s.frames); if (si < 0) si = def.scenes.length - 1;
    const s = def.scenes[si], lt = t - s.start;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    bg(s.theme || def.theme || 'neutral', t);
    ctx.save();
    // golpe de entrada en cada corte + zoom lento constante
    const pin = s.noPunch ? 1 : 1 + .1 * (1 - E.out(prog(lt, 0, .22)));
    const drift = 1 + .035 * (lt / s.d);
    const shake = (s.shake || 0) * Math.max(0, 1 - lt / (s.shakeDur || .5));
    const sx = shake ? (rnd(frame) - .5) * shake * 2 : 0, sy = shake ? (rnd(frame + 99) - .5) * shake * 2 : 0;
    ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(pin * drift, pin * drift); ctx.translate(-W / 2, -H / 2);
    s.draw(ENG, lt, t);
    ctx.restore();
    if (!s.noPunch) flash(.35 * (1 - prog(lt, 0, .12)));
    if (def.progress !== false) progressBar(t, def.duration);
    post(t, frame);
  };
})();
