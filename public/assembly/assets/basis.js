// Імпорт файлів «Базис-Мебельщик 10» (.fr3d / .b3d) у модель сайту.
// Формат не документований: структура встановлена по зразку .fr3d (версія 10.13) і звірена з кресленнями.
// Працює і в браузері (DecompressionStream), і в Node (zlib). Усі розміри в мм.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BasisImport = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const dec16 = new TextDecoder("utf-16le");
  const dec8 = new TextDecoder("utf-8");

  // ---------- Контейнер BZ85 ----------
  async function inflate(bytes) {
    if (typeof process !== "undefined" && process.versions && process.versions.node) {
      return new Uint8Array(require("zlib").inflateSync(Buffer.from(bytes)));
    }
    const ds = new DecompressionStream("deflate");
    const out = new Response(new Blob([bytes]).stream().pipeThrough(ds));
    return new Uint8Array(await out.arrayBuffer());
  }

  function findMarker(u8, from) {
    // Розділ: 01 00 00 FF, прапорець (00 — без стиснення, 01 — zlib до кінця файлу)
    for (let i = from; i + 5 < u8.length; i++) {
      if (u8[i] === 1 && u8[i + 1] === 0 && u8[i + 2] === 0 && u8[i + 3] === 0xff && (u8[i + 4] === 1 || u8[i + 4] === 0)) {
        if (u8[i + 4] === 1 && u8[i + 5] === 0x78) return i;
      }
    }
    return -1;
  }

  // ---------- Дерево: [ключ u32][N u32][тип u8][дані] ----------
  function reader(u8) {
    const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    let p = 0;
    let names = [];

    function readDict() {
      const n = dv.getUint32(p, true); p += 4;
      names = [];
      for (let i = 0; i < n; i++) {
        const len = dv.getUint32(p, true); p += 4;
        names.push(dec8.decode(u8.subarray(p, p + len))); p += len;
      }
    }

    function item() {
      const key = dv.getUint32(p, true), n = dv.getUint32(p + 4, true), t = u8[p + 8];
      p += 9;
      const name = names[key] !== undefined ? names[key] : "#" + key;
      if (t === 0) {
        const kids = [];
        for (let i = 0; i < n; i++) kids.push(item());
        return { name, kids };
      }
      let v;
      if (t === 1 || t === 2) v = t === 2;
      else if (t === 3) { v = u8[p]; p += 1; }
      else if (t === 4) { v = dv.getUint32(p, true); p += 4; }
      else if (t === 5) { v = dv.getFloat64(p, true); p += 8; }
      else if (t === 6) { const L = dv.getUint32(p, true); v = dec16.decode(u8.subarray(p + 4, p + 4 + 2 * L)); p += 4 + 2 * L; }
      else if (t === 7) { const L = dv.getUint32(p, true); v = u8.subarray(p + 4, p + 4 + L); p += 4 + L; }
      else throw new Error("Невідомий тип даних " + t + " на позиції " + (p - 9));
      return { name, v };
    }

    return { readDict, item, get pos() { return p; }, set pos(x) { p = x; }, get names() { return names; } };
  }

  const kid = (node, name) => node.kids && node.kids.find(k => k.name === name);
  const kids = (node, name) => (node.kids || []).filter(k => k.name === name);
  const val = (node, name, def) => { const k = kid(node, name); return k && k.v !== undefined ? k.v : def; };
  const bytesToStr = b => (b instanceof Uint8Array ? dec8.decode(b) : String(b));

  async function parseFile(buffer) {
    const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== "BZ85") throw new Error("Це не файл Базис-Мебельщик (немає підпису BZ85).");
    const at = findMarker(u8, 4);
    if (at < 0) throw new Error("Не знайдено основний блок моделі. Можливо, версія формату інша.");
    const body = await inflate(u8.subarray(at + 5));
    const r = reader(body);
    r.readDict();
    const doc = r.item();
    if (doc.name !== "Document") throw new Error("Неочікувана структура файлу.");
    // мініатюра з заголовка (необов'язково)
    let thumb = null;
    for (let i = 0; i < Math.min(at, u8.length) - 8; i++) {
      if (u8[i] === 0x89 && u8[i + 1] === 0x50 && u8[i + 2] === 0x4e && u8[i + 3] === 0x47) {
        for (let j = i; j < at - 8; j++) if (u8[j] === 0x49 && u8[j + 1] === 0x45 && u8[j + 2] === 0x4e && u8[j + 3] === 0x44) { thumb = u8.subarray(i, j + 8); break; }
        break;
      }
    }
    return { doc, thumb };
  }

  // ---------- Геометрія ----------
  const quatMat = (x, y, z, w) => [
    [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
    [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
    [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]
  ];
  const ident = () => ({ R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], T: [0, 0, 0] });
  function transOf(node) {
    const t = kid(node, "Trans");
    if (!t) return ident();
    return { R: quatMat(val(t, "Rx", 0), val(t, "Ry", 0), val(t, "Rz", 0), val(t, "Rw", 1)), T: [val(t, "X", 0), val(t, "Y", 0), val(t, "Z", 0)] };
  }
  const apply = (m, p) => [0, 1, 2].map(i => m.R[i][0] * p[0] + m.R[i][1] * p[1] + m.R[i][2] * p[2] + m.T[i]);
  const applyDir = (m, d) => [0, 1, 2].map(i => m.R[i][0] * d[0] + m.R[i][1] * d[1] + m.R[i][2] * d[2]);
  function compose(a, b) {
    const R = [0, 1, 2].map(i => [0, 1, 2].map(j => a.R[i][0] * b.R[0][j] + a.R[i][1] * b.R[1][j] + a.R[i][2] * b.R[2][j]));
    return { R, T: apply(a, b.T) };
  }

  // Контур: u32 кількість, далі записи по 33 байти: тип 0x10 (відрізок) і x1,y1,x2,y2
  function contourSegments(raw) {
    if (!(raw instanceof Uint8Array) || raw.length < 4) return [];
    const dv = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
    const n = dv.getUint32(0, true), segs = [];
    let p = 4;
    for (let i = 0; i < n && p + 33 <= raw.length; i++) {
      if (raw[p] !== 0x10) break; // дуги та інші елементи поки не підтримуються
      segs.push([dv.getFloat64(p + 1, true), dv.getFloat64(p + 9, true), dv.getFloat64(p + 17, true), dv.getFloat64(p + 25, true)]);
      p += 33;
    }
    return segs;
  }

  const r1 = v => Math.round(v * 10) / 10;
  const clean = s => String(s || "").replace(/\r.*$/s, "").trim();

  function materialColor(mat, thick) {
    const m = (mat || "").toLowerCase();
    if (/хдф|двп/.test(m) || thick <= 4) return "#efe9dc";
    if (/сер/.test(m)) return "#b4b7bb";
    if (/біл|бел/.test(m)) return "#f1eee8";
    if (/чорн|черн|графіт|графит/.test(m)) return "#4d4d4d";
    if (/дуб|дерев|ясен|горіх|орех/.test(m)) return "#c9a574";
    return thick >= 18 ? "#d9c4a0" : "#8fb0c4";
  }

  // ---------- Перетворення в моделі сайту ----------
  // Виріб = секція верхнього рівня (так само організовані складальні креслення Базису).
  // Модулі виробу = вкладені групи (ящики, блоки); власні панелі секції — модуль «Корпус».
  // Усі координати рахуються в системі самої секції (Y вгору, фронт +Z), а не в системі всієї кухні.
  function toProducts(parsed, opts) {
    opts = opts || {};
    const { doc } = parsed;
    const warnings = [];
    const model = kid(doc, "Model");
    if (!model) throw new Error("У файлі немає моделі (Model).");

    const furn = {};
    ((kid(doc, "FurnList") || { kids: [] }).kids).forEach(f => {
      furn[val(f, "FastID", 0)] = { name: clean(val(f, "Name", "")), holes: kids(kid(f, "Holes") || { kids: [] }, "Hole") };
    });
    const stats = { products: 0, panels: 0, skipped: 0, fasteners: 0 };

    function makePanel(objNode, m) {
      const segs = contourSegments(val(objNode, "Contour"));
      if (!segs.length) { stats.skipped++; warnings.push(`Панель ID ${val(objNode, "ID", "?")} («${val(objNode, "Name", "")}»): контур із дугами або вирізами, пропущено.`); return null; }
      const xs = segs.flatMap(s => [s[0], s[2]]), ys = segs.flatMap(s => [s[1], s[3]]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const thick = val(objNode, "Thick", 0);
      const corners = [];
      [x0, x1].forEach(x => [y0, y1].forEach(y => [0, thick].forEach(z => corners.push(apply(m, [x, y, z])))));
      const lo = [0, 1, 2].map(i => Math.min(...corners.map(c => c[i]))), hi = [0, 1, 2].map(i => Math.max(...corners.map(c => c[i])));
      const size = [0, 1, 2].map(i => hi[i] - lo[i]);
      const mat = clean(val(objNode, "Mat", "")).replace(/\d{4,}$/, "").trim();
      const part = {
        art: String(val(objNode, "ArtPos", "")), srcName: val(objNode, "Name", ""), material: mat || "—", thick,
        size, dims: [Math.max(x1 - x0, y1 - y0), Math.min(x1 - x0, y1 - y0), thick],
        edge: [], edgeMat: "", grooves: "", holes: [], _lo: lo, _hi: hi, id: val(objNode, "ID", 0)
      };
      const c = [0, 1, 2].map(i => (lo[i] + hi[i]) / 2);
      const idx = [0, 1, 2];
      const la = idx.find(i => Math.abs(size[i] - part.dims[0]) < 0.6);
      const wa = idx.find(i => i !== la && Math.abs(size[i] - part.dims[1]) < 0.6);
      const buttsNode = kid(objNode, "Butts");
      if (buttsNode && la !== undefined && wa !== undefined) {
        kids(buttsNode, "Butt").forEach(b => {
          const s = segs[val(b, "Elem", -1)];
          if (!s) return;
          const mid = apply(m, [(s[0] + s[2]) / 2, (s[1] + s[3]) / 2, thick / 2]);
          const dl = mid[la] - c[la], dw = mid[wa] - c[wa];
          const code = Math.abs(dw) >= Math.abs(dl) ? "l" + (dw > 0 ? 1 : 2) : "w" + (dl > 0 ? 1 : 2);
          if (!part.edge.includes(code)) part.edge.push(code);
          part.edgeMat = part.edgeMat || clean(val(b, "Mat", ""));
        });
      }
      part.grooves = [...new Set(kids(kid(objNode, "Cuts") || { kids: [] }, "Cut").map(k => clean(val(k, "Name", ""))).filter(Boolean))].join("; ");
      stats.panels++;
      return part;
    }

    // обхід групи: панелі й фурнітура потрапляють у модуль, вкладені групи першого рівня стають окремими модулями
    function walk(objs, world, mod, product, depth) {
      kids(objs, "Obj").forEach(o => {
        const type = val(o, "Type", 0);
        const m = compose(world, transOf(o));
        if (type === 4002) {
          const p = makePanel(o, m);
          if (p) mod.parts.push(p);
        } else if (type === 3001) {
          mod.fasteners.push({ m, art: String(val(o, "ArtPos", "")), fast: val(o, "FastID", 0) });
          stats.fasteners++;
        } else if (type === 1005 || type === 4001 || type === 4004 || type === 2004) {
          const sub = kid(o, "Objs");
          if (!sub) return;
          let target = mod;
          if (type === 1005 && depth === 0) {
            target = { name: val(o, "Name", "Блок"), parts: [], fasteners: [] };
            product.mods.push(target);
          }
          walk(sub, m, target, product, depth + 1);
        }
      });
    }

    function finish(product, name, id) {
      const mods = product.mods.filter(b => b.parts.length);
      const all = mods.flatMap(b => b.parts);
      if (!all.length) return null;
      const gLo = [0, 1, 2].map(i => Math.min(...all.map(p => p._lo[i]))), gHi = [0, 1, 2].map(i => Math.max(...all.map(p => p._hi[i])));

      // отвори: точки отворів фурнітури, що потрапляють на пласть панелі
      mods.forEach(b => b.fasteners.forEach(f => {
        const fd = furn[f.fast];
        if (!fd) return;
        fd.holes.forEach(h => {
          const p = apply(f.m, [val(h, "X", 0), val(h, "Y", 0), val(h, "Z", 0)]);
          const d = applyDir(f.m, [val(h, "DirX", 0), val(h, "DirY", 0), val(h, "DirZ", 0)]);
          mods.forEach(bb => bb.parts.forEach(part => {
            const ta = [0, 1, 2].find(i => Math.abs(part.size[i] - part.thick) < 0.6);
            if (ta === undefined || Math.abs(d[ta]) < 0.9) return;
            if (![0, 1, 2].every(i => p[i] >= part._lo[i] - 0.6 && p[i] <= part._hi[i] + 0.6)) return;
            const la = [0, 1, 2].find(i => i !== ta && Math.abs(part.size[i] - part.dims[0]) < 0.6);
            const wa = [0, 1, 2].find(i => i !== ta && i !== la);
            if (la === undefined || wa === undefined) return;
            part.holes.push({ l: r1(p[la] - part._lo[la]), w: r1(p[wa] - part._lo[wa]), d: r1(val(h, "Radius", 1.5) * 2), depth: r1(val(h, "Depth", 0)) });
          }));
        });
      }));

      const out = { id, name, source: { format: "basis", version: val(doc, "VersionMajor", "?") + "." + val(doc, "VersionMinor", "?"), unit: "mm", draft: true },
        materials: {}, blocks: [] };
      let pos = 0;
      const midX = (gLo[0] + gHi[0]) / 2;
      mods.forEach((b, bi) => {
        const ps = b.parts;
        const bLo = [0, 1, 2].map(i => Math.min(...ps.map(p => p._lo[i]))), bHi = [0, 1, 2].map(i => Math.max(...ps.map(p => p._hi[i])));
        ps.forEach(p => {
          const ta = [0, 1, 2].reduce((a, i) => (p.size[i] < p.size[a] ? i : a), 0);
          const cx = (p._lo[0] + p._hi[0]) / 2;
          let role;
          if (p.thick <= 4) role = "Задняя стенка";
          else if (ta === 0) role = ps.some(q => q !== p && Math.abs(q._lo[0] - p._lo[0]) > 40 && q.thick > 4) ? (cx < midX ? "Боковина левая" : "Боковина правая") : "Боковина";
          else if (ta === 1) role = Math.abs(p._lo[1] - bLo[1]) < 1 ? "Дно" : Math.abs(p._hi[1] - bHi[1]) < 1 ? "Крышка" : "Полка";
          else role = Math.abs(p._hi[2] - bHi[2]) < 30 ? "Фасад" : "Перегородка";
          p.role = role;
        });
        const rank = p => ({ "Дно": 1, "Боковина левая": 2, "Боковина правая": 2, "Боковина": 2, "Перегородка": 3, "Полка": 3, "Крышка": 4, "Задняя стенка": 5, "Фасад": 6 }[p.role] || 3);
        ps.sort((a, c2) => rank(a) - rank(c2) || a._lo[1] - c2._lo[1] || a._lo[0] - c2._lo[0] || a._lo[2] - c2._lo[2]);
        const hw = {};
        b.fasteners.forEach(f => {
          const fd = furn[f.fast];
          const k = f.art + "|" + (fd ? fd.name : "Фурнитура");
          hw[k] = (hw[k] || 0) + 1;
        });
        const parts = ps.map(p => {
          pos += 1;
          out.materials[p.material] = out.materials[p.material] || materialColor(p.material, p.thick);
          const o = { pos, name: p.role, material: p.material, size: p.size.map(r1), at: p._lo.map((v, i) => r1(v - gLo[i])), dims: p.dims.map(r1), edge: p.edge, holes: p.holes, art: p.art, srcName: p.srcName };
          if (p.edgeMat) o.edgeMat = p.edgeMat;
          if (p.grooves) o.grooves = p.grooves;
          return o;
        });
        const groups = [];
        parts.forEach(p => {
          const last = groups[groups.length - 1];
          if (last && last.role === p.name) last.pos.push(p.pos); else groups.push({ role: p.name, pos: [p.pos] });
        });
        const steps = groups.map(g => ({ text: `${g.role}: установите ${g.pos.length > 1 ? "детали " : "деталь "}${g.pos.join(", ")}.`, parts: g.pos, hardware: [], draft: true }));
        out.blocks.push({ id: "m" + (bi + 1), name: b.name, parts, hardware: Object.entries(hw).map(([k, qty]) => ({ name: k.split("|")[1], art: k.split("|")[0], qty })), steps });
      });
      out.bounds = gHi.map((v, i) => r1(v - gLo[i]));
      return out;
    }

    const products = [];
    const loose = { mods: [{ name: "Окремі панелі", parts: [], fasteners: [] }] };
    kids(model, "Obj").forEach((o, i) => {
      const type = val(o, "Type", 0);
      if (type === 1005) {
        const own = { name: "Корпус", parts: [], fasteners: [] };
        const prod = { mods: [own] };
        const sub = kid(o, "Objs");
        if (sub) walk(sub, ident(), own, prod, 0);
        const pr = finish(prod, val(o, "Name", "Секция " + (i + 1)), (opts.idPrefix || "p") + (products.length + 1));
        if (pr) products.push(pr);
      } else if (type === 4002) {
        const p = makePanel(o, transOf(o));
        if (p) loose.mods[0].parts.push(p);
      }
    });
    const lp = finish(loose, "Окремые панели", (opts.idPrefix || "p") + "-loose");
    if (lp) products.push(lp);
    stats.products = products.length;
    return { products, stats, warnings, version: val(doc, "VersionMajor", "?") + "." + val(doc, "VersionMinor", "?") };
  }

  async function importFile(buffer, opts) {
    return toProducts(await parseFile(buffer), opts);
  }

  return { parseFile, toProducts, importFile, contourSegments };
});
