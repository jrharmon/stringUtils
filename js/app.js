(function () {
  'use strict';

  var activeKey = null;
  var undoStack = [];
  var redoStack = [];

  var fnList     = document.getElementById('fn-list');
  var paramInner = document.getElementById('param-inner');
  var io         = document.getElementById('io');
  var btnRun     = document.getElementById('btn-run');
  var btnUndo    = document.getElementById('btn-undo');
  var btnRedo    = document.getElementById('btn-redo');
  var statusMsg  = document.getElementById('status-msg');
  var statLine   = document.getElementById('stat-line');
  var statTotal  = document.getElementById('stat-total');
  var statChar   = document.getElementById('stat-char');
  var statSel    = document.getElementById('stat-sel');

  // ── Build sidebar ───────────────────────────────────────
  function buildSidebar() {
    var keys = Object.keys(FUNCTION_PARAMS).sort(function (a, b) {
      return FUNCTION_PARAMS[a].label.localeCompare(FUNCTION_PARAMS[b].label);
    });
    keys.forEach(function (key) {
      var item = document.createElement('div');
      item.className = 'fn-item';
      item.dataset.key = key;
      item.textContent = FUNCTION_PARAMS[key].label;
      item.addEventListener('click', function () { selectFn(key); });
      fnList.appendChild(item);
    });
  }

  // ── Focus first input in param panel ────────────────────
  function focusFirstParam() {
    var first = paramInner.querySelector('input, select');
    if (first) first.focus({ preventScroll: true });
  }

  // ── Select function ─────────────────────────────────────
  function selectFn(key) {
    if (key === activeKey) return;
    activeKey = key;

    // Update active class
    var items = fnList.querySelectorAll('.fn-item');
    items.forEach(function (el) {
      el.classList.toggle('active', el.dataset.key === key);
    });

    var html = FUNCTION_PARAMS[key].html();

    if (!html.trim()) {
      // No params — hide panel
      paramInner.classList.add('fading');
      setTimeout(function () {
        paramInner.innerHTML = '';
        paramInner.classList.add('empty');
        paramInner.classList.remove('fading');
      }, 180);
      return;
    }

    paramInner.classList.remove('empty');

    if (paramInner.innerHTML.trim()) {
      // Fade out, swap, fade in
      paramInner.classList.add('fading');
      setTimeout(function () {
        paramInner.innerHTML = html;
        paramInner.classList.remove('fading');
        focusFirstParam();
      }, 180);
    } else {
      paramInner.innerHTML = html;
      focusFirstParam();
    }
  }

  // ── Collect params from panel ───────────────────────────
  function collectParams() {
    var p = {};
    var textEl      = document.getElementById('p-text');
    var findEl      = document.getElementById('p-find');
    var replaceEl   = document.getElementById('p-replace');
    var delimEl     = document.getElementById('p-delimiter');
    var searchEl    = document.getElementById('p-search');
    var countEl     = document.getElementById('p-count');
    var directionEl = document.getElementById('p-direction');
    var keepEl      = document.getElementById('p-keep');
    var caseEl      = document.getElementById('p-case-sensitive');

    if (textEl)      p.text      = textEl.value;
    if (findEl)      p.find      = findEl.value;
    if (replaceEl)   p.replace   = replaceEl.value;
    if (delimEl)     p.delimiter = delimEl.value;
    if (searchEl)    p.search    = searchEl.value;
    if (countEl)     p.count     = countEl.value;
    if (directionEl) p.direction = directionEl.value;
    if (keepEl)      p.keep      = keepEl.checked;
    if (caseEl)      p.caseSensitive = caseEl.checked;

    return p;
  }

  // ── Undo / Redo ─────────────────────────────────────────
  function updateUndoRedoButtons() {
    btnUndo.disabled = undoStack.length === 0;
    btnRedo.disabled = redoStack.length === 0;
  }

  function pushUndo() {
    undoStack.push(io.value);
    redoStack = [];
    updateUndoRedoButtons();
  }

  function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(io.value);
    io.value = undoStack.pop();
    updateUndoRedoButtons();
    updateStatus();
    showMsg('Undo');
  }

  function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(io.value);
    io.value = redoStack.pop();
    updateUndoRedoButtons();
    updateStatus();
    showMsg('Redo');
  }

  // ── Show status message ─────────────────────────────────
  function showMsg(msg, isError) {
    statusMsg.textContent = msg;
    statusMsg.className = isError ? 'error' : '';
    clearTimeout(showMsg._timer);
    showMsg._timer = setTimeout(function () {
      statusMsg.textContent = '';
      statusMsg.className = '';
    }, 3000);
  }

  // ── Run function ────────────────────────────────────────
  function runFn() {
    if (!activeKey) return;
    var text = io.value;
    var params = collectParams();

    if (activeKey === 'replace-clipboard') {
      runWithClipboard(text, params);
      return;
    }

    try {
      var result = StringFunctions[activeKey](text, params);
      pushUndo();
      io.value = result;
      showMsg('Done');
    } catch (e) {
      showMsg('Error: ' + e.message, true);
    }
  }

  function runWithClipboard(text, params) {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      showMsg('Clipboard API not supported in this browser', true);
      return;
    }
    navigator.clipboard.readText().then(function (clip) {
      var clipLines = clip.split('\n');
      try {
        var result = StringFunctions['replace-clipboard'](text, params, clipLines);
        pushUndo();
        io.value = result;
        showMsg('Done');
      } catch (e) {
        showMsg('Error: ' + e.message, true);
      }
    }).catch(function (err) {
      showMsg('Clipboard access denied: ' + err.message, true);
    });
  }

  // ── Status bar ──────────────────────────────────────────
  function updateStatus() {
    var text  = io.value;
    var start = io.selectionStart;
    var end   = io.selectionEnd;

    // Current line (1-based)
    var lineNum = text.slice(0, start).split('\n').length;
    var totalLines = text.split('\n').length;

    statLine.textContent  = 'Ln ' + lineNum;
    statTotal.textContent = totalLines + ' lines';

    if (start !== end) {
      var selCount = end - start;
      statChar.textContent = '';
      statSel.textContent  = selCount + ' selected';
    } else {
      var code = text.charCodeAt(start);
      if (!isNaN(code)) {
        statChar.textContent = 'U+' + code.toString(16).toUpperCase().padStart(4, '0') +
                               ' (' + code + ')';
      } else {
        statChar.textContent = '';
      }
      statSel.textContent = '';
    }
  }

  // ── Keyboard shortcuts ───────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runFn();
      return;
    }
    // Plain Enter while focused inside the param panel
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      if (paramInner.contains(document.activeElement)) {
        e.preventDefault();
        runFn();
        return;
      }
    }
    // Undo / Redo — skip when focus is in a param input (let native handle)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
      var inParamInput = paramInner.contains(document.activeElement);
      if (!inParamInput) {
        e.preventDefault();
        if (e.shiftKey) { redo(); } else { undo(); }
      }
    }
  });

  // ── Wire events ─────────────────────────────────────────
  btnRun.addEventListener('click', runFn);
  btnUndo.addEventListener('click', undo);
  btnRedo.addEventListener('click', redo);

  ['selectionchange', 'keyup', 'click', 'mouseup'].forEach(function (evt) {
    if (evt === 'selectionchange') {
      document.addEventListener(evt, function () {
        if (document.activeElement === io) updateStatus();
      });
    } else {
      io.addEventListener(evt, updateStatus);
    }
  });

  // ── Init ─────────────────────────────────────────────────
  buildSidebar();
  selectFn(Object.keys(FUNCTION_PARAMS)[0]);
  updateStatus();

}());
