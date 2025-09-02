import KPI from '../components/KPI.jsx'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'

export default function Dashboard() {
    const [state] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const totalHours = (state.workLogs.reduce((s, l) => s + (l.ms || 0), 0) / 3600000).toFixed(1)

    return (
        <div className="grid">
            <aside className="card sidebar">
                <div className="group">
                    <div className="title">빠른 작업</div>
                    <a className="badge" href="/matching">스마트 매칭</a>
                    <a className="badge" href="/jobs">채용정보 검토</a>
                    <a className="badge" href="/pay">페이시스템</a>
                    <a className="badge" href="/contracts">계약서 관리</a>
                </div>
            </aside>
            <section>
                <div className="kpis">
                    <KPI title="후보자" value={state.candidates.length} />
                    <KPI title="채용공고" value={state.jobs.length} />
                    <KPI title="에스크로 진행" value={state.escrows.filter(e => e.status !== 'RELEASED').length} />
                    <KPI title="누적 작업시간" value={`${totalHours}h`} />
                </div>
                <div className="card" style={{ marginTop: 12 }}>
                    <h2>알림</h2>
                    <ul>
                        <li>민감정보(급여/계약유형/근무시간)는 <strong>채용정보</strong>·<strong>페이시스템</strong>에서 강조 표시됩니다.</li>
                        <li>계약서는 <strong>DOCX</strong>로 추출되어 한글(HWP)에서 바로 열 수 있습니다.</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
