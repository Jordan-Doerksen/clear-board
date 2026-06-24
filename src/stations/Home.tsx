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
    <>
      <section className="lede">
        <span className="free">Free · tip jar only</span>
        <p>Start on your first day knowing nothing. Get <b>job-ready, one piece at a time</b>. Every rule
          explained in plain words first, the real CROR text one tap deeper — and a safe place to make every
          mistake until the right move is automatic.</p>
      </section>

      <h2 className="section">Your path</h2>
      <div className="path">
        <div className="stage"><b>{stageFor(profile)}</b><span>{pct}% mastered</span></div>
        <div className="bar" role="progressbar" aria-label="Overall mastery" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h2 className="section">The job, one piece at a time</h2>
      <div className="grid">
        {DOMAINS.map(d => {
          const m = Math.round((profile.domains[d.id]?.mastery || 0) * 100);
          const liveCard = d.live && drillable(content.byDomain[d.id], content).length > 0;
          const inner = (
            <>
              <div className="h"><span className="dot" style={liveCard ? undefined : { background: 'var(--muted)' }} /><h3>{d.name}</h3></div>
              <p>{d.desc}</p>
              {liveCard
                ? <div className="mini" role="progressbar" aria-label={`${d.name} mastery`} aria-valuenow={m} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${m}%` }} /></div>
                : <span className="soon">Coming soon</span>}
            </>
          );
          return liveCard
            ? <button key={d.id} className="card" aria-label={`Drill ${d.name}`} onClick={() => navigate(`/drill/${d.id}`)}>{inner}</button>
            : <div key={d.id} className="card locked">{inner}</div>;
        })}
      </div>

      <h2 className="section">Ways to learn</h2>
      <div className="stations">
        {STATIONS.map(s => (
          <button key={s.go} className="station" onClick={() => navigate(s.go)}><b>{s.icon} {s.name}</b><small>{s.sub}</small></button>
        ))}
        <button className="station" disabled><b>📝 Exam</b><small>Coming soon</small></button>
      </div>

      <footer>
        <a className="tip" href="https://ko-fi.com/jordandoerksen" target="_blank" rel="noopener">☕ Tip jar — if it helped you get there</a>
        <p>An independent study tool. Cites the <b>Canadian Rail Operating Rules</b> (a public document)
          and flags CN operating practice (GOI) as not-a-rule. Not affiliated with CN, Transport Canada,
          or the RAC. Built for the people the book failed.</p>
      </footer>
    </>
  );
}
