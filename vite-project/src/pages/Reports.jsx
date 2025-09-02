import { useMemo } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import KPI from '../components/KPI.jsx'

export default function Reports() {
    const [state] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const totalHours = useMemo(() => state.workLogs.reduce((s, l) => s + (l.ms || 0), 0) / 3600000, [state.workLogs])
    const byUser = useMemo(() => {
        const map = {}
        for (const l of state.workLogs) {
            if (!map[l.user]) map[l.user] = { user: l.user, ms: 0, count: 0 }
            map[l.user].ms += l.ms || 0
            map[l.user].count++
        }
        return Object.values(map).sort((a, b) => b.ms - a.ms)
    }, [state.workLogs])

    return (
        <div className="grid">
            <aside className="card">
                <h2>자동 집계 요약</h2>
                <div className="kpis">
                    <KPI title="총 계약" value={state.contracts.length} />
                    <KPI title="에스크로 진행" value={state.escrows.filter(e => e.status !== 'RELEASED').length} />
                    <KPI title="누적 작업시간" value={`${totalHours.toFixed(1)}h`} />
                    <KPI title="분쟁" value={state.disputes.length} />
                </div>
            </aside>
            <section>
                <div className="card">
                    <h2>사용자별 작업 시간</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {byUser.map(u => (
                            <li key={u.user} className="row" style={{ alignItems: 'center' }}>
                                <span style={{ display: 'inline-block', width: 140 }} className="small">{u.user}</span>
                                <span style={{ flex: 1, height: 10, background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 999, position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, (u.ms / (3600000 * 40)) * 100)}%`, background: '#93c5fd', borderRadius: 999 }} />
                                </span>
                                <span style={{ width: 60, textAlign: 'right' }} className="small">{(u.ms / 3600000).toFixed(1)}h</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    )
}
