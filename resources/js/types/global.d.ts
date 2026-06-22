import type { Auth } from '@/types/auth';
import type { Team } from '@/types/teams';
import type { FlashToast } from '@/types/ui';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            flash: {
                toast?: FlashToast | null;
                success: string | null;
                error: string | null;
            };
            unreadNotificationsCount: number;
            sidebarOpen: boolean;
            currentTeam: Team | null;
            teams: Team[];
            [key: string]: unknown;
        };
    }
}
