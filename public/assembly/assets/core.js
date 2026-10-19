// Общая логика: заказ → этаж → помещение → изделие → модуль → деталь, обозначения, стабильные коды,
// ожидаемая комплектация и состояние упаковок.
(function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Адреса данных считаем от самого скрипта: страница q.html открывается по пути /assembly/q/<код>
  const BASE = new URL("../", document.currentScript.src).href;

  const json = url => fetch(new URL(url, BASE)).then(r => {
    if (!r.ok) throw new Error("Не найден файл " + url);
    return r.json();
  });

  const orders = {}, models = {};

  // Заказ с плоским списком изделий: у каждого изделия есть этаж и помещение
  function loadOrder(id) {
    if (!/^[\w-]+$/.test(id || "")) return Promise.reject(new Error("Неверный номер заказа."));
    if (!orders[id]) {
      orders[id] = json(`data/orders/${id}.json`).then(o => {
        o.items = [];
        o.floors.forEach(f => f.rooms.forEach(r => r.items.forEach(it => {
          o.items.push(Object.assign(it, { floor: f.n, room: r.name, roomId: r.id }));
        })));
        return o;
      });
    }
    return orders[id];
  }

  function loadModel(id) {
    if (!/^[\w-]+$/.test(id || "")) return Promise.reject(new Error("Неверная ссылка. Проверьте QR-код."));
    if (!models[id]) {
      models[id] = json(`data/models/${id}.json`).then(m => {
        m.blocks.forEach(b => { b.parts = b.parts || []; b.hardware = b.hardware || []; b.steps = b.steps || []; });
        return m;
      });
    }
    return models[id];
  }

  // Обозначение детали внутри изделия: «модуль.деталь», например 1.3
  function designations(model) {
    const list = [];
    model.blocks.forEach((b, bi) => b.parts.forEach((p, pi) => {
      list.push({ p, block: b, bi, des: `${bi + 1}.${pi + 1}` });
    }));
    return list;
  }

  const partUid = (order, item, des) => `${order.id}-${item.id}-${des}`;
  const unitUid = (order, item, bi) => `${order.id}-${item.id}-m${bi + 1}`;
  const kitUid = (order, item) => `${order.id}-${item.id}-hw`;
  const commonUid = order => `${order.id}-common`;
  const packUid = (order, n) => `${order.id}-pk-${n}`;

  // Читаемое обозначение: «Заказ 670 · этаж 2 · Спальня 1 · ШК03 · деталь 1.3»
  function readable(order, item, tail) {
    return ["Заказ " + order.id, "этаж " + item.floor, item.room, item.code].concat(tail ? [tail] : []).join(" · ");
  }

  // Что должно лежать в упаковках по этому изделию: детали, готовые узлы целиком, комплект фурнитуры.
  // Внутренние детали готового узла отдельными местами не считаются.
  function expected(order, item, model) {
    const out = [];
    model.blocks.forEach((b, bi) => {
      if (b.ready) {
        out.push({ code: unitUid(order, item, bi), kind: "unit", title: `Модуль ${bi + 1} «${b.name}»`, short: `узел ${bi + 1}`, bi });
      } else {
        b.parts.forEach((p, pi) => {
          const des = `${bi + 1}.${pi + 1}`;
          out.push({ code: partUid(order, item, des), kind: "part", title: `${p.name}`, short: `деталь ${des}`, des, pos: p.pos, bi });
        });
      }
    });
    if (model.blocks.some(b => b.hardware.length)) {
      out.push({ code: kitUid(order, item), kind: "kit", title: "Комплект фурнитуры", short: "фурнитура" });
    }
    return out;
  }

  // Любой считанный код (адрес из QR или просто код с клавиатуры сканера) приводится к короткому виду
  function normalizeCode(text) {
    let s = String(text || "").trim();
    if (!s) return "";
    try {
      const u = new URL(s);
      s = u.searchParams.get("c") || decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || "");
    } catch { /* не адрес — уже код */ }
    return s.trim().toLowerCase();
  }

  // Определить, чему принадлежит код. Возвращает { kind, order, ... } или null
  function parseCode(code) {
    let m;
    if ((m = code.match(/^([\w]+)-pk-(\d+)$/))) return { kind: "pack", order: m[1], n: Number(m[2]) };
    if ((m = code.match(/^([\w]+)-common$/))) return { kind: "common", order: m[1] };
    if ((m = code.match(/^([\w]+)-([a-z0-9]+)-hw$/))) return { kind: "kit", order: m[1], item: m[2] };
    if ((m = code.match(/^([\w]+)-([a-z0-9]+)-m(\d+)$/))) return { kind: "unit", order: m[1], item: m[2], bi: Number(m[3]) - 1 };
    if ((m = code.match(/^([\w]+)-([a-z0-9]+)-(\d+)\.(\d+)$/))) return { kind: "part", order: m[1], item: m[2], bi: Number(m[3]) - 1, pi: Number(m[4]) - 1 };
    return null;
  }

  function modelUrl(order, item, extra) {
    const q = new URLSearchParams({ id: item.model, order: order.id, item: item.id });
    Object.keys(extra || {}).forEach(k => q.set(k, extra[k]));
    return "model.html?" + q.toString();
  }

  // Адрес, зашитый в QR: постоянный, не зависит от версии инструкции
  function root() { return BASE; }
  const qrUrl = (base, code) => (base || root()).replace(/\/?$/, "/") + "q/" + code;

  // ---------- Упаковки (демо: хранятся в браузере; настоящий сервис хранил бы их на сервере) ----------
  const shipKey = id => "asm-ship-" + id;
  function loadShipment(orderId) {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(shipKey(orderId))); } catch { /* нет хранилища */ }
    if (saved && Array.isArray(saved.packages)) return Promise.resolve(saved);
    return json(`data/shipments/${orderId}.json`).catch(() => ({ order: orderId, packages: [] }));
  }
  function saveShipment(orderId, s) {
    try { localStorage.setItem(shipKey(orderId), JSON.stringify(s)); } catch { /* ignore */ }
  }
  function resetShipment(orderId) {
    try { localStorage.removeItem(shipKey(orderId)); } catch { /* ignore */ }
  }

  window.AsmCore = {
    esc, loadOrder, loadModel, designations, expected, partUid, unitUid, kitUid, commonUid, packUid,
    readable, normalizeCode, parseCode, modelUrl, qrUrl, root, loadShipment, saveShipment, resetShipment
  };
})();
