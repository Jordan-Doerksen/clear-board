// view.ts — the view of the Yard. It holds each markup string, each class name and each DOM write
// of the Yard chrome. It holds no game state and it imports no engine module. The controller
// (../yardSim.js) sends plain data, and this file builds the words and the elements from it.
//
// A view function finds its element at the time of each call, and it does not test for a missing
// element. When a learner leaves the Yard, the host is emptied. A move that still runs then stops
// at its next view call with a TypeError, as it did before the split. A test for a missing
// element would let that move run on. Do not add one.

/** The tone of the banner. It is also the name of the class that the view adds. */
export type BannerTone = '' | 'ok' | 'bad' | 'win';

/** The three numbers of the readout. */
export interface ReadoutData { moves: number; par: number; joints: number }

/** One rule chip. `kind` is `cror` or `si`: it comes from the puzzle data. */
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
  setReadout(data: ReadoutData): void;
  setBanner(text: string | null | undefined, tone: BannerTone): void;
  /** A refusal. With `onLookup`, the banner gets the control "Look it up". */
  setRefusal(text: string | null | undefined, onLookup: (() => void) | null): void;
  renderRules(list: RuleChip[]): void;
  renderSwitchList(data: SwitchListData, handlers: SwitchListHandlers): void;
  renderVerifiedOrder(data: VerifiedOrderData): void;
  renderWorkOrder(data: WorkOrderData): void;
  setCount(data: CountData): void;
  setTracks(ids: readonly string[]): void;
  /** `keep` is the value that the picker has before the call. An empty string selects nothing. */
  renderPicker(groups: PickerGroup[], keep: string): void;
  setDepart(data: DepartData): void;
  setMuted(muted: boolean): void;
  /** `fn` gets the `data-go` value of the back button when the learner presses it. */
  onGo(fn: (route: string | undefined) => void): void;
}

// The body of the Yard page. The app has its own header, so this markup starts with a back button.
const YARD_HTML = `
  <div class="yard-wrap">
    <button class="back" data-go="">← Home</button>

    <div class="bar">
      <select id="picker" title="Pick a job"></select>
      <span class="spacer"></span>
      <div class="readout" id="readout">Moves 0 / par 0 · Joints 0</div>
    </div>

    <div class="workorder" id="workorder"></div>

    <div class="yardframe" data-cb="yard-drawing"></div>

    <div class="bar">
      <select id="act" title="Action">
        <option value="pull">PULL</option>
        <option value="spot">SPOT</option>
        <option value="kick">KICK</option>
        <option value="secure">SECURE</option>
      </select>
      <select id="count" title="How many cars"></select>
      <span style="color:var(--dim)">cars</span>
      <select id="track" title="Which track"></select>
      <button class="go" id="work">Work it ▸</button>
      <button id="optimal" title="Auto-line and play the fewest-moves line in slow motion">▶ Watch optimal</button>
      <button id="depart" title="Depart the assembled outbound out the lead" style="display:none">Depart ▸</button>
      <span class="spacer"></span>
      <button id="reset">Reset</button>
      <button id="mute" title="Sound">🔊</button>
    </div>

    <div class="banner" id="msg"></div>

    <div class="legend">
      Rules in play —
      <span class="k">CROR</span> = the national rulebook (applies everywhere) ·
      <span class="s">S.I.</span> = a <em>special instruction</em>, specific to <em>this</em> yard — <strong>you must know your yard's.</strong>
    </div>
    <div class="rules" id="rules"></div>

    <div style="margin:10px 0 4px; padding:10px 13px; border-left:3px solid var(--si); background:var(--sibg); border-radius:6px; font-size:13px;">
      <strong style="color:var(--si)">What this trainer builds</strong> — the instinct to <strong>think several moves ahead</strong> and learn the <strong>switching routine</strong>: read the yard, line the road, call clean moves, win in the fewest. <span style="color:var(--dim)">The next level — out on the ground — is minimizing the actual distance you run and using the lead as working room. That's real-yard efficiency that comes with seat time, beyond what this tool scores.</span>
    </div>

    <details>
      <summary>How to play & why these rules</summary>
      <p><strong>You are the conductor, not the engineer.</strong> Click a switch target to line it
      (<span style="color:var(--si)">yellow</span> = lined into the track / diverging,
      <span style="color:var(--good)">green</span> = normal, straight up the ladder). Then call a move:</p>
      <ul>
        <li><strong>PULL n from a track</strong> — back in, couple the near (throat) cut, pull <code>n</code> cars onto the lead.</li>
        <li><strong>SPOT n to a track</strong> — shove <code>n</code> cars in and leave them.</li>
        <li><strong>KICK n to a track</strong> — shove and cut away; the cars coast in on their own with no coupling. Only where a special instruction allows it (<span style="color:var(--si)">⚡</span>), only onto a secured 2+ car cut, and only car types that can be kicked.</li>
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

  const drawHost = root.querySelector('.yardframe') as HTMLElement;
  // The picker element is kept between calls, as it was before the split.
  const picker = at<HTMLSelectElement>('picker');

  return {
    el,
    drawHost,

    setReadout({ moves, par, joints }) {
      at('readout').textContent = `Moves ${moves} / par ${par} · Joints ${joints}`;
    },

    setBanner(text, tone) {
      const msg = at('msg');
      msg.textContent = text || '';
      msg.className = `banner ${tone || ''}`;
    },

    setRefusal(text, onLookup) {
      const msg = at('msg');
      msg.className = 'banner bad';
      msg.textContent = text || '';
      if (onLookup) {
        const b = document.createElement('button');
        b.className = 'lookup'; b.textContent = 'Look it up →';
        b.addEventListener('click', onLookup);
        msg.appendChild(b);
      }
    },

    renderRules(list) {
      const box = at('rules'); box.innerHTML = '';
      for (const r of list) {
        const chip = document.createElement('div');
        chip.className = `chip ${r.kind}`;
        chip.innerHTML = `<b>${r.cite}</b><span>${r.label}</span>`;
        box.appendChild(chip);
      }
    },

    renderSwitchList(data, { onFlag, onCertify }) {
      const rows = data.lines.map((e, i) =>
        `<div class="ord-row${e.flagged ? ' flagged' : ''}" data-i="${i}">`
        + `<span class="ord-flag">${e.flagged ? '⚑' : '▢'}</span>`
        + `<span class="ord-mark">${e.mark}</span><span class="ord-arrow">→</span><span class="ord-trk">${e.track}</span>`
        + `</div>`).join('');
      at('workorder').innerHTML =
        `<div class="wo-top"><span class="wo-tag si">SWITCH LIST</span> <span class="wo-id">${data.id.toUpperCase()}</span> · the list can be wrong</div>`
        + `<div class="wo-job">Build <b>${data.goalTrack}</b> from these cars. Check each line against the yard — tap any that <b>don't match</b>, then certify.</div>`
        + `<div class="ord-list">${rows}</div>`
        + `<button class="go" id="certify">Certify order ▸</button>`
        + `<div class="wo-meta"><span class="wo-tip">${data.hint}</span></div>`;
      at('workorder').querySelectorAll<HTMLElement>('.ord-row').forEach((row) => row.addEventListener('click', () => {
        onFlag(+(row.dataset.i as string));
      }));
      at('certify').addEventListener('click', onCertify);
    },

    renderVerifiedOrder(data) {
      const lines = data.lines
        .map((e) => `<b>${e.mark}</b> → ${e.track}${e.corrected ? ' <span class="ord-fix">(list was wrong)</span>' : ''}`)
        .join(' · ');
      at('workorder').innerHTML =
        `<div class="wo-top"><span class="wo-tag">WORK ORDER ✓</span> <span class="wo-id">${data.goalTrack}</span> · verified</div>`
        + `<div class="wo-job">Build <b>${data.goalTrack}</b>: ${lines}.</div>`
        + `<div class="wo-meta">Target <b>${data.par} move${data.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.</div>`;
    },

    renderWorkOrder(data) {
      const nums = data.cars.map((c) => c.split(' ').pop());
      const head = `<div class="wo-top"><span class="wo-tag">WORK ORDER</span> <span class="wo-id">${data.id.toUpperCase()}</span> · ${data.title}</div>`;
      const meta = `<div class="wo-meta">Target <b>${data.par} move${data.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.<span class="wo-tip">${data.hint}</span></div>`;
      const job = data.depart
        ? `<div class="wo-job">Build the outbound${data.ordered ? ' in order' : ''} — gather <b>${nums.join(' · ')}</b> onto your train${data.from.length ? ` <span class="wo-from">(set out on ${data.from.join(', ')})</span>` : ''}, then <b>Depart ▸</b>.</div>`
        : `<div class="wo-job">Build <b>${data.goalTrack}</b> — gather <b>${nums.join(' · ')}</b> onto it${data.from.length ? ` <span class="wo-from">(now on ${data.from.join(', ')})</span>` : ''}.</div>`;
      at('workorder').innerHTML = head + job + meta;
    },

    setCount({ max, value, disabled }) {
      const cnt = at<HTMLSelectElement>('count');
      cnt.disabled = disabled;
      cnt.style.opacity = disabled ? '.45' : '';
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

    setDepart({ shown, enabled }) {
      const dep = at<HTMLButtonElement>('depart');
      dep.style.display = shown ? '' : 'none';
      dep.disabled = !enabled;
    },

    setMuted(muted) {
      at('mute').textContent = muted ? '🔇' : '🔊';
    },

    onGo(fn) {
      root.querySelectorAll<HTMLElement>('[data-go]').forEach((b) => b.addEventListener('click', () => fn(b.dataset.go)));
    },
  };
}
