import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, TrendingUp } from 'lucide-react';
import { login } from '@/routes';

type Report = {
    id: number;
    title: string;
    category: string;
    location: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    created_at: string;
};

type Props = {
    stats: {
        total: number;
        pending: number;
        diproses: number;
        selesai: number;
    };
    reports: {
        data: Report[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
};

const statusMap = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700' },
    diproses: { label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
    selesai: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
    ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
};

const catMap: Record<string, string> = {
    ruang_kelas: 'Ruang Kelas',
    laboratorium: 'Lab',
    toilet: 'Toilet',
    listrik: 'Listrik',
    internet: 'Internet',
    parkiran: 'Parkiran',
    perpustakaan: 'Perpustakaan',
    kantin: 'Kantin',
    gedung: 'Gedung',
    kebersihan: 'Kebersihan',
    keamanan: 'Keamanan',
    pelayanan_akademik: 'Akademik',
    lainnya: 'Lainnya',
    kelas: 'Kelas',
};

export default function Progress({ stats, reports }: Props) {
    return (
        <>
            <Head title="Progress Pengaduan - SIPASKA" />
            <div className="min-h-screen bg-gray-50">
                {/* Nav */}
                <nav className="border-b border-gray-200 bg-white">
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
                                href="/"
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/forum"
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                            >
                                Forum
                            </Link>
                            <Link
                                href={login()}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Masuk
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="mx-auto max-w-6xl px-4 py-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Progress Pengaduan
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Status terbaru pengaduan fasilitas kampus — terbuka
                        untuk publik.
                    </p>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="flex items-center gap-3 rounded-lg border bg-white p-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                                <p className="text-xs text-gray-500">Total</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border bg-white p-4">
                            <Clock className="h-5 w-5 text-amber-500" />
                            <div>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats.pending}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Menunggu
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border bg-white p-4">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats.diproses}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Diproses
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border bg-white p-4">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats.selesai}
                                </p>
                                <p className="text-xs text-gray-500">Selesai</p>
                            </div>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="mt-8 space-y-3">
                        {reports.data.length === 0 ? (
                            <div className="rounded-lg border bg-white p-12 text-center">
                                <FileText className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-3 text-gray-500">
                                    Belum ada laporan pengaduan.
                                </p>
                            </div>
                        ) : (
                            reports.data.map((r) => {
                                const s = statusMap[r.status];
                                return (
                                    <div
                                        key={r.id}
                                        className="flex flex-col gap-2 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-gray-900">
                                                {r.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {catMap[r.category] ??
                                                    r.category}{' '}
                                                • {r.location} •{' '}
                                                {new Date(
                                                    r.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {reports.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-3">
                            {reports.prev_page_url && (
                                <Link
                                    href={reports.prev_page_url}
                                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Sebelumnya
                                </Link>
                            )}
                            <span className="text-sm text-gray-500">
                                {reports.current_page} / {reports.last_page}
                            </span>
                            {reports.next_page_url && (
                                <Link
                                    href={reports.next_page_url}
                                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Selanjutnya
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
