import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, TrendingUp } from 'lucide-react';
import { AnimateIn } from '@/components/animate-in';
import { PublicLayout } from '@/components/public-layout';

type Report = {
    id: number;
    title: string;
    category: string;
    location: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    created_at: string;
};

type Props = {
    stats: { total: number; pending: number; diproses: number; selesai: number };
    reports: { data: Report[]; current_page: number; last_page: number; next_page_url: string | null; prev_page_url: string | null };
};

const statusMap = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
    diproses: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
    selesai: { label: 'Selesai', color: 'bg-green-100 text-green-700', dot: 'bg-green-400' },
    ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
};

const catMap: Record<string, string> = {
    ruang_kelas: 'Ruang Kelas', laboratorium: 'Lab', toilet: 'Toilet', listrik: 'Listrik',
    internet: 'Internet', parkiran: 'Parkiran', perpustakaan: 'Perpustakaan', kantin: 'Kantin',
    gedung: 'Gedung', kebersihan: 'Kebersihan', keamanan: 'Keamanan',
    pelayanan_akademik: 'Akademik', lainnya: 'Lainnya', kelas: 'Kelas',
};

export default function Progress({ stats, reports }: Props) {
    return (
        <>
            <Head title="Progress Pengaduan - SIPASKA" />
            <PublicLayout>
                <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                    <AnimateIn>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Progress Pengaduan</h1>
                        <p className="mt-1 text-gray-500">Status terbaru pengaduan fasilitas — terbuka untuk publik.</p>
                    </AnimateIn>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { icon: FileText, value: stats.total, label: 'Total', color: 'text-blue-600 bg-blue-50' },
                            { icon: Clock, value: stats.pending, label: 'Menunggu', color: 'text-amber-600 bg-amber-50' },
                            { icon: TrendingUp, value: stats.diproses, label: 'Diproses', color: 'text-indigo-600 bg-indigo-50' },
                            { icon: CheckCircle, value: stats.selesai, label: 'Selesai', color: 'text-green-600 bg-green-50' },
                        ].map((item, i) => (
                            <AnimateIn key={item.label} delay={i * 80}>
                                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.color}`}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{item.value}</p>
                                        <p className="text-xs text-gray-500">{item.label}</p>
                                    </div>
                                </div>
                            </AnimateIn>
                        ))}
                    </div>

                    {/* Reports */}
                    <div className="mt-10 space-y-3">
                        {reports.data.length === 0 ? (
                            <AnimateIn>
                                <div className="rounded-2xl border bg-white p-12 text-center">
                                    <FileText className="mx-auto h-10 w-10 text-gray-200" />
                                    <p className="mt-3 text-gray-400">Belum ada laporan pengaduan.</p>
                                </div>
                            </AnimateIn>
                        ) : (
                            reports.data.map((r, i) => {
                                const s = statusMap[r.status];
                                return (
                                    <AnimateIn key={r.id} delay={i * 50}>
                                        <div className="group flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-blue-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{r.title}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {catMap[r.category] ?? r.category} • {r.location} • {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                                {s.label}
                                            </span>
                                        </div>
                                    </AnimateIn>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {reports.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            {reports.prev_page_url && (
                                <Link href={reports.prev_page_url} className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:border-blue-200">Sebelumnya</Link>
                            )}
                            <span className="text-sm text-gray-400">{reports.current_page} / {reports.last_page}</span>
                            {reports.next_page_url && (
                                <Link href={reports.next_page_url} className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:border-blue-200">Selanjutnya</Link>
                            )}
                        </div>
                    )}
                </div>
            </PublicLayout>
        </>
    );
}
