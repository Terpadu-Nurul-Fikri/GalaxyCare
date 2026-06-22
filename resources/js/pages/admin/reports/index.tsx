import { Head, Link, router, usePage, usePoll } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type Report = {
    id: number;
    title: string;
    category: string;
    location: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    created_at: string;
    user: { name: string };
};

type PaginatedReports = {
    data: Report[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

type Props = {
    reports: PaginatedReports;
    stats: {
        total: number;
        pending: number;
        diproses: number;
        selesai: number;
        ditolak: number;
    };
    filters: {
        status?: string;
        category?: string;
        search?: string;
    };
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
        color: 'bg-green-100 text-green-700 border-green-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-900/50',
        dot: 'bg-green-400',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900/50',
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

const statCards = [
    {
        key: undefined,
        icon: FileText,
        label: 'Total',
        iconColor: 'text-primary',
        bg: 'bg-primary/10',
        border: 'border-primary/20',
    },
    {
        key: 'pending',
        icon: Clock,
        label: 'Menunggu',
        iconColor: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-100 dark:border-amber-900/40',
    },
    {
        key: 'diproses',
        icon: AlertCircle,
        label: 'Diproses',
        iconColor: 'text-sky-700 dark:text-sky-200',
        bg: 'bg-sky-50 dark:bg-sky-950/30',
        border: 'border-sky-100 dark:border-sky-900/40',
    },
    {
        key: 'selesai',
        icon: CheckCircle,
        label: 'Selesai',
        iconColor: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-100 dark:border-emerald-900/40',
    },
    {
        key: 'ditolak',
        icon: AlertCircle,
        label: 'Ditolak',
        iconColor: 'text-rose-600',
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        border: 'border-rose-100 dark:border-rose-900/40',
    },
] as const;

export default function AdminReportsIndex({ reports, stats, filters }: Props) {
    usePoll(10000, {
        only: ['reports', 'stats', 'unreadNotificationsCount'],
    });

    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get(
            `/${teamSlug}/admin/reports`,
            { search, status: filters.status, category: filters.category },
            { preserveState: false },
        );
    }

    function filterByStatus(status: string | undefined) {
        router.get(
            `/${teamSlug}/admin/reports`,
            { status, category: filters.category, search: filters.search },
            { preserveState: false },
        );
    }

    function filterByCategory(category: string | undefined) {
        router.get(
            `/${teamSlug}/admin/reports`,
            { status: filters.status, category, search: filters.search },
            { preserveState: false },
        );
    }

    const statValues: Record<string, number> = {
        total: stats.total,
        pending: stats.pending,
        diproses: stats.diproses,
        selesai: stats.selesai,
        ditolak: stats.ditolak,
    };
    const hasFilters = filters.status || filters.category || filters.search;

    return (
        <>
            <Head title="Kelola Laporan" />
            <div className="min-h-screen bg-background text-foreground">
                {/* Header Banner */}
                <div className="border-b border-slate-200 bg-[#003366] px-6 py-10 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl">
                        <p className="text-sm font-bold tracking-wider text-primary uppercase">
                            Panel Admin
                        </p>
                        <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl">
                            Kelola Laporan Fasilitas
                        </h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">
                            Tinjau, perbarui status, dan berikan respons resmi
                            untuk setiap laporan pengaduan dari mahasiswa.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl p-4 sm:p-6">
                    {/* Stat Cards */}
                    <div className="-mt-12 grid grid-cols-2 gap-4 sm:grid-cols-5">
                        {statCards.map((card) => {
                            const val =
                                card.key === undefined
                                    ? statValues.total
                                    : statValues[card.key];
                            const isActive =
                                filters.status === card.key ||
                                (card.key === undefined && !filters.status);

                            return (
                                <button
                                    key={card.label}
                                    type="button"
                                    onClick={() => filterByStatus(card.key)}
                                    className={`rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-1 ${isActive ? `border-accent ring-2 ring-accent/20` : 'border-border'}`}
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}
                                    >
                                        <card.icon
                                            className={`h-5 w-5 ${card.iconColor}`}
                                        />
                                    </div>
                                    <p className="mt-4 text-3xl font-extrabold text-foreground">
                                        {val}
                                    </p>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">
                                        {card.label}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters */}
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2"
                        >
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul atau lokasi..."
                                    className="sipaska-focus h-11 w-64 rounded-xl border border-border bg-card pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                            >
                                Cari
                            </button>
                        </form>

                        <select
                            value={filters.category ?? ''}
                            onChange={(e) =>
                                filterByCategory(e.target.value || undefined)
                            }
                            className="sipaska-focus h-11 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground"
                        >
                            <option value="">Semua Kategori</option>
                            {Object.entries(categoryLabels).map(
                                ([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ),
                            )}
                        </select>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(`/${teamSlug}/admin/reports`);
                                }}
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-5 text-sm font-bold text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <X className="h-4 w-4" />
                                Reset Filter
                            </button>
                        )}
                    </div>

                    {/* Reports List */}
                    <div className="mt-8">
                        {reports.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-20 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="mt-6 text-lg font-bold text-foreground">
                                    Tidak ada laporan ditemukan
                                </p>
                                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                    Coba gunakan kata kunci lain atau bersihkan
                                    filter untuk melihat semua laporan.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {reports.data.map((report) => {
                                    const cfg = statusConfig[report.status];

                                    return (
                                        <div
                                            key={report.id}
                                            className="sipaska-card group flex items-center justify-between p-4"
                                        >
                                            <Link
                                                href={`/${teamSlug}/admin/reports/${report.id}`}
                                                className="flex min-w-0 flex-1 items-center gap-4"
                                            >
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-base font-extrabold text-foreground transition-colors group-hover:text-primary">
                                                        {report.title}
                                                    </p>
                                                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs font-medium text-muted-foreground">
                                                        <span className="font-bold text-primary/80">
                                                            {report.user.name}
                                                        </span>
                                                        <span className="opacity-40">
                                                            •
                                                        </span>
                                                        <span>
                                                            {categoryLabels[
                                                                report.category
                                                            ] ??
                                                                report.category}
                                                        </span>
                                                        <span className="opacity-40">
                                                            •
                                                        </span>
                                                        <span>
                                                            {report.location}
                                                        </span>
                                                        <span className="opacity-40">
                                                            •
                                                        </span>
                                                        <span>
                                                            {new Date(
                                                                report.created_at,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                                {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                },
                                                            )}
                                                        </span>
                                                    </p>
                                                </div>
                                            </Link>
                                            <div className="ml-4 flex items-center gap-3">
                                                <span
                                                    className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase sm:inline-flex ${cfg.color}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
                                                    />
                                                    {cfg.label}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/${teamSlug}/admin/reports/${report.id}`}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted hover:text-primary"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Admin: Hapus laporan ini secara permanen?',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    `/${teamSlug}/admin/reports/${report.id}`,
                                                                    {
                                                                        preserveScroll: true,
                                                                        preserveState: false,
                                                                        onSuccess:
                                                                            () => {
                                                                                router.reload(
                                                                                    {
                                                                                        only: [
                                                                                            'reports',
                                                                                            'stats',
                                                                                            'unreadNotificationsCount',
                                                                                        ],
                                                                                    },
                                                                                );
                                                                            },
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {reports.last_page > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-3">
                                {reports.prev_page_url && (
                                    <Link
                                        href={reports.prev_page_url}
                                        className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                                    >
                                        Sebelumnya
                                    </Link>
                                )}
                                <span className="rounded-xl bg-primary/10 px-5 py-2.5 text-sm font-extrabold text-primary">
                                    {reports.current_page} / {reports.last_page}
                                </span>
                                {reports.next_page_url && (
                                    <Link
                                        href={reports.next_page_url}
                                        className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                                    >
                                        Selanjutnya
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
