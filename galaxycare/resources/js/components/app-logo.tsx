import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-11 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm dark:bg-slate-900">
                <AppLogoIcon className="h-full w-full object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-2xl leading-tight font-extrabold tracking-normal text-foreground group-data-[collapsible=icon]:hidden dark:text-white">
                    SIPASKA
                </span>
                <span className="truncate text-[11px] leading-tight font-semibold text-primary uppercase group-data-[collapsible=icon]:hidden dark:text-blue-200">
                    BSP Kampus
                </span>
            </div>
        </>
    );
}
