import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    MapPin,
    Tag,
    Trash2,
    User,
} from 'lucide-react';
import type { FormEvent } from 'react';

type Report = {
    id: number;
    title: string;
    description: string;
    photo: string | null;
    category: string;
    location: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    priority?: 'low' | 'medium' | 'high';
    admin_response: string | null;
    resolved_at: string | null;
    created_at: string;
    user: { name: string; email: string };
};

type Props = { report: Report };

const statusConfig = {
    pending: {
        label: 'Menunggu',
        color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-900/50',
        dot: 'bg-amber-400',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-900/50',
        dot: 'bg-blue-400',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-900/50',
        dot: 'bg-green-400',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900/50',
        dot: 'bg-red-400',
    },
};

const priorityConfig = {
    low: { label: 'Rendah', color: 'bg-emerald-100 text-emerald-700' },
    medium: { label: 'Sedang', color: 'bg-amber-100 text-amber-700' },
    high: { label: 'Tinggi', color: 'bg-rose-100 text-rose-700' },
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

export default function AdminReportsShow({ report }: Props) {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const cfg = statusConfig[report.status];
    const flash = usePage().props.flash as { success?: string } | undefined;

    const { data, setData, patch, processing, errors } = useForm({
        status: report.status,
        admin_response: report.admin_response ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        patch(`/${teamSlug}/admin/reports/${report.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({
                    only: ['report', 'unreadNotificationsCount'],
                });
            },
        });
    }

    function deleteReport() {
        if (confirm('Admin: Hapus laporan ini secara permanen?')) {
            router.delete(`/${teamSlug}/admin/reports/${report.id}`, {
                preserveState: false,
            });
        }
    }

    return (
        <>
            <Head title={`Admin - ${report.title}`} />
            <div className="min-h-screen bg-background text-foreground">
                {/* Top bar */}
                <div className="border-b border-border bg-card px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${teamSlug}/admin/reports`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold tracking-wide text-primary uppercase">
                                Panel Admin / Laporan #{report.id}
                            </p>
                            <h1 className="mt-0.5 truncate text-lg font-extrabold text-foreground sm:text-xl">
                                {report.title}
                            </h1>
                        </div>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold uppercase ${cfg.color}`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${cfg.dot}`}
                            />
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-600 sm:mx-6">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                <div className="p-4 sm:p-6">
                    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
                        {/* LEFT: Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Photo */}
                            {report.photo && (
                                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                                    <img
                                        src={`/storage/${report.photo}`}
                                        alt={report.title}
                                        className="max-h-[32rem] w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="sipaska-card p-6">
                                <h2 className="mb-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                    Deskripsi Laporan
                                </h2>
                                <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
                                    {report.description}
                                </p>
                            </div>

                            {/* Admin Action Form */}
                            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                                <div className="border-b border-border bg-muted/30 px-6 py-4">
                                    <h2 className="font-extrabold text-foreground">
                                        Tindakan Admin
                                    </h2>
                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                        Perbarui status dan kirim respons ke
                                        pelapor.
                                    </p>
                                </div>
                                <form
                                    onSubmit={submit}
                                    className="space-y-6 p-6"
                                >
                                    {/* Status */}
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="mb-3 block text-sm font-bold text-foreground"
                                        >
                                            Status Laporan
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                            {(
                                                [
                                                    'pending',
                                                    'diproses',
                                                    'selesai',
                                                    'ditolak',
                                                ] as const
                                            ).map((s) => {
                                                const sc = statusConfig[s];
                                                const isSelected =
                                                    data.status === s;

                                                return (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() =>
                                                            setData('status', s)
                                                        }
                                                        className={`rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all ${
                                                            isSelected
                                                                ? `${sc.color} border-current ring-4 ring-current/10`
                                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted'
                                                        }`}
                                                    >
                                                        <span className="flex items-center justify-center gap-2">
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${isSelected ? sc.dot : 'bg-muted'}`}
                                                            />
                                                            {sc.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.status && (
                                            <p className="mt-2 text-xs font-bold text-destructive">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>

                                    {/* Admin Response */}
                                    <div>
                                        <label
                                            htmlFor="admin_response"
                                            className="mb-3 block text-sm font-bold text-foreground"
                                        >
                                            Catatan / Respons{' '}
                                            <span className="font-normal text-muted-foreground">
                                                (opsional)
                                            </span>
                                        </label>
                                        <textarea
                                            id="admin_response"
                                            value={data.admin_response}
                                            onChange={(e) =>
                                                setData(
                                                    'admin_response',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Berikan catatan atau respons untuk pelapor..."
                                            rows={4}
                                            className="sipaska-focus w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all placeholder:text-muted-foreground"
                                        />
                                        {errors.admin_response && (
                                            <p className="mt-2 text-xs font-bold text-destructive">
                                                {errors.admin_response}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Perubahan'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={deleteReport}
                                            className="inline-flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-6 py-3 text-sm font-bold text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Trash2 className="size-4" />
                                            Hapus Permanen
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT: Sidebar */}
                        <div className="space-y-4">
                            {/* Reporter Info */}
                            <div className="sipaska-card p-6">
                                <h3 className="mb-6 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                    Info Pelapor
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary">
                                        {report.user.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-extrabold text-foreground">
                                            {report.user.name}
                                        </p>
                                        <p className="truncate text-xs font-medium text-muted-foreground">
                                            {report.user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Info */}
                            <div className="sipaska-card p-6">
                                <h3 className="mb-6 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                                    Detail Laporan
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-3">
                                        <Tag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground">
                                                Kategori
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                {categoryLabels[
                                                    report.category
                                                ] ?? report.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground">
                                                Lokasi
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                {report.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground">
                                                Tanggal Lapor
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                {new Date(
                                                    report.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {report.priority && (
                                        <div className="flex items-start gap-3">
                                            <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground">
                                                    Urgensi
                                                </p>
                                                <span
                                                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${priorityConfig[report.priority].color}`}
                                                >
                                                    {
                                                        priorityConfig[
                                                            report.priority
                                                        ].label
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
