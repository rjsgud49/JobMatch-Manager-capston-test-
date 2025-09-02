import { useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import { baseTermsKR, renderContractText, ruleBasedContractAudit } from '../lib/contracts'
import { exportContractDocx } from '../lib/exportDocx'

export default function Contracts() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const [idx, setIdx] = useState(0)
    const draft = state.contracts[idx]

    const update = (patch) => setState(s => { const next = [...s.contracts]; next[idx] = { ...next[idx], ...patch }; return { ...s, contracts: next } })
    const add = () => {
        setState(s => ({
            ...s,
            contracts: [{
                id: crypto.randomUUID(),
                title: '새 계약 초안',
                language: 'KR',
                type: 'Freelance',
                employer: '',
                contractor: '',
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
                rateType: 'Hourly',
                rate: 40000,
                hoursPerWeek: 20,
                deliverables: '주 단위 기능 구현 및 코드 제출',
                terms: baseTermsKR(),
                review: [],
                status: 'DRAFT'
            }, ...s.contracts]
        }))
        setIdx(0)
    }

    return (
        <div className="grid">
            <aside className="card">
                <h2>계약 목록</h2>
                <div className="list">
                    {state.contracts.map((c, i) => (
                        <div key={c.id} className={`item ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                            <div>{c.title}</div><div className="small">{c.type} · {c.language}</div>
                        </div>
                    ))}
                </div>
                <div className="row" style={{ marginTop: 8 }}>
                    <button className="btn" onClick={add}>새 초안</button>
                    <button className="btn ghost" onClick={() => setState(s => ({ ...s, contracts: s.contracts.filter((_, i) => i !== idx) }))}>삭제</button>
                </div>
            </aside>
            <section>
                {!draft ? <div className="card">선택된 계약이 없습니다.</div> : (
                    <div className="card">
                        <h2 style={{ marginTop: 0 }}>계약 편집</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                            <label><div className="small">제목</div><input className="input" value={draft.title} onChange={e => update({ title: e.target.value })} /></label>
                            <label><div className="small">언어</div><select className="input" value={draft.language} onChange={e => update({ language: e.target.value })}><option>KR</option><option>EN</option></select></label>
                            <label><div className="small">형태</div><select className="input" value={draft.type} onChange={e => update({ type: e.target.value })}><option>Full-time</option><option>Part-time</option><option>Freelance</option></select></label>
                            <label><div className="small">고용주</div><input className="input" value={draft.employer} onChange={e => update({ employer: e.target.value })} /></label>
                            <label><div className="small">근로자/계약자</div><input className="input" value={draft.contractor} onChange={e => update({ contractor: e.target.value })} /></label>
                            <label><div className="small">시작일</div><input type="date" className="input" value={draft.startDate} onChange={e => update({ startDate: e.target.value })} /></label>
                            <label><div className="small">종료일</div><input type="date" className="input" value={draft.endDate} onChange={e => update({ endDate: e.target.value })} /></label>
                            <label><div className="small">단가 유형</div><select className="input" value={draft.rateType} onChange={e => update({ rateType: e.target.value })}><option>Hourly</option><option>Monthly</option><option>Project</option></select></label>
                            <label><div className="small">단가/급여</div><input type="number" className="input" value={draft.rate} onChange={e => update({ rate: +e.target.value })} /></label>
                            <label><div className="small">주당 시간</div><input type="number" className="input" value={draft.hoursPerWeek} onChange={e => update({ hoursPerWeek: +e.target.value })} /></label>
                            <label style={{ gridColumn: '1/-1' }}><div className="small">업무/산출물</div><textarea className="input" rows="3" value={draft.deliverables} onChange={e => update({ deliverables: e.target.value })} /></label>
                            <label style={{ gridColumn: '1/-1' }}><div className="small">계약 조항</div><textarea className="input" rows="8" value={draft.terms} onChange={e => update({ terms: e.target.value })} /></label>
                        </div>
                        <div className="row" style={{ gap: 8, marginTop: 8 }}>
                            <button className="btn" onClick={() => update({ review: ruleBasedContractAudit(draft) })}>AI 계약 검토</button>
                            <button className="btn ghost" onClick={() => exportContractDocx(draft)}>한글 파일(DOCX)로 내보내기</button>
                        </div>
                        {!!draft.review?.length && (
                            <div className="card" style={{ marginTop: 12, background: '#fff7ed', borderColor: '#fde68a' }}>
                                <strong>위험/개선 포인트</strong>
                                <ul>{draft.review.map((r, i) => <li key={i}>⚠️ {r}</li>)}</ul>
                            </div>
                        )}
                        <details style={{ marginTop: 8 }}>
                            <summary>미리보기</summary>
                            <pre>{renderContractText(draft)}</pre>
                        </details>
                    </div>
                )}
            </section>
        </div>
    )
}
