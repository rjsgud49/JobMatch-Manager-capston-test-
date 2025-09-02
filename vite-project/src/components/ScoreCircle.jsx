// src/components/ScoreCircle.jsx
export default function ScoreCircle({ value }) {
    const radius = 40
    const stroke = 8
    const norm = (value > 100 ? 100 : value < 0 ? 0 : value)
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (norm / 100) * circumference

    return (
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
            <svg width="100" height="100">
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx="50"
                    cy="50"
                />
                <circle
                    stroke={norm >= 70 ? "#10b981" : norm >= 40 ? "#f59e0b" : "#ef4444"}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx="50"
                    cy="50"
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="18"
                    fill="#111827"
                >
                    {Math.round(norm)}%
                </text>
            </svg>
            <span className="small">매칭률</span>
        </div>
    )
}
