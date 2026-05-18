import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    FileText,
    MessageCircle,
    Send,
    TrendingUp,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

type Props = {
    canRegister?: boolean;
    stats: {
        total: number;
        pending: number;
        diproses: number;
        selesai: number;
    };
};

export default function Welcome({ canRegister = true, stats }: Props) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <>
            <Head title="SIPASKA - Sistem Pengaduan Fasilitas Kampus" />
            <div className="min-h-screen bg-white">
                {/* Nav */}
                <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                                NF
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                                SIPASKA
                            </span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/progress"
                                className="hidden px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 sm:inline-block"
                            >
                                Progress
                            </Link>
                            <Link
                                href="/forum"
                                className="hidden px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 sm:inline-block"
                            >
                                Forum
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600"
                                    >
                                        Masuk
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Daftar
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-20 sm:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="mb-4 text-sm font-medium text-blue-600">
                            STT Terpadu Nurul Fikri
                        </p>
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-5xl">
                            Sistem Pengaduan
                            <br />
                            Fasilitas Kampus
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-gray-600">
                            Sampaikan keluhan fasilitas kampus dengan mudah dan
                            pantau progresnya secara transparan.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700 sm:w-auto"
                                >
                                    <Send className="mr-2 inline h-4 w-4" />
                                    Buat Pengaduan
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={register()}
                                        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700 sm:w-auto"
                                    >
                                        <Send className="mr-2 inline h-4 w-4" />
                                        Lapor Sekarang
                                    </Link>
                                    <Link
                                        href="/progress"
                                        className="w-full rounded-lg border border-gray-200 px-6 py-3 text-center font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
                                    >
                                        <TrendingUp className="mr-2 inline h-4 w-4" />
                                        Lihat Progress
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="border-t border-gray-100 px-4 py-12">
                    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                            <FileText className="mx-auto h-6 w-6 text-blue-600" />
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stats.total}
                            </p>
                            <p className="text-xs text-gray-500">
                                Total Laporan
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                            <Clock className="mx-auto h-6 w-6 text-amber-500" />
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stats.pending}
                            </p>
                            <p className="text-xs text-gray-500">Menunggu</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                            <TrendingUp className="mx-auto h-6 w-6 text-blue-500" />
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stats.diproses}
                            </p>
                            <p className="text-xs text-gray-500">Diproses</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                            <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stats.selesai}
                            </p>
                            <p className="text-xs text-gray-500">Selesai</p>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="bg-blue-50 px-4 py-16">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="text-center text-2xl font-bold text-gray-900">
                            Fitur SIPASKA
                        </h2>
                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <Send className="h-8 w-8 text-blue-600" />
                                <h3 className="mt-3 font-semibold text-gray-900">
                                    Lapor Cepat
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Buat laporan kerusakan fasilitas dalam
                                    hitungan detik dengan foto bukti.
                                </p>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <TrendingUp className="h-8 w-8 text-blue-600" />
                                <h3 className="mt-3 font-semibold text-gray-900">
                                    Tracking Transparan
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Pantau status laporan secara real-time.
                                    Semua orang bisa lihat progress.
                                </p>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <MessageCircle className="h-8 w-8 text-blue-600" />
                                <h3 className="mt-3 font-semibold text-gray-900">
                                    Forum Anonim
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Sampaikan kritik dan saran secara anonim
                                    tanpa perlu login.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100 px-4 py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
                                NF
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                                SIPASKA
                            </span>
                            <span className="text-sm text-gray-400">
                                • STT Terpadu Nurul Fikri
                            </span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                            <Link
                                href="/progress"
                                className="hover:text-blue-600"
                            >
                                Progress
                            </Link>
                            <Link href="/forum" className="hover:text-blue-600">
                                Forum
                            </Link>
                            <Link
                                href={login()}
                                className="hover:text-blue-600"
                            >
                                Masuk
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
