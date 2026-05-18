import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, Tag, User } from 'lucide-react';
import { type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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

export default function AdminReportsShow({ report }: Props) {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const config = statusConfig[report.status];

    const { data, setData, patch, processing, errors } = useForm({
        status: report.status,
        admin_response: report.admin_response ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        patch(`/${teamSlug}/admin/reports/${report.id}`);
    }

    return (
        <>
            <Head title={`Admin - ${report.title}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${teamSlug}/admin/reports`}>
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

                        {/* Admin Action Form */}
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle>Tindakan Admin</CardTitle>
                                <CardDescription>
                                    Perbarui status laporan dan berikan respons
                                    kepada pelapor.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    'status',
                                                    e.target
                                                        .value as Report['status'],
                                                )
                                            }
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="diproses">
                                                Diproses
                                            </option>
                                            <option value="selesai">
                                                Selesai
                                            </option>
                                            <option value="ditolak">
                                                Ditolak
                                            </option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-sm text-destructive">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="admin_response">
                                            Catatan / Respons
                                        </Label>
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
                                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                        />
                                        {errors.admin_response && (
                                            <p className="text-sm text-destructive">
                                                {errors.admin_response}
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Detail Laporan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Pelapor
                                        </p>
                                        <p className="text-sm font-medium">
                                            {report.user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {report.user.email}
                                        </p>
                                    </div>
                                </div>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
