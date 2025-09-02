import { Link } from 'react-router-dom'

export default function UserLanding() {
    return (
        <div className="grid">
            <aside className="card">
                <h2>사용자 허브</h2>
                <p className="small">원하는 역할을 선택하세요.</p>
                <div className="row" style={{ gap: 8 }}>
                    <Link className="btn" to="/user/candidate">구직자</Link>
                    <Link className="btn ghost" to="/user/employer">기업/구인자</Link>
                </div>
            </aside>
            <section>
                <div className="card">
                    <h2 style={{ marginTop: 0 }}>무엇을 할 수 있나요?</h2>
                    <ul>
                        <li><strong>구직자</strong>: 프로필 작성 → 공고 탐색/지원 → 내 지원현황/계약 확인</li>
                        <li><strong>기업</strong>: 공고 등록 → AI 추천 후보 확인 → 제안/계약서 발송</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}