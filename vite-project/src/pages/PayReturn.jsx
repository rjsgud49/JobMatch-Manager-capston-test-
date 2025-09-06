import { useEffect, useMemo, useState } from 'react'
import { useStickyState } from '../lib/storage'
import { seedInitialState } from './state'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
}

export default function PayReturn() {
    const [state, setState] = useStickyState(seedInitialState(), 'jobmatch_state_v2')
    const q = useQuery()
    const nav = useNavigate()
    const [done, setDone] = useState(false)

    // NICE가 붙여준(또는 샌드박스 모의) 파라미터들
    const resultCode = q.get('resultCode') // "0000"이면 정상
    const resultMsg = q.get('resultMsg') || ''
    const amount = q.get('amount')
    const orderId = q.get('orderId')
    const tid = q.get('tid')
    const escrowId = q.get('escrowId') // ← 우리가 returnUrl에 붙여 보낸 식별자

    const ok = resultCode === '0000'

    useEffect(() => {
        // 어떤 에스크로 결제인지 식별 가능할 때만 상태 반영
        if (!escrowId) return

        setState(s => {
            const escrows = s.escrows.map(e => {
                if (e.id !== escrowId) return e
                // 여기서 "결제 완료 → 진행중" 으로 전이(혹은 별도 결제플래그 저장)
                return {
                    ...e,
                    status: ok ? 'IN_PROGRESS' : e.status,
                    lastPayment: {
                        ok,
                        orderId,
                        tid,
                        amount: amount ? Number(amount) : undefined,
                        resultMsg,
                        at: new Date().toISOString(),
                    },
                }
            })
            return { ...s, escrows }
        })

        setDone(true)
    }, [escrowId, ok, orderId, tid, amount, resultMsg, setState])

    // 간단한 결과 화면
    return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ marginTop: 0 }}>결제 결과</h2>
            <div
                style={{
                    padding: 16,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    background: ok ? '#ecfdf5' : '#fef2f2',
                    marginBottom: 16,
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    {ok ? '정상 처리(0000)' : `실패(${resultCode || '—'})`}
                </div>
                <div style={{ color: '#374151' }}>{resultMsg || (ok ? '결제가 승인되었습니다.' : '결제가 실패했습니다.')}</div>
            </div>

            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                <div>주문번호: <b>{orderId || '—'}</b></div>
                <div>TID: <b>{tid || '—'}</b></div>
                <div>금액: <b>{amount ? `₩${Number(amount).toLocaleString()}` : '—'}</b></div>
                <div>에스크로ID: <b>{escrowId || '—'}</b></div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => nav(-1)}>이전으로</button>
                <Link className="btn ghost" to="/pay">에스크로 목록으로</Link>
            </div>

            {done && (
                <p style={{ marginTop: 16, fontSize: 12, color: '#6b7280' }}>
                    상태가 반영되었습니다. 목록에서 <b>IN_PROGRESS</b>로 바뀐 항목을 확인하세요.
                </p>
            )}
        </div>
    )
}
