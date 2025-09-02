import { useMemo, useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import JobCard from '../components/JobCard.jsx'

export default function Jobs(){
  const [state] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
  const [q, setQ] = useState('')
  const [type, setType] = useState('ALL')
  const [industry, setIndustry] = useState('ALL')

  const industries = useMemo(()=> ['ALL', ...Array.from(new Set(state.jobs.map(j=> j.industry||'기타')))], [state.jobs])

  const list = useMemo(()=> state.jobs.filter(j=> {
    const matchType = (type==='ALL' || j.requirements.employmentType===type)
    const matchIndustry = (industry==='ALL' || (j.industry||'기타')===industry)
    const matchText = (j.title+j.company+j.location).toLowerCase().includes(q.toLowerCase())
    return matchType && matchIndustry && matchText
  }), [state.jobs,q,type,industry])

  return (
    <div className="grid">
      <aside className="card">
        <h2>필터</h2>
        <label className="small">검색</label>
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="직무/회사/지역" />
        <label className="small" style={{marginTop:8}}>고용형태</label>
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="ALL">전체</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Freelance</option>
          <option>Project</option>
        </select>
        <label className="small" style={{marginTop:8}}>산업</label>
        <select className="input" value={industry} onChange={e=>setIndustry(e.target.value)}>
          {industries.map(it=> <option key={it}>{it}</option>)}
        </select>
        <div className="card" style={{marginTop:8}}>
          <div className="small">※ 민감정보 강조</div>
          <div style={{marginTop:6, display:'grid', gap:6}}>
            <span className="badge chip-warn">💰 급여/연봉·시급</span>
            <span className="badge chip-danger">🧾 계약유형</span>
            <span className="badge">⏱ 근무시간/교대</span>
            <span className="badge">📜 자격증</span>
          </div>
        </div>
      </aside>
      <section>
        {list.map(j=> <JobCard key={j.id} j={j} emphasize />)}
      </section>
    </div>
  )
}
