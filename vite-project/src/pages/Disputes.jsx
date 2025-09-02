import { useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'

function ruleBasedMediation(detail) {
    const t = (detail || '').toLowerCase()
    if (/임금|미지급|지급/.test(t)) return '제안: 에스크로 조건 명확화 + 완료분 부분지급 우선. 검수 로그 첨부.'
    if (/지연|납품|delay/.test(t)) return '제안: 일정 재협상(연장) + 성과 기반 분할 지급. 핵심 산출물 우선.'
    if (/품질|버그|quality|bug/.test(t)) return '제안: 재현 절차/수락 기준 문서화, 수정 라운드/기한 명시(예: 2회/7일).'
    return '제안: 사실관계 타임라인과 조항 대조, 공동 합의 초안 작성. 필요시 노무사/노동청 연계.'
}

export default function Disputes() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')
    const submit = () => {
        if (!title) return
        setState(s => ({ ...s, disputes: [{ id: crypto.randomUUID(), title, detail, suggestion: ruleBasedMediation(detail || title), status: 'OPEN', date: new Date().toISOString().slice(0, 10) }, ...s.disputes] }))
        setTitle(''); setDetail('')
    }

    return (
        <div className="grid">
            <aside className="card">
                <h2>분쟁 접수</h2>
                <label className="small">제목</label>
                <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 납품 지연에 따른 대금 지급 분쟁" />
                <label className="small" style={{ marginTop: 8 }}>상세</label>
                <textarea className="input" rows="4" value={detail} onChange={e => setDetail(e.target.value)} placeholder="상세 상황을 적어주세요." />
                <button className="btn" onClick={submit} style={{ marginTop: 8 }}>AI 중재안 생성</button>
            </aside>
            <section>
                <div className="card">
                    <h2>분쟁 목록</h2>
                    <table className="table">
                        <thead><tr><th>일자</th><th>제목</th><th>상태</th><th>AI 제안</th></tr></thead>
                        <tbody>
                            {state.disputes.map(d => (
                                <tr key={d.id}>
                                    <td>{d.date}</td>
                                    <td>{d.title}</td>
                                    <td><span className="pill in_progress">{d.status}</span></td>
                                    <td className="small">{d.suggestion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
