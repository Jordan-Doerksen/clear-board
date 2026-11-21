// view.ts — the view of the Yard. It holds each markup string, each class name and each DOM write
// of the Yard chrome. It holds no game state and it imports no engine module. The controller
// (../yardSim.js) sends plain data, and this file builds the words and the elements from it.
//
// A view function finds its element at the time of each call. Most view functions do not test for a
// missing element: when a learner leaves the Yard, the bridge calls unmount() of the controller
// first (2c-plan C2), and it stops each move, pause, question and sound, so no view function runs
// after the host is emptied. setCarsNow and setArrival test for their element, because only some
// jobs have it.

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
  /** The job has an inbound train: the work order holds the control "Show the arrival" (R7-P5). */
  arrival: boolean;
  /** The first job: the work order says how to line a switch and how to call a move (U-16). */
  first: boolean;
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

/**
 * The watched line (R7-P8): the calls of the optimal line, the number of steps that show, and true
 * while "Play all" plays.
 */
export interface DemoData { steps: string[]; at: number; playing: boolean }

/** What the controller does on Back, Next and "Play all" (or Stop) of the watched line. */
export interface DemoHandlers { back: () => void; next: () => void; play: () => void }

/**
 * One line of the move log (R7-P10): the call, the result of the model, the cost in words, and true
 * when the line has "Play again" (a move of the engine; a secure has none). The last line also has
 * "Before and after".
 */
export interface LogLine { call: string; msg: string; cost: string; again: boolean }

/** The two controls of a line of the move log: `k` is the number of the line, from 1. */
export type LogAction = 'again' | 'before-after';

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
   * Shows the stepper of the watched line in place of the controls of a move, and the list of its
   * steps (R7-P8). `null` hides them and shows the controls of a move again.
   */
  setDemo(data: DemoData | null): void;
  /** The handlers of Back, Next and "Play all". */
  bindDemo(handlers: DemoHandlers): void;
  /** Writes the move log. An empty list hides it. A line keeps its element, so focus stays on its control. */
  renderLog(lines: LogLine[]): void;
  /** The handler of "Play again" and "Before and after" of the move log. */
  onLog(handler: (action: LogAction, k: number) => void): void;
  /**
   * The words over the picture when it shows a past state of the move log, for example "Before move 3"
   * (R7-P10). `null` hides them: the picture shows the yard now.
   */
  setViewLabel(text: string | null): void;
  /**
   * The head bar of the picture (YARD-HEAD, ROUTE-WORDS): the route words of the state that the
   * picture shows, and BUILD with the goal track and its count, for a job with a goal track.
   */
  setYardHead(data: { route: string; goal: { track: string; have: number; want: number } | null }): void;
  /**
   * The tracks where the cars of the job stand now, off the goal track (lead ruling FROM-NOW). The
   * work order says "(now on ...)" and the words stay true after each move; an empty list hides them.
   */
  setCarsNow(tracks: string[]): void;
  /** Shows or hides the control "Show the arrival" of the work order (R7-P5). */
  setArrival(shown: boolean): void;
  /** The handler of the control "Show the arrival". */
  onArrival(handler: () => void): void;
  /**
   * Asks a question in a modal dialog with the answers Yes and No (U-12). No has the focus first.
   * `answer` gets true for Yes, and false for No, Escape or a close. Focus goes back to the control
   * that had it before the question.
   */
  ask(question: string, answer: (yes: boolean) => void): void;
  /** Closes the question with the answer No, if it is open. */
  closeAsk(): void;
  setMuted(muted: boolean): void;
}

// The body of the Yard page. The station wrapper (../Yard.tsx) draws "← Home" and the heading above
// the host, so this markup starts with the strip.
const YARD_HTML = `
  <div class="yard-wrap">
    <div class="yd-bar yd-strip dusk-strip">
      <div class="yd-field yd-field--job"><label class="yd-label" for="picker">Pick a job</label><select class="cb-select" id="picker" aria-describedby="yard-pickkey"></select><span class="yd-pickkey cb-sub" id="yard-pickkey">✓ job done · → your next job</span></div>
      <span class="dusk-spacer"></span>
      <div class="dusk-cell"><b class="yd-readout" id="readout">Moves 0 / par 0 · Couplings 0</b></div>
    </div>

    <div class="yd-workorder dusk-panel dusk-panel--framed" id="workorder"></div>

    <div class="yd-yardframe dusk-panel dusk-panel--framed" data-cb="yard-drawing">
      <div class="yd-yardhead dusk-panel-head" id="yard-head"><span class="dusk-panel-name yd-route" id="yard-route"></span><span class="yd-viewlabel dusk-state dusk-state--info" id="yard-view-label" hidden></span><span class="dusk-spacer"></span><span class="yd-headgoal" id="yard-goal" hidden><span class="yd-headgoal-word" id="yard-goal-word"></span> <span class="dusk-count yd-headgoal-count" id="yard-goal-count"></span></span></div>
    </div>

    <ul class="yd-mirror dusk-sr" id="yard-mirror" role="list"></ul>

    <div class="yd-bar yd-builder dusk-panel">
      <div class="yd-field yd-move-part"><label class="yd-label" for="act">Action</label><select class="cb-select" id="act">
        <option value="pull">PULL</option>
        <option value="spot">SPOT</option>
        <option value="kick">KICK</option>
        <option value="secure">SECURE</option>
      </select></div>
      <select class="cb-select yd-move-part" id="count" title="How many cars"></select>
      <label class="yd-unit cb-sub yd-move-part" for="count">cars</label>
      <div class="yd-field yd-move-part"><label class="yd-label" for="track">Which track</label><select class="cb-select" id="track"></select></div>
      <button class="yd-go dusk-btn yd-move-part" id="work">Work it ▸</button>
      <button class="yd-go dusk-btn" id="optimal" title="Auto-line and show the fewest-moves line, one step at a time">▶ Watch optimal</button>
      <button type="button" class="yd-go dusk-btn yd-demo-part" id="yard-back" hidden><span aria-hidden="true">◂</span> Back</button>
      <button type="button" class="yd-go dusk-btn yd-demo-part" id="yard-next" hidden>Next <span aria-hidden="true">▸</span></button>
      <button type="button" class="yd-go dusk-btn yd-demo-part" id="yard-play" hidden></button>
      <button class="yd-go dusk-btn yd-move-part" id="depart" title="Depart the assembled outbound out the lead" style="display:none">Depart ▸</button>
      <span class="dusk-spacer"></span>
      <button class="cb-btn--plain" id="reset">Reset</button>
      <button class="cb-btn--plain" id="mute"><span aria-hidden="true">🔊</span> Sound on</button>
    </div>

    <div class="yd-banner cb-banner" id="msg"></div>
    <div class="yd-live dusk-sr" id="yard-live" role="status" aria-live="polite"></div>

    <div class="yd-demo dusk-panel dusk-panel--framed" id="yard-demo" hidden>
      <div class="dusk-panel-head"><h3 class="dusk-panel-name yd-demo-name">The optimal line</h3><span class="dusk-panel-sub yd-demo-sub">a demonstration, not your run · it gets no done mark</span><span class="dusk-spacer"></span><span class="dusk-count yd-demo-count" id="yard-demo-count"></span></div>
      <ol class="yd-demo-list dusk-panel-body" id="yard-demo-list"></ol>
    </div>

    <div class="yd-log dusk-panel dusk-panel--framed" id="yard-log" hidden>
      <div class="dusk-panel-head"><h3 class="dusk-panel-name yd-log-name">Your moves on this job</h3><span class="dusk-spacer"></span><span class="dusk-count yd-log-count" id="yard-log-count"></span></div>
      <ol class="yd-log-list dusk-panel-body" id="yard-log-list"></ol>
    </div>

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
      <strong>Couplings</strong> are a second, "also good" stat: lower is cleaner. To reach a
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

  // The controls of the move log: one listener of the list calls the handler with the action and the
  // number of the line.
  let logHandler: ((action: LogAction, k: number) => void) | null = null;
  at('yard-log-list').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('button[data-log]');
    if (b && logHandler) logHandler(b.dataset.log as LogAction, +(b.dataset.k as string));
  });

  // The control "Show the arrival" is made again with the work order, so one listener of the work
  // order calls the handler.
  let arrivalHandler: (() => void) | null = null;
  at('workorder').addEventListener('click', (e) => {
    if (arrivalHandler && (e.target as HTMLElement).closest('#yard-arrival')) arrivalHandler();
  });

  // A track id in a job line is a mark: bold, in the mono face (TRACK-MONO).
  const mark = (track: string): string => `<b class="dusk-num">${track}</b>`;
  // Writes the work order. When focus was inside it, focus stays inside it (CERTIFY-FOCUS): the job
  // line takes the focus, so that focus does not fall to the page body when its control goes.
  function order(html: string): void {
    const box = at('workorder');
    const had = box.contains(document.activeElement);
    box.innerHTML = html;
    if (!had) return;
    const line = box.querySelector<HTMLElement>('.yd-wo-job');
    if (line) { line.tabIndex = -1; line.focus(); }
  }

  return {
    el,
    drawHost,

    // One name for one thing (U-23, U-40, 2c-plan C6): the readout says "Couplings", as the banner of
    // the model does.
    setReadout({ moves, par, joints }) {
      const text = `Moves ${moves} / par ${par} · Couplings ${joints}`;
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
      order(
        `<div class="yd-wo-top dusk-panel-head"><span class="yd-wo-tag yd-si dusk-panel-name">SWITCH LIST</span> <span class="yd-wo-id dusk-count">${data.id.toUpperCase()}</span> <span class="yd-wo-sub dusk-panel-sub">· the list can be wrong</span></div>`
        + `<div class="yd-wo-body dusk-panel-body">`
        + `<div class="yd-wo-job cb-prose">Build ${mark(data.goalTrack)} from these cars. Check each line against the yard — tap any that <b>don't match</b>, then certify.</div>`
        + `<div class="yd-ord-list">${rows}</div>`
        + `<button class="yd-go dusk-btn" id="certify">Certify order ▸</button>`
        + `<div class="yd-wo-meta cb-sub"><span class="yd-wo-tip">${data.hint}</span></div>`
        + `</div>`);
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

    // The job line (Y-FIX, TRACK-MONO): a car mark, a car number and a track id are marks, and only a
    // mark takes the mono face (dusk-num). A word stays in the face of the line.
    renderVerifiedOrder(data) {
      const lines = data.lines
        .map((e) => `<b class="dusk-num">${e.mark}</b> → <span class="dusk-num">${e.track}</span>${e.corrected ? ' <span class="yd-ord-fix">(list was wrong)</span>' : ''}`)
        .join(' · ');
      order(
        `<div class="yd-wo-top dusk-panel-head"><span class="yd-wo-tag dusk-panel-name">WORK ORDER ✓</span> <span class="yd-wo-id dusk-count">${data.goalTrack}</span> <span class="yd-wo-sub dusk-panel-sub">· verified</span></div>`
        + `<div class="yd-wo-body dusk-panel-body">`
        + `<div class="yd-wo-job cb-prose">Build ${mark(data.goalTrack)}: ${lines}.</div>`
        + `<div class="yd-wo-meta cb-sub">Target <b>${data.par} move${data.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.</div>`
        + `</div>`);
    },

    renderWorkOrder(data) {
      const nums = data.cars.map((c) => c.split(' ').pop());
      const head = `<div class="yd-wo-top dusk-panel-head"><span class="yd-wo-tag dusk-panel-name">WORK ORDER</span> <span class="yd-wo-id dusk-count">${data.id.toUpperCase()}</span> <span class="yd-wo-sub dusk-panel-sub">· ${data.title}</span></div>`;
      const meta = `<div class="yd-wo-meta cb-sub">Target <b>${data.par} move${data.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.<span class="yd-wo-tip">${data.hint}</span></div>`;
      const from = data.from.map((t) => `<span class="dusk-num">${t}</span>`).join(', ');
      const job = data.depart
        ? `<div class="yd-wo-job cb-prose">Build the outbound${data.ordered ? ' in order' : ''} — gather <b class="dusk-num">${nums.join(' · ')}</b> onto your train${data.from.length ? ` <span class="yd-wo-from">(set out on ${from})</span>` : ''}, then <b>Depart ▸</b>.</div>`
        : `<div class="yd-wo-job cb-prose">Build ${mark(data.goalTrack as string)} — gather <b class="dusk-num">${nums.join(' · ')}</b> onto it<span class="yd-wo-from" data-now${data.from.length ? '' : ' hidden'}> (now on ${from})</span>.</div>`;
      const arrival = data.arrival
        ? `<button type="button" class="yd-go dusk-btn yd-arrival" id="yard-arrival"><span aria-hidden="true">▶</span> Show the arrival</button>`
        : '';
      // U-16: the first job says, in view, how to line a switch and how to call a move. The words name
      // the controls; the refusal of the model keeps its words.
      const how = data.first
        ? `<p class="yd-wo-how cb-prose">To line a switch, press its box on the picture: the word at the switch changes from NORMAL to REVERSE. To call a move, choose the action, the number of cars and the track under the picture, then press <b class="yd-wo-how-go">Work it ▸</b>.</p>`
        : '';
      order(head + `<div class="yd-wo-body dusk-panel-body">` + job + how + meta + arrival + `</div>`);
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
          const yours = p.best ? ` · your best ${p.best.moves} move${p.best.moves === 1 ? '' : 's'}` : '';
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

    // The stepper sits in the place of the controls of a move: a move is not called during the
    // demonstration. Back, Next and "Play all" keep focus when they cannot act: they take
    // aria-disabled, not disabled, so that focus does not fall to the page body at the first or the
    // last step. The list is made one time for each line and then changes in place.
    setDemo(data) {
      const on = !!data;
      root.querySelectorAll<HTMLElement>('.yd-move-part').forEach((e) => { e.hidden = on; });
      root.querySelectorAll<HTMLElement>('.yd-demo-part').forEach((e) => { e.hidden = !on; });
      at('yard-demo').hidden = !on;
      this.setWatching(on);
      if (!data) { at('yard-demo-list').replaceChildren(); return; }
      const n = data.steps.length;
      const list = at('yard-demo-list');
      if (list.childElementCount !== n || list.dataset.line !== data.steps.join('|')) {
        list.dataset.line = data.steps.join('|');
        list.innerHTML = data.steps.map((call, k) =>
          `<li class="yd-demo-step"><span class="yd-demo-n dusk-num">${k + 1}</span><span class="yd-demo-mark" aria-hidden="true"></span><span class="yd-demo-call dusk-num">${call}</span></li>`).join('');
      }
      list.querySelectorAll<HTMLElement>('.yd-demo-step').forEach((li, k) => {
        const state = k < data.at ? 'done' : k === data.at ? 'next' : '';
        if (li.dataset.state !== state) li.dataset.state = state;
        (li.querySelector('.yd-demo-mark') as HTMLElement).textContent = k < data.at ? '✓' : k === data.at ? '▸' : '';
        if (k === data.at - 1) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      at('yard-demo-count').textContent = `${data.at} / ${n}`;
      const dis = (id: string, off: boolean): void => { at(id).setAttribute('aria-disabled', String(off)); };
      dis('yard-back', data.at === 0 || data.playing);
      dis('yard-next', data.at >= n);
      dis('yard-play', data.at >= n && !data.playing);
      at('yard-play').innerHTML = data.playing
        ? '<span aria-hidden="true">■</span> Stop'
        : '<span aria-hidden="true">▶</span> Play all';
    },

    renderLog(lines) {
      at('yard-log').hidden = lines.length === 0;
      at('yard-log-count').textContent = String(lines.length);
      const list = at('yard-log-list');
      while (list.childElementCount > lines.length) (list.lastElementChild as Element).remove();
      lines.forEach((ln, i) => {
        const k = i + 1, last = k === lines.length;
        let li = list.children[i] as HTMLElement | undefined;
        if (!li) {
          li = document.createElement('li');
          li.className = 'yd-log-line';
          li.innerHTML = `<span class="yd-log-n dusk-num">${k}</span>`
            + `<span class="yd-log-text"><b class="yd-log-call dusk-num"></b> <span class="yd-log-msg"></span> <span class="yd-log-cost"></span></span>`
            + `<span class="yd-log-ctl"></span>`;
          list.appendChild(li);
        }
        const put = (sel: string, text: string): void => { const e = li!.querySelector(sel) as HTMLElement; if (e.textContent !== text) e.textContent = text; };
        put('.yd-log-call', ln.call); put('.yd-log-msg', ln.msg); put('.yd-log-cost', ln.cost);
        const ctl = li.querySelector('.yd-log-ctl') as HTMLElement;
        const want = [ln.again ? 'again' : '', last ? 'before-after' : ''].filter(Boolean);
        const have = [...ctl.querySelectorAll<HTMLElement>('button')].map((b) => b.dataset.log);
        if (want.join() !== have.join()) {
          // A control that goes while it has the focus gives the focus to its line.
          if (ctl.contains(document.activeElement)) { li.tabIndex = -1; li.focus(); }
          ctl.innerHTML = want.map((a) => a === 'again'
            ? `<button type="button" class="cb-btn--plain yd-log-btn" data-log="again" data-k="${k}" aria-label="Play again, move ${k}">Play again</button>`
            : `<button type="button" class="cb-btn--plain yd-log-btn" data-log="before-after" data-k="${k}" aria-label="Before and after, move ${k}">Before and after</button>`).join('');
        }
      });
    },

    onLog(handler) { logHandler = handler; },

    setViewLabel(text) {
      const label = at('yard-view-label');
      label.hidden = !text;
      if (label.textContent !== (text || '')) label.textContent = text || '';
    },

    setCarsNow(tracks) {
      const now = root.querySelector<HTMLElement>('.yd-wo-from[data-now]');
      if (!now) return;
      // With no car of the job off the goal track, the words go: the span is hidden and empty.
      const html = tracks.length ? ` (now on ${tracks.map((t) => `<span class="dusk-num">${t}</span>`).join(', ')})` : '';
      now.hidden = tracks.length === 0;
      if (now.innerHTML !== html) now.innerHTML = html;
    },

    setYardHead({ route, goal }) {
      const put = (id: string, text: string): void => { const e = at(id); if (e.textContent !== text) e.textContent = text; };
      put('yard-route', `Route: ${route}`);
      at('yard-goal').hidden = !goal;
      if (goal) { put('yard-goal-word', `BUILD ${goal.track}`); put('yard-goal-count', `${goal.have} / ${goal.want}`); }
    },

    bindDemo({ back, next, play }) {
      const on = (id: string, fn: () => void): void => {
        at(id).addEventListener('click', () => { if (at(id).getAttribute('aria-disabled') !== 'true') fn(); });
      };
      on('yard-back', back);
      on('yard-next', next);
      on('yard-play', play);
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

    setArrival(shown) {
      const b = root.querySelector<HTMLElement>('#yard-arrival');
      if (b && b.hidden === shown) b.hidden = !shown;
    },

    onArrival(handler) { arrivalHandler = handler; },

    // A Depart that stops being enabled while it has the focus gives the focus to Reset, so that the
    // focus does not fall to the page body (after the departure Reset opens the job again, R7-P14).
    setDepart({ shown, enabled }) {
      const dep = at<HTMLButtonElement>('depart');
      const had = document.activeElement === dep;
      dep.style.display = shown ? '' : 'none';
      dep.disabled = !enabled;
      if (had && !enabled) at('reset').focus();
    },

    // The sound button says its state in words (U-20). The glyph is decoration (U-41).
    setMuted(muted) {
      at('mute').innerHTML = `<span aria-hidden="true">${muted ? '🔇' : '🔊'}</span> Sound ${muted ? 'off' : 'on'}`;
    },
  };
}
