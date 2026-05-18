import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, Eye, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
};

const statusConfig = {
    pending: {
        label: 'Pending',
        variant: 'secondary' as const,
        color: 'text-yellow-600',
    },
    diproses: {
        label: 'Diproses',
        variant: 'default' as const,
        color: 'text-blue-600',
    },
    selesai: {
        label: 'Selesai',
        variant: 'outline' as const,
        color: 'text-green-600',
    },
    ditolak: {
        label: 'Ditolak',
        variant: 'destructive' as const,
        color: 'text-red-600',
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

export default function ReportsIndex({ reports }: Props) {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';

    return (
        <>
            <Head title="Laporan Saya" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Laporan Saya
                        </h1>
                        <p className="text-muted-foreground">
                            Daftar semua laporan pengaduan yang Anda buat.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={`/${teamSlug}/reports/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Laporan
                        </Link>
                    </Button>
                </div>

                {reports.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">
                                Belum ada laporan
                            </p>
                            <p className="mb-4 text-muted-foreground">
                                Buat laporan pertama Anda untuk melaporkan
                                kerusakan fasilitas.
                            </p>
                            <Button asChild>
                                <Link href={`/${teamSlug}/reports/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Laporan Baru
                                </Link>
                            </Button>
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
                                                href={`/${teamSlug}/reports/${report.id}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Pagination */}
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
