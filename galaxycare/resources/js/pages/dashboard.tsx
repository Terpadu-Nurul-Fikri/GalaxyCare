import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, Plus, TrendingUp } from 'lucide-react';
import { dashboard } from '@/routes';

type Report = {
    id: number;
    title: string;
    category: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    created_at: string;
    user?: { name: string };
};

type Props = {
    stats: {
        total: number;
        pending: number;
        diproses: number;
        selesai: number;
    };
    recentReports: Report[];
    isAdmin: boolean;
    unreadNotifications?: number;
};

const statusMap = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700' },
    diproses: { label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
    selesai: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
    ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
};

export default function Dashboard({ stats, recentReports, isAdmin }: Props) {
    const { currentTeam } = usePage().props;
    const slug = currentTeam?.slug ?? '';

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            {isAdmin ? 'Dashboard Admin' : 'Dashboard'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isAdmin
                                ? 'Kelola semua laporan pengaduan.'
                                : 'Pantau status laporan Anda.'}
                        </p>
                    </div>
                    {!isAdmin && (
                        <Link
                            href={`/${slug}/reports/create`}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Buat Laporan
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {stats.total}
                        </p>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <Clock className="h-5 w-5 text-amber-500" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {stats.pending}
                        </p>
                        <p className="text-xs text-gray-500">Menunggu</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {stats.diproses}
                        </p>
                        <p className="text-xs text-gray-500">Diproses</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {stats.selesai}
                        </p>
                        <p className="text-xs text-gray-500">Selesai</p>
                    </div>
                </div>

                {/* Recent */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Laporan Terbaru
                    </h2>
                    <div className="mt-4 space-y-2">
                        {recentReports.length === 0 ? (
                            <div className="rounded-lg border bg-white p-8 text-center">
                                <p className="text-gray-500">
                                    Belum ada laporan.
                                </p>
                            </div>
                        ) : (
                            recentReports.map((r) => {
                                const s = statusMap[r.status];
                                const href = isAdmin
                                    ? `/${slug}/admin/reports/${r.id}`
                                    : `/${slug}/reports/${r.id}`;
                                return (
                                    <Link
                                        key={r.id}
                                        href={href}
                                        className="flex items-center justify-between rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-gray-900">
                                                {r.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {r.category}{' '}
                                                {isAdmin && r.user
                                                    ? `• ${r.user.name}`
                                                    : ''}{' '}
                                                •{' '}
                                                {new Date(
                                                    r.created_at,
                                                ).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <span
                                            className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}
                                        >
                                            {s.label}
                                        </span>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
