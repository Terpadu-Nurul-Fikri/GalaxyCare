import { GraduationCap } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="animate-sipaska-glow flex aspect-square size-10 items-center justify-center rounded-lg bg-[#fd8b00] text-white shadow-sm">
                <GraduationCap className="size-5" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-2xl leading-tight font-extrabold tracking-normal text-white group-data-[collapsible=icon]:hidden">
                    SIPASKA
                </span>
                <span className="truncate text-[11px] leading-tight font-semibold text-blue-100 uppercase group-data-[collapsible=icon]:hidden">
                    Student Portal
                </span>
            </div>
        </>
    );
}
