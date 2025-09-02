// src/components/JobCard.jsx
export default function JobCard({ j, emphasize = false }) {
  if (!j) return null

  const payBadge = j.sensitive?.pay || (j.requirements.salaryRange?.[0] ? `₩${j.requirements.salaryRange[0].toLocaleString()}~` : (j.requirements.hourlyRange?.[0] ? `시급 ₩${j.requirements.hourlyRange[0].toLocaleString()}~` : '협의'))

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h3 style={{ marginTop: 0 }}>{j.title}</h3>
      <div className="small">{j.company} • {j.location} {j.remoteOK ? '(원격 가능)' : ''}</div>
      <div className="small">산업: {j.industry || '기타'}</div>
      <div className="small">요구 기술/업무: {j.requirements.skills.join(', ')}</div>
      <div className="small">경력: {j.requirements.minExp}+ 년 · 고용형태: {j.requirements.employmentType}</div>
      {j.requirements.licenses?.length ? <div className="small">자격증: {j.requirements.licenses.join(', ')}</div> : null}
      <div className="small">언어: {j.languages.join(', ')}</div>
      {j.requirements.shifts?.length ? <div className="small">근무시간대: {j.requirements.shifts.join(', ')}</div> : null}

      {emphasize && (
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge chip-warn">💰 {payBadge}</span>
          <span className="badge chip-danger">🧾 {j.sensitive?.contract || j.requirements.employmentType}</span>
          <span className="badge">⏱ {j.sensitive?.hours || '근무시간 협의'}</span>
          {j.requirements.licenses?.length ? <span className="badge">📜 {j.requirements.licenses.join(', ')}</span> : null}
          {j.industry ? <span className="badge">🏷 {j.industry}</span> : null}
        </div>
      )}
    </div>
  )
}
