// Home — the qualification path. Mastery bars per domain + the ways to learn. (vanilla renderHome)
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { DOMAINS, drillable, dueNow, overallPercent, stageFor, STATIONS } from '../core/store';

export function Home() {
  const { content, contentFailed, profile } = useApp();
  const navigate = useNavigate();
  if (!content) return <p className="muted">Loading…</p>;

  const pct = overallPercent(profile);
  // U-27: one main control. A learner with no graded item starts; each other learner continues,
  // with the count of items due now from the stored due dates (U-26).
  const started = Object.keys(profile.items).length > 0;
  const due = dueNow(profile, content);

  return (
    <div className="cb-home-view">
      {/* U-11 and U-25: the lede promises only what the app holds, and says that this is practice. */}
      <section className="dusk-panel">
        <span className="dusk-badge">Free · tip jar only</span>
        <p className="cb-prose">Start on your first day knowing nothing. Learn the job, <b>one piece at a time</b>. Rules
          explained in plain words, each with its source — and a safe place to make every mistake until the right move
          is automatic.</p>
        <p className="cb-sub cb-home-practice">Practice, not the official test.</p>
      </section>

      <h2 className="dusk-rule"><b>Your path</b></h2>
      <div className="dusk-panel">
        <div className="cb-home-stage"><b>{stageFor(profile)}</b><span className="dusk-num">{pct}% mastered</span></div>
        <div className="dusk-bar" role="progressbar" aria-label="Overall mastery" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <i className="dusk-fill dusk-fill--teal" style={{ width: `${pct}%` }} />
        </div>
        <div className="cb-home-next">
          <button className="dusk-btn cb-home-main" onClick={() => navigate('/drill')}>{started ? 'Continue' : 'Start here'}</button>
          {started && <span className="cb-home-due">{due > 0 ? `${due} due now` : 'Nothing due now'}</span>}
        </div>
      </div>

      <h2 className="dusk-rule"><b>The job, one piece at a time</b></h2>
      <div className="dusk-grid">
        {DOMAINS.map(d => {
          const m = Math.round((profile.domains[d.id]?.mastery || 0) * 100);
          const liveCard = d.live && drillable(content.byDomain[d.id], content).length > 0;
          // U-33: the visible words of a live tile say what a press does and give the mastery as a
          // number, so the name of the button is its own words (no aria-label).
          const inner = (
            <>
              <span className="dusk-tile-cap"><h3 className="dusk-tile-lab">{d.name}</h3></span>
              <span className="dusk-tile-body">
                <p className="dusk-tile-sub">{d.desc}</p>
                {/* U-24: the radio calls are scored in the Radio station, mode "Call it yourself". */}
                {liveCard && d.id === 'radio' && <p className="dusk-tile-sub cb-home-pointer">The calls are scored in Radio walkthrough: Call it yourself.</p>}
                {liveCard
                  ? (
                    <span className="cb-home-tile-foot">
                      <span className="cb-home-tile-figure">
                        {/* TILE-BAR: the bar is hidden from a screen reader; the visible number gives
                            the value in the name of the tile one time. */}
                        <span className="dusk-bar" role="progressbar" aria-hidden="true" aria-label={`${d.name} mastery`} aria-valuenow={m} aria-valuemin={0} aria-valuemax={100}><i className="dusk-fill dusk-fill--teal" style={{ width: `${m}%` }} /></span>
                        <b className="dusk-num">{m}%</b>
                      </span>
                      <span className="cb-home-tile-act">Drill <span aria-hidden="true">→</span></span>
                    </span>
                  )
                  // A domain with no content says "Coming soon" only when each content file loaded.
                  // When a file did not load, the notice of the shell says so (U-07).
                  : contentFailed.length === 0 && <span className="dusk-tile-tag">Coming soon</span>}
              </span>
            </>
          );
          return liveCard
            ? <button key={d.id} className="dusk-tile dusk-tile--teal" data-cb="domain-card" onClick={() => navigate(`/drill/${d.id}`)}>{inner}</button>
            : <div key={d.id} className="dusk-tile dusk-tile--grey" data-cb="domain-card">{inner}</div>;
        })}
      </div>

      {/* U-35: no Exam row. The plan has no Exam station. */}
      <h2 className="dusk-rule"><b>Ways to learn</b></h2>
      <div className="dusk-rows cb-home-stations">
        {STATIONS.map(s => (
          <button key={s.go} className="dusk-row" data-cb="station" onClick={() => navigate(s.go)}><span className="dusk-ico" aria-hidden="true">{s.icon}</span><span><b>{s.name}</b><small>{s.sub}</small></span></button>
        ))}
      </div>

      <footer>
        {/* U-42: the link says that it opens a new tab, and it sends no page address. */}
        <a className="dusk-btn" href="https://ko-fi.com/jordandoerksen" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><span aria-hidden="true">☕</span> Tip jar — if it helped you get there (opens a new tab)</a>
        <p className="cb-sub dusk-measure">An independent study tool. Cites the <b>Canadian Rail Operating Rules</b> (a public document)
          and flags CN operating practice (GOI) as not-a-rule. Not affiliated with CN, Transport Canada,
          or the RAC. Built for the people the book failed.</p>
      </footer>
    </div>
  );
}
