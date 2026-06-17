import { Link, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ClipboardCheck,
    FileText,
    MessageCircle,
    TrendingUp,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    const highlights = [
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
    ];

    return (
        <div className="relative flex min-h-dvh items-center justify-center bg-[#f8f9fa] px-4 py-6 sm:px-6 sm:py-8 dark:bg-slate-950">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(0,30,64,0.07)_1px,transparent_0)] bg-[size:40px_40px] dark:opacity-40" />

            <div className="relative grid w-full max-w-6xl overflow-hidden rounded-lg border border-[#c3c6d1] bg-white shadow-xl lg:min-h-[40rem] lg:grid-cols-[minmax(0,1fr)_minmax(28rem,36rem)] dark:border-slate-800 dark:bg-slate-900">
                <section className="relative hidden min-h-[40rem] flex-col overflow-hidden bg-[#001e40] p-10 text-white lg:flex">
                    <div className="animate-sipaska-auth-sheen pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(253,139,0,0.16),transparent_34%,rgba(255,255,255,0.08)_68%,transparent)]" />

                    <div className="relative z-10 flex h-full flex-col justify-center gap-8">
                        <Link
                            href={home()}
                            className="flex w-fit items-center gap-3 text-lg font-extrabold"
                        >
                            <span className="animate-sipaska-glow flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-lg shadow-blue-950/20">
                                <AppLogoIcon className="h-full w-full object-contain" />
                            </span>
                            {name ?? 'SIPASKA'}
                        </Link>

                        <div className="max-w-xl">
                            <h2 className="text-4xl leading-tight font-extrabold">
                                Sistem Pengaduan Fasilitas Kampus
                            </h2>
                            <p className="mt-6 max-w-md text-base leading-7 text-blue-100/80">
                                Platform terpadu untuk melaporkan dan memantau
                                perbaikan fasilitas kampus yang dikelola oleh
                                BSP, Biro Sarana dan Prasarana.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {highlights.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur transition hover:bg-white/12"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#003366]">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-blue-50">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/10 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#fd8b00] text-white">
                                    <ClipboardCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Laporan lebih tertib dan terpantau
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-blue-100">
                                        Status penanganan, respons admin, dan
                                        riwayat laporan tersedia dalam satu
                                        portal SIPASKA.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative flex min-h-[calc(100dvh-3rem)] w-full flex-col justify-center gap-6 bg-white p-6 sm:min-h-[calc(100dvh-4rem)] sm:p-10 lg:min-h-[40rem] dark:bg-slate-900">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700">
                            <AppLogoIcon className="h-full w-full object-contain" />
                        </span>
                    </Link>

                    <div className="flex flex-col items-start gap-3 text-left">
                        <div className="hidden items-center gap-2 rounded-full bg-[#d9e3f7] px-3 py-1 text-xs font-semibold text-[#003366] lg:flex dark:bg-slate-800 dark:text-blue-100">
                            <CheckCircle className="h-3.5 w-3.5" />
                            SIPASKA STT NF
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#001e40] dark:text-white">
                            {title}
                        </h1>
                        <p className="text-base leading-6 text-[#43474f] dark:text-slate-300">
                            {description}
                        </p>
                    </div>

                    {children}

                    <p className="text-sm leading-6 text-[#737780] dark:text-slate-400">
                        &copy; 2026 SIPASKA - Biro Sarana dan Prasarana.
                    </p>
                </section>
            </div>
        </div>
    );
}
