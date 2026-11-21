// view.ts — the view of the Yard. It holds each markup string, each class name and each DOM write
// of the Yard chrome. It holds no game state and it imports no engine module. The controller
// (../yardSim.js) sends plain data, and this file builds the words and the elements from it.
//
// A view function finds its element at the time of each call, and it does not test for a missing
// element. When a learner leaves the Yard, the host is emptied. A move that still runs then stops
// at its next view call with a TypeError, as it did before the split. A test for a missing
// element would let that move run on. Do not add one.

/** The tone of the banner. The view adds the class `yd-` and the tone. */
export type BannerTone = '' | 'ok' | 'bad' | 'win';

/** The three numbers of the readout. */
export interface ReadoutData { moves: number; par: number; joints: number }

/** One rule chip. `kind` is `cror` or `si`: it comes from the puzzle data. The view adds the class `yd-` and the kind. */
export interface RuleChip { kind: string; cite: string; label: string }

/** One line of a switch list that is not verified yet. */
export interface SwitchListLine { mark: string; track: string; flagged: boolean }

/** A switch list that the learner must check. */
export interface SwitchListData { id: string; goalTrack: string; hint: string; lines: SwitchListLine[] }

/** What the controller does when the learner flags a line or certifies the list. */
export interface SwitchListHandlers { onFlag: (index: number) => void; onCertify: () => void }

/** One line of a verified order. `corrected` is true where the list was wrong. */
export interface VerifiedLine { mark: string; track: string; corrected: boolean }

/** A switch list after it is verified. */
export interface VerifiedOrderData { goalTrack: string; par: number; lines: VerifiedLine[] }

/**
 * A work order. `cars` holds the car marks of the goal. `from` holds the tracks where those cars
 * stand in the start layout. `goalTrack` is not set for a job that ends with Depart.
 */
export interface WorkOrderData {
  id: string; title: string; hint: string; par: number;
  depart: boolean; ordered: boolean; goalTrack?: string;
  cars: string[]; from: string[];
}

/** The car count of the move builder. `max` is 1 or more. */
export interface CountData { max: number; value: number; disabled: boolean }

/** One job in the picker. `state` is the mark of the job. `best` is the record of the learner. */
export interface PickerOption {
  value: number; title: string; par: number;
  state: '' | 'done' | 'next';
  best: { moves: number } | null;
}

/** One tier of the picker. */
export interface PickerGroup { label: string; options: PickerOption[] }

/** The Depart control. */
export interface DepartData { shown: boolean; enabled: boolean }

/** The view object. `createView` makes it. */
export interface YardView {
  /** The element with this id inside the Yard, or null. It is found again at each call. */
  el(id: string): HTMLElement | null;
  /** The element that the drawing adapter fills. */
  readonly drawHost: HTMLElement;
  /** Writes the readout and returns its text. */
  setReadout(data: ReadoutData): string;
  setBanner(text: string | null | undefined, tone: BannerTone): void;
  /** A refusal. With `onLookup`, the banner gets the control "Look it up". */
  setRefusal(text: string | null | undefined, onLookup: (() => void) | null): void;
  renderRules(list: RuleChip[]): void;
  renderSwitchList(data: SwitchListData, handlers: SwitchListHandlers): void;
  /** Flags or unflags line `index` of the switch list in place, so that focus stays on it. */
  setLineFlag(index: number, flagged: boolean): void;
  renderVerifiedOrder(data: VerifiedOrderData): void;
  renderWorkOrder(data: WorkOrderData): void;
  setCount(data: CountData): void;
  setTracks(ids: readonly string[]): void;
  /** `keep` is the value that the picker has before the call. An empty string selects nothing. */
  renderPicker(groups: PickerGroup[], keep: string): void;
  setDepart(data: DepartData): void;
  /** While the optimal line plays, its button reads "Stop watching" and stops it (U-12). */
  setWatching(on: boolean): void;
  /**
   * Asks a question in a modal dialog with the answers Yes and No (U-12). No has the focus first.
   * `answer` gets true for Yes, and false for No, Escape or a close. Focus goes back to the control
   * that had it before the question.
   */
  ask(question: string, answer: (yes: boolean) => void): void;
  /** Closes the question with the answer No, if it is open. */
  closeAsk(): void;
  setMuted(muted: boolean): void;
  /** `fn` gets the `data-go` value of the back button when the learner presses it. */
  onGo(fn: (route: string | undefined) => void): void;
}

// The body of the Yard page. The app has its own header, so this markup starts with a back button.
const YARD_HTML = `
  <div class="yard-wrap">
    <button class="yd-back cb-btn--plain" data-go="">← Home</button>

    <div class="yd-bar yd-strip dusk-strip">
      <div class="yd-field yd-field--job"><label class="yd-label" for="picker">Pick a job</label><select class="cb-select" id="picker"></select></div>
      <span class="dusk-spacer"></span>
      <div class="dusk-cell"><b class="yd-readout" id="readout">Moves 0 / par 0 · Joints 0</b></div>
    </div>

    <div class="yd-workorder dusk-panel dusk-panel--framed" id="workorder"></div>

    <div class="yd-yardframe dusk-panel dusk-panel--framed" data-cb="yard-drawing"></div>

    <ul class="yd-mirror dusk-sr" id="yard-mirror" role="list"></ul>

    <div class="yd-bar yd-builder dusk-panel">
      <div class="yd-field"><label class="yd-label" for="act">Action</label><select class="cb-select" id="act">
        <option value="pull">PULL</option>
        <option value="spot">SPOT</option>
        <option value="kick">KICK</option>
        <option value="secure">SECURE</option>
      </select></div>
      <select class="cb-select" id="count" title="How many cars"></select>
      <label class="yd-unit cb-sub" for="count">cars</label>
      <div class="yd-field"><label class="yd-label" for="track">Which track</label><select class="cb-select" id="track"></select></div>
      <button class="yd-go dusk-btn" id="work">Work it ▸</button>
      <button class="yd-go dusk-btn" id="optimal" title="Auto-line and play the fewest-moves line in slow motion">▶ Watch optimal</button>
      <button class="yd-go dusk-btn" id="depart" title="Depart the assembled outbound out the lead" style="display:none">Depart ▸</button>
      <span class="dusk-spacer"></span>
      <button class="cb-btn--plain" id="reset">Reset</button>
      <button class="cb-btn--plain" id="mute"><span aria-hidden="true">🔊</span> Sound on</button>
    </div>

    <div class="yd-banner cb-banner" id="msg"></div>
    <div class="yd-live dusk-sr" id="yard-live" role="status" aria-live="polite"></div>

    <div class="yd-rules-panel dusk-panel">
      <div class="yd-rules-legend dusk-rule">
        <b>Rules in play</b>
        <span>— <span class="yd-k">CROR</span> = the national rulebook (applies everywhere) ·
        <span class="yd-s">S.I.</span> = a <em>special instruction</em>, specific to <em>this</em> yard — <strong>you must know your yard's.</strong></span>
      </div>
      <div class="yd-rules dusk-grid" id="rules"></div>
    </div>

    <div class="yd-note dusk-panel">
      <strong class="yd-note-head">What this trainer builds</strong> — the instinct to <strong>think several moves ahead</strong> and learn the <strong>switching routine</strong>: read the yard, line the road, call clean moves, win in the fewest. <span class="yd-note-more">The next level — out on the ground — is minimizing the actual distance you run and using the lead as working room. That's real-yard efficiency that comes with seat time, beyond what this tool scores.</span>
    </div>

    <dialog class="yd-ask cb-dialog" id="yard-ask" aria-labelledby="yard-ask-q">
      <div class="dusk-panel-body">
        <p class="yd-ask-q cb-prose" id="yard-ask-q"></p>
        <div class="yd-ask-answers">
          <button type="button" class="dusk-btn" id="yard-ask-yes">Yes</button>
          <button type="button" class="dusk-btn" id="yard-ask-no">No</button>
        </div>
      </div>
    </dialog>

    <details class="yd-help cb-disclosure">
      <summary>How to play & why these rules</summary>
      <p><strong>You are the conductor, not the engineer.</strong> Click a switch target to line it
      (<span class="yd-key-reverse">yellow</span> = lined into the track / diverging,
      <span class="yd-key-normal">green</span> = normal, straight up the ladder). Then call a move:</p>
      <ul>
        <li><strong>PULL n from a track</strong> — back in, couple the near (throat) cut, pull <code class="cb-code">n</code> cars onto the lead.</li>
        <li><strong>SPOT n to a track</strong> — shove <code class="cb-code">n</code> cars in and leave them.</li>
        <li><strong>KICK n to a track</strong> — shove and cut away; the cars coast in on their own with no coupling. Only where a special instruction allows it (<span class="yd-key-kick">⚡</span>), only onto a secured 2+ car cut, and only car types that can be kicked.</li>
      </ul>
      <p><strong>Score = fewest engine MOVES</strong> — beat or match <em>par</em>. A move is one run of the
      engine in one direction, so every change of direction counts: a <strong>PULL = 2</strong> (back in, pull
      out) and a <strong>SPOT = 2</strong> (shove in, pull out) — <em>except the spot that finishes the job is 1</em>,
      because the engine just leaves the cars and is done (no pull-out). A <strong>KICK = 1</strong> (one shove,
      the cars coast in by themselves). So <em>pull, pull, spot</em> = 5 moves, and kicking saves the pull-out.
      <strong>Joints</strong> (couplings) is a second, "also good" stat: lower is cleaner. To reach a
      track, line <em>its</em> switch reverse and the ones below it normal, or the engineer refuses
      (<strong>CROR 104</strong>).</p>
      <p><strong>Securing &amp; kicking.</strong> <strong>Rule 112</strong> — any car left unattended gets a hand brake.
      A <strong>KICK</strong> (Rule 113.5) needs a <em>secured</em> cut of at least two cars as a <em>backstop</em> to
      catch the rolling car — and a tank, autorack or centrebeam is never kicked. After coupling, the engineer
      <em>stretches</em> the joint to confirm the knuckles are locked before moving (<strong>Rule 113.2</strong>).</p>
    </details>
  </div>
`;

export function createView(root: HTMLElement): YardView {
  root.innerHTML = YARD_HTML;

  const el = (id: string): HTMLElement | null => root.querySelector<HTMLElement>('#' + id);
  // The same lookup with a type and with no test. If the element is not there, the result is
  // null and the caller stops with a TypeError at its first write.
  const at = <T extends HTMLElement = HTMLElement>(id: string): T => root.querySelector('#' + id) as T;

  const drawHost = root.querySelector('.yd-yardframe') as HTMLElement;
  // The picker element is kept between calls, as it was before the split.
  const picker = at<HTMLSelectElement>('picker');
  // The title of "Watch optimal", for the time when it does not play.
  const watchTitle = at('optimal').title;

  // The question dialog. One answer at a time: `pending` holds the function of the open question.
  let pending: ((yes: boolean) => void) | null = null;
  let back: HTMLElement | null = null;
  const dialog = at<HTMLDialogElement>('yard-ask');
  const settle = (yes: boolean): void => {
    const fn = pending;
    pending = null;
    if (dialog.open) dialog.close();
    if (back && back.isConnected) back.focus();
    back = null;
    if (fn) fn(yes);
  };
  at('yard-ask-yes').addEventListener('click', () => settle(true));
  at('yard-ask-no').addEventListener('click', () => settle(false));
  dialog.addEventListener('close', () => { if (pending) settle(false); });   // Escape

  return {
    el,
    drawHost,

    setReadout({ moves, par, joints }) {
      const text = `Moves ${moves} / par ${par} · Joints ${joints}`;
      at('readout').textContent = text;
      return text;
    },

    setBanner(text, tone) {
      const msg = at('msg');
      msg.textContent = text || '';
      msg.className = `yd-banner cb-banner${tone ? ` yd-${tone} cb-banner--${tone}` : ''}`;
    },

    setRefusal(text, onLookup) {
      const msg = at('msg');
      msg.className = 'yd-banner yd-bad cb-banner cb-banner--bad';
      msg.textContent = text || '';
      if (onLookup) {
        const b = document.createElement('button');
        b.className = 'yd-lookup cb-btn--plain'; b.textContent = 'Look it up →';
        b.addEventListener('click', onLookup);
        msg.appendChild(b);
      }
    },

    renderRules(list) {
      const box = at('rules'); box.innerHTML = '';
      for (const r of list) {
        // A rule tile takes the tone of its kind: blue for CROR, amber for a special instruction.
        // A kind with no tone gets no tone class.
        const tone = r.kind === 'cror' ? ' dusk-tile--blue' : r.kind === 'si' ? ' dusk-tile--amber' : '';
        const chip = document.createElement('div');
        chip.className = `yd-chip yd-${r.kind} dusk-tile${tone}`;
        chip.innerHTML = `<div class="dusk-tile-cap"><b class="dusk-tile-lab dusk-num">${r.cite}</b></div>`
          + `<div class="dusk-tile-body"><span class="dusk-tile-sub">${r.label}</span></div>`;
        box.appendChild(chip);
      }
    },

    // Each line is a native button (U-09, A11Y-02): Tab reaches it, Enter or Space flags it, and
    // aria-pressed gives its state. The glyph shows the state and is hidden from a screen reader.
    renderSwitchList(data, { onFlag, onCertify }) {
      const rows = data.lines.map((e, i) =>
        `<button type="button" class="yd-ord-row dusk-row dusk-row--amber${e.flagged ? ' dusk-row--on yd-flagged' : ''}" data-i="${i}" aria-pressed="${e.flagged}">`
        + `<span class="yd-ord-flag dusk-ico" aria-hidden="true">${e.flagged ? '⚑' : '▢'}</span>`
        + `<span class="yd-ord-line"><span class="yd-ord-mark">${e.mark}</span><span class="yd-ord-arrow">→</span><span class="yd-ord-trk">${e.track}</span></span>`
        + `</button>`).join('');
      at('workorder').innerHTML =
        `<div class="yd-wo-top dusk-panel-head"><span class="yd-wo-tag yd-si dusk-panel-name">SWITCH LIST</span> <span class="yd-wo-id dusk-count">${data.id.toUpperCase()}</span> <span class="yd-wo-sub dusk-panel-sub">· the list can be wrong</span></div>`
        + `<div class="yd-wo-body dusk-panel-body">`
        + `<div class="yd-wo-job cb-prose">Build <b class="dusk-num">${data.goalTrack}</b> from these cars. Check each line against the yard — tap any that <b class="dusk-num">don't match</b>, then certify.</div>`
        + `<div class="yd-ord-list">${rows}</div>`
        + `<button class="yd-go dusk-btn" id="certify">Certify order ▸</button>`
        + `<div class="yd-wo-meta cb-sub"><span class="yd-wo-tip">${data.hint}</span></div>`
        + `</div>`;
      at('workorder').querySelectorAll<HTMLElement>('.yd-ord-row').forEach((row) => row.addEventListener('click', () => {
        onFlag(+(row.dataset.i as string));
      }));
      at('certify').addEventListener('click', onCertify);
    },

    setLineFlag(index, flagged) {
      const row = at('workorder').querySelector(`.yd-ord-row[data-i="${index}"]`) as HTMLElement;
      row.classList.toggle('dusk-row--on', flagged);
      row.classList.toggle('yd-flagged', flagged);
      row.setAttribute('aria-pressed', String(flagged));
      (row.querySelector('.yd-ord-flag') as HTMLElement).textContent = flagged ? '⚑' : '▢';
    },

    renderVerifiedOrder(data) {
      const lines = data.lines
        .map((e) => `<b class="dusk-num">${e.mark}</b> → ${e.track}${e.corrected ? ' <span class="yd-ord-fix">(list was wrong)</span>' : ''}`)
        .join(' · ');
      at('workorder').innerHTML =
        `<div class="yd-wo-top dusk-panel-head"><span class="yd-wo-tag dusk-panel-name">WORK ORDER ✓</span> <span class="yd-wo-id dusk-count">${data.goalTrack}</span> <span class="yd-wo-sub dusk-panel-sub">· verified</span></div>`
        + `<div class="yd-wo-body dusk-panel-body">`
        + `<div class="yd-wo-job cb-prose">Build <b class="dusk-num">${data.goalTrack}</b>: ${lines}.</div>`
        + `<div class="yd-wo-meta cb-sub">Target <b>${data.par} move${data.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.</div>`
        + `</div>`;
    },

    renderWorkOrder(data) {
      const nums = data.cars.map((c) => c.split(' ').pop());
      const head = `<div class="yd-wo-top dusk-panel-head"><span class="yd-wo-tag dusk-panel-name">WORK ORDER</span> <span class="yd-wo-id dusk-count">${data.id.toUpperCase()}</span> <span class="yd-wo-sub dusk-panel-sub">· ${data.title}</span></div>`;
      const meta = `<div class="yd-wo-meta cb-sub">Target <b>${data.par} move${data.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.<span class="yd-wo-tip">${data.hint}</span></div>`;
      const job = data.depart
        ? `<div class="yd-wo-job cb-prose">Build the outbound${data.ordered ? ' in order' : ''} — gather <b class="dusk-num">${nums.join(' · ')}</b> onto your train${data.from.length ? ` <span class="yd-wo-from">(set out on ${data.from.join(', ')})</span>` : ''}, then <b class="dusk-num">Depart ▸</b>.</div>`
        : `<div class="yd-wo-job cb-prose">Build <b class="dusk-num">${data.goalTrack}</b> — gather <b class="dusk-num">${nums.join(' · ')}</b> onto it${data.from.length ? ` <span class="yd-wo-from">(now on ${data.from.join(', ')})</span>` : ''}.</div>`;
      at('workorder').innerHTML = head + `<div class="yd-wo-body dusk-panel-body">` + job + meta + `</div>`;
    },

    setCount({ max, value, disabled }) {
      const cnt = at<HTMLSelectElement>('count');
      cnt.disabled = disabled;
      cnt.innerHTML = '';
      for (let k = 1; k <= max; k++) {
        const o = document.createElement('option'); o.value = String(k); o.textContent = String(k); cnt.appendChild(o);
      }
      cnt.value = String(value);
    },

    setTracks(ids) {
      const trackSel = at('track');
      ids.forEach((id) => { const o = document.createElement('option'); o.value = id; o.textContent = id; trackSel.appendChild(o); });
    },

    renderPicker(groups, keep) {
      picker.innerHTML = '';
      for (const t of groups) {
        const g = document.createElement('optgroup');
        g.label = t.label;
        for (const p of t.options) {
          const mark = p.state === 'done' ? '✓ ' : (p.state === 'next' ? '→ ' : '');
          const yours = p.best ? ` · your best ${p.best.moves}m` : '';
          const o = document.createElement('option');
          o.value = String(p.value);
          o.textContent = `${mark}${p.title} · par ${p.par}${yours}`;
          g.appendChild(o);
        }
        picker.appendChild(g);
      }
      if (keep !== '') picker.value = keep;
    },

    setWatching(on) {
      const b = at<HTMLButtonElement>('optimal');
      b.textContent = on ? 'Stop watching' : '▶ Watch optimal';
      if (on) b.removeAttribute('title'); else b.title = watchTitle;
    },

    ask(question, answer) {
      if (pending) settle(false);
      at('yard-ask-q').textContent = question;
      pending = answer;
      back = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      at('yard-ask-no').focus();
    },

    closeAsk() {
      if (pending || dialog.open) settle(false);
    },

    setDepart({ shown, enabled }) {
      const dep = at<HTMLButtonElement>('depart');
      dep.style.display = shown ? '' : 'none';
      dep.disabled = !enabled;
    },

    // The sound button says its state in words (U-20). The glyph is decoration (U-41).
    setMuted(muted) {
      at('mute').innerHTML = `<span aria-hidden="true">${muted ? '🔇' : '🔊'}</span> Sound ${muted ? 'off' : 'on'}`;
    },

    onGo(fn) {
      root.querySelectorAll<HTMLElement>('[data-go]').forEach((b) => b.addEventListener('click', () => fn(b.dataset.go)));
    },
  };
}
