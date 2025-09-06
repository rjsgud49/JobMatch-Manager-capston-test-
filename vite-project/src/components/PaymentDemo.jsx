import { useMemo, useState } from "react";

/** 간단한 유틸 */
const genOrderId = () => Math.random().toString(16).slice(2);
const nowISO = () => new Date().toISOString().replace(/[-:]/g, "").slice(0, 14);

/** 모의 NICE 결제 모달 */
function MockNicepayModal({ open, onClose, payload }) {
    if (!open) return null;

    const [cardNo, setCardNo] = useState("");
    const [installment, setInstallment] = useState("0");

    const wrap = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
    };
    const box = {
        width: 420,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
    };
    const head = { padding: "16px 20px", borderBottom: "1px solid #eee", fontWeight: 700 };
    const body = { padding: 20, display: "grid", gap: 12 };
    const row = { display: "grid", gap: 6 };
    const lab = { fontSize: 12, color: "#555" };
    const inp = { padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8 };
    const foot = {
        padding: 16,
        borderTop: "1px solid #eee",
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
    };
    const btn = (variant = "solid") => ({
        padding: "10px 14px",
        borderRadius: 8,
        border: variant === "ghost" ? "1px solid #e5e7eb" : "none",
        background: variant === "solid" ? "#2563eb" : "#fff",
        color: variant === "solid" ? "#fff" : "#111",
        cursor: "pointer",
    });

    const redirectToReturnUrl = (ok) => {
        // NICE 승인 응답을 흉내낸 파라미터
        const qs = new URLSearchParams({
            orderId: payload.orderId,
            amount: String(payload.amount),
            goodsName: payload.goodsName,
            buyerName: payload.buyerName,
            resultCode: ok ? "0000" : "9999",
            resultMsg: ok ? "정상처리" : "모의실패",
            tid: "TID" + Math.random().toString(36).slice(2, 10).toUpperCase(),
            approvedAt: nowISO(),
            payMethod: payload.method || "card",
        }).toString();

        // 보통은 서버의 /pay/return(가짜)로 리다이렉트
        const url = `${payload.returnUrl}${payload.returnUrl.includes("?") ? "&" : "?"}${qs}`;
        window.location.href = url;
    };

    return (
        <div style={wrap} onClick={onClose}>
            <div style={box} onClick={(e) => e.stopPropagation()}>
                <div style={head}>나이스페이 모의 결제창</div>
                <div style={body}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {payload.goodsName} <span style={{ color: "#6b7280", fontWeight: 500 }}>({payload.amount.toLocaleString()}원)</span>
                    </div>

                    <div style={{ ...row, marginTop: 4 }}>
                        <div style={lab}>구매자</div>
                        <div>{payload.buyerName}</div>
                    </div>

                    <div style={row}>
                        <div style={lab}>카드번호(모의)</div>
                        <input
                            style={inp}
                            placeholder="4242 4242 4242 4242"
                            value={cardNo}
                            onChange={(e) => setCardNo(e.target.value)}
                        />
                    </div>

                    <div style={row}>
                        <div style={lab}>할부(개월)</div>
                        <select style={inp} value={installment} onChange={(e) => setInstallment(e.target.value)}>
                            <option value="0">일시불</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="6">6</option>
                            <option value="12">12</option>
                        </select>
                    </div>

                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                        ※ 실제 결제가 이루어지지 않는 <b>모의 UI</b>입니다. 승인/실패 버튼으로 흐름만 테스트하세요.
                    </div>
                </div>
                <div style={foot}>
                    <button style={btn("ghost")} onClick={onClose}>닫기</button>
                    <button style={btn("ghost")} onClick={() => redirectToReturnUrl(false)}>실패(모의)</button>
                    <button style={btn()} onClick={() => redirectToReturnUrl(true)}>결제(모의 승인)</button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentDemo() {
    const [amount, setAmount] = useState(55000);
    const [goodsName, setGoodsName] = useState("샌드박스 상품");
    const [buyerName, setBuyerName] = useState("홍길동");
    const [open, setOpen] = useState(false);

    const payload = useMemo(() => {
        return {
            clientId: "S2_b93d3ee0b4264ccab621972dec981b74",
            method: "card",
            orderId: genOrderId(),
            amount: Number(amount) || 1000,
            goodsName: goodsName?.trim() || "테스트 상품",
            buyerName: buyerName?.trim() || "테스트",
            returnUrl: "http://localhost:5174/pay/return",
        };
    }, [amount, goodsName, buyerName]);

    const wrap = { fontFamily: "system-ui, sans-serif", padding: 24 };
    const label = { display: "block", marginTop: 12 };
    const input = { padding: 8, width: 260, border: "1px solid #e5e7eb", borderRadius: 8 };
    const btn = { padding: "10px 16px", marginTop: 16, borderRadius: 8, border: "none", background: "#111", color: "#fff", cursor: "pointer" };

    return (
        <div style={wrap}>
            <h2>나이스페이 결제창 테스트 (React + 모의 모달)</h2>

            <label style={label}>금액</label>
            <input
                type="number"
                style={input}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <label style={label}>주문명</label>
            <input
                style={input}
                value={goodsName}
                onChange={(e) => setGoodsName(e.target.value)}
            />

            <label style={label}>구매자명</label>
            <input
                style={input}
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
            />

            <div>
                <button style={btn} onClick={() => setOpen(true)}>결제하기(모의)</button>
            </div>

            <MockNicepayModal
                open={open}
                onClose={() => setOpen(false)}
                payload={payload}
            />
        </div>
    );
}
