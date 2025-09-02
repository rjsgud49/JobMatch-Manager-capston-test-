// src/components/CandidateCard.jsx
export default function CandidateCard({ c }) {
    if (!c) return null

    return (
        <div className="card" style={{ marginBottom: 12 }}>
            <h3 style={{ marginTop: 0 }}>{c.name}</h3>
            <div className="small">경력: {c.experienceYears}년</div>
            <div className="small">기술: {c.skills.join(", ")}</div>
            <div className="small">언어: {c.languages.join(", ")}</div>
            <div className="small">희망: {c.desired.employmentType}, 최소 연봉 ₩{c.desired.salaryMin.toLocaleString()}</div>
            <div className="small">위치: {c.desired.location} {c.desired.remoteOK ? "(원격 가능)" : ""}</div>
            <div style={{ marginTop: 8 }}>
                <span className="badge">프로젝트 완료 {c.completedProjects}건</span>
                <span className="badge chip-warn">평판 {c.reputation.toFixed(1)}/5</span>
            </div>
        </div>
    )
}
