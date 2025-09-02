import { useMemo, useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import CandidateCard from '../components/CandidateCard.jsx'
import JobCard from '../components/JobCard.jsx'
import ScoreCircle from '../components/ScoreCircle.jsx'
import { computeMatch } from '../lib/matching'
import { buildDraftContract } from '../lib/contracts'

export default function Matching() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const [cid, setCid] = useState(state.candidates[0]?.id || '')
    const [jid, setJid] = useState(state.jobs[0]?.id || '')
    const c = state.candidates.find(x => x.id === cid)
    const j = state.jobs.find(x => x.id === jid)
    const { score, breakdown } = useMemo(() => c && j ? computeMatch(c, j) : { score: 0, breakdown: [] }, [c, j])
    const topJobs = useMemo(() => !c ? [] : state.jobs.map(job => ({ job, ...computeMatch(c, job) })).sort((a, b) => b.score - a.score).slice(0, 5), [c, state.jobs])

    return (
        <div className="grid">
            <aside className="card">
                <h2>구직자</h2>
                <select className="input" value={cid} onChange={e => setCid(e.target.value)}>
                    {state.candidates.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
                {c && <CandidateCard c={c} />}
            </aside>
            <section>
                <div className="card">
                    <h2>채용 공고</h2>
                    <select className="input" value={jid} onChange={e => setJid(e.target.value)}>
                        {state.jobs.map(x => <option key={x.id} value={x.id}>{x.title} @ {x.company}</option>)}
                    </select>
                    {j && <JobCard j={j} emphasize />}
                </div>

                <div className="card" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12 }}>
                    <div>
                        <h3 style={{ marginTop: 0 }}>매칭 결과</h3>
                        <ScoreCircle value={score} />
                    </div>
                    <div>
                        <ul>
                            {breakdown.map((b, i) => <li key={i}>✅ {b.label} <em>(+{b.points})</em></li>)}
                        </ul>
                        {c && j && (
                            <div className="row" style={{ gap: 8, marginTop: 8 }}>
                                <button className="btn" onClick={() => setState(p => ({ ...p, contracts: [buildDraftContract(c, j), ...p.contracts] }))}>계약 초안 생성</button>
                            </div>
                        )}
                    </div>
                </div>

                {!!topJobs.length && (
                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>상위 추천 포지션</h3>
                        <ol>
                            {topJobs.map((x, i) => <li key={x.job.id}><strong>{x.job.title}</strong> @ {x.job.company} · <span className="small">{Math.round(x.score)}%</span></li>)}
                        </ol>
                    </div>
                )}
            </section>
        </div>
    )
}
