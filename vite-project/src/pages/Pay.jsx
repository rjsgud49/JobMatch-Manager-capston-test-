import { useEffect } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import KPI from '../components/KPI.jsx'

export default function Pay() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const update = (id, status) =>
        setState(s => ({ ...s, escrows: s.escrows.map(e => (e.id === id ? { ...e, status } : e)) }))

    // NICEPAY JS SDK 프리로드
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

    // 작은 팝업으로 결제창 열기
    const openNicePayPopup = ({ escrowId, amount, goodsName, buyerName }) => {
        const clientId = import.meta.env?.VITE_NICE_CLIENT_KEY || 'S2_b93d3ee0b4264ccab621972dec981b74'
        const baseReturnUrl =
            import.meta.env?.VITE_NICE_RETURN_URL || `${location.origin}/pay/return`

        // 어떤 에스크로 결제인지 식별용 파라미터 추가
        const returnUrl = `${baseReturnUrl}${baseReturnUrl.includes('?') ? '&' : '?'}escrowId=${encodeURIComponent(escrowId)}`

        const params = {
            clientId,
            method: 'card',
            orderId: 'POPUP-' + Math.random().toString(16).slice(2),
            amount: Number(amount || 1000),
            goodsName: goodsName || '테스트 상품',
            buyerName: buyerName || '테스트',
            returnUrl, // ← escrowId 포함
        }

        const popup = window.open(
            '',
            'nicepayPopup',
            'width=480,height=720,resizable=no,scrollbars=yes'
        )
        if (!popup) {
            alert('팝업이 차단되었습니다. 브라우저에서 팝업 허용을 켜주세요.')
            return
        }

        window.__NP_PARAMS__ = params

        const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>NICEPAY 결제</title>
  <script src="https://pay.nicepay.co.kr/v1/js/"><\\/script>
  <style>body{font-family:sans-serif;padding:24px;margin:0}</style>
</head>
<body>
  <h3 style="margin:0 0 8px">결제 진행중...</h3>
  <script>
    (function () {
      try {
        var p = window.opener && window.opener.__NP_PARAMS__;
        if (!p) { alert('초기화 오류: 파라미터 없음'); window.close(); return; }
        if (!window.AUTHNICE) { alert('SDK 로딩 실패'); window.close(); return; }
        AUTHNICE.requestPay({
          clientId: p.clientId,
          method: p.method,
          orderId: p.orderId,
          amount: p.amount,
          goodsName: p.goodsName,
          buyerName: p.buyerName,
          returnUrl: p.returnUrl,
          fnError: function (r) {
            alert('에러: ' + (r.errorMsg || r.msg || '알 수 없는 오류'));
            window.close();
          }
        });
      } catch (e) {
        alert('오류: ' + (e && e.message ? e.message : e));
        window.close();
      }
    })();
  <\\/script>
</body>
</html>`

        popup.document.open()
        popup.document.write(html)
        popup.document.close()
    }

    return (
        <div className="grid">
            <aside className="card">
                <h2>페이시스템 안내</h2>
                <ul className="small">
                    <li>에스크로 예치금은 마감/검수 충족 시 자동 지급</li>
                    <li>분쟁 발생 시 지급 보류 → 중재 모듈 연계</li>
                </ul>
            </aside>

            <section>
                <div className="kpis">
                    <KPI title="총 건수" value={state.escrows.length} />
                    <KPI title="진행중" value={state.escrows.filter(e => e.status === 'IN_PROGRESS').length} />
                    <KPI title="지급완료" value={state.escrows.filter(e => e.status === 'RELEASED').length} />
                    <KPI title="분쟁" value={state.escrows.filter(e => e.status === 'DISPUTED').length} />
                </div>

                <div className="card" style={{ marginTop: 12 }}>
                    <h2>에스크로 목록</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>프로젝트</th>
                                <th>계약자</th>
                                <th>예치금</th>
                                <th>마감일</th>
                                <th>상태</th>
                                <th>조치</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.escrows.map(e => (
                                <tr key={e.id}>
                                    <td>{e.project}</td>
                                    <td>{e.contractor}</td>
                                    <td>₩{e.amount.toLocaleString()}</td>
                                    <td>{e.deadline}</td>
                                    <td>
                                        <span className={`pill ${e.status.toLowerCase()}`}>{e.status}</span>
                                    </td>
                                    <td className="row" style={{ gap: 8 }}>
                                        <button className="btn sm" onClick={() => update(e.id, 'RELEASED')}>
                                            지급
                                        </button>
                                        <button className="btn sm ghost" onClick={() => update(e.id, 'DISPUTED')}>
                                            분쟁
                                        </button>
                                        {/* ★ 결제(팝업) 테스트 */}
                                        <button
                                            className="btn sm"
                                            onClick={() =>
                                                openNicePayPopup({
                                                    escrowId: e.id,          // ← 추가!
                                                    amount: e.amount,
                                                    goodsName: e.project,
                                                    buyerName: e.contractor,
                                                })
                                            }
                                            title="작은 팝업창에서 결제창 열기"
                                        >
                                            결제(팝업)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
