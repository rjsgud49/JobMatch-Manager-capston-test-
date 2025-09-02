import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import KPI from '../components/KPI.jsx'

export default function Pay() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const update = (id, status) => setState(s => ({ ...s, escrows: s.escrows.map(e => e.id === id ? { ...e, status } : e) }))

    return (
        <div className="grid">
            <aside className="card">
                <h2>페이시스템 안내</h2>
                <ul className="small">
                    <li>에스크로 예치금은 마감/검수 충족 시 자동 지급</li>
                    <li>분쟁 발생 시 지급 보류 → 중재 모듈 연계</li>
                </ul>
            </aside>
            <section>
                <div className="kpis">
                    <KPI title="총 건수" value={state.escrows.length} />
                    <KPI title="진행중" value={state.escrows.filter(e => e.status === 'IN_PROGRESS').length} />
                    <KPI title="지급완료" value={state.escrows.filter(e => e.status === 'RELEASED').length} />
                    <KPI title="분쟁" value={state.escrows.filter(e => e.status === 'DISPUTED').length} />
                </div>
                <div className="card" style={{ marginTop: 12 }}>
                    <h2>에스크로 목록</h2>
                    <table className="table">
                        <thead><tr><th>프로젝트</th><th>계약자</th><th>예치금</th><th>마감일</th><th>상태</th><th>조치</th></tr></thead>
                        <tbody>
                            {state.escrows.map(e => (
                                <tr key={e.id}>
                                    <td>{e.project}</td>
                                    <td>{e.contractor}</td>
                                    <td>₩{e.amount.toLocaleString()}</td>
                                    <td>{e.deadline}</td>
                                    <td><span className={`pill ${e.status.toLowerCase()}`}>{e.status}</span></td>
                                    <td className="row">
                                        <button className="btn sm" onClick={() => update(e.id, 'RELEASED')}>지급</button>
                                        <button className="btn sm ghost" onClick={() => update(e.id, 'DISPUTED')}>분쟁</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
