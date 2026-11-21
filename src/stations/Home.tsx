// Home — the qualification path. Mastery bars per domain + the ways to learn. (vanilla renderHome)
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { DOMAINS, drillable, stageFor } from '../core/store';

const STATIONS = [
  { go: '/reference', icon: '📖', name: 'Reference', sub: 'Look anything up — cited' },
  { go: '/drill', icon: '🎯', name: 'Drill', sub: 'Adaptive practice' },
  { go: '/yard', icon: '🚂', name: 'The Yard', sub: 'Work the cuts' },
  { go: '/signals', icon: '🚦', name: 'Signals', sub: 'Read the aspect' },
  { go: '/radio', icon: '📻', name: 'Radio walkthrough', sub: 'Back to a joint' },
];

export function Home() {
  const { content, profile } = useApp();
  const navigate = useNavigate();
  if (!content) return <p className="muted">Loading…</p>;

  const live = DOMAINS.filter(d => d.live);
  const pct = Math.round(live.reduce((s, d) => s + (profile.domains[d.id]?.mastery || 0), 0) / Math.max(1, live.length) * 100);

  return (
    <div className="cb-home-view">
      <section className="dusk-panel">
        <span className="dusk-badge">Free · tip jar only</span>
        <p className="cb-prose">Start on your first day knowing nothing. Get <b>job-ready, one piece at a time</b>. Every rule
          explained in plain words first, the real CROR text one tap deeper — and a safe place to make every
          mistake until the right move is automatic.</p>
      </section>

      <h2 className="dusk-rule"><b>Your path</b></h2>
      <div className="dusk-panel">
        <div className="cb-home-stage"><b>{stageFor(profile)}</b><span className="dusk-num">{pct}% mastered</span></div>
        <div className="dusk-bar" role="progressbar" aria-label="Overall mastery" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <i className="dusk-fill dusk-fill--teal" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h2 className="dusk-rule"><b>The job, one piece at a time</b></h2>
      <div className="dusk-grid">
        {DOMAINS.map(d => {
          const m = Math.round((profile.domains[d.id]?.mastery || 0) * 100);
          const liveCard = d.live && drillable(content.byDomain[d.id], content).length > 0;
          const inner = (
            <>
              <span className="dusk-tile-cap"><h3 className="dusk-tile-lab">{d.name}</h3></span>
              <span className="dusk-tile-body">
                <p className="dusk-tile-sub">{d.desc}</p>
                {liveCard
                  ? <div className="dusk-bar" role="progressbar" aria-label={`${d.name} mastery`} aria-valuenow={m} aria-valuemin={0} aria-valuemax={100}><i className="dusk-fill dusk-fill--teal" style={{ width: `${m}%` }} /></div>
                  : <span className="dusk-tile-tag">Coming soon</span>}
              </span>
            </>
          );
          return liveCard
            ? <button key={d.id} className="dusk-tile dusk-tile--teal" data-cb="domain-card" aria-label={`Drill ${d.name}`} onClick={() => navigate(`/drill/${d.id}`)}>{inner}</button>
            : <div key={d.id} className="dusk-tile dusk-tile--grey" data-cb="domain-card">{inner}</div>;
        })}
      </div>

      <h2 className="dusk-rule"><b>Ways to learn</b></h2>
      <div className="dusk-rows cb-home-stations">
        {STATIONS.map(s => (
          <button key={s.go} className="dusk-row" data-cb="station" onClick={() => navigate(s.go)}><span className="dusk-ico" aria-hidden="true">{s.icon}</span><span><b>{s.name}</b><small>{s.sub}</small></span></button>
        ))}
        <button className="dusk-row" data-cb="station" disabled><span className="dusk-ico" aria-hidden="true">📝</span><span><b>Exam</b><small>Coming soon</small></span></button>
      </div>

      <footer>
        <a className="dusk-btn" href="https://ko-fi.com/jordandoerksen" target="_blank" rel="noopener"><span aria-hidden="true">☕</span> Tip jar — if it helped you get there</a>
        <p className="cb-sub dusk-measure">An independent study tool. Cites the <b>Canadian Rail Operating Rules</b> (a public document)
          and flags CN operating practice (GOI) as not-a-rule. Not affiliated with CN, Transport Canada,
          or the RAC. Built for the people the book failed.</p>
      </footer>
    </div>
  );
}
