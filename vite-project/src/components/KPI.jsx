// src/components/KPI.jsx
export default function KPI({ title, value }) {
    return (
        <div className="kpi">
            <div className="kpi__value">{value}</div>
            <div className="kpi__title">{title}</div>
        </div>
    )
}
