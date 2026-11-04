(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    cv = $("c"),
    g = cv.getContext("2d");
  const LAPS = 3,
    W = 150,
    TOP = 520;
  const PC = [
    [0, -300],
    [400, -340],
    [760, -170],
    [700, 140],
    [330, 260],
    [90, 90],
    [-210, 260],
    [-620, 210],
    [-740, -40],
    [-470, -260],
  ];
  const S = [];
  for (let i = 0; i < PC.length; i++) {
    const p = [0, 1, 2, 3].map((k) => PC[(i + k - 1 + PC.length) % PC.length]);
    for (let j = 0; j < 24; j++) {
      const t = j / 24,
        t2 = t * t,
        t3 = t2 * t;
      S.push(
        [0, 1].map(
          (d) =>
            0.5 *
            (2 * p[1][d] +
              (-p[0][d] + p[2][d]) * t +
              (2 * p[0][d] - 5 * p[1][d] + 4 * p[2][d] - p[3][d]) * t2 +
              (-p[0][d] + 3 * p[1][d] - 3 * p[2][d] + p[3][d]) * t3),
        ),
      );
    }
  }
  const N = S.length,
    tang = (i) => {
      const a = S[i % N],
        b = S[(i + 1) % N];
      return Math.atan2(b[1] - a[1], b[0] - a[0]);
    };
  let tp;
  const mkPath = () => {
    tp = new Path2D();
    S.forEach((p, i) => (i ? tp.lineTo(p[0], p[1]) : tp.moveTo(p[0], p[1])));
    tp.closePath();
  };
  mkPath();
  let sd = 7;
  const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const bushes = [];
  for (let n = 0; n < 220; n++) {
    const x = (rnd() - 0.5) * 2500,
      y = (rnd() - 0.5) * 1600;
    if (S.every((p) => Math.hypot(p[0] - x, p[1] - y) > W / 2 + 50))
      bushes.push([x, y, 9 + rnd() * 16]);
  }
  let bx0 = 1e9,
    bx1 = -1e9,
    by0 = 1e9,
    by1 = -1e9;
  S.forEach((p) => {
    bx0 = Math.min(bx0, p[0]);
    bx1 = Math.max(bx1, p[0]);
    by0 = Math.min(by0, p[1]);
    by1 = Math.max(by1, p[1]);
  });
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wr = (a) => {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  };
  const LV = [
    {
      n: "Greenwood Forest",
      g: "#6fae5b",
      k: "tree",
      c1: "#4f8e42",
      c2: "#86c36f",
      p: PC,
    },
    {
      n: "Neon City",
      g: "#59606e",
      k: "bld",
      c1: "#2d3445",
      c2: "#8fa3c7",
      p: [
        [-500, -250],
        [0, -300],
        [500, -250],
        [650, 0],
        [500, 250],
        [180, 180],
        [0, 60],
        [-180, 180],
        [-500, 250],
        [-650, 0],
      ],
    },
    {
      n: "Dune Run",
      g: "#e3c27e",
      k: "rock",
      c1: "#3f8d4a",
      c2: "#d1a35f",
      c3: "#b98a4a",
      p: [
        [-700, -100],
        [-400, -300],
        [-50, -150],
        [250, -300],
        [650, -200],
        [700, 100],
        [400, 250],
        [50, 100],
        [-250, 300],
        [-600, 250],
      ],
    },
    {
      n: "Frostbite Pass",
      g: "#e9f2f8",
      k: "tree",
      c1: "#b7ccd9",
      c2: "#2f7d5b",
      r: "#4a5568",
      p: [
        [-700, -250],
        [-250, -330],
        [200, -250],
        [650, -300],
        [780, 0],
        [450, 200],
        [100, 60],
        [-250, 230],
        [-650, 300],
        [-800, 30],
      ],
    },
    {
      n: "Sunset Coast",
      g: "#f0d9a0",
      k: "rock",
      c1: "#2aa6b8",
      c2: "#e87f6b",
      c3: "#c9a45f",
      p: [
        [-600, -100],
        [-350, -300],
        [0, -220],
        [350, -320],
        [700, -150],
        [650, 150],
        [300, 300],
        [-50, 200],
        [-400, 320],
        [-720, 150],
      ],
    },
    {
      n: "Volcano Ridge",
      g: "#3b2a2a",
      k: "rock",
      c1: "#ff6a2a",
      c2: "#5a4040",
      c3: "#241818",
      r: "#2a2a33",
      p: [
        [-500, -300],
        [0, -100],
        [500, -300],
        [750, -50],
        [500, 250],
        [100, 150],
        [-100, 320],
        [-450, 200],
        [-750, 60],
        [-700, -150],
      ],
    },
    {
      n: "Midnight Docks",
      g: "#1c2236",
      k: "bld",
      c1: "#10141f",
      c2: "#2b6cb0",
      r: "#2d3040",
      p: [
        [-650, -250],
        [-150, -250],
        [50, -100],
        [450, -100],
        [650, -250],
        [750, 100],
        [350, 250],
        [-50, 250],
        [-250, 100],
        [-650, 250],
      ],
    },
    {
      n: "Jungle Run",
      g: "#2f7a3f",
      k: "tree",
      c1: "#1d5a2c",
      c2: "#3fa653",
      p: [
        [-750, 0],
        [-500, -250],
        [-150, -100],
        [100, -300],
        [500, -250],
        [700, -50],
        [400, 50],
        [600, 250],
        [100, 300],
        [-300, 150],
      ],
    },
    {
      n: "Red Canyon",
      g: "#c0643a",
      k: "rock",
      c1: "#8a3e22",
      c2: "#d98a5a",
      c3: "#6b2e1a",
      p: [
        [-750, -200],
        [-250, -300],
        [250, -200],
        [700, -300],
        [780, 100],
        [350, 150],
        [0, 300],
        [-350, 150],
        [-550, 300],
        [-800, 100],
      ],
    },
    {
      n: "Grand Prix Speedway",
      g: "#79b85c",
      k: "tree",
      c1: "#3f7d34",
      c2: "#9fd47e",
      p: [
        [-700, -200],
        [-250, -320],
        [300, -320],
        [700, -200],
        [780, 100],
        [400, 280],
        [100, 150],
        [-200, 300],
        [-600, 300],
        [-780, 60],
      ],
    },
  ];
  let lv = 0,
    lvl = LV[0],
    solo = true;
  function setLevel(i) {
    lv = i;
    lvl = LV[i];
    const P = lvl.p;
    S.length = 0;
    for (let a = 0; a < P.length; a++) {
      const p = [0, 1, 2, 3].map((k) => P[(a + k - 1 + P.length) % P.length]);
      for (let j = 0; j < 24; j++) {
        const t = j / 24,
          t2 = t * t,
          t3 = t2 * t;
        S.push(
          [0, 1].map(
            (d) =>
              0.5 *
              (2 * p[1][d] +
                (-p[0][d] + p[2][d]) * t +
                (2 * p[0][d] - 5 * p[1][d] + 4 * p[2][d] - p[3][d]) * t2 +
                (-p[0][d] + 3 * p[1][d] - 3 * p[2][d] + p[3][d]) * t3),
          ),
        );
      }
    }
    mkPath();
    sd = 11 + i * 5;
    bushes.length = 0;
    const cy = lvl.k === "bld";
    for (let n = 0; n < 260; n++) {
      const x = (rnd() - 0.5) * 2500,
        y = (rnd() - 0.5) * 1600;
      if (
        S.every((p) => Math.hypot(p[0] - x, p[1] - y) > W / 2 + (cy ? 70 : 50))
      )
        bushes.push([x, y, (cy ? 18 : 9) + rnd() * 16]);
    }
    bx0 = 1e9;
    bx1 = -1e9;
    by0 = 1e9;
    by1 = -1e9;
    S.forEach((p) => {
      bx0 = Math.min(bx0, p[0]);
      bx1 = Math.max(bx1, p[0]);
      by0 = Math.min(by0, p[1]);
      by1 = Math.max(by1, p[1]);
    });
  }
  const COLORS = [
    "#e4572e",
    "#1f8a8a",
    "#f2b632",
    "#7a4fd1",
    "#2f6fdd",
    "#e2639b",
  ];
  const BOTS = ["Rex", "Mika", "Turbo", "Nova", "Blitz", "Sparky", "Dash"];
  let color = COLORS[0],
    cars = [],
    mode = "menu",
    cnt = 0,
    t0 = 0,
    now = 0,
    finN = 0,
    endAt = 0,
    cam = { x: 0, y: -300 },
    sc = 1,
    W_ = 1,
    H_ = 1,
    dpr = 1;
  const keys = {},
    tch = { l: 0, r: 0, g: 0, b: 0 };

  function track(c) {
    let best = 1e18,
      bi = c.idx;
    for (let d = -4; d <= 24; d++) {
      const j = (c.idx + d + N) % N,
        dx = S[j][0] - c.x,
        dy = S[j][1] - c.y,
        q = dx * dx + dy * dy;
      if (q < best) {
        best = q;
        bi = j;
      }
    }
    let dl = bi - c.idx;
    if (dl < -N / 2) dl += N;
    if (dl > N / 2) dl -= N;
    c.tot += dl;
    c.idx = bi;
    c.dist = Math.sqrt(best);
  }
  function mk(i, name, col, bot) {
    const k = (N - 3 - Math.floor(i / 2) * 3 + N) % N,
      a = tang(k),
      o = (i % 2 ? 1 : -1) * 32;
    const c = {
      name,
      col,
      bot,
      x: S[k][0] - Math.sin(a) * o,
      y: S[k][1] + Math.cos(a) * o,
      a,
      v: 0,
      idx: k,
      tot: k - N,
      top: bot ? 0.86 + lv * 0.014 + Math.random() * 0.07 : 1,
      off: (Math.random() - 0.5) * 50,
      fin: 0,
      time: 0,
      dist: 0,
    };
    track(c);
    return c;
  }
  function ai(c) {
    const p = cars[0],
      j = (c.idx + 9) % N,
      a2 = tang(j);
    const tx = S[j][0] - Math.sin(a2) * c.off,
      ty = S[j][1] + Math.cos(a2) * c.off,
      diff = wr(Math.atan2(ty - c.y, tx - c.x) - c.a),
      ab = Math.abs(diff);
    return {
      steer: clamp(diff * 1.8, -1, 1),
      up: ab < 1 && !(ab > 0.5 && c.v > 340),
      down: ab > 0.8 && c.v > 260,
    };
  }
  const pr = [],
    DG = { top: 5, acc: 5, hand: 5, grip: 5, brk: 5, resp: 5 };
  function smoke(c) {
    const ca = Math.cos(c.a),
      sa = Math.sin(c.a);
    for (const o of [-9, 9]) {
      const x = c.x - ca * 17 - sa * o,
        y = c.y - sa * 17 + ca * o;
      pr.push({
        x,
        y,
        t: 0,
        l: 0.7 + Math.random() * 0.4 + (c.bo ? 0.6 : 0),
        r: c.bo ? 8 : 5,
        k: 0,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
      });
      if (Math.random() < 0.5)
        pr.push({ x, y, t: 0, l: 6, r: 3, k: 1, vx: 0, vy: 0 });
    }
    if (pr.length > 700) pr.splice(0, 100);
  }
  function drive(c, i, dt, top) {
    const G = c.tn || DG;
    top *= 1 + 0.04 * (G.top - 5);
    const ac = 0.6 + 0.08 * G.acc,
      hd = 0.6 + 0.08 * G.hand,
      gp = 0.5 + 0.1 * G.grip,
      bk = 0.6 + 0.08 * G.brk,
      rs = 4 + 1.6 * G.resp,
      bo = i.up && (i.down || i.hb) && Math.abs(c.v) < 230;
    c.bo = bo;
    const max = TOP * top * (c.dist < W / 2 + 6 ? 1 : 0.5);
    if (i.up)
      c.v += (bo ? 150 : (260 + 380 * (1 - clamp(c.v / TOP, 0, 1))) * ac) * dt;
    else c.v -= c.v * 1.1 * dt;
    if (bo) c.v -= c.v * 0.8 * dt;
    if (i.down && !bo) c.v -= (c.v > 0 ? 1000 : 350) * bk * dt;
    if (c.v > max) c.v -= (c.v - max) * 4 * dt;
    if (c.v < -120) c.v = -120;
    c.st = (c.st || 0) + (i.steer - (c.st || 0)) * Math.min(1, dt * rs);
    const sp = clamp(Math.abs(c.v) / 90, 0, 1),
      dth =
        c.st *
          3.7 *
          hd *
          dt *
          sp *
          (c.v < 0 ? -1 : 1) *
          (1 - 0.3 * clamp(c.v / TOP, 0, 1)) *
          (i.hb ? 1.45 : 1) +
        (bo ? c.st * 2.6 * dt : 0);
    c.a += dth;
    c.l = (c.l || 0) - c.v * dth;
    c.v += c.l * dth;
    if (i.hb) c.v -= c.v * 0.9 * dt;
    c.l *= Math.exp(
      -(bo
        ? 1.2
        : i.hb
          ? 1.4
          : Math.abs(c.st) > 0.7 && c.v > TOP * 0.8
            ? 9
            : 15) *
        gp *
        dt,
    );
    const L = c.l;
    c.x += (Math.cos(c.a) * c.v - Math.sin(c.a) * L) * dt;
    c.y += (Math.sin(c.a) * c.v + Math.cos(c.a) * L) * dt;
    if (bo) {
      smoke(c);
      smoke(c);
    } else if ((Math.abs(L) > 70 && Math.abs(c.v) > 120) || (i.hb && c.v > 150))
      smoke(c);
  }
  function start() {
    setLevel(lv);
    const nm = clean($("nm").value) || "You";
    cars = [mk(0, nm, color, false)];
    cars[0].tn = cfg.g;
    for (let i = 0; i < 7; i++)
      cars.push(mk(i + 1, BOTS[i], COLORS[(i + 1) % 6], true));
    finN = 0;
    mode = "count";
    cnt = performance.now() + 3400;
    ["menu", "end", "lv", "mp"].forEach((id) => ($(id).hidden = true));
    $("hud").hidden = false;
    $("pad").hidden = !matchMedia("(pointer:coarse)").matches;
  }
  function order() {
    return [...cars].sort((a, b) =>
      a.fin && b.fin ? a.fin - b.fin : a.fin ? -1 : b.fin ? 1 : b.tot - a.tot,
    );
  }
  function step(dt) {
    for (let i = pr.length - 1; i >= 0; i--) {
      const q = pr[i];
      q.t += dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      if (q.t > q.l) pr.splice(i, 1);
    }
    const p = cars[0];
    for (const c of cars) {
      let inp;
      if (c.bot || c.fin) {
        inp = ai(c);
      } else
        inp = {
          steer:
            (keys.ArrowRight || keys.d || tch.r ? 1 : 0) -
            (keys.ArrowLeft || keys.a || tch.l ? 1 : 0),
          up: keys.ArrowUp || keys.w || tch.g,
          down: keys.ArrowDown || keys.s || tch.b,
          hb: keys[" "] || tch.h,
        };
      let top = c.top;
      if (c.bot && !c.fin)
        top *= 1 + clamp(((p.tot - c.tot) / N) * 0.4, -0.05, 0.06);
      if (c.fin) top = 0.6;
      drive(c, inp, dt, top);
    }
    for (let i = 0; i < cars.length; i++)
      for (let j = i + 1; j < cars.length; j++) {
        const a = cars[i],
          b = cars[j],
          dx = b.x - a.x,
          dy = b.y - a.y,
          d = Math.hypot(dx, dy);
        if (d < 32 && d > 0.01) {
          const k = (32 - d) / 2 / d;
          a.x -= dx * k;
          a.y -= dy * k;
          b.x += dx * k;
          b.y += dy * k;
          a.v *= 0.985;
          b.v *= 0.985;
        }
      }
    for (const c of cars) {
      track(c);
      if (c.dist > W / 2 - 6) {
        const s = S[c.idx],
          k = (W / 2 - 6) / c.dist;
        c.x = s[0] + (c.x - s[0]) * k;
        c.y = s[1] + (c.y - s[1]) * k;
        c.v *= 0.985;
        c.dist = W / 2 - 6;
      }
      if (!c.fin && c.tot >= LAPS * N) {
        c.fin = ++finN;
        c.time = now - t0;
        if (c === p) endAt = now + 2200;
      }
    }
  }
  const cpOf = (c) => (c.tot < 0 ? 0 : Math.floor((c.tot % N) / 30));
  const ord = (n) =>
    n +
    (["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] ||
      "th");
  function rows(el, list, max, cls) {
    el.textContent = "";
    list.slice(0, max).forEach((c, i) => {
      const d = document.createElement(cls);
      if (c === cars[0]) d.className = "me";
      const a = document.createElement("span"),
        b = document.createElement("span");
      a.textContent = i + 1 + ". " + c.name;
      b.textContent = c.fin ? (c.time / 1000).toFixed(1) + "s" : "";
      d.append(a, b);
      el.append(d);
    });
  }
  function showEnd() {
    mode = "end";
    const o = order(),
      me = o.indexOf(cars[0]) + 1;
    $("et").textContent = me === 1 ? "You win!" : "You finished " + ord(me);
    rows($("er"), o, 8, "li");
    $("end").hidden = false;
    $("pad").hidden = true;
    const nx = solo && me <= 3 && lv < LV.length - 1;
    if (nx) unlock(lv + 1);
    $("nextb").hidden = !nx;
  }

  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.globalAlpha = 1;
    g.fillStyle = lvl.g;
    g.fillRect(0, 0, W_, H_);
    g.translate(W_ / 2, H_ / 2);
    g.scale(sc, sc);
    g.translate(-cam.x, -cam.y);
    for (const b of bushes) {
      const r = b[2],
        x = b[0],
        y = b[1];
      if (lvl.k === "bld") {
        g.fillStyle = "rgba(0,0,0,.3)";
        g.fillRect(x - r + 5, y - r + 6, r * 2, r * 2);
        g.fillStyle = lvl.c1;
        g.fillRect(x - r, y - r, r * 2, r * 2);
        g.fillStyle = lvl.c2;
        g.fillRect(x - r + 5, y - r + 5, r * 2 - 10, r * 2 - 10);
        g.fillStyle = "#f2b632";
        g.fillRect(x - 3, y - 3, 6, 6);
      } else if (lvl.k === "rock") {
        g.fillStyle = lvl.c3;
        g.beginPath();
        g.arc(x + 3, y + 4, r * 0.8, 0, 7);
        g.fill();
        g.fillStyle = r > 18 ? lvl.c1 : lvl.c2;
        g.beginPath();
        g.arc(x, y, r * 0.8, 0, 7);
        g.fill();
      } else {
        g.fillStyle = lvl.c1;
        g.beginPath();
        g.arc(x + 3, y + 4, r, 0, 7);
        g.fill();
        g.fillStyle = lvl.c2;
        g.beginPath();
        g.arc(x, y, r, 0, 7);
        g.fill();
      }
    }
    g.lineJoin = "round";
    g.setLineDash([]);
    g.strokeStyle = "#fff";
    g.lineWidth = W + 30;
    g.stroke(tp);
    g.strokeStyle = "#e4572e";
    g.setLineDash([36, 36]);
    g.stroke(tp);
    g.setLineDash([]);
    g.strokeStyle = lvl.r || "#3a4150";
    g.lineWidth = W;
    g.stroke(tp);
    g.strokeStyle = "rgba(255,255,255,.55)";
    g.lineWidth = 4;
    g.setLineDash([26, 30]);
    g.stroke(tp);
    g.setLineDash([]);
    g.save();
    g.translate(S[0][0], S[0][1]);
    g.rotate(tang(0));
    for (let r = 0; r < 2; r++)
      for (let k = 0; k < 10; k++) {
        g.fillStyle = (r + k) % 2 ? "#fff" : "#111";
        g.fillRect(r * 10 - 10, -W / 2 + (k * W) / 10, 10, W / 10);
      }
    g.restore();
    const cp = cpOf(cars[0]);
    for (let i = 1; i < 8; i++) {
      const j = i * 30;
      g.save();
      g.translate(S[j][0], S[j][1]);
      g.rotate(tang(j));
      g.fillStyle = i <= cp ? "#3ddc84" : "#f2b632";
      g.fillRect(-3, -W / 2, 6, W);
      g.restore();
    }
    const o = order();
    for (const q of pr) {
      if (q.k) {
        g.fillStyle = "rgba(20,20,25," + 0.35 * (1 - q.t / q.l) + ")";
        g.beginPath();
        g.arc(q.x, q.y, q.r, 0, 7);
        g.fill();
      }
    }
    for (const q of pr) {
      if (!q.k) {
        g.fillStyle = "rgba(235,235,240," + 0.5 * (1 - q.t / q.l) + ")";
        g.beginPath();
        g.arc(q.x, q.y, q.r + q.t * 30, 0, 7);
        g.fill();
      }
    }
    for (const c of cars) {
      g.save();
      g.translate(c.x, c.y);
      g.rotate(c.a);
      g.fillStyle = "rgba(0,0,0,.28)";
      g.beginPath();
      g.roundRect(-18, -8, 40, 22, 6);
      g.fill();
      g.fillStyle = "#111";
      g.fillRect(-14, -13, 9, 4);
      g.fillRect(-14, 9, 9, 4);
      g.fillRect(8, -13, 9, 4);
      g.fillRect(8, 9, 9, 4);
      g.fillStyle = c.col;
      g.beginPath();
      g.roundRect(-20, -10, 40, 20, 6);
      g.fill();
      g.strokeStyle = "#1d2433";
      g.lineWidth = 2;
      g.stroke();
      g.fillStyle = "rgba(20,30,50,.7)";
      g.fillRect(-4, -7, 11, 14);
      g.fillStyle = "#fff7b0";
      g.fillRect(17, -8, 3, 4);
      g.fillRect(17, 4, 3, 4);
      g.restore();
      g.font = '700 15px "Barlow Condensed",sans-serif';
      g.textAlign = "center";
      g.fillStyle = c === cars[0] ? "#fff" : "rgba(255,255,255,.85)";
      g.strokeStyle = "rgba(29,36,51,.8)";
      g.lineWidth = 3;
      g.strokeText(c.name, c.x, c.y - 20);
      g.fillText(c.name, c.x, c.y - 20);
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.globalAlpha = cfg.map ? 1 : 0;
    const mw = W_ < 600 ? 100 : 140,
      mh = mw * 0.62,
      mx = 12,
      my = (W_ < 600 ? 96 : 104) + 0,
      s = Math.min(mw / (bx1 - bx0), mh / (by1 - by0));
    g.fillStyle = "rgba(255,246,220,.85)";
    g.fillRect(mx - 4, my - 4, mw + 8, mh + 8);
    g.beginPath();
    S.forEach((p, i) => {
      const X = mx + (p[0] - bx0) * s,
        Y = my + (p[1] - by0) * s;
      i ? g.lineTo(X, Y) : g.moveTo(X, Y);
    });
    g.closePath();
    g.strokeStyle = "#3a4150";
    g.lineWidth = 4;
    g.stroke();
    for (const c of cars) {
      g.fillStyle = c === cars[0] ? "#e4572e" : c.col;
      g.beginPath();
      g.arc(
        mx + (c.x - bx0) * s,
        my + (c.y - by0) * s,
        c === cars[0] ? 4 : 2.5,
        0,
        7,
      );
      g.fill();
    }
  }
  function frame(t) {
    requestAnimationFrame(frame);
    now = t;
    const dt = Math.min(0.05, (t - (frame.l || t)) / 1000);
    frame.l = t;
    sc = clamp(Math.min(W_, H_) / 700, 0.5, 1.05);
    if (mode === "menu") {
      cam.x = Math.cos(t / 6000) * 500;
      cam.y = Math.sin(t / 6000) * 250;
      draw();
      return;
    }
    if (mode === "count") {
      const left = cnt - t;
      $("count").textContent =
        left > 2400 ? "3" : left > 1400 ? "2" : left > 400 ? "1" : "GO";
      if (left <= 0) {
        mode = "race";
        t0 = t;
        $("count").textContent = "";
      }
    } else if (mode === "race" || mode === "end") {
      if (mode === "race" || true) step(dt);
    }
    if (mode === "race" && cars[0].fin && t > endAt) showEnd();
    if (mode === "race" && t - t0 > 800) $("count").textContent = "";
    const p = cars[0];
    cam.x += (p.x + Math.cos(p.a) * p.v * 0.25 - cam.x) * Math.min(1, dt * 5);
    cam.y += (p.y + Math.sin(p.a) * p.v * 0.25 - cam.y) * Math.min(1, dt * 5);
    const o = order();
    $("lap").textContent = "";
    const l1 = document.createElement("span"),
      l2 = document.createElement("small");
    l1.textContent =
      "Lap " + clamp(Math.floor(p.tot / N) + 1, 1, LAPS) + "/" + LAPS;
    l2.textContent =
      ord(o.indexOf(p) + 1) +
      " of 8 · " +
      Math.round(Math.max(0, p.v) * (cfg.unit ? 0.25 : 0.4)) +
      (cfg.unit ? " mph" : " km/h") +
      " · Checkpoint " +
      cpOf(p) +
      "/7";
    $("lap").append(l1, l2);
    rows($("board"), o, 5, "div");
    draw();
  }
  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W_ = innerWidth;
    H_ = innerHeight;
    cv.width = W_ * dpr;
    cv.height = H_ * dpr;
  }
  addEventListener("resize", resize);
  resize();
  addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    keys[k] = 1;
    if (k.startsWith("Arrow") || k === " ") e.preventDefault();
  });
  addEventListener("keyup", (e) => {
    keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = 0;
  });
  [
    ["bl", "l"],
    ["br", "r"],
    ["bg", "g"],
    ["bb", "b"],
    ["bh", "h"],
  ].forEach(([id, k]) => {
    const b = $(id);
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      tch[k] = 1;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
      b.addEventListener(ev, () => (tch[k] = 0)),
    );
  });
  COLORS.forEach((c, i) => {
    const b = document.createElement("button");
    b.style.background = c;
    b.setAttribute("aria-label", "Colour " + (i + 1));
    if (!i) b.className = "on";
    b.onclick = () => {
      color = c;
      [...$("sw").children].forEach((x) => (x.className = ""));
      b.className = "on";
    };
    $("sw").append(b);
  });
  let unl = 0,
    mmap = -1;
  try {
    unl = +localStorage.getItem("apexU") || 0;
  } catch (e) {}
  const unlock = (i) => {
    if (i > unl) {
      unl = i;
      try {
        localStorage.setItem("apexU", i);
      } catch (e) {}
    }
  };
  function show(id) {
    ["menu", "lv", "mp", "end", "set", "login", "pause"].forEach(
      (x) => ($(x).hidden = x !== id),
    );
    $("hud").hidden = true;
    $("pad").hidden = true;
    $("count").textContent = "";
    mode = "menu";
  }
  function cards() {
    const el = $("cards");
    el.textContent = "";
    LV.forEach((L, i) => {
      const b = document.createElement("button");
      b.className = "card";
      b.style.borderLeftColor = L.g;
      b.disabled = i > unl;
      b.textContent =
        i +
        1 +
        ". " +
        L.n +
        (i > unl ? " (finish top 3 on the previous level to unlock)" : "");
      b.onclick = () => {
        solo = true;
        lv = i;
        start();
      };
      el.append(b);
    });
  }
  function seg(id, opts, cb) {
    const el = $(id);
    opts.forEach((t, i) => {
      const b = document.createElement("button");
      b.textContent = t;
      if (!i) b.className = "on";
      b.onclick = () => {
        [...el.children].forEach((x) => (x.className = ""));
        b.className = "on";
        cb(i);
      };
      el.append(b);
    });
  }
  seg("mmap", ["Random", ...LV.map((l) => l.n)], (i) => (mmap = i - 1));
  seg("mplay", ["Random players", "Friends"], (i) => {
    $("fr").hidden = !i;
  });
  $("mk").onclick = () => {
    const r = Math.random().toString(36).slice(2, 7).toUpperCase();
    $("rc").value = r;
    $("rcmsg").textContent =
      "Room " +
      r +
      " created. Friends can join with this code once online servers are live.";
  };
  $("jn").onclick = () => {
    $("rcmsg").textContent =
      "Joining a friend\u2019s room needs the online server, which is not live yet.";
  };
  $("find").onclick = () => {
    const b = $("find");
    b.disabled = true;
    b.textContent = "Finding drivers\u2026";
    setTimeout(() => {
      b.disabled = false;
      b.textContent = "Find match";
      solo = false;
      lv = mmap < 0 ? Math.floor(Math.random() * LV.length) : mmap;
      start();
    }, 1400);
  };
  $("solo").onclick = () => {
    cards2();
    show("lv");
    cd.scrollTo({ left: 0, behavior: "instant" });
    edge();
  };
  $("multi").onclick = () => show("mp");
  document
    .querySelectorAll(".back")
    .forEach((b) => (b.onclick = () => show("menu")));
  $("tomenu").onclick = () => show("menu");
  $("again").onclick = start;
  $("nextb").onclick = () => {
    lv++;
    start();
  };
  let pm = "race",
    pt = 0;
  function pause() {
    if (mode === "race" || mode === "count") {
      pm = mode;
      pt = now;
      mode = "paused";
      $("pause").hidden = false;
    }
  }
  function resume() {
    if (mode !== "paused") return;
    const d = now - pt;
    t0 += d;
    cnt += d;
    endAt += d;
    mode = pm;
    $("pause").hidden = true;
    $("set").hidden = true;
  }
  $("pausebtn").onclick = pause;
  $("resume").onclick = resume;
  $("psettings").onclick = () => {
    $("set").hidden = false;
  };
  $("pmenu").onclick = () => show("menu");
  addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "Escape" || e.key === "p" || e.key === "P") {
      if (mode === "paused") resume();
      else pause();
    }
  });
  let user = null;
  const cfg = { map: 0, unit: 0, g: { ...DG } },
    clean = (s) =>
      String(s || "")
        .replace(/[^\w \-]/g, "")
        .trim()
        .slice(0, 12);
  try {
    const u = JSON.parse(localStorage.getItem("apexUser"));
    if (u && typeof u.name === "string" && clean(u.name))
      user = { name: clean(u.name) };
  } catch (e) {}
  if (user) $("nm").value = user.name;
  function prof() {
    const el = $("prof");
    el.textContent = "";
    if (user) {
      const c = document.createElement("div");
      c.className = "panel chip";
      const a = document.createElement("span");
      a.className = "ava";
      a.textContent = user.name.charAt(0).toUpperCase();
      const n = document.createElement("span");
      n.textContent = user.name + (user.guest ? " (guest)" : "");
      const o = document.createElement("button");
      o.className = "go alt sm";
      o.textContent = user.guest ? "Sign up" : "Log out";
      o.onclick = () => {
        if (user.guest) {
          $("login").hidden = false;
        } else {
          user = null;
          try {
            localStorage.removeItem("apexUser");
          } catch (e) {}
          prof();
        }
      };
      c.append(a, n, o);
      el.append(c);
    } else {
      const b = document.createElement("button");
      b.className = "go sm";
      b.textContent = "Log in / Sign up";
      b.onclick = () => {
        $("login").hidden = false;
        $("ln").focus();
      };
      el.append(b);
    }
    $("guest").hidden = !!user;
  }
  $("lgo").onclick = () => {
    const n = clean($("ln").value);
    if (!n) {
      $("lmsg").textContent =
        "Enter a username using letters, numbers, spaces or dashes.";
      return;
    }
    user = { name: n };
    try {
      localStorage.setItem("apexUser", JSON.stringify(user));
    } catch (e) {}
    $("nm").value = n;
    $("login").hidden = true;
    prof();
  };
  $("guest").onclick = () => {
    user = {
      name: "Guest" + (1000 + Math.floor(Math.random() * 9000)),
      guest: true,
    };
    $("nm").value = user.name;
    prof();
  };
  $("gear").onclick = () => {
    $("set").hidden = false;
  };
  $("setok").onclick = () => {
    const n = clean($("nm").value);
    if (n && user) {
      user.name = n;
      if (!user.guest) {
        try {
          localStorage.setItem("apexUser", JSON.stringify({ name: n }));
        } catch (e) {}
      }
      prof();
    }
    $("set").hidden = true;
  };
  seg("uni", ["km/h", "mph"], (i) => (cfg.unit = i));
  prof();
  function spl(P) {
    const o = [];
    for (let a = 0; a < P.length; a++) {
      const p = [0, 1, 2, 3].map((k) => P[(a + k - 1 + P.length) % P.length]);
      for (let j = 0; j < 24; j++) {
        const t = j / 24,
          t2 = t * t,
          t3 = t2 * t;
        o.push(
          [0, 1].map(
            (d) =>
              0.5 *
              (2 * p[1][d] +
                (-p[0][d] + p[2][d]) * t +
                (2 * p[0][d] - 5 * p[1][d] + 4 * p[2][d] - p[3][d]) * t2 +
                (-p[0][d] + 3 * p[1][d] - 3 * p[2][d] + p[3][d]) * t3),
          ),
        );
      }
    }
    return o;
  }
  function thumb(L) {
    const c = document.createElement("canvas");
    c.width = 240;
    c.height = 240;
    c.setAttribute("role", "img");
    c.setAttribute("aria-label", L.n + " track preview");
    const x = c.getContext("2d"),
      s = spl(L.p);
    let a0 = 1e9,
      a1 = -1e9,
      b0 = 1e9,
      b1 = -1e9;
    s.forEach((p) => {
      a0 = Math.min(a0, p[0]);
      a1 = Math.max(a1, p[0]);
      b0 = Math.min(b0, p[1]);
      b1 = Math.max(b1, p[1]);
    });
    const k = Math.min(200 / (a1 - a0), 200 / (b1 - b0)),
      ox = 120 - ((a0 + a1) / 2) * k,
      oy = 120 - ((b0 + b1) / 2) * k;
    x.fillStyle = L.g;
    x.fillRect(0, 0, 240, 240);
    let q = 1 + L.n.length * 977;
    const rs = () => (q = (q * 16807) % 2147483647) / 2147483647;
    for (let n = 0; n < 80; n++) {
      const px = rs() * 240,
        py = rs() * 240,
        r = 3 + rs() * 5;
      if (
        s.every(
          (p) =>
            Math.hypot(p[0] * k + ox - px, p[1] * k + oy - py) >
            (W / 2) * k + r + 5,
        )
      ) {
        if (L.k === "bld") {
          x.fillStyle = L.c1;
          x.fillRect(px - r, py - r, r * 2, r * 2);
          x.fillStyle = L.c2;
          x.fillRect(px - r + 1.5, py - r + 1.5, r * 2 - 3, r * 2 - 3);
        } else {
          x.fillStyle = L.k === "rock" ? L.c3 : L.c1;
          x.beginPath();
          x.arc(px + 1, py + 1.5, r, 0, 7);
          x.fill();
          x.fillStyle = L.k === "rock" ? (r > 6 ? L.c1 : L.c2) : L.c2;
          x.beginPath();
          x.arc(px, py, r, 0, 7);
          x.fill();
        }
      }
    }
    x.beginPath();
    s.forEach((p, i) => {
      const X = p[0] * k + ox,
        Y = p[1] * k + oy;
      i ? x.lineTo(X, Y) : x.moveTo(X, Y);
    });
    x.closePath();
    x.lineJoin = "round";
    x.strokeStyle = "#fff6dc";
    x.lineWidth = (W + 30) * k;
    x.stroke();
    x.strokeStyle = L.r || "#3a4150";
    x.lineWidth = W * k;
    x.stroke();
    x.strokeStyle = "rgba(255,255,255,.6)";
    x.lineWidth = 1.5;
    x.setLineDash([5, 5]);
    x.stroke();
    x.setLineDash([]);
    x.fillStyle = "#fff";
    x.fillRect(s[0][0] * k + ox - 2, s[0][1] * k + oy - (W / 2) * k, 4, W * k);
    const im = new Image(150, 150);
    im.src = c.toDataURL("image/png");
    im.alt = L.n + " track preview";
    im.draggable = false;
    return im;
  }
  function cards2() {
    const el = $("cards");
    el.textContent = "";
    LV.forEach((L, i) => {
      const b = document.createElement("button");
      b.className = "lcard";
      b.disabled = i > unl;
      b.append(thumb(L));
      const t = document.createElement("span");
      t.className = "lt";
      t.textContent = L.n;
      b.append(t);
      if (i > unl) {
        const l = document.createElement("span");
        l.className = "lk";
        l.textContent = "Locked";
        b.append(l);
      } else if (i > 2) {
        const nw = document.createElement("span");
        nw.className = "nw";
        nw.textContent = "NEW";
        b.append(nw);
      }
      b.onclick = () => {
        solo = true;
        lv = i;
        start();
      };
      el.append(b);
    });
    const so = document.createElement("div");
    so.className = "lcard soon";
    so.textContent = "More levels coming soon";
    el.append(so);
  }
  $("unall").onclick = () => {
    unlock(LV.length - 1);
    cards2();
  };
  const vp = $("vp"),
    cd = $("cards");
  function edge() {
    vp.classList.toggle("l", cd.scrollLeft > 4);
    vp.classList.toggle(
      "r",
      cd.scrollLeft + cd.clientWidth < cd.scrollWidth - 4,
    );
  }
  cd.addEventListener("scroll", edge);
  addEventListener("resize", edge);
  $("lprev").onclick = () => cd.scrollBy({ left: -166 });
  $("lnext").onclick = () => cd.scrollBy({ left: 166 });
  const ST = [
      ["top", "Top speed"],
      ["acc", "Acceleration"],
      ["hand", "Steering"],
      ["resp", "Steering response"],
      ["grip", "Grip (low = more drift)"],
      ["brk", "Brakes"],
    ],
    PRE = [
      { ...DG },
      { top: 6, acc: 7, hand: 7, grip: 2, brk: 5, resp: 8 },
      { top: 9, acc: 6, hand: 5, grip: 6, brk: 6, resp: 5 },
    ];
  try {
    const s = JSON.parse(localStorage.getItem("apexG") || "null");
    if (s && s.g)
      ST.forEach(([k]) => {
        const v = +s.g[k];
        if (v >= 1 && v <= 10) cfg.g[k] = Math.round(v);
      });
    if (s && COLORS.includes(s.c)) {
      color = s.c;
      [...$("sw").children].forEach(
        (b, i) => (b.className = COLORS[i] === color ? "on" : ""),
      );
    }
  } catch (e) {}
  const sv = () => {
    try {
      localStorage.setItem("apexG", JSON.stringify({ g: cfg.g, c: color }));
    } catch (e) {}
  };
  function sliders() {
    const el = $("sl");
    el.textContent = "";
    ST.forEach(([k, t]) => {
      const l = document.createElement("label");
      l.textContent = t + ": ";
      const o = document.createElement("output");
      o.textContent = cfg.g[k];
      const r = document.createElement("input");
      r.type = "range";
      r.min = 1;
      r.max = 10;
      r.step = 1;
      r.value = cfg.g[k];
      r.oninput = () => {
        cfg.g[k] = +r.value;
        o.textContent = r.value;
        sv();
      };
      l.append(o, r);
      el.append(l);
    });
  }
  seg("pre", ["Balanced", "Drift", "Speed"], (i) => {
    Object.assign(cfg.g, PRE[i]);
    sliders();
    sv();
  });
  $("garb").onclick = () => {
    sliders();
    $("garage").hidden = false;
  };
  $("pgar").onclick = () => {
    sliders();
    $("garage").hidden = false;
  };
  $("garok").onclick = () => {
    sv();
    $("garage").hidden = true;
  };
  cars = [mk(0, "You", color, false)];
  requestAnimationFrame(frame);
})();
