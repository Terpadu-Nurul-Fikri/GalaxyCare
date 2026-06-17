import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sipaska-animations';

const getStoredAnimationPreference = (): boolean => {
    if (typeof window === 'undefined') {
        return true;
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    return stored === null ? true : stored === '1';
};

const applyAnimationPreference = (enabled: boolean): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.toggle('no-animations', !enabled);
};

export function initializeAnimations(): void {
    applyAnimationPreference(getStoredAnimationPreference());
}

export function useAnimations() {
    const [enabled, setEnabled] = useState(getStoredAnimationPreference);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
        applyAnimationPreference(enabled);
    }, [enabled]);

    const toggle = useCallback(() => setEnabled((v) => !v), []);

    return { enabled, toggle };
}
