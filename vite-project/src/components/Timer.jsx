// src/components/Timer.jsx
import { useEffect, useRef, useState } from "react"

export default function Timer({ onStop }) {
    const [running, setRunning] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const startRef = useRef(null)
    const timerRef = useRef(null)

    useEffect(() => {
        if (running) {
            startRef.current = Date.now() - elapsed
            timerRef.current = setInterval(() => {
                setElapsed(Date.now() - startRef.current)
            }, 100)
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [running])

    const formatTime = (ms) => {
        const totalSec = Math.floor(ms / 1000)
        const h = String(Math.floor(totalSec / 3600)).padStart(2, "0")
        const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0")
        const s = String(totalSec % 60).padStart(2, "0")
        return `${h}:${m}:${s}`
    }

    const handleStart = () => setRunning(true)
    const handleStop = () => {
        setRunning(false)
        if (onStop) onStop(elapsed)
        setElapsed(0)
    }

    return (
        <div className="card">
            <h3>근무 타이머</h3>
            <div style={{ fontSize: "1.5rem", margin: "8px 0" }}>
                {formatTime(elapsed)}
            </div>
            {!running ? (
                <button className="btn" onClick={handleStart}>
                    시작
                </button>
            ) : (
                <button className="btn ghost" onClick={handleStop}>
                    종료
                </button>
            )}
        </div>
    )
}
