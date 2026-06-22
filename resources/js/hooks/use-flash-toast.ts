import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashMessages = {
    toast?: FlashToast;
    success?: string | null;
    error?: string | null;
};

function showFlashToast(flash?: FlashMessages): void {
    if (flash?.toast) {
        toast[flash.toast.type](flash.toast.message);

        return;
    }

    if (flash?.success) {
        toast.success(flash.success);
    }

    if (flash?.error) {
        toast.error(flash.error);
    }
}

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            showFlashToast(flash);
        });
    }, []);
}
