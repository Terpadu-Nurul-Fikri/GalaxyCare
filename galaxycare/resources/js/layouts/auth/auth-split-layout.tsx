import { Link, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ClipboardCheck,
    FileText,
    GraduationCap,
    MessageCircle,
    TrendingUp,
} from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center bg-[#f8f9fa] px-4 py-6 sm:px-6 sm:py-8 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(28rem,36rem)] lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(0,30,64,0.07)_1px,transparent_0)] bg-[size:40px_40px]" />
            <div className="relative hidden h-full min-h-[44rem] flex-col overflow-hidden rounded-l-lg bg-[#001e40] p-10 text-white shadow-lg lg:flex">
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-extrabold"
                >
                    <span className="animate-sipaska-glow mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#fd8b00] text-sm font-bold text-white shadow-lg shadow-blue-950/20">
                        <GraduationCap className="h-5 w-5" />
                    </span>
                    {name ?? 'SIPASKA'}
                </Link>
                <div className="relative z-10 mt-12 max-w-xl">
                    <h2 className="text-4xl leading-tight font-extrabold">
                        Sistem Informasi Pengaduan Sarana dan Prasarana Kampus
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-7 text-[#799dd6]">
                        Platform terpadu untuk melaporkan dan memantau perbaikan
                        fasilitas kampus demi kenyamanan bersama civitas
                        akademika.
                    </p>
                    <div className="mt-8 grid gap-3">
                        {[
                            {
                                icon: FileText,
                                label: 'Buat laporan kerusakan fasilitas',
                            },
                            {
                                icon: TrendingUp,
                                label: 'Pantau status penanganan',
                            },
                            {
                                icon: MessageCircle,
                                label: 'Forum aspirasi anonim',
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur transition hover:bg-white/12"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#003366]">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-semibold text-blue-50">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-10 mt-auto overflow-hidden rounded-lg border border-white/10 bg-white/10 p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#fd8b00] text-white">
                            <ClipboardCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">
                                Laporan lebih tertib dan terpantau
                            </p>
                            <p className="mt-1 text-sm leading-6 text-blue-100">
                                Status penanganan, respons admin, dan riwayat
                                laporan tersedia dalam satu portal SIPASKA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative w-full py-6 sm:py-8 lg:p-0">
                <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[34rem] flex-col justify-center gap-7 rounded-lg border border-[#c3c6d1] bg-white p-6 shadow-lg sm:min-h-[calc(100dvh-4rem)] sm:gap-8 sm:p-10 lg:mx-0 lg:min-h-[44rem] lg:max-w-none lg:rounded-l-none">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#001e40] text-sm font-bold text-white shadow-lg">
                            <GraduationCap className="h-6 w-6" />
                        </span>
                    </Link>
                    <div className="flex flex-col items-start gap-3 text-left">
                        <div className="hidden items-center gap-2 rounded-full bg-[#d9e3f7] px-3 py-1 text-xs font-semibold text-[#003366] lg:flex">
                            <CheckCircle className="h-3.5 w-3.5" />
                            SIPASKA STT NF
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#001e40]">
                            {title}
                        </h1>
                        <p className="text-base leading-6 text-[#43474f]">
                            {description}
                        </p>
                    </div>
                    {children}
                    <p className="text-sm leading-6 text-[#737780]">
                        &copy; 2026 SIPASKA - Biro Sarana dan Prasarana Kampus.
                    </p>
                </div>
            </div>
        </div>
    );
}
