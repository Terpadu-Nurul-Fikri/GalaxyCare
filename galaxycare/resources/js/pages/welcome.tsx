import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, MessageCircle, Send, TrendingUp } from 'lucide-react';
import { AnimateIn } from '@/components/animate-in';
import { PublicLayout } from '@/components/public-layout';
import { dashboard, register } from '@/routes';

type Props = {
    canRegister?: boolean;
    stats: { total: number; pending: number; diproses: number; selesai: number };
};

export default function Welcome({ stats }: Props) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <>
            <Head title="SIPASKA - Sistem Pengaduan Fasilitas Kampus" />
            <PublicLayout>
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-4 py-20 sm:py-28">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-50/80 blur-3xl" />
                    </div>
                    <div className="relative mx-auto max-w-3xl text-center">
                        <AnimateIn>
                            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                STT Terpadu Nurul Fikri
                            </p>
                        </AnimateIn>
                        <AnimateIn delay={100}>
                            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-5xl">
                                Sistem Pengaduan<br />
                                <span className="text-blue-600">Fasilitas Kampus</span>
                            </h1>
                        </AnimateIn>
                        <AnimateIn delay={200}>
                            <p className="mx-auto mt-5 max-w-lg text-gray-500 sm:text-lg">
                                Laporkan kerusakan fasilitas dengan mudah, pantau progresnya secara transparan.
                            </p>
                        </AnimateIn>
                        <AnimateIn delay={300}>
                            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                {auth.user ? (
                                    <Link href={dashboardUrl} className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-medium text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 sm:w-auto">
                                        <Send className="mr-2 inline h-4 w-4" />Buat Pengaduan
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={register()} className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-medium text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 sm:w-auto">
                                            <Send className="mr-2 inline h-4 w-4" />Lapor Sekarang
                                        </Link>
                                        <Link href="/progress" className="w-full rounded-xl border border-gray-200 px-6 py-3 text-center font-medium text-gray-700 transition-all hover:border-blue-200 hover:bg-blue-50 sm:w-auto">
                                            <TrendingUp className="mr-2 inline h-4 w-4" />Lihat Progress
                                        </Link>
                                    </>
                                )}
                            </div>
                        </AnimateIn>
                    </div>
                </section>

                {/* Stats */}
                <section className="border-t border-gray-100 px-4 py-14">
                    <div className="mx-auto max-w-4xl">
                        <AnimateIn>
                            <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider">Statistik Pengaduan</p>
                        </AnimateIn>
                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                { icon: FileText, value: stats.total, label: 'Total Laporan', color: 'text-blue-600 bg-blue-50' },
                                { icon: Clock, value: stats.pending, label: 'Menunggu', color: 'text-amber-600 bg-amber-50' },
                                { icon: TrendingUp, value: stats.diproses, label: 'Diproses', color: 'text-indigo-600 bg-indigo-50' },
                                { icon: CheckCircle, value: stats.selesai, label: 'Selesai', color: 'text-green-600 bg-green-50' },
                            ].map((item, i) => (
                                <AnimateIn key={item.label} delay={i * 100}>
                                    <div className="group rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
                                        <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${item.color} transition-transform group-hover:scale-110`}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <p className="mt-3 text-2xl font-bold text-gray-900">{item.value}</p>
                                        <p className="text-xs text-gray-500">{item.label}</p>
                                    </div>
                                </AnimateIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16">
                    <div className="mx-auto max-w-4xl">
                        <AnimateIn>
                            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Bagaimana Cara Kerjanya?</h2>
                        </AnimateIn>
                        <div className="mt-12 grid gap-6 sm:grid-cols-3">
                            {[
                                { icon: Send, title: 'Lapor Cepat', desc: 'Isi form, upload foto, kirim. Selesai dalam 30 detik.', color: 'from-blue-500 to-blue-600' },
                                { icon: TrendingUp, title: 'Tracking Real-time', desc: 'Pantau status dari pending hingga selesai. Transparan.', color: 'from-indigo-500 to-indigo-600' },
                                { icon: MessageCircle, title: 'Forum Anonim', desc: 'Sampaikan kritik & saran tanpa perlu login.', color: 'from-violet-500 to-violet-600' },
                            ].map((item, i) => (
                                <AnimateIn key={item.title} delay={i * 150}>
                                    <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm transition-transform group-hover:scale-110`}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                                    </div>
                                </AnimateIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-4 py-16">
                    <AnimateIn>
                        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-center shadow-xl sm:p-12">
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">Siap Melaporkan?</h2>
                            <p className="mt-3 text-blue-100">Daftar dengan email @student.nurulfikri.ac.id</p>
                            <Link href={register()} className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-medium text-blue-600 shadow-sm transition-all hover:shadow-lg">
                                Daftar Sekarang
                            </Link>
                        </div>
                    </AnimateIn>
                </section>
            </PublicLayout>
        </>
    );
}
