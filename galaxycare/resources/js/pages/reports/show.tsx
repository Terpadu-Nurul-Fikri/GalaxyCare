import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, Tag, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        label: 'Pending',
        variant: 'secondary' as const,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    diproses: {
        label: 'Diproses',
        variant: 'default' as const,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    selesai: {
        label: 'Selesai',
        variant: 'outline' as const,
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    ditolak: {
        label: 'Ditolak',
        variant: 'destructive' as const,
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
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

    return (
        <>
            <Head title={report.title} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${teamSlug}/reports`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {report.title}
                        </h1>
                    </div>
                    <Badge variant={config.variant} className="text-sm">
                        {config.label}
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Photo */}
                        {report.photo && (
                            <Card>
                                <CardContent className="p-4">
                                    <img
                                        src={`/storage/${report.photo}`}
                                        alt={report.title}
                                        className="max-h-96 w-full rounded-lg object-cover"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Deskripsi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap text-muted-foreground">
                                    {report.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Admin Response */}
                        {report.admin_response && (
                            <Card className="border-blue-200 dark:border-blue-800">
                                <CardHeader>
                                    <CardTitle className="text-blue-700 dark:text-blue-300">
                                        Respons Admin
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-muted-foreground">
                                        {report.admin_response}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Detail Laporan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Kategori
                                        </p>
                                        <p className="text-sm font-medium">
                                            {categoryLabels[report.category] ??
                                                report.category}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Lokasi
                                        </p>
                                        <p className="text-sm font-medium">
                                            {report.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Tanggal Lapor
                                        </p>
                                        <p className="text-sm font-medium">
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
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Pelapor
                                        </p>
                                        <p className="text-sm font-medium">
                                            {report.user.name}
                                        </p>
                                    </div>
                                </div>
                                {report.resolved_at && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-green-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Diselesaikan
                                            </p>
                                            <p className="text-sm font-medium">
                                                {new Date(
                                                    report.resolved_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
                                >
                                    {config.label}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
