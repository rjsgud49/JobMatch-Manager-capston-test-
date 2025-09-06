import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import CandidateCard from '../components/CandidateCard'
import { computeMatch } from '../lib/matching'
import { buildDraftContract } from '../lib/contracts'

export default function EmployerPortal() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const [title, setTitle] = useState('')
    const [skills, setSkills] = useState('')
    const [employmentType, setEmploymentType] = useState('Full-time')

    // 결제 로딩 상태
    const [paying, setPaying] = useState(false)

    useEffect(() => {
        const id = 'nicepay-js-sdk'
        if (!document.getElementById(id)) {
            const s = document.createElement('script')
            s.id = id
            s.src = 'https://pay.nicepay.co.kr/v1/js/'
            s.async = true
            document.body.appendChild(s)
        }
    }, [])

    const addJob = () => {
        if (!title) return
        const reqSkills = skills.split(',').map(s => s.trim()).filter(Boolean)
        const job = {
            id: crypto.randomUUID(), title,
            industry: '기타', company: 'Demo Co', location: 'Seoul', remoteOK: false, languages: ['KR'],
            requirements: { skills: reqSkills, minExp: 0, employmentType, salaryRange: [0, 0], hourlyRange: [0, 0], shifts: ['유연'], licenses: [] },
            sensitive: { pay: '협의', contract: employmentType, hours: '협의' }
        }
        setState(s => ({ ...s, jobs: [job, ...s.jobs] }))
        setTitle(''); setSkills('')
        alert('공고가 등록되었습니다.')
    }
    

    // 💳 일회성 결제창 호출
    const startPayment = async (amount = 1000) => {
        try {
            setPaying(true);

            const orderId = `JOBPOST-${Date.now()}`;

            // SDK 로드 대기
            const waitSdk = () =>
                new Promise((res, rej) => {
                    let t = 0;
                    const i = setInterval(() => {
                        t += 100;
                        if (window.AUTHNICE?.requestPay) { clearInterval(i); res(); }
                        if (t > 5000) { clearInterval(i); rej(new Error('NICEPAY SDK 로드 실패')); }
                    }, 100);
                });
            await waitSdk();

            window.AUTHNICE.requestPay({
                clientId: import.meta.env.VITE_NICE_CLIENT_KEY, // 발급받은 clientId
                orderId: `JOBPOST-${Date.now()}`,
                amount: 1000,
                goodsName: '공고 등록(테스트)',
                buyerName: '테스트 사용자',
                currency: 'KRW',

                // ✅ 결제수단 지정 (필수)
                method: 'card', // 또는 'all' (모든 수단 허용)

                // ✅ 서버에 만들어둔 return URL
                returnUrl: 'http://localhost:5174/pay/return',

                // ✅ 에러 콜백 (필수)
                fnError: (res) => {
                    const code = res?.resultCode || res?.errorCode || 'UNKNOWN'
                    const msg = res?.resultMsg || res?.errorMsg || '결제 오류 발생'
                    alert(`[NICEPAY] ${code} - ${msg}`)
                },
            })



        } catch (e) {
            console.error(e);
            alert('결제 요청 중 오류가 발생했습니다.');
        } finally {
            setPaying(false);
        }
    };


    // 가장 최근 공고에 대한 후보 추천(데모)
    const lastJob = state.jobs[0]
    const ranked = useMemo(() => !lastJob ? [] :
        state.candidates.map(c => ({ c, ...computeMatch(c, lastJob) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
        , [state.candidates, lastJob])

    const propose = (c) => {
        const draft = buildDraftContract(c, lastJob)
        setState(s => ({ ...s, contracts: [draft, ...s.contracts] }))
        alert(`${c.name}님에게 제안(계약 초안)이 발송되었습니다. (데모)`)
    }

    return (
        <div className="grid">
            <aside className="card">
                <h2>기업 포털</h2>

                <label className="small">공고 제목</label>
                <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 바리스타(주말)" />

                <label className="small" style={{ marginTop: 8 }}>필요 기술/업무(쉼표로 구분)</label>
                <input className="input" value={skills} onChange={e => setSkills(e.target.value)} placeholder="예: 에스프레소, 고객응대" />

                <label className="small" style={{ marginTop: 8 }}>고용형태</label>
                <select className="input" value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
                    <option>Full-time</option><option>Part-time</option><option>Freelance</option><option>Project</option>
                </select>

                <div className="row" style={{ gap: 8, marginTop: 8 }}>
                    <button className="btn" onClick={addJob}>공고 등록</button>

                    {/* 💳 일회성 결제 버튼 (테스트) */}
                    <button className="btn ghost" onClick={() => startPayment(1000)} disabled={paying} title="나이스페이 샌드박스 결제창 호출">
                        {paying ? '결제 준비...' : '결제(테스트)'}
                    </button>
                </div>

                <p className="small">간단 등록(데모). 상세 급여/교대/자격증은 관리 화면에서 수정하세요.</p>
            </aside>

            <section>
                {!lastJob ? <div className="card">공고를 먼저 등록하세요.</div> : (
                    <>
                        <div className="card">
                            <h3 style={{ marginTop: 0 }}>최근 공고: {lastJob.title}</h3>
                            <div className="small">{lastJob.company} • {lastJob.location} • {lastJob.requirements.employmentType}</div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginTop: 0 }}>AI 추천 후보 TOP 5</h3>
                            {ranked.map(({ c, score }) => (
                                <div key={c.id} className="card" style={{ marginBottom: 8 }}>
                                    <div className="row" style={{ justifyContent: 'space-between' }}>
                                        <strong>{c.name}</strong>
                                        <span className="badge">적합도 {Math.round(score)}%</span>
                                    </div>
                                    <CandidateCard c={c} />
                                    <div className="row" style={{ gap: 8 }}>
                                        <button className="btn" onClick={() => propose(c)}>제안(계약 초안)</button>
                                        <button className="btn ghost" onClick={() => alert('메시지 전송(데모)')}>메시지</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}
