// src/lib/matching.js

// 범용 매칭: 스킬/경력/형태/임금(월급·시급)/위치/언어/자격증/교대
export function computeMatch(candidate, job) {
    let score = 0
    const breakdown = []

    // 스킬
    const matchedSkills = candidate.skills.filter(s => job.requirements.skills.includes(s))
    const skillPts = Math.min(5, matchedSkills.length) * 8  // 스킬 5개까지 가중
    if (skillPts) { score += skillPts; breakdown.push({ label: `기술/업무 일치 (${matchedSkills.join(', ')})`, points: skillPts }) }

    // 경력
    if (candidate.experienceYears >= job.requirements.minExp) {
        score += 12; breakdown.push({ label: '경력 충족', points: 12 })
    }

    // 고용형태
    if (candidate.desired.employmentType === job.requirements.employmentType) {
        score += 8; breakdown.push({ label: '희망 고용형태 일치', points: 8 })
    }

    // 임금(월급/시급 모두 지원)
    const salaryOk = candidate.desired.salaryMin ? (candidate.desired.salaryMin <= (job.requirements.salaryRange[1] || 0)) : true
    const hourlyOk = candidate.desired.hourlyMin ? (candidate.desired.hourlyMin <= (job.requirements.hourlyRange[1] || 0)) : true
    if (salaryOk && hourlyOk) {
        score += 10; breakdown.push({ label: '보상 조건 충족', points: 10 })
    }

    // 위치/원격
    const locOk = candidate.desired.location === job.location || (candidate.desired.remoteOK && job.remoteOK)
    if (locOk) { score += 10; breakdown.push({ label: '위치/원격 조건 일치', points: 10 }) }

    // 언어
    const matchedLangs = candidate.languages.filter(l => job.languages.includes(l))
    if (matchedLangs.length) { score += 5; breakdown.push({ label: `언어 (${matchedLangs.join(', ')})`, points: 5 }) }

    // 자격증
    const needed = job.requirements.licenses || []
    const hasLic = needed.every(l => candidate.licenses?.includes(l))
    if (needed.length) {
        if (hasLic) { score += 12; breakdown.push({ label: `필수 자격증 보유 (${needed.join(', ')})`, points: 12 }) }
        else { breakdown.push({ label: `자격증 필요: ${needed.join(', ')}`, points: 0 }) }
    }

    // 교대/근무시간대
    const shiftOverlap = (candidate.desired.shifts || []).some(s => (job.requirements.shifts || []).includes(s)) || (job.requirements.shifts || []).includes('유연')
    if (shiftOverlap) { score += 8; breakdown.push({ label: '근무시간대/교대 일치', points: 8 }) }

    return { score: Math.min(100, score), breakdown }
}
