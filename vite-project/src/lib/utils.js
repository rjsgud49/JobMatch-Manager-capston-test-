// src/lib/utils.js

// 고유 ID 생성
export function uid() {
    return crypto.randomUUID()
}

// 오늘 날짜 (YYYY-MM-DD)
export function today() {
    return new Date().toISOString().slice(0, 10)
}

// 며칠 뒤 날짜 계산
export function plusDays(days) {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
}
