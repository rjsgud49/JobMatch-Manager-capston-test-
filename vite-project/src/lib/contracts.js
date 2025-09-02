// src/lib/contracts.js

// 기본 계약 조항 (한국어)
export function baseTermsKR() {
    return `1. 근로시간 및 업무시간 준수
2. 임금은 계약에 따라 지급한다.
3. 산출물에 대한 저작권 귀속은 합의된 조건을 따른다.
4. 계약 해지 시 최소 7일 전 통보한다.`
}

// 계약서 텍스트 렌더링
export function renderContractText(c) {
    return `계약서: ${c.title}
형태: ${c.type}
기간: ${c.startDate} ~ ${c.endDate}
고용주: ${c.employer}
계약자: ${c.contractor}
보상: ${c.rateType} ${c.rate}원
업무: ${c.deliverables}

조항:
${c.terms}`
}

// 계약 검토 (간단 rule 기반)
export function ruleBasedContractAudit(c) {
    const issues = []
    if (c.rate < 10000) issues.push('💸 단가가 너무 낮습니다.')
    if (!c.deliverables) issues.push('📌 산출물이 구체적으로 기재되지 않았습니다.')
    if (new Date(c.endDate) < new Date(c.startDate)) issues.push('⚠️ 종료일이 시작일보다 빠릅니다.')
    return issues
}

// 계약 초안 생성
export function buildDraftContract(candidate, job) {
    return {
        id: crypto.randomUUID(),
        title: `${job.title} 계약 초안`,
        language: 'KR',
        type: job.requirements.employmentType,
        employer: job.company,
        contractor: candidate.name,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
        rateType: 'Monthly',
        rate: job.requirements.salaryRange?.[0] || 3000000,
        hoursPerWeek: 40,
        deliverables: '프로젝트 요구사항에 맞는 결과물 제공',
        terms: baseTermsKR(),
        review: [],
        status: 'DRAFT'
    }
}
