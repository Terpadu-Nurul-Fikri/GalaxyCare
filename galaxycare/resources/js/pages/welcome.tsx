import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    FileText,
    MessageCircle,
    Send,
    TrendingUp,
} from 'lucide-react';
import { AnimateIn } from '@/components/animate-in';
import { PublicLayout } from '@/components/public-layout';
import { dashboard, register } from '@/routes';

type Props = {
    canRegister?: boolean;
    stats: {
        total: number;
        pending: number;
        diproses: number;
        selesai: number;
    };
};

export default function Welcome({ stats }: Props) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <>
            <Head title="SIPASKA - Sistem Pengaduan Fasilitas Kampus" />
            <PublicLayout>
                {/* Hero */}
                <section className="relative overflow-hidden bg-[#001e40] px-4 py-16 sm:py-20">
                    <img
                        src="/stitch-dashboard-screen.png"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
                    />
                    <div className="absolute inset-0 bg-[#001e40]/85" />
                    <div className="relative mx-auto max-w-4xl text-center">
                        <AnimateIn>
                            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-100">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fd8b00]" />
                                STT Terpadu Nurul Fikri
                            </p>
                        </AnimateIn>
                        <AnimateIn delay={100}>
                            <h1 className="text-4xl leading-tight font-extrabold text-white sm:text-5xl">
                                SIPASKA
                            </h1>
                        </AnimateIn>
                        <AnimateIn delay={200}>
                            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                                Sistem Pengaduan Fasilitas Kampus untuk
                                melaporkan kerusakan, memantau progres, dan
                                menjaga fasilitas akademik tetap responsif.
                            </p>
                        </AnimateIn>
                        <AnimateIn delay={300}>
                            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                {auth.user ? (
                                    <Link
                                        href={dashboardUrl}
                                        prefetch
                                        className="w-full rounded-xl bg-[#fd8b00] px-6 py-3 text-center font-bold text-white shadow-lg shadow-orange-950/20 transition-all hover:bg-orange-600 sm:w-auto"
                                    >
                                        <Send className="mr-2 inline h-4 w-4" />
                                        Buat Pengaduan
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            prefetch
                                            className="w-full rounded-xl bg-[#fd8b00] px-6 py-3 text-center font-bold text-white shadow-lg shadow-orange-950/20 transition-all hover:bg-orange-600 sm:w-auto"
                                        >
                                            <Send className="mr-2 inline h-4 w-4" />
                                            Lapor Sekarang
                                        </Link>
                                        <Link
                                            href="/progress"
                                            prefetch
                                            className="w-full rounded-xl border border-white/30 px-6 py-3 text-center font-bold text-white transition-all hover:bg-white/10 sm:w-auto"
                                        >
                                            <TrendingUp className="mr-2 inline h-4 w-4" />
                                            Lihat Progress
                                        </Link>
                                    </>
                                )}
                            </div>
                        </AnimateIn>
                    </div>
                </section>

                {/* Stats */}
                <section className="border-t border-slate-200 px-4 py-14">
                    <div className="mx-auto max-w-4xl">
                        <AnimateIn>
                            <p className="text-center text-sm font-bold text-slate-500 uppercase">
                                Statistik Pengaduan
                            </p>
                        </AnimateIn>
                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                {
                                    icon: FileText,
                                    value: stats.total,
                                    label: 'Total Laporan',
                                    color: 'text-[#003366] bg-blue-100',
                                },
                                {
                                    icon: Clock,
                                    value: stats.pending,
                                    label: 'Menunggu',
                                    color: 'text-[#fd8b00] bg-orange-100',
                                },
                                {
                                    icon: TrendingUp,
                                    value: stats.diproses,
                                    label: 'Diproses',
                                    color: 'text-blue-600 bg-blue-100',
                                },
                                {
                                    icon: CheckCircle,
                                    value: stats.selesai,
                                    label: 'Selesai',
                                    color: 'text-green-600 bg-green-50',
                                },
                            ].map((item, i) => (
                                <AnimateIn key={item.label} delay={i * 100}>
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:border-[#003366]/30 hover:shadow-md">
                                        <div
                                            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${item.color} transition-transform group-hover:scale-110`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <p className="mt-3 text-2xl font-extrabold text-[#001e40]">
                                            {item.value}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {item.label}
                                        </p>
                                    </div>
                                </AnimateIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="bg-[#f7f9fb] px-4 py-16">
                    <div className="mx-auto max-w-4xl">
                        <AnimateIn>
                            <h2 className="text-center text-2xl font-extrabold text-[#001e40] sm:text-3xl">
                                Bagaimana Cara Kerjanya?
                            </h2>
                        </AnimateIn>
                        <div className="mt-12 grid gap-6 sm:grid-cols-3">
                            {[
                                {
                                    icon: Send,
                                    title: 'Lapor Cepat',
                                    desc: 'Isi form, upload foto, kirim. Selesai dalam 30 detik.',
                                    color: 'bg-[#003366]',
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Tracking Real-time',
                                    desc: 'Pantau status dari pending hingga selesai. Transparan.',
                                    color: 'bg-blue-600',
                                },
                                {
                                    icon: MessageCircle,
                                    title: 'Forum Anonim',
                                    desc: 'Sampaikan kritik & saran tanpa perlu login.',
                                    color: 'bg-[#fd8b00]',
                                },
                            ].map((item, i) => (
                                <AnimateIn key={item.title} delay={i * 150}>
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color} text-white shadow-sm transition-transform group-hover:scale-110`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-4 font-bold text-[#001e40]">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                            {item.desc}
                                        </p>
                                    </div>
                                </AnimateIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-4 py-16">
                    <AnimateIn>
                        <div className="mx-auto max-w-2xl rounded-2xl bg-[#001e40] p-8 text-center shadow-xl sm:p-12">
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                Siap Melaporkan?
                            </h2>
                            <p className="mt-3 text-blue-100">
                                Daftar dengan email @student.nurulfikri.ac.id
                            </p>
                            <Link
                                href={register()}
                                prefetch
                                className="mt-6 inline-block rounded-xl bg-[#fd8b00] px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-lg"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </AnimateIn>
                </section>
            </PublicLayout>
        </>
    );
}
