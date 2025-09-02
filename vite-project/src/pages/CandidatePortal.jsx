import { useMemo, useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import JobCard from '../components/JobCard'
import { computeMatch } from '../lib/matching'
import { buildDraftContract } from '../lib/contracts'
import { Link } from 'react-router-dom'

export default function CandidatePortal() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const me = state.candidates[0] // 데모: 첫 번째 사용자를 로그인 사용자로 가정
    const [q, setQ] = useState('')

    const ranked = useMemo(() => {
        return state.jobs
            .filter(j => (j.title + j.company + j.location).toLowerCase().includes(q.toLowerCase()))
            .map(job => ({ job, ...computeMatch(me, job) }))
            .sort((a, b) => b.score - a.score)
    }, [state.jobs, q, me])

    const apply = (job) => {
        // 데모: 지원만 기록(에스크로/계약은 기업 측에서 확정)
        const app = { id: crypto.randomUUID(), jobId: job.id, jobTitle: job.title, company: job.company, date: new Date().toISOString().slice(0, 10), status: 'SUBMITTED', score: computeMatch(me, job).score }
        setState(s => ({ ...s, applications: [app, ...(s.applications || [])] }))
        alert('지원이 접수되었습니다.')
    }

    const requestContractDraft = (job) => {
        const draft = buildDraftContract(me, job)
        setState(s => ({ ...s, contracts: [draft, ...s.contracts] }))
        alert('계약 초안 요청이 생성되었습니다. (데모)')
    }

    return (
        <div className="grid">
            <aside className="card">
                <h2>구직자 포털</h2>
                <div className="small">로그인 사용자: <strong>{me.name}</strong></div>
                <div className="row" style={{ marginTop: 8 }}>
                    <Link className="btn" to="/user/profile">내 프로필</Link>
                    <Link className="btn ghost" to="/user/apps">내 지원현황</Link>
                </div>
                <hr />
                <label className="small">검색</label>
                <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="직무/회사/지역" />
                <p className="small">추천 순으로 정렬됩니다.</p>
            </aside>

            <section>
                {ranked.map(({ job, score }) => (
                    <div className="card" key={job.id} style={{ marginBottom: 12 }}>
                        <div className="row" style={{ justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{job.title}</h3>
                            <span className="badge">추천도 {Math.round(score)}%</span>
                        </div>
                        <JobCard j={job} emphasize />
                        <div className="row" style={{ gap: 8 }}>
                            <button className="btn" onClick={() => apply(job)}>지원</button>
                            <button className="btn ghost" onClick={() => requestContractDraft(job)}>계약 초안 요청</button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}
