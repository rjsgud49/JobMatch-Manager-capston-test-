/* eslint-env node */
import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** (선택) 헬스/ENV 체크 */
app.get('/api/health', (_req, res) => res.json({ ok: true, t: Date.now() }))
app.get('/api/env-check', (_req, res) =>
    res.json({
        NICE_CLIENT_KEY: !!process.env.NICE_CLIENT_KEY,
        NICE_SECRET_KEY: !!process.env.NICE_SECRET_KEY,
    })
)

/** 샌드박스 승인 호출에 쓸 Basic 헤더 (clientKey:secretKey) */
const BASIC = 'Basic ' + Buffer
    .from(`${process.env.NICE_CLIENT_KEY}:${process.env.NICE_SECRET_KEY}`)
    .toString('base64')

/** (옵션) 승인 API를 따로 호출하고 싶을 때 사용 */
app.post('/api/nicepay/approve', async (req, res) => {
    try {
        const { tid, amount } = req.body || {}
        if (!tid || !amount) return res.status(400).json({ error: 'tid, amount 필수' })
        const url = `https://sandbox-api.nicepay.co.kr/v1/payments/${encodeURIComponent(tid)}`
        const r = await axios.post(
            url,
            { amount: Number(amount) },
            { headers: { Authorization: BASIC, 'Content-Type': 'application/json;charset=utf-8' } }
        )
        res.json(r.data)
    } catch (e) {
        console.error('[APPROVE ERROR]', e.response?.status, e.response?.data || e.message)
        res.status(e.response?.status || 500).json(e.response?.data || { error: e.message })
    }
})

/** 결제창 리턴을 서버로 받아서 곧바로 승인까지 처리(데모) */
app.get('/pay/return', async (req, res) => {
    try {
        const { authResultCode, authResultMsg, tid, amount, orderId } = req.query
        if (authResultCode !== '0000') {
            return res.status(400).send(`<pre>인증 실패\n${authResultCode} ${authResultMsg || ''}</pre>`)
        }
        const url = `https://sandbox-api.nicepay.co.kr/v1/payments/${encodeURIComponent(tid)}`
        const r = await axios.post(
            url,
            { amount: Number(amount) || 1000 },
            { headers: { Authorization: BASIC, 'Content-Type': 'application/json;charset=utf-8' } }
        )
        res
            .status(200)
            .send(`<pre>승인 성공
orderId=${orderId}
tid=${tid}

${JSON.stringify(r.data, null, 2)}</pre>`)
    } catch (e) {
        console.error('[RETURN/APPROVE ERROR]', e.response?.status, e.response?.data || e.message)
        res
            .status(e.response?.status || 500)
            .send(`<pre>${e.response?.data ? JSON.stringify(e.response.data, null, 2) : e.message}</pre>`)
    }
})

/** (선택) 웹훅 수신 — 콘솔에 등록하면 결과가 여기로 옴(외부URL 필요) */
app.post('/api/nicepay/webhook', (req, res) => {
    console.log('[WEBHOOK] headers:', req.headers)
    console.log('[WEBHOOK] body:', req.body)
    res.json({ ok: true })
})

const PORT = process.env.PORT || 5174
app.listen(PORT, () => console.log(`API on :${PORT}`))

// 👇 기존 GET 그대로 두고, POST도 추가
app.post('/pay/return', async (req, res) => {
    try {
        // 나이스가 x-www-form-urlencoded로 보내므로 body에서 꺼냄
        const { authResultCode, authResultMsg, tid, amount, orderId } = req.body || {}
        if (authResultCode !== '0000') {
            return res.status(400).send(`<pre>인증 실패\n${authResultCode} ${authResultMsg || ''}</pre>`)
        }
        const url = `https://sandbox-api.nicepay.co.kr/v1/payments/${encodeURIComponent(tid)}`
        const r = await axios.post(
            url,
            { amount: Number(amount) || 1000 },
            { headers: { Authorization: BASIC, 'Content-Type': 'application/json;charset=utf-8' } }
        )
        res
            .status(200)
            .send(`<pre>승인 성공
orderId=${orderId}
tid=${tid}

${JSON.stringify(r.data, null, 2)}</pre>`)
    } catch (e) {
        console.error('[RETURN/APPROVE ERROR]', e.response?.status, e.response?.data || e.message)
        res
            .status(e.response?.status || 500)
            .send(`<pre>${e.response?.data ? JSON.stringify(e.response.data, null, 2) : e.message}</pre>`)
    }
})
