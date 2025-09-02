import { useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'

export default function Admin() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const [json, setJson] = useState(JSON.stringify(state, null, 2))
    const apply = () => {
        try {
            setState(JSON.parse(json)); alert('적용 완료')
        } catch (e) { alert('JSON 파싱 오류: ' + e.message) }
    }
    return (
        <div className="card">
            <h2>전체 상태(JSON)</h2>
            <textarea className="input" rows="24" value={json} onChange={e => setJson(e.target.value)} />
            <div className="row" style={{ marginTop: 8 }}>
                <button className="btn" onClick={apply}>적용</button>
                <button className="btn ghost" onClick={() => setJson(JSON.stringify(seedInitialState(), null, 2))}>데모로 리셋</button>
            </div>
        </div>
    )
}
