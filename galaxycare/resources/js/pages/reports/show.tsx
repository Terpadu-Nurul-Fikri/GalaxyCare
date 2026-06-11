import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    MapPin,
    Tag,
    User,
} from 'lucide-react';

type Report = {
    id: number;
    title: string;
    description: string;
    photo: string | null;
    category: string;
    location: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    admin_response: string | null;
    resolved_at: string | null;
    created_at: string;
    user: { name: string; email: string };
};

type Props = {
    report: Report;
};

const statusConfig = {
    pending: {
        label: 'Menunggu',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-400',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-400',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-400',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-400',
    },
};

const categoryLabels: Record<string, string> = {
    ruang_kelas: 'Ruang Kelas',
    laboratorium: 'Laboratorium',
    toilet: 'Toilet',
    listrik: 'Listrik',
    internet: 'Internet',
    parkiran: 'Parkiran',
    perpustakaan: 'Perpustakaan',
    kantin: 'Kantin',
    gedung: 'Gedung',
    kebersihan: 'Kebersihan',
    keamanan: 'Keamanan',
    pelayanan_akademik: 'Pelayanan Akademik',
    lainnya: 'Lainnya',
    kelas: 'Kelas',
};

export default function ReportsShow({ report }: Props) {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const config = statusConfig[report.status];

    const detailRows = [
        {
            icon: Tag,
            label: 'Kategori',
            value: categoryLabels[report.category] ?? report.category,
        },
        { icon: MapPin, label: 'Lokasi', value: report.location },
        {
            icon: Calendar,
            label: 'Tanggal Lapor',
            value: new Date(report.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        },
        { icon: User, label: 'Pelapor', value: report.user.name },
    ];

    return (
        <>
            <Head title={report.title} />
            <div className="min-h-screen bg-[#f7f9fb]">
                <div className="border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
                    <div className="mx-auto flex max-w-5xl items-center gap-3">
                        <Link
                            href={`/${teamSlug}/reports`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-[#9a4a00]"
                            aria-label="Kembali ke daftar laporan"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                                Laporan #{report.id}
                            </p>
                            <h1 className="mt-0.5 truncate text-lg font-bold text-gray-900 sm:text-xl">
                                {report.title}
                            </h1>
                        </div>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${config.color}`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${config.dot}`}
                            />
                            {config.label}
                        </span>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
                        <div className="space-y-5 lg:col-span-2">
                            {report.photo && (
                                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <img
                                        src={`/storage/${report.photo}`}
                                        alt={report.title}
                                        className="max-h-96 w-full object-cover"
                                    />
                                </div>
                            )}

                            <section className="sipaska-card p-5">
                                <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Deskripsi
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                    {report.description}
                                </p>
                            </section>

                            {report.admin_response && (
                                <section className="rounded-lg border border-blue-200 bg-blue-50 p-5 shadow-sm">
                                    <h2 className="text-sm font-semibold tracking-wide text-blue-700 uppercase">
                                        Respons Admin
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-blue-900">
                                        {report.admin_response}
                                    </p>
                                </section>
                            )}
                        </div>

                        <aside className="space-y-4">
                            <section className="sipaska-card p-5">
                                <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Detail Laporan
                                </h2>
                                <div className="space-y-4">
                                    {detailRows.map((row) => (
                                        <div
                                            key={row.label}
                                            className="flex items-start gap-3"
                                        >
                                            <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    {row.label}
                                                </p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {row.value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {report.resolved_at && (
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Diselesaikan
                                                </p>
                                                <p className="text-sm font-medium text-green-700">
                                                    {new Date(
                                                        report.resolved_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="sipaska-card p-5">
                                <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Status Saat Ini
                                </h2>
                                <span
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${config.color}`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${config.dot}`}
                                    />
                                    {config.label}
                                </span>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
