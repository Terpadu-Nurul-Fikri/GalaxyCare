import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    MapPin,
    Tag,
    Trash2,
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
        color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-900/50',
        dot: 'bg-amber-500',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-900/50',
        dot: 'bg-blue-500',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-900/50',
        dot: 'bg-emerald-600',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-900/50',
        dot: 'bg-rose-600',
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

    function deleteReport() {
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            router.delete(`/${teamSlug}/reports/${report.id}`, {
                preserveState: false,
            });
        }
    }

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
            <div className="min-h-screen bg-background text-foreground">
                <div className="border-b border-border bg-card px-4 py-4 sm:px-6">
                    <div className="mx-auto flex max-w-5xl items-center gap-3">
                        <Link
                            href={`/${teamSlug}/reports`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted"
                            aria-label="Kembali ke daftar laporan"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold tracking-wide text-primary uppercase">
                                Laporan #{report.id}
                            </p>
                            <h1 className="mt-0.5 truncate text-lg font-extrabold text-foreground sm:text-xl">
                                {report.title}
                            </h1>
                        </div>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold uppercase ${config.color}`}
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
                                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                                    <img
                                        src={`/storage/${report.photo}`}
                                        alt={report.title}
                                        className="max-h-96 w-full object-cover"
                                    />
                                </div>
                            )}

                            <section className="sipaska-card p-6">
                                <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                    Deskripsi
                                </h2>
                                <p className="mt-4 text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
                                    {report.description}
                                </p>
                            </section>

                            {report.admin_response && (
                                <section className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
                                    <h2 className="text-xs font-bold tracking-wide text-primary uppercase">
                                        Respons Admin
                                    </h2>
                                    <p className="mt-4 text-sm leading-relaxed font-medium whitespace-pre-wrap text-foreground">
                                        {report.admin_response}
                                    </p>
                                </section>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={deleteReport}
                                    className="inline-flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-2.5 text-sm font-bold text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    <Trash2 className="size-4" />
                                    Hapus Laporan
                                </button>
                            </div>
                        </div>

                        <aside className="space-y-4">
                            <section className="sipaska-card p-6">
                                <h2 className="mb-6 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                    Detail Laporan
                                </h2>
                                <div className="space-y-5">
                                    {detailRows.map((row) => (
                                        <div
                                            key={row.label}
                                            className="flex items-start gap-3"
                                        >
                                            <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground">
                                                    {row.label}
                                                </p>
                                                <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                    {row.value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {report.resolved_at && (
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground">
                                                    Diselesaikan
                                                </p>
                                                <p className="mt-0.5 text-sm font-bold text-emerald-600">
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

                            <section className="sipaska-card p-6">
                                <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                    Status Saat Ini
                                </h2>
                                <span
                                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold uppercase ${config.color}`}
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
