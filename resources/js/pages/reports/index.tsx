import { Head, Link, router, usePage } from '@inertiajs/react';
import { Clock, Eye, FileText, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type Report = {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    created_at: string;
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
    filters: {
        search?: string;
    };
};

const statusConfig = {
    pending: {
        label: 'Menunggu',
        color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/60',
        dot: 'bg-amber-400',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900/60',
        dot: 'bg-blue-400',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900/60',
        dot: 'bg-green-400',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900/60',
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

export default function ReportsIndex({ reports, filters }: Props) {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const [search, setSearch] = useState(filters.search ?? '');
    const hasSearch = Boolean(filters.search);

    function handleSearch(e: FormEvent): void {
        e.preventDefault();

        router.get(
            `/${teamSlug}/reports`,
            { search: search.trim() || undefined },
            { preserveState: true },
        );
    }

    return (
        <>
            <Head title="Laporan Saya" />
            <div className="min-h-screen bg-background text-foreground">
                <div className="border-b border-border bg-card px-4 py-5 sm:px-6">
                    <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-300">
                                SIPASKA - BSP
                            </p>
                            <h1 className="mt-1 text-2xl font-bold text-foreground">
                                Laporan Saya
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Pantau semua pengaduan fasilitas kampus yang
                                masuk untuk ditindaklanjuti BSP.
                            </p>
                        </div>
                        <Link
                            href={`/${teamSlug}/reports/create`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#fd8b00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
                        >
                            <Plus className="h-4 w-4" />
                            Buat Laporan
                        </Link>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="mx-auto max-w-5xl">
                        <form
                            onSubmit={handleSearch}
                            className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center"
                        >
                            <div className="relative min-w-0 flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul, lokasi, atau deskripsi..."
                                    className="sipaska-focus h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-[#003366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#001e40]"
                            >
                                Cari
                            </button>
                            {hasSearch && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        router.get(`/${teamSlug}/reports`);
                                    }}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-200"
                                >
                                    <X className="h-4 w-4" />
                                    Reset
                                </button>
                            )}
                        </form>

                        {reports.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                                    <Clock className="h-7 w-7 text-blue-500" />
                                </div>
                                <p className="mt-4 font-semibold text-foreground">
                                    Belum ada laporan
                                </p>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Laporkan fasilitas yang rusak agar tim
                                    kampus bisa menindaklanjuti dengan cepat.
                                </p>
                                <Link
                                    href={`/${teamSlug}/reports/create`}
                                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#fd8b00] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-orange-600"
                                >
                                    <Plus className="h-4 w-4" />
                                    Buat Laporan Baru
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reports.data.map((report) => {
                                    const config = statusConfig[report.status];

                                    return (
                                        <div
                                            key={report.id}
                                            className="sipaska-card group flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <Link
                                                href={`/${teamSlug}/reports/${report.id}`}
                                                className="flex min-w-0 flex-1 items-start gap-3"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h2 className="truncate font-extrabold text-foreground transition-colors group-hover:text-primary">
                                                            {report.title}
                                                        </h2>
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${config.color}`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                                                            />
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                                        {report.description}
                                                    </p>
                                                    <p className="mt-2 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                                                        <span className="font-bold">
                                                            {categoryLabels[
                                                                report.category
                                                            ] ??
                                                                report.category}
                                                        </span>
                                                        <span>-</span>
                                                        <span>
                                                            {report.location}
                                                        </span>
                                                        <span>-</span>
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
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/${teamSlug}/reports/${report.id}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted hover:text-primary"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                'Hapus laporan ini?',
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/${teamSlug}/reports/${report.id}`,
                                                            );
                                                        }
                                                    }}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {reports.last_page > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-4">
                                        {reports.prev_page_url && (
                                            <Link
                                                href={reports.prev_page_url}
                                                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
                                            >
                                                Sebelumnya
                                            </Link>
                                        )}
                                        <span className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                                            {reports.current_page} /{' '}
                                            {reports.last_page}
                                        </span>
                                        {reports.next_page_url && (
                                            <Link
                                                href={reports.next_page_url}
                                                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
                                            >
                                                Selanjutnya
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
