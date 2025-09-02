import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import { useState } from 'react'

export default function MyProfile() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const [me, setMe] = useState(state.candidates[0])

    const save = () => {
        setState(s => ({ ...s, candidates: s.candidates.map(c => c.id === me.id ? me : c) }))
        alert('프로필 저장 완료')
    }

    return (
        <div className="card">
            <h2 style={{ marginTop: 0 }}>내 프로필</h2>
            <div className="small">이름</div>
            <input className="input" value={me.name} onChange={e => setMe({ ...me, name: e.target.value })} />
            <div className="small" style={{ marginTop: 8 }}>직무(요약)</div>
            <input className="input" value={me.role} onChange={e => setMe({ ...me, role: e.target.value })} />
            <div className="small" style={{ marginTop: 8 }}>경력(년)</div>
            <input type="number" className="input" value={me.experienceYears} onChange={e => setMe({ ...me, experienceYears: +e.target.value })} />
            <div className="small" style={{ marginTop: 8 }}>기술/업무(쉼표로 구분)</div>
            <input className="input" value={me.skills.join(', ')} onChange={e => setMe({ ...me, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            <div className="small" style={{ marginTop: 8 }}>자격증(쉼표로 구분)</div>
            <input className="input" value={(me.licenses || []).join(', ')} onChange={e => setMe({ ...me, licenses: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            <div className="small" style={{ marginTop: 8 }}>희망 고용형태</div>
            <select className="input" value={me.desired.employmentType} onChange={e => setMe({ ...me, desired: { ...me.desired, employmentType: e.target.value } })}>
                <option>Full-time</option><option>Part-time</option><option>Freelance</option><option>Project</option>
            </select>
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
                <label style={{ flex: 1 }}>
                    <div className="small">최소 연봉</div>
                    <input type="number" className="input" value={me.desired.salaryMin} onChange={e => setMe({ ...me, desired: { ...me.desired, salaryMin: +e.target.value } })} />
                </label>
                <label style={{ flex: 1 }}>
                    <div className="small">최소 시급</div>
                    <input type="number" className="input" value={me.desired.hourlyMin} onChange={e => setMe({ ...me, desired: { ...me.desired, hourlyMin: +e.target.value } })} />
                </label>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
                <label style={{ flex: 1 }}>
                    <div className="small">희망 위치</div>
                    <input className="input" value={me.desired.location} onChange={e => setMe({ ...me, desired: { ...me.desired, location: e.target.value } })} />
                </label>
                <label className="row" style={{ alignItems: 'center', gap: 6, marginTop: 22 }}>
                    <input type="checkbox" checked={me.desired.remoteOK} onChange={e => setMe({ ...me, desired: { ...me.desired, remoteOK: e.target.checked } })} />
                    원격 가능
                </label>
            </div>
            <button className="btn" style={{ marginTop: 10 }} onClick={save}>저장</button>
        </div>
    )
}
