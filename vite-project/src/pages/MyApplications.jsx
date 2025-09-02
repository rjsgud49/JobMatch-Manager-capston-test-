import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'

export default function MyApplications() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const apps = state.applications || []

    const withdraw = (id) => {
        setState(s => ({ ...s, applications: s.applications.map(a => a.id === id ? { ...a, status: 'WITHDRAWN' } : a) }))
    }

    return (
        <div className="card">
            <h2 style={{ marginTop: 0 }}>내 지원 현황</h2>
            {!apps.length ? <div className="small">아직 지원 내역이 없습니다.</div> : (
                <table className="table">
                    <thead><tr><th>일자</th><th>공고</th><th>회사</th><th>상태</th><th>추천도</th><th>조치</th></tr></thead>
                    <tbody>
                        {apps.map(a => (
                            <tr key={a.id}>
                                <td>{a.date}</td>
                                <td>{a.jobTitle}</td>
                                <td>{a.company}</td>
                                <td><span className="pill in_progress">{a.status}</span></td>
                                <td>{Math.round(a.score)}%</td>
                                <td><button className="btn sm ghost" onClick={() => withdraw(a.id)}>지원 취소</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
