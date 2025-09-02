import { useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import Timer from '../components/Timer.jsx'
import { uid, today } from '../lib/utils'

export default function Work() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const [note, setNote] = useState('')
    const [user, setUser] = useState(state.candidates[0]?.name || '')
    const addLog = (entry) => setState(s => ({ ...s, workLogs: [entry, ...s.workLogs] }))

    return (
        <div className="grid">
            <aside className="card">
                <h2>출퇴근 타이머</h2>
                <label className="small">사용자</label>
                <select className="input" value={user} onChange={e => setUser(e.target.value)}>
                    {state.candidates.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
                <Timer onStop={(ms) => addLog({ id: uid(), user, ms, date: new Date().toISOString().slice(0, 10) })} />
            </aside>
            <section>
                <div className="card">
                    <h2>업무/산출물 기록</h2>
                    <div className="row">
                        <input className="input" placeholder="업무 내용 또는 산출물 링크" value={note} onChange={e => setNote(e.target.value)} />
                        <button className="btn" onClick={() => { if (!note) return; addLog({ id: uid(), user, note, date: today(), ms: 0 }); setNote('') }}>추가</button>
                    </div>
                    <p className="small">계약과 연동되는 간단한 텍스트 로그입니다.</p>
                </div>
                <div className="card">
                    <h2>최근 기록</h2>
                    <table className="table">
                        <thead><tr><th>일자</th><th>사용자</th><th>작업</th><th>시간</th></tr></thead>
                        <tbody>
                            {state.workLogs.slice(0, 20).map(l => (
                                <tr key={l.id}>
                                    <td>{l.date}</td><td>{l.user}</td><td>{l.note || '-'}</td>
                                    <td>{l.ms ? `${(l.ms / 3600000).toFixed(1)}h` : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
