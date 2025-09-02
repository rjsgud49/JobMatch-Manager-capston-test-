import { uid, plusDays, today } from '../lib/utils'
import { buildDraftContract } from '../lib/contracts'

export function seedInitialState() {
    const candidates = [
        { id: uid(), name: '김하늘', role: '프론트/웹', skills: ['React', '고객응대', 'POS'], licenses: [], experienceYears: 3, languages: ['KR', 'EN'], desired: { employmentType: 'Freelance', salaryMin: 3800000, hourlyMin: 0, location: 'Seoul', remoteOK: true, shifts: ['주간'] }, reputation: 4.6, completedProjects: 12 },
        { id: uid(), name: '박건우', role: '창고/물류', skills: ['지게차', '재고관리'], licenses: ['지게차운전기능사'], experienceYears: 5, languages: ['KR'], desired: { employmentType: 'Full-time', salaryMin: 36000000, hourlyMin: 0, location: 'Incheon', remoteOK: false, shifts: ['주간', '야간'] }, reputation: 4.2, completedProjects: 18 },
        { id: uid(), name: '이소연', role: '간병/요양', skills: ['간호보조', '혈압측정', '식사보조'], licenses: ['요양보호사'], experienceYears: 4, languages: ['KR'], desired: { employmentType: 'Part-time', salaryMin: 0, hourlyMin: 12000, location: 'Seoul', remoteOK: false, shifts: ['주간', '야간'] }, reputation: 4.7, completedProjects: 30 },
        { id: uid(), name: '최민준', role: '현장/건설', skills: ['형틀목공', '안전수칙'], licenses: ['안전교육이수'], experienceYears: 6, languages: ['KR'], desired: { employmentType: 'Project', salaryMin: 0, hourlyMin: 15000, location: 'Gyeonggi', remoteOK: false, shifts: ['주간'] }, reputation: 4.3, completedProjects: 25 },
        { id: uid(), name: 'Emma Park', role: '바리스타/서비스', skills: ['에스프레소', '라떼아트', '고객응대'], licenses: [], experienceYears: 2, languages: ['EN', 'KR'], desired: { employmentType: 'Part-time', salaryMin: 0, hourlyMin: 11000, location: 'Seoul', remoteOK: false, shifts: ['오전', '주말'] }, reputation: 4.8, completedProjects: 22 },
        { id: uid(), name: '오세라', role: '디자인/편집', skills: ['포토샵', '일러스트', '편집'], licenses: [], experienceYears: 3, languages: ['KR'], desired: { employmentType: 'Freelance', salaryMin: 3000000, hourlyMin: 0, location: 'Remote', remoteOK: true, shifts: ['유연'] }, reputation: 4.5, completedProjects: 40 },
    ]

    const jobs = [
        // IT도 남겨두되, 다수 직군 추가
        {
            id: uid(), title: '프론트엔드 개발자', industry: '사무/IT', company: 'Acme Corp', location: 'Seoul', remoteOK: true, languages: ['KR', 'EN'],
            requirements: { skills: ['React', 'TypeScript', '협업'], minExp: 3, employmentType: 'Freelance', salaryRange: [3500000, 5000000], hourlyRange: [0, 0], shifts: ['유연'], licenses: [] },
            sensitive: { pay: '₩3.5M ~ ₩5.0M', contract: '프리랜스', hours: '주 25~40h' }
        },

        {
            id: uid(), title: '창고 물류 직원(지게차 우대)', industry: '물류/운송', company: 'BlueLogis', location: 'Incheon', remoteOK: false, languages: ['KR'],
            requirements: { skills: ['지게차', '재고관리'], minExp: 2, employmentType: 'Full-time', salaryRange: [32000000, 42000000], hourlyRange: [0, 0], shifts: ['주간', '야간'], licenses: ['지게차운전기능사'] },
            sensitive: { pay: '₩32M ~ ₩42M', contract: '정규직', hours: '주 40h · 교대' }
        },

        {
            id: uid(), title: '요양 보호사(입주/교대)', industry: '보건/간병', company: 'Healing Care', location: 'Seoul', remoteOK: false, languages: ['KR'],
            requirements: { skills: ['간호보조', '혈압측정', '식사보조'], minExp: 1, employmentType: 'Part-time', salaryRange: [0, 0], hourlyRange: [11000, 15000], shifts: ['주간', '야간'], licenses: ['요양보호사'] },
            sensitive: { pay: '시급 ₩11,000 ~ ₩15,000', contract: '파트타임', hours: '주 20~40h' }
        },

        {
            id: uid(), title: '형틀목공(현장)', industry: '건설/현장', company: 'BuildOne', location: 'Gyeonggi', remoteOK: false, languages: ['KR'],
            requirements: { skills: ['형틀목공', '안전수칙'], minExp: 3, employmentType: 'Project', salaryRange: [0, 0], hourlyRange: [15000, 22000], shifts: ['주간'], licenses: ['안전교육이수'] },
            sensitive: { pay: '시급 ₩15,000 ~ ₩22,000', contract: '프로젝트', hours: '주 40h' }
        },

        {
            id: uid(), title: '바리스타(주말/오전)', industry: '요식/서비스', company: 'Cafe Mint', location: 'Seoul', remoteOK: false, languages: ['KR', 'EN'],
            requirements: { skills: ['에스프레소', '라떼아트', '고객응대'], minExp: 0, employmentType: 'Part-time', salaryRange: [0, 0], hourlyRange: [10000, 13000], shifts: ['오전', '주말'], licenses: [] },
            sensitive: { pay: '시급 ₩10,000 ~ ₩13,000', contract: '파트타임', hours: '주 10~25h' }
        },

        {
            id: uid(), title: '편집 디자이너(리모트)', industry: '디자인/미디어', company: 'Paper&Co', location: 'Remote', remoteOK: true, languages: ['KR'],
            requirements: { skills: ['포토샵', '일러스트', '편집'], minExp: 2, employmentType: 'Freelance', salaryRange: [2500000, 4000000], hourlyRange: [0, 0], shifts: ['유연'], licenses: [] },
            sensitive: { pay: '₩2.5M ~ ₩4.0M', contract: '프리랜스', hours: '주 20~40h' }
        },
    ]

    const contracts = [buildDraftContract(candidates[0], jobs[0])]
    const escrows = [
        { id: uid(), project: `${jobs[0].title} @ ${jobs[0].company}`, contractor: candidates[0].name, amount: 5000000, deadline: plusDays(30), status: 'IN_PROGRESS' }
    ]
    const workLogs = []
    const disputes = []

    return { candidates, jobs, contracts, escrows, workLogs, disputes }
}
