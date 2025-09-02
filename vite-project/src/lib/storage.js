// src/lib/storage.js
import { useEffect, useState } from 'react'

export function useStickyState(initial, key) {
    const [val, setVal] = useState(() => {
        try {
            const raw = localStorage.getItem(key)
            return raw ? JSON.parse(raw) : initial
        } catch { return initial }
    })
    useEffect(() => { localStorage.setItem(key, JSON.stringify(val)) }, [key, val])
    return [val, setVal]
}
