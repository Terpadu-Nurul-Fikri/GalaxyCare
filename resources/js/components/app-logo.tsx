import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

type AppLogoProps = {
    variant?: 'default' | 'sidebar';
};

export default function AppLogo({ variant = 'default' }: AppLogoProps) {
    const isSidebar = variant === 'sidebar';

    return (
        <>
            <div className="flex aspect-square size-11 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm dark:bg-slate-900">
                <AppLogoIcon className="h-full w-full object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span
                    className={cn(
                        'truncate text-2xl leading-tight font-extrabold tracking-normal group-data-[collapsible=icon]:hidden',
                        isSidebar
                            ? 'text-white'
                            : 'text-foreground dark:text-white',
                    )}
                >
                    SIPASKA
                </span>
                <span
                    className={cn(
                        'truncate text-[11px] leading-tight font-semibold uppercase group-data-[collapsible=icon]:hidden',
                        isSidebar
                            ? 'text-blue-100'
                            : 'text-primary dark:text-blue-200',
                    )}
                >
                    BSP Kampus
                </span>
            </div>
        </>
    );
}
