(function () {
  const params = new URLSearchParams(location.search);
  const $ = id => document.getElementById(id);
  const { esc, loadOrder, loadModel, designations, partUid, readable } = AsmCore;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function fail(msg) {
    $("m-name").textContent = "Изделие не найдено";
    $("m-error").hidden = false;
    $("m-error").innerHTML = msg + ' <a href="index.html">Вернуться к списку</a>.';
  }

  function loadSource() {
    if (params.get("local")) {
      try {
        return Promise.resolve(JSON.parse(sessionStorage.getItem("localModel")));
      } catch {
        return Promise.reject(new Error("Не удалось прочитать файл модели."));
      }
    }
    return loadModel(params.get("id"));
  }

  // Контекст изделия в заказе: этаж, помещение, код. Без него инструкция открывается как «тип изделия».
  function loadContext(m) {
    const o = params.get("order"), it = params.get("item");
    if (!o || !it) return Promise.resolve(null);
    return loadOrder(o).then(order => {
      const item = order.items.find(x => x.id === it && x.model === m.id);
      return item ? { order, item } : null;
    }).catch(() => null);
  }

  // Проверяем модель и дозаполняем dims, если их не передали
  function normalize(m) {
    if (!m || !Array.isArray(m.blocks) || !m.blocks.length) throw new Error("В файле модели нет модулей.");
    const seen = new Set();
    m.blocks.forEach(b => {
      b.parts = b.parts || [];
      b.hardware = b.hardware || [];
      b.steps = b.steps || [];
      b.parts.forEach(p => {
        if (!Array.isArray(p.size) || !Array.isArray(p.at)) throw new Error("Деталь " + p.pos + ": нет size или at.");
        if (seen.has(p.pos)) throw new Error("Позиция " + p.pos + " повторяется.");
        seen.add(p.pos);
        if (!p.dims) p.dims = p.size.slice().sort((a, b) => b - a);
      });
      if (b.ready) {
        // Готовый узел приходит в сборе: внутренняя сборка в инструкции пропускается
        b.steps = [{
          text: `«${b.name}» поставляется в сборе. Установите узел на место. Внутреннюю сборку выполнять не нужно.`,
          parts: b.parts.map(p => p.pos), hardware: [], unit: true
        }];
      } else if (!b.steps.length) {
        b.steps = [{ text: "Соберите модуль по чертежу и списку деталей.", parts: b.parts.map(p => p.pos), hardware: b.hardware }];
      }
    });
    return m;
  }

  function overall(m) {
    const all = m.blocks.flatMap(b => b.parts);
    const lo = [0, 1, 2].map(i => Math.min(...all.map(p => p.at[i])));
    const hi = [0, 1, 2].map(i => Math.max(...all.map(p => p.at[i] + p.size[i])));
    return { lo, hi, size: [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]].map(Math.round) };
  }

  const EDGE_CODE = { l1: "Д1", l2: "Д2", w1: "Ш1", w2: "Ш2" };
  function edgeText(p) {
    return (p.edge && p.edge.length) ? p.edge.map(e => EDGE_CODE[e] || e).join(", ") : "—";
  }

  // ---------- Ориентация детали в изделии ----------
  const DIR = [["слева", "справа"], ["снизу", "сверху"], ["сзади", "спереди"]];
  const FACE = [["влево", "вправо"], ["вниз", "вверх"], ["назад", "вперёд"]];

  function sideDirections(p) {
    const ax = partAxes(p);
    const res = {};
    ["l1", "l2", "w1", "w2"].forEach(s => {
      const axis = s[0] === "l" ? ax.wa : ax.la;
      res[s] = DIR[axis][s[1] === "1" ? 1 : 0];
    });
    return res;
  }

  function orientation(p, ov) {
    const ax = partAxes(p);
    const c = [0, 1, 2].map(i => p.at[i] + p.size[i] / 2);
    const mid = [0, 1, 2].map(i => (ov.lo[i] + ov.hi[i]) / 2);
    const outer = FACE[ax.ta][c[ax.ta] >= mid[ax.ta] ? 1 : 0];
    const lenDir = ["по ширине изделия", "вертикально", "вглубь изделия"][ax.la];
    const pose = ax.ta === 1 ? "Лежит горизонтально" : `Стоит вертикально, внешняя пласть смотрит ${outer}`;
    return { pose, lenDir, outer };
  }

  function neighbours(p, all) {
    const gap = 3; // учитываем монтажный зазор фасадов (обычно 2 мм)
    return all.filter(q => q !== p && [0, 1, 2].every(i =>
      q.at[i] <= p.at[i] + p.size[i] + gap && p.at[i] <= q.at[i] + q.size[i] + gap));
  }

  function materialSummary(m) {
    const t = {};
    m.blocks.forEach(b => b.parts.forEach(p => {
      const r = t[p.material] || (t[p.material] = { n: 0, area: 0, edge: 0 });
      r.n++;
      r.area += (p.dims[0] * p.dims[1]) / 1e6;
      (p.edge || []).forEach(s => { r.edge += (s[0] === "l" ? p.dims[0] : p.dims[1]) / 1000; });
    }));
    return Object.entries(t).map(([name, r]) => ({ name, ...r }));
  }

  function sumHardware(blocks) {
    const t = {};
    blocks.forEach(b => b.hardware.forEach(h => { t[h.name] = (t[h.name] || 0) + h.qty; }));
    return Object.entries(t).map(([name, qty]) => ({ name, qty }));
  }

  function hwTable(list) {
    if (!list.length) return "";
    return `<table class="parts"><thead><tr><th>Фурнитура</th><th>Кол-во</th></tr></thead><tbody>
      ${list.map(h => `<tr><td>${esc(h.name)}</td><td>${h.qty}</td></tr>`).join("")}</tbody></table>`;
  }

  function init(m, ctx) {
    const partByPos = {}, blockOf = {}, desOf = {};
    designations(m).forEach(d => { partByPos[d.p.pos] = d.p; blockOf[d.p.pos] = d.block; desOf[d.p.pos] = d; });
    const allParts = m.blocks.flatMap(b => b.parts);
    const ov = overall(m);
    const count = allParts.length;
    const label = tail => ctx ? readable(ctx.order, ctx.item, tail) : tail;
    const uidOf = p => ctx ? partUid(ctx.order, ctx.item, desOf[p.pos].des) : null;

    document.title = ctx ? `${ctx.item.code} · ${m.name}` : m.name;
    $("m-name").textContent = m.name;
    if (ctx) {
      $("m-where").hidden = false;
      $("m-where").textContent = readable(ctx.order, ctx.item);
    } else if (m.source && m.source.format === "basis") {
      $("m-where").hidden = false;
      $("m-where").textContent = `Импорт из Базис-Мебельщика ${m.source.version} · черновик: имена деталей и шаги определены автоматически`;
    }
    $("m-meta").textContent = `${ov.size[0]}×${ov.size[1]}×${ov.size[2]} мм · модулей: ${m.blocks.length} · деталей: ${count}`;
    $("tabs").hidden = false;
    $("btn-pdf").hidden = false;

    // ---------- Вкладки ----------
    const viewers = {};
    function showTab(name) {
      document.querySelectorAll(".tab").forEach(t => t.classList.toggle("is-active", t.id === "tab-" + name));
      document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("is-active", b.dataset.tab === name));
      if (viewers[name]) viewers[name].resize();
      window.scrollTo(0, 0);
    }
    $("tabs").addEventListener("click", e => {
      if (e.target.dataset.tab) showTab(e.target.dataset.tab);
    });

    // ---------- Сборка по шагам ----------
    const steps = [];
    m.blocks.forEach((b, bi) => b.steps.forEach((s, i) => steps.push({ block: b, bi, i, n: b.steps.length, step: s })));
    const stepOf = {};
    steps.forEach((s, idx) => s.step.parts.forEach(p => { if (stepOf[p] === undefined) stepOf[p] = idx; }));

    const asm = new Viewer3D($("viewer-asm"));
    asm.load(m);
    viewers.assembly = asm;

    let cur = 0;
    let playing = false;
    const speed = () => Number($("asm-speed").value) || 1;

    function stepStates(idx, hideFuture) {
      const shown = new Set(), active = new Set(steps[idx].step.parts);
      steps.forEach((x, i) => { if (i <= idx) x.step.parts.forEach(p => shown.add(p)); });
      asm.setStates(pos => active.has(pos) ? "active" : shown.has(pos) ? "normal" : hideFuture ? "hidden" : "ghost");
    }

    function note(id, prefix, text) {
      $(id).hidden = !text;
      $(id).innerHTML = text ? `<b>${prefix}</b> ${esc(text)}` : "";
    }

    function renderStep(animate) {
      const s = steps[cur];
      stepStates(cur, playing);
      if (animate) asm.animateIn(s.step.parts, 900 / speed());

      $("asm-where").textContent = `Модуль ${s.bi + 1} «${s.block.name}»${s.block.ready ? " · готовый узел" : ` · шаг ${s.i + 1} из ${s.n}`}`;
      $("asm-title").textContent = `Шаг ${cur + 1} из ${steps.length}`;
      $("asm-text").textContent = s.step.text;
      $("asm-parts").innerHTML = s.step.unit ? "" : s.step.parts.map(pos => {
        const p = partByPos[pos];
        return p ? `<button type="button" class="chip" data-part="${pos}"><b>${desOf[pos].des}</b> ${esc(p.name)} · ${p.dims.join("×")}</button>` : "";
      }).join("");
      $("asm-hw").innerHTML = (s.step.hardware || []).map(h => `<li>${esc(h.name)} — <b>${h.qty} шт</b></li>`).join("");
      note("asm-tool", "Инструмент:", s.step.tool);
      note("asm-check", "Проверьте:", s.step.check);
      if (s.step.draft && !s.step.warn) note("asm-warn", "Черновик:", "порядок и текст шага сформированы автоматически по геометрии. Конструктор должен проверить его перед выпуском.");
      else note("asm-warn", "Внимание:", s.step.warn);
      $("asm-bar").style.width = Math.round(((cur + 1) / steps.length) * 100) + "%";
      $("asm-prev").disabled = cur === 0;
      $("asm-next").disabled = cur === steps.length - 1;
      $("asm-dots").innerHTML = steps.map((_, i) =>
        `<button type="button" class="dot ${i === cur ? "is-cur" : ""}" data-i="${i}" aria-label="Шаг ${i + 1}">${i + 1}</button>`).join("");
    }

    async function play() {
      if (playing) { playing = false; asm.stopAnimation(); return; }
      playing = true;
      $("asm-play").textContent = "■ Остановить";
      asm.setStates(() => "hidden");
      for (cur = 0; cur < steps.length; cur++) {
        renderStep(false);
        await asm.animateIn(steps[cur].step.parts, 1100 / speed());
        if (!playing) break;
        await wait(500 / speed());
        if (!playing) break;
      }
      cur = Math.min(cur, steps.length - 1);
      playing = false;
      $("asm-play").textContent = "▶ Анимация сборки";
      renderStep(false);
    }

    $("asm-play").addEventListener("click", play);
    $("asm-next").addEventListener("click", () => { if (!playing && cur < steps.length - 1) { cur++; renderStep(true); } });
    $("asm-prev").addEventListener("click", () => { if (!playing && cur > 0) { cur--; renderStep(false); } });
    $("asm-dots").addEventListener("click", e => {
      if (!playing && e.target.dataset.i !== undefined) { cur = Number(e.target.dataset.i); renderStep(false); }
    });
    $("asm-parts").addEventListener("click", e => {
      const b = e.target.closest("[data-part]");
      if (b) openPart(Number(b.dataset.part));
    });
    renderStep(false);

    // ---------- Свободный 3D: детали и модули ----------
    const free = new Viewer3D($("viewer-3d"));
    free.load(m);
    free.setStates(() => "normal");
    viewers.view3d = free;

    let mode = "parts";
    const hidden = new Set();
    const toggles = { dims: false, transparent: false, holes: false, edges: false, facades: false, ruler: false };
    let picked = null;

    const facadeHidden = pos => toggles.facades && blockOf[pos].kind === "facade";
    function freeStates(activeSet) {
      free.setStates(pos => hidden.has(pos) || facadeHidden(pos) ? "hidden" : activeSet && activeSet.has(pos) ? "active" : "normal");
    }
    function setMode(next) {
      mode = next;
      $("toolbar").querySelectorAll("[data-mode]").forEach(x => x.classList.toggle("is-on", x.dataset.mode === next));
    }

    function blockCard(b, bi) {
      const hw = b.hardware.reduce((s, h) => s + h.qty, 0);
      const ps = b.parts;
      const lo = [0, 1, 2].map(i => Math.min(...ps.map(p => p.at[i])));
      const hi = [0, 1, 2].map(i => Math.max(...ps.map(p => p.at[i] + p.size[i])));
      const gab = hi.map((v, i) => Math.round(v - lo[i])).join(" × ");
      return `<h3>Модуль ${bi + 1} · ${esc(b.name)}</h3>
        <p>Габарит: ${gab} мм · деталей: ${ps.length}${b.ready ? " · готовый узел" : ` · фурнитуры: ${hw} шт`}</p>
        <div class="nav-row wrap">
          <button type="button" class="btn btn-ghost" data-act="hide">Скрыть модуль</button>
          <button type="button" class="btn btn-ghost" data-act="only">Только этот модуль</button>
          <button type="button" class="btn btn-ghost" data-act="all">Показать всё</button>
          <button type="button" class="btn" data-act="steps">Шаги модуля →</button>
        </div>`;
    }

    function partInfo(p) {
      const d = desOf[p.pos];
      return `<h3>${d.des} · ${esc(p.name)}</h3>
        <p>${esc(p.material)} · ${p.dims[0]}×${p.dims[1]}×${p.dims[2]} мм · модуль ${d.bi + 1} «${esc(d.block.name)}»</p>
        <p>Кромка: ${edgeText(p)}${p.grooves ? " · " + esc(p.grooves) : ""}</p>
        <div class="nav-row wrap">
          <button type="button" class="btn" data-act="card">Карточка детали и ориентация →</button>
          <button type="button" class="btn btn-ghost" data-act="hidepart">Скрыть деталь</button>
          ${hidden.size ? '<button type="button" class="btn btn-ghost" data-act="all">Показать всё</button>' : ""}
        </div>`;
    }

    function rulerHint() {
      return '<p class="muted">Рулетка: коснитесь двух точек на деталях. Расстояние по прямой, в миллиметрах.</p>';
    }

    function resetPick() {
      picked = null;
      freeStates(null);
      free.showBands(toggles.edges);
      $("pick-info").innerHTML = toggles.ruler ? rulerHint() :
        '<p class="muted">Коснитесь ' + (mode === "blocks" ? "модуля" : "детали") + ", чтобы увидеть информацию.</p>" +
        (hidden.size ? '<div class="nav-row"><button type="button" class="btn btn-ghost" data-act="all">Показать всё</button></div>' : "");
    }

    free.onPick(pos => {
      if (toggles.ruler) return;
      if (pos == null) return resetPick();
      picked = pos;
      if (mode === "blocks") {
        const b = blockOf[pos];
        freeStates(new Set(b.parts.map(p => p.pos)));
        $("pick-info").innerHTML = blockCard(b, m.blocks.indexOf(b));
      } else {
        freeStates(new Set([pos]));
        free.showBands(true, toggles.edges ? null : pos);
        $("pick-info").innerHTML = partInfo(partByPos[pos]);
      }
    });

    function isolateBlock(b) {
      allParts.forEach(p => { if (blockOf[p.pos] !== b) hidden.add(p.pos); else hidden.delete(p.pos); });
      freeStates(new Set(b.parts.map(p => p.pos)));
      free.focusMany(b.parts.map(p => p.pos));
    }

    $("pick-info").addEventListener("click", e => {
      const act = e.target.dataset.act;
      if (!act) return;
      const b = picked != null ? blockOf[picked] : null;
      if (act === "hide" && b) b.parts.forEach(p => hidden.add(p.pos));
      if (act === "only" && b) { isolateBlock(b); $("pick-info").innerHTML = blockCard(b, m.blocks.indexOf(b)); return; }
      if (act === "hidepart" && picked != null) hidden.add(picked);
      if (act === "all") hidden.clear();
      if (act === "steps" && b) {
        cur = steps.findIndex(s => s.block === b);
        renderStep(false);
        showTab("assembly");
        return;
      }
      if (act === "card" && picked != null) return openPart(picked);
      resetPick();
    });

    // Дерево изделия: модули → детали; клик по модулю изолирует его и центрирует камеру
    $("tree").innerHTML = m.blocks.map((b, bi) => `
      <div class="tree-mod">
        <button type="button" class="tree-b" data-block="${bi}">Модуль ${bi + 1} · ${esc(b.name)}${b.ready ? " · готовый узел" : ""} <span class="muted">(${b.parts.length})</span></button>
        <ul>${b.parts.map((p, pi) => `<li><button type="button" class="tree-p" data-tpart="${p.pos}">${bi + 1}.${pi + 1} ${esc(p.name)}</button></li>`).join("")}</ul>
      </div>`).join("") +
      '<button type="button" class="btn btn-ghost" id="tree-all">Показать всё изделие</button>';
    $("tree").addEventListener("click", e => {
      const bb = e.target.closest("[data-block]"), pp = e.target.closest("[data-tpart]");
      if (e.target.id === "tree-all") { hidden.clear(); free.resetCamera(); resetPick(); return; }
      if (bb) {
        const bi = Number(bb.dataset.block), b = m.blocks[bi];
        picked = b.parts[0] ? b.parts[0].pos : null;
        setMode("blocks");
        isolateBlock(b);
        $("pick-info").innerHTML = blockCard(b, bi);
        $("viewer-3d").scrollIntoView({ block: "center", behavior: "smooth" });
      } else if (pp) {
        const pos = Number(pp.dataset.tpart);
        picked = pos;
        setMode("parts");
        freeStates(new Set([pos]));
        free.showBands(true, toggles.edges ? null : pos);
        free.focus(pos);
        $("pick-info").innerHTML = partInfo(partByPos[pos]);
        $("viewer-3d").scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });

    free.onMeasure((d, axes) => {
      if (d === null) { $("pick-info").innerHTML = rulerHint(); return; }
      if (axes) {
        $("pick-info").innerHTML = `<h3>${Math.round(d)} мм</h3>
          <p>По осям: ширина ${Math.round(axes.dx)} · высота ${Math.round(axes.dy)} · глубина ${Math.round(axes.dz)} мм</p>
          <p class="muted">Коснитесь ещё раз, чтобы начать новое измерение.</p>`;
      } else {
        $("pick-info").innerHTML = '<p class="muted">Первая точка поставлена. Коснитесь второй точки.</p>';
      }
    });

    $("toolbar").addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.id === "btn-reset") {
        hidden.clear();
        $("explode").value = 0;
        $("explode").disabled = false;
        free.explode(0);
        free.setRuler(false);
        toggles.ruler = false;
        toggles.facades = false;
        $("toolbar").querySelectorAll("[data-toggle]").forEach(x => {
          if (x.dataset.toggle === "ruler" || x.dataset.toggle === "facades") x.classList.remove("is-on");
        });
        free.resetCamera();
        resetPick();
        return;
      }
      if (btn.dataset.mode) {
        setMode(btn.dataset.mode);
        resetPick();
        return;
      }
      const t = btn.dataset.toggle;
      if (!t) return;
      toggles[t] = !toggles[t];
      btn.classList.toggle("is-on", toggles[t]);
      if (t === "dims") free.showDims(toggles.dims);
      if (t === "transparent") free.setTransparent(toggles.transparent);
      if (t === "holes") free.showHoles(toggles.holes);
      if (t === "edges") free.showBands(toggles.edges);
      if (t === "facades") freeStates(picked != null && mode === "blocks" ? new Set(blockOf[picked].parts.map(p => p.pos)) : null);
      if (t === "ruler") {
        // Измерять честнее на собранном изделии: раздвижение на время измерения отключаем
        if (toggles.ruler) { $("explode").value = 0; free.explode(0); }
        $("explode").disabled = toggles.ruler;
        free.setRuler(toggles.ruler);
        picked = null;
        freeStates(null);
        resetPick();
      }
    });
    free.showHoles(false);
    $("explode").addEventListener("input", e => free.explode(e.target.value / 100));

    // ---------- Карточка детали (открывается по QR) ----------
    let pv = null;
    function openPart(pos) {
      const p = partByPos[pos];
      if (!p) return;
      const d = desOf[pos];
      $("tab-btn-part").hidden = false;
      showTab("part");
      if (!pv) {
        pv = new Viewer3D($("viewer-part"));
        pv.load(m);
        viewers.part = pv;
      }
      pv.resize();
      pv.setStates(q => q === pos ? "active" : "ghost");
      pv.showBands(true, pos);
      pv.showHoles(true);
      pv.showArrows(pos);
      pv.focus(pos);

      const o = orientation(p, ov);
      const dirs = sideDirections(p);
      const edges = (p.edge || []).map(s => `<li><b>${EDGE_CODE[s]}</b> — ${dirs[s]}</li>`).join("") || "<li>Без кромки</li>";
      const near = neighbours(p, allParts).map(q =>
        `<button type="button" class="chip" data-part="${q.pos}"><b>${desOf[q.pos].des}</b> ${esc(q.name)}</button>`).join("") || '<span class="muted">—</span>';
      const si = stepOf[pos];
      const uid = uidOf(p);

      $("part-card").innerHTML = `
        <div class="block">
          <p class="muted">${esc(label("деталь " + d.des))}</p>
          <h2>${d.des} · ${esc(p.name)}</h2>
          <p><b>${p.dims[0]} × ${p.dims[1]} × ${p.dims[2]} мм</b> · ${esc(p.material)}</p>
          ${p.art ? `<p class="muted">Позиция в чертежах Базис: ${esc(p.art)}${p.srcName ? " · имя в проекте: " + esc(p.srcName) : ""}${p.edgeMat ? " · кромка: " + esc(p.edgeMat) : ""}</p>` : ""}
          ${uid ? `<p class="muted">Идентификатор экземпляра: <code>${esc(uid)}</code></p>` : ""}
          ${d.block.ready ? `<p class="note">Деталь входит в готовый узел «${esc(d.block.name)}». Его внутренняя сборка в инструкции пропущена.</p>` : ""}
          <div class="orient">
            <p><b>Как стоит:</b> ${o.pose}. Длинная сторона — ${o.lenDir}.</p>
            <p><b>Кромка</b> (оранжевая на 3D):</p>
            <ul>${edges}</ul>
            ${p.grooves ? `<p><b>Паз:</b> ${esc(p.grooves)}</p>` : ""}
            <p><b>Отверстия:</b> ${(p.holes || []).length ? p.holes.length + " шт (красные точки)" : "нет"}</p>
          </div>
          <p class="muted">Синяя стрелка — вверх, зелёная — перёд изделия.</p>
          ${si !== undefined ? `<button type="button" class="btn" id="go-step">Устанавливается на шаге ${si + 1} →</button>` : ""}
          <h3>Стыкуется с</h3>
          <div class="chips" id="near">${near}</div>
          <h3>Чертёж</h3>
          ${Drawings.partDrawing(p, dirs)}
        </div>`;
      const go = $("go-step");
      if (go) go.addEventListener("click", () => { cur = si; renderStep(false); showTab("assembly"); });
      $("near").addEventListener("click", e => {
        const b = e.target.closest("[data-part]");
        if (b) openPart(Number(b.dataset.part));
      });
      if (history.replaceState) {
        const u = new URLSearchParams(location.search);
        u.set("part", pos);
        history.replaceState(null, "", "?" + u.toString());
      }
    }

    // ---------- Состав ----------
    const hasArt = allParts.some(p => p.art);
    $("tab-spec").innerHTML = m.blocks.map((b, bi) => `
      <div class="block">
        <h2>Модуль ${bi + 1} · ${esc(b.name)}</h2>
        ${b.ready ? '<p class="note">Готовый узел: приходит в сборе и считается одним местом. Детали ниже — справочный состав, отдельно их не комплектуют.</p>' : ""}
        <div class="table-wrap"><table class="parts">
          <thead><tr><th>Обозн.</th>${hasArt ? "<th>Поз. Базис</th>" : ""}<th>Название</th><th>Материал</th><th>Длина</th><th>Шир.</th><th>Толщ.</th><th>Кромка</th><th>Примечание</th></tr></thead>
          <tbody>${b.parts.map(p => `<tr data-part="${p.pos}" class="row-link"><td>${desOf[p.pos].des}</td>${hasArt ? `<td>${esc(p.art || "")}</td>` : ""}<td>${esc(p.name)}</td><td>${esc(p.material)}</td>
            <td>${p.dims[0]}</td><td>${p.dims[1]}</td><td>${p.dims[2]}</td><td>${edgeText(p)}</td><td>${esc(p.grooves || "")}</td></tr>`).join("")}</tbody>
        </table></div>
        ${hwTable(b.hardware)}
      </div>`).join("") +
      `<div class="block"><h2>Материалы</h2><div class="table-wrap"><table class="parts">
        <thead><tr><th>Материал</th><th>Деталей</th><th>Площадь, м²</th><th>Кромка, м</th></tr></thead>
        <tbody>${materialSummary(m).map(r => `<tr><td>${esc(r.name)}</td><td>${r.n}</td><td>${r.area.toFixed(2)}</td><td>${r.edge.toFixed(1)}</td></tr>`).join("")}</tbody>
      </table></div></div>` +
      `<div class="block"><h2>Вся фурнитура</h2>${hwTable(sumHardware(m.blocks)) || '<p class="muted">Нет.</p>'}</div>`;
    $("tab-spec").addEventListener("click", e => {
      const r = e.target.closest("[data-part]");
      if (r) openPart(Number(r.dataset.part));
    });

    // ---------- Чертежи ----------
    $("tab-draw").innerHTML = `
      <label class="check"><input type="checkbox" id="detail-toggle"> Показать детальные чертежи деталей</label>
      ${m.blocks.map((b, bi) => `
        <div class="block">
          <h2>Модуль ${bi + 1} · ${esc(b.name)}</h2>
          <p class="muted">Вид спереди. Цифры слева — высота от низа модуля до нижней плоскости полок, мм.</p>
          ${Drawings.frontView(b, m)}
          ${hwTable(b.hardware)}
        </div>`).join("")}
      <div id="detail-sheets" hidden>
        ${allParts.map(p => `
          <div class="block part-sheet">
            <h3>${desOf[p.pos].des} · ${esc(p.name)}</h3>
            <p class="muted">${esc(p.material)} · ${p.dims[0]}×${p.dims[1]}×${p.dims[2]} мм · кромка: ${edgeText(p)}</p>
            ${Drawings.partDrawing(p, sideDirections(p))}
            <p class="muted legend">Оранжевая линия — кромка. Зелёные круги — отверстия.${p.grooves ? " " + esc(p.grooves) + "." : ""}</p>
          </div>`).join("")}
      </div>`;
    $("detail-toggle").addEventListener("change", e => { $("detail-sheets").hidden = !e.target.checked; });

    // ---------- PDF (печать) ----------
    $("btn-pdf").addEventListener("click", () => {
      document.body.classList.add("print-all");
      $("detail-sheets").hidden = false;
      window.print();
      document.body.classList.remove("print-all");
      $("detail-sheets").hidden = !$("detail-toggle").checked;
    });

    const startPart = Number(params.get("part"));
    const startModule = Number(params.get("module"));
    if (startPart && partByPos[startPart]) openPart(startPart);
    else if (startModule && m.blocks[startModule - 1]) {
      showTab("view3d");
      setMode("blocks");
      const b = m.blocks[startModule - 1];
      picked = b.parts[0] && b.parts[0].pos;
      isolateBlock(b);
      $("pick-info").innerHTML = blockCard(b, startModule - 1);
    } else if (params.get("tab") === "spec") showTab("spec");

    window.__model = { steps: steps.length, parts: count };
  }

  loadSource()
    .then(normalize)
    .then(m => loadContext(m).then(ctx => init(m, ctx)))
    .catch(err => fail(esc(err.message)));
})();
