import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/* ====== (이미 있던) 달력 색상/클래스 ====== */
const PILL_CLASS = {
    "출근": "pill-badge pill-work",
    "재택": "pill-badge pill-home",
    "휴가": "pill-badge pill-vac",
    "결근": "pill-badge pill-absent",
};

/* 공통 모달 */
function Modal({ title, onClose, children, footer }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__head">
                    <div className="modal__title">{title}</div>
                    <button className="iconbtn" onClick={onClose}>닫기 ✕</button>
                </div>
                <div className="modal__body">{children}</div>
                {footer && <div className="modal__foot">{footer}</div>}
            </div>
        </div>
    );
}

/* 달력 */
function CalendarAttendance({ year, month, attendance, onPick }) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();
    const isToday = (d) =>
        year === today.getFullYear() &&
        month === today.getMonth() &&
        d === today.getDate();

    const map = useMemo(
        () => Object.fromEntries(attendance.map(a => [parseInt(a.date.split("-")[2], 10), a.status])),
        [attendance]
    );

    return (
        <div className="calendar">
            <div className="cal-header">
                <div className="cal-title">출근 · 업무 기록 ({year}년 {month + 1}월)</div>
                <div className="legend">
                    <span className="chip"><span className="pill-badge pill-work"></span>출근</span>
                    <span className="chip"><span className="pill-badge pill-home"></span>재택</span>
                    <span className="chip"><span className="pill-badge pill-vac"></span>휴가</span>
                    <span className="chip"><span className="pill-badge pill-absent"></span>결근</span>
                </div>
            </div>

            <div className="cal-weekdays">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => <div key={d}>{d}</div>)}
            </div>

            <div className="cal-grid">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="cal-cell is-empty" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const status = map[day];
                    return (
                        <div
                            key={day}
                            className={`cal-cell ${isToday(day) ? "today" : ""}`}
                            onClick={() => onPick(day)}
                            title={status ? `${day}일 · ${status}` : `${day}일`}
                        >
                            <div className="date-num">{day}</div>
                            {status && <span className={PILL_CLASS[status]}>{status}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ====== 메인 페이지 ====== */
export default function EmployeePortal() {
    /* 출근/업무 기록 */
    const [attendance, setAttendance] = useState([
        { date: "2025-09-01", status: "출근" },
        { date: "2025-09-02", status: "출근" },
        { date: "2025-09-03", status: "재택" },
        { date: "2025-09-05", status: "휴가" },
    ]);

    /* 급여 */
    const [payments] = useState([
        { id: 1, month: "2025-08", amount: 2500000, status: "정산 완료" },
        { id: 2, month: "2025-09", amount: 2500000, status: "예정" },
    ]);

    /* ✅ 현재 재직 회사 정보 */
    const currentEmployment = {
        company: "비컴퍼니",
        role: "주니어 프론트엔드",
        empId: "EMP-2025-08-012",
    };

    /* ✅ “현재 회사에 제출한 계약서” (문서별 버전 이력) */
    const [docs, setDocs] = useState([
        {
            id: "DOC-001",
            title: "근로계약서",
            versions: [
                { ver: 1, date: "2025-08-18", status: "제출", note: "초안 제출", fileName: "근로계약서_v1.pdf", url: "#" },
                { ver: 2, date: "2025-08-19", status: "수정 제출", note: "연봉/근무지 수정", fileName: "근로계약서_v2.pdf", url: "#" },
                { ver: 3, date: "2025-08-20", status: "승인(최종)", note: "서명 완료", fileName: "근로계약서_v3_final.pdf", url: "#" },
            ],
        },
        {
            id: "DOC-002",
            title: "개인정보 수집·이용 동의서",
            versions: [
                { ver: 1, date: "2025-08-18", status: "승인(최종)", note: "서명 완료", fileName: "동의서_v1.pdf", url: "#" },
            ],
        },
    ]);

    /* 모달 상태 */
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showSalaryPolicy, setShowSalaryPolicy] = useState(false);

    /* 파일 업로드 → 새 버전 추가 (더미) */
    const uploadRef = useRef(null);
    const [uploadTarget, setUploadTarget] = useState(null);
    const todayStr = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };
    const addNewVersion = (docId, fileName) => {
        setDocs(prev =>
            prev.map(doc => {
                if (doc.id !== docId) return doc;
                const nextVer = doc.versions.length ? Math.max(...doc.versions.map(v => v.ver)) + 1 : 1;
                const newV = {
                    ver: nextVer,
                    date: todayStr(),
                    status: "제출(신규)",
                    note: "새 버전 업로드",
                    fileName,
                    url: "#",
                };
                return { ...doc, versions: [newV, ...doc.versions] }; // 최신이 위로
            })
        );
    };

    /* 급여/보상 규정 (요약) */
    const salaryPolicy = [
        { h: "급여 지급일", d: "매월 25일(은행 휴일 시 직전 영업일). 에스크로 정산 반영." },
        { h: "수습/연봉", d: "수습 3개월 동안 연봉의 90% 지급(수습 종료 시 소급 없음)." },
        { h: "시간외 수당", d: "주 40시간 초과분 통상임금 1.5배. 야간·휴일 중복 가산." },
        { h: "상여/인센티브", d: "프로젝트 성과 및 분기 OKR 달성률 기반(별첨 2)." },
        { h: "지각/결근", d: "지각 3회=반차 0.5 차감. 무단결근 시 경고 및 평가 반영." },
        { h: "재택 기준", d: "주 2회 팀장 승인 하 재택 가능(산출물·회의 참석 증빙)." },
    ];

    /* ===== 계좌 인증 (예금주 실명 조회) ===== */
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [bankCode, setBankCode] = useState("");     // 예: "004" (국민)
    const [accountNum, setAccountNum] = useState(""); // 예: "4703XXXXXXXX"
    const [loading, setLoading] = useState(false);
    const [accountResult, setAccountResult] = useState(null);

    const verifyAccount = async () => {
        setAccountResult(null);
        if (!bankCode || !accountNum) {
            setAccountResult({ error: "은행 코드와 계좌번호를 입력하세요." });
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post("/api/bank-owner", {
                bank_code: bankCode,
                account_num: accountNum,
            });
            setAccountResult(res.data?.data || res.data || { ok: true });
        } catch (err) {
            setAccountResult({
                error: err?.response?.data || err?.message || "요청 중 오류가 발생했습니다.",
            });
        } finally {
            setLoading(false);
        }
    };


    const year = 2025, month = 8; // 9월

    return (
        <div className="grid gap-4">
            <header className="card">
                <h2>재직자 포털</h2>
                <p className="small">근무 기록과 급여 내역을 확인하고 재계약 여부를 관리하세요.</p>
                <div className="row" style={{ gap: 8 }}>
                    <Link to="/user" className="btn sm ghost">← 사용자 허브로</Link>
                    {/* ✅ 현재 회사 제출 계약서 팝업 */}
                    <button className="btn sm" onClick={() => setShowSubmitModal(true)}>
                        제출 계약서(현 직장)
                    </button>
                    <button className="btn sm ghost" onClick={() => setShowSalaryPolicy(true)}>
                        회사 급여/보상 규정
                    </button>
                    {/* ✅ 계좌 인증 버튼 */}
                    <button className="btn sm" onClick={() => setShowAccountModal(true)}>
                        계좌 인증하기
                    </button>
                </div>
            </header>

            <section className="card">
                <CalendarAttendance
                    year={year}
                    month={month}
                    attendance={attendance}
                    onPick={(day) =>
                        setAttendance((prev) => [
                            ...prev,
                            {
                                date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                                status: "출근",
                            },
                        ])
                    }
                />
                <p className="small" style={{ marginTop: 8 }}>
                    👉 날짜 클릭 시 “출근”으로 기록됩니다. (차후 상태 선택 팝업 추가 예정)
                </p>
            </section>

            <section className="card">
                <h3>급여 내역</h3>
                <table className="table">
                    <thead><tr><th>월</th><th>금액</th><th>상태</th></tr></thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td>{p.month}</td>
                                <td>{p.amount.toLocaleString()} 원</td>
                                <td>{p.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ✅ ① 현재 회사에 제출한 계약서 모달 */}
            {showSubmitModal && (
                <Modal
                    title={`제출 계약서 — ${currentEmployment.company} (${currentEmployment.role})`}
                    onClose={() => setShowSubmitModal(false)}
                    footer={
                        <>
                            {/* 숨겨진 파일 업로더 */}
                            <input
                                ref={uploadRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.hwp,.hwpx,.png,.jpg"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f || !uploadTarget) return;
                                    addNewVersion(uploadTarget, f.name);
                                    e.currentTarget.value = "";
                                }}
                            />
                            <button className="btn ghost" onClick={() => setShowSubmitModal(false)}>닫기</button>
                        </>
                    }
                >
                    <div className="small" style={{ marginBottom: 8 }}>
                        사번: {currentEmployment.empId} · 회사 기준 문서만 표시됩니다.
                    </div>

                    <div className="list" style={{ marginBottom: 8 }}>
                        {docs.map(doc => {
                            const latest = doc.versions[0];
                            return (
                                <div key={doc.id} className="item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                                    <div className="doccard">
                                        <div className="docmeta">
                                            <div className="title">{doc.title}</div>
                                            <div className="sub">
                                                최신본 v{latest.ver} · {latest.date} ·{" "}
                                                <span className={`badge ${latest.status.includes("승인") ? "badge-ok" :
                                                        latest.status.includes("반려") ? "badge-reject" : "badge-pending"}`}>
                                                    {latest.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="row" style={{ gap: 8 }}>
                                            <a className="btn sm ghost" href={latest.url}>최신본 미리보기</a>
                                            <a className="btn sm" href={latest.url} download={latest.fileName}>다운로드</a>
                                            <button
                                                className="btn sm"
                                                onClick={() => { setUploadTarget(doc.id); uploadRef.current?.click(); }}
                                                title="새 버전 제출"
                                            >
                                                새 버전 제출
                                            </button>
                                        </div>
                                    </div>

                                    <div className="versions">
                                        {doc.versions.map(v => (
                                            <div key={v.ver} className="version">
                                                <div>
                                                    <strong>v{v.ver}</strong> · {v.date} ·{" "}
                                                    <span className={`badge ${v.status.includes("승인") ? "badge-ok" :
                                                            v.status.includes("반려") ? "badge-reject" : "badge-pending"}`}>
                                                        {v.status}
                                                    </span>
                                                    <div className="small">{v.note} · 파일: {v.fileName}</div>
                                                </div>
                                                <div className="row" style={{ gap: 8 }}>
                                                    <a className="btn sm ghost" href={v.url}>보기</a>
                                                    <a className="btn sm" href={v.url} download={v.fileName}>다운</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Modal>
            )}

            {/* ② 회사 급여/보상 규정 모달 */}
            {showSalaryPolicy && (
                <Modal
                    title="회사 급여/보상 규정(요약)"
                    onClose={() => setShowSalaryPolicy(false)}
                    footer={<button className="btn" onClick={() => setShowSalaryPolicy(false)}>닫기</button>}
                >
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {salaryPolicy.map((p, idx) => (
                            <li key={idx} style={{ marginBottom: 8 }}>
                                <strong>{p.h}:</strong> {p.d}
                            </li>
                        ))}
                    </ul>
                    <div className="small" style={{ marginTop: 10 }}>
                        * 상세 원문은 사내 위키/HR 문서 참조. 필요 시 PDF로 연결하세요.
                    </div>
                </Modal>
            )}

            {/* ✅ ③ 계좌 인증 모달 */}
            {showAccountModal && (
                <Modal
                    title="계좌 인증하기"
                    onClose={() => { setShowAccountModal(false); setAccountResult(null); }}
                    footer={<button className="btn" onClick={() => setShowAccountModal(false)}>닫기</button>}
                >
                    <div className="form" style={{ display: "grid", gap: 8 }}>
                        <label>은행 코드
                            <input
                                value={bankCode}
                                onChange={(e) => setBankCode(e.target.value)}
                                placeholder="예: 004 (국민은행)"
                            />
                        </label>
                        <label>계좌 번호
                            <input
                                value={accountNum}
                                onChange={(e) => setAccountNum(e.target.value)}
                                placeholder="계좌번호 입력"
                            />
                        </label>
                        <button className="btn" onClick={verifyAccount} disabled={loading}>
                            {loading ? "조회 중..." : "인증 요청"}
                        </button>
                    </div>

                    {accountResult && (
                        <div className="result" style={{ marginTop: 10 }}>
                            {"error" in accountResult ? (
                                <div className="badge badge-reject">
                                    오류: {typeof accountResult.error === "string"
                                        ? accountResult.error
                                        : JSON.stringify(accountResult.error)}
                                </div>
                            ) : (
                                <div className="badge badge-ok">
                                    ✅ 예금주: {accountResult.owner_name} ({accountResult.bank_code} {accountResult.account_num})
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
}
