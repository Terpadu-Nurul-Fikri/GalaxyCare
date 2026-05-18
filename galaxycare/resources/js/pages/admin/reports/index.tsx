import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Search,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    pending: { label: 'Pending', variant: 'secondary' as const },
    diproses: { label: 'Diproses', variant: 'default' as const },
    selesai: { label: 'Selesai', variant: 'outline' as const },
    ditolak: { label: 'Ditolak', variant: 'destructive' as const },
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

    return (
        <>
            <Head title="Kelola Laporan" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Kelola Laporan
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola semua laporan pengaduan fasilitas kampus.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card
                        className="cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => filterByStatus(undefined)}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.total}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Total
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => filterByStatus('pending')}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <Clock className="h-5 w-5 text-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.pending}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Pending
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => filterByStatus('diproses')}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.diproses}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Diproses
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => filterByStatus('selesai')}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.selesai}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Selesai
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => filterByStatus('ditolak')}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.ditolak}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Ditolak
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-2"
                    >
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari laporan..."
                                className="w-64 pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline" size="sm">
                            Cari
                        </Button>
                    </form>

                    <select
                        value={filters.category ?? ''}
                        onChange={(e) =>
                            filterByCategory(e.target.value || undefined)
                        }
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
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

                    {(filters.status || filters.category || filters.search) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                router.get(`/${teamSlug}/admin/reports`)
                            }
                        >
                            Reset Filter
                        </Button>
                    )}
                </div>

                {/* Reports List */}
                {reports.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">
                                Tidak ada laporan
                            </p>
                            <p className="text-muted-foreground">
                                Belum ada laporan yang sesuai dengan filter.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {reports.data.map((report) => {
                            const config = statusConfig[report.status];
                            return (
                                <Card key={report.id}>
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">
                                                    {report.title}
                                                </h3>
                                                <Badge variant={config.variant}>
                                                    {config.label}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{report.user.name}</span>
                                                <span>•</span>
                                                <span>
                                                    {categoryLabels[
                                                        report.category
                                                    ] ?? report.category}
                                                </span>
                                                <span>•</span>
                                                <span>{report.location}</span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(
                                                        report.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/${teamSlug}/admin/reports/${report.id}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {reports.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                {reports.prev_page_url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={reports.prev_page_url}>
                                            Sebelumnya
                                        </Link>
                                    </Button>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    Halaman {reports.current_page} dari{' '}
                                    {reports.last_page}
                                </span>
                                {reports.next_page_url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={reports.next_page_url}>
                                            Selanjutnya
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
