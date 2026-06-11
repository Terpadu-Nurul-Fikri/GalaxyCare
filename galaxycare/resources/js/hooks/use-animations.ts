import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sipaska-animations';

export function useAnimations() {
    const [enabled, setEnabled] = useState(() => {
        if (typeof window === 'undefined') {
return true;
}

        const stored = localStorage.getItem(STORAGE_KEY);

        return stored === null ? true : stored === '1';
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
        document.documentElement.classList.toggle('no-animations', !enabled);
    }, [enabled]);

    const toggle = useCallback(() => setEnabled((v) => !v), []);

    return { enabled, toggle };
}
