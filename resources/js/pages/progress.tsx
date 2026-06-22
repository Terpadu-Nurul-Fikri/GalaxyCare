import { Head, Link, router, usePoll } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    FileText,
    MapPin,
    PlusCircle,
    Search,
    SearchCheck,
    TrendingUp,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { AnimateIn } from '@/components/animate-in';
import { CampusInformationPanel } from '@/components/campus-information-panel';
import type { CampusInformationItem } from '@/components/campus-information-panel';
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
    filters?: {
        search?: string;
    };
    campusInformation: CampusInformationItem[];
};

const statusMap = {
    pending: {
        label: 'Menunggu',
        color: 'bg-amber-100 text-amber-700',
        dot: 'bg-amber-400',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-700',
        dot: 'bg-blue-400',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700',
        dot: 'bg-green-400',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-700',
        dot: 'bg-red-400',
    },
};

const categoryLabels: Record<string, string> = {
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

export default function Progress({
    stats,
    reports,
    filters,
    campusInformation,
}: Props) {
    usePoll(15000, {
        only: ['stats', 'reports', 'campusInformation'],
    });

    const reportItems = reports?.data ?? [];
    const [search, setSearch] = useState(filters?.search ?? '');
    const hasActiveSearch = (filters?.search ?? '') !== '';

    function submitSearch(e: FormEvent): void {
        e.preventDefault();

        router.get(
            '/progress',
            { search: search.trim() },
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            },
        );
    }

    function clearSearch(): void {
        setSearch('');
        router.get(
            '/progress',
            {},
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            },
        );
    }

    return (
        <>
            <Head title="Progress Pengaduan - SIPASKA" />
            <PublicLayout>
                <div className="border-b border-border bg-card">
                    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-14">
                        <AnimateIn>
                            <div className="flex max-w-3xl flex-col gap-5">
                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">
                                    <SearchCheck className="size-4" />
                                    Transparansi Publik
                                </span>
                                <div className="flex flex-col gap-3">
                                    <h1 className="text-3xl font-extrabold text-foreground sm:text-5xl">
                                        Progress Pengaduan Fasilitas Kampus
                                    </h1>
                                    <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                        Pantau status laporan tanpa login. Untuk
                                        membuat laporan baru, mahasiswa tetap
                                        perlu masuk agar laporan tercatat atas
                                        akun yang benar.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href="/login"
                                        prefetch
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                                    >
                                        <PlusCircle className="size-4" />
                                        Masuk untuk Lapor
                                    </Link>
                                    <Link
                                        href="/forum"
                                        prefetch
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
                                    >
                                        Forum Publik
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </div>
                        </AnimateIn>

                        <AnimateIn delay={120}>
                            <div className="rounded-xl border border-border bg-muted/30 p-6">
                                <p className="text-sm font-bold text-muted-foreground uppercase">
                                    Ringkasan
                                </p>
                                <p className="mt-3 text-5xl font-extrabold text-foreground">
                                    {stats.total}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground/80">
                                    total laporan fasilitas yang sudah masuk ke
                                    sistem SIPASKA untuk ditindaklanjuti BSP.
                                </p>
                                <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary"
                                        style={{
                                            width: `${stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0}%`,
                                        }}
                                    />
                                </div>
                                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                                    {stats.total > 0
                                        ? `${Math.round((stats.selesai / stats.total) * 100)}% laporan selesai`
                                        : 'Belum ada laporan selesai'}
                                </p>
                            </div>
                        </AnimateIn>
                    </div>
                </div>

                <CampusInformationPanel items={campusInformation} compact />

                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            {
                                icon: FileText,
                                value: stats.total,
                                label: 'Total',
                                color: 'text-primary bg-primary/10',
                            },
                            {
                                icon: Clock,
                                value: stats.pending,
                                label: 'Menunggu',
                                color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
                            },
                            {
                                icon: TrendingUp,
                                value: stats.diproses,
                                label: 'Diproses',
                                color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
                            },
                            {
                                icon: CheckCircle,
                                value: stats.selesai,
                                label: 'Selesai',
                                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
                            },
                        ].map((item, index) => (
                            <AnimateIn key={item.label} delay={index * 80}>
                                <div className="flex min-h-28 items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-foreground">
                                            {item.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.label}
                                        </p>
                                    </div>
                                </div>
                            </AnimateIn>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold text-foreground">
                                Semua Progress Pengaduan
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Data publik hanya menampilkan informasi umum
                                tanpa identitas pelapor.
                            </p>
                        </div>
                        <form
                            onSubmit={submitSearch}
                            className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row"
                        >
                            <label className="relative flex min-h-11 flex-1 items-center rounded-xl border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
                                <Search className="size-4 shrink-0 text-muted-foreground" />
                                <span className="sr-only">
                                    Cari progress pengaduan
                                </span>
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    maxLength={80}
                                    placeholder="Cari judul, lokasi, status..."
                                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                                {hasActiveSearch && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                        aria-label="Bersihkan pencarian"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </label>
                            <button
                                type="submit"
                                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {hasActiveSearch && (
                        <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
                            Menampilkan hasil untuk "{filters?.search}".
                        </div>
                    )}

                    <div className="mt-6 grid gap-3">
                        {reportItems.length === 0 ? (
                            <AnimateIn>
                                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                                    <FileText className="mx-auto h-10 w-10 text-gray-200" />
                                    <p className="mt-3 text-gray-400 dark:text-slate-500">
                                        {hasActiveSearch
                                            ? 'Tidak ada progress yang cocok dengan pencarian.'
                                            : 'Belum ada laporan pengaduan.'}
                                    </p>
                                    {hasActiveSearch && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Tampilkan semua
                                        </button>
                                    )}
                                </div>
                            </AnimateIn>
                        ) : (
                            reportItems.map((report, index) => {
                                const status = statusMap[report.status];

                                return (
                                    <AnimateIn
                                        key={report.id}
                                        delay={index * 50}
                                    >
                                        <div className="group grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-teal-200 hover:shadow-md md:grid-cols-[minmax(0,1fr)_auto] md:items-center dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-300">
                                                        {categoryLabels[
                                                            report.category
                                                        ] ?? report.category}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        <MapPin className="size-3.5" />
                                                        {report.location}
                                                    </span>
                                                </div>
                                                <p className="mt-3 truncate font-bold text-slate-950 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                                                    {report.title}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase ${status.color}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                                />
                                                {status.label}
                                            </span>
                                        </div>
                                    </AnimateIn>
                                );
                            })
                        )}
                    </div>

                    {reports?.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            {reports.prev_page_url && (
                                <Link
                                    href={reports.prev_page_url}
                                    prefetch
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold transition-colors hover:border-teal-200 hover:bg-teal-50"
                                >
                                    Sebelumnya
                                </Link>
                            )}
                            <span className="text-sm text-gray-400">
                                {reports.current_page} / {reports.last_page}
                            </span>
                            {reports.next_page_url && (
                                <Link
                                    href={reports.next_page_url}
                                    prefetch
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold transition-colors hover:border-teal-200 hover:bg-teal-50"
                                >
                                    Selanjutnya
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </PublicLayout>
        </>
    );
}
