import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Search,
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

const statCards = [
    {
        key: undefined,
        icon: FileText,
        label: 'Total',
        iconColor: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
    },
    {
        key: 'pending',
        icon: Clock,
        label: 'Menunggu',
        iconColor: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
    },
    {
        key: 'diproses',
        icon: AlertCircle,
        label: 'Diproses',
        iconColor: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
    },
    {
        key: 'selesai',
        icon: CheckCircle,
        label: 'Selesai',
        iconColor: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-100',
    },
    {
        key: 'ditolak',
        icon: AlertCircle,
        label: 'Ditolak',
        iconColor: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-100',
    },
] as const;

export default function AdminReportsIndex({ reports, stats, filters }: Props) {
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
            { preserveState: true },
        );
    }

    function filterByStatus(status: string | undefined) {
        router.get(
            `/${teamSlug}/admin/reports`,
            { status, category: filters.category, search: filters.search },
            { preserveState: true },
        );
    }

    function filterByCategory(category: string | undefined) {
        router.get(
            `/${teamSlug}/admin/reports`,
            { status: filters.status, category, search: filters.search },
            { preserveState: true },
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
            <div className="min-h-screen bg-[#f7f9fb]">
                {/* Header Banner */}
                <div className="bg-[#001e40] px-6 py-8">
                    <div>
                        <p className="text-sm font-medium text-orange-200">
                            Panel Admin
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                            Kelola Laporan
                        </h1>
                        <p className="mt-1 text-sm text-blue-100">
                            Tinjau, perbarui status, dan respons laporan
                            pengaduan.
                        </p>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Stat Cards */}
                    <div className="-mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
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
                                    className={`rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isActive ? `${card.border} ring-2 ring-[#fd8b00]/25 ring-offset-1` : 'border-slate-200'}`}
                                >
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg}`}
                                    >
                                        <card.icon
                                            className={`h-4 w-4 ${card.iconColor}`}
                                        />
                                    </div>
                                    <p className="mt-3 text-2xl font-bold text-gray-900">
                                        {val}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500">
                                        {card.label}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2"
                        >
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul atau lokasi..."
                                    className="sipaska-focus h-9 w-56 rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-[#001e40] placeholder:text-slate-400 focus:border-[#fd8b00]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-[#9a4a00]"
                            >
                                Cari
                            </button>
                        </form>

                        <select
                            value={filters.category ?? ''}
                            onChange={(e) =>
                                filterByCategory(e.target.value || undefined)
                            }
                            className="sipaska-focus h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#fd8b00]"
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
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                <X className="h-3.5 w-3.5" />
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Reports List */}
                    <div className="mt-6">
                        {reports.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                    <FileText className="h-7 w-7 text-gray-300" />
                                </div>
                                <p className="mt-4 font-medium text-gray-500">
                                    Tidak ada laporan
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Coba ubah atau reset filter pencarian.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {reports.data.map((report) => {
                                    const cfg = statusConfig[report.status];

                                    return (
                                        <Link
                                            key={report.id}
                                            href={`/${teamSlug}/admin/reports/${report.id}`}
                                            className="sipaska-card group flex items-center justify-between p-4"
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#003366]/10 group-hover:bg-[#003366]/15">
                                                    <FileText className="h-5 w-5 text-[#003366]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-[#001e40] group-hover:text-[#9a4a00]">
                                                        {report.title}
                                                    </p>
                                                    <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-gray-400">
                                                        <span>
                                                            {report.user.name}
                                                        </span>
                                                        <span>|</span>
                                                        <span>
                                                            {categoryLabels[
                                                                report.category
                                                            ] ??
                                                                report.category}
                                                        </span>
                                                        <span>|</span>
                                                        <span>
                                                            {report.location}
                                                        </span>
                                                        <span>|</span>
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
                                            </div>
                                            <div className="ml-4 flex items-center gap-3">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
                                                    />
                                                    {cfg.label}
                                                </span>
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                                                    <Eye className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {reports.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                {reports.prev_page_url && (
                                    <Link
                                        href={reports.prev_page_url}
                                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        Sebelumnya
                                    </Link>
                                )}
                                <span className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm">
                                    {reports.current_page} / {reports.last_page}
                                </span>
                                {reports.next_page_url && (
                                    <Link
                                        href={reports.next_page_url}
                                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
