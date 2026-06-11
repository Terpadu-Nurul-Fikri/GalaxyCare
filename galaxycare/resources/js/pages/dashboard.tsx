import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Bell,
    CalendarDays,
    CheckCircle,
    ClipboardList,
    Clock3,
    Eye,
    Info,
    Megaphone,
    MessageSquare,
    PlusSquare,
    SearchCheck,
    Wrench,
} from 'lucide-react';
import { dashboard } from '@/routes';

type Report = {
    id: number;
    title: string;
    category: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    created_at: string;
    description?: string;
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
};

type PageProps = {
    currentTeam?: { slug: string };
    auth?: { user?: { name?: string } };
};

const statusMap = {
    pending: {
        label: 'Menunggu Verifikasi',
        color: 'bg-orange-100 text-orange-800',
        dot: 'bg-orange-500',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-[#003366]',
        dot: 'bg-blue-500',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800',
        dot: 'bg-green-600',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-800',
        dot: 'bg-red-600',
    },
};

const categoryLabels: Record<string, string> = {
    ruang_kelas: 'Fasilitas Kelas',
    laboratorium: 'Laboratorium',
    toilet: 'Toilet',
    listrik: 'Kelistrikan',
    internet: 'Infrastruktur IT',
    parkiran: 'Parkiran',
    perpustakaan: 'Perpustakaan',
    kantin: 'Kantin',
    gedung: 'Gedung',
    kebersihan: 'Kebersihan',
    keamanan: 'Keamanan',
    pelayanan_akademik: 'Akademik',
    lainnya: 'Lainnya',
    kelas: 'Fasilitas Kelas',
};

const statCards = (isAdmin: boolean) =>
    [
        {
            key: 'total',
            label: isAdmin ? 'Total Laporan Kampus' : 'Laporan Saya',
            helper: isAdmin ? 'Semua laporan masuk' : 'Total yang Anda kirim',
            icon: ClipboardList,
            iconClass: 'bg-slate-100 text-slate-900',
            numberClass: 'text-slate-950',
        },
        {
            key: 'pending',
            label: 'Menunggu',
            helper: isAdmin ? 'Perlu verifikasi' : 'Menunggu ditinjau',
            icon: Clock3,
            iconClass: 'bg-orange-100 text-orange-700',
            numberClass: 'text-orange-900',
        },
        {
            key: 'diproses',
            label: 'Diproses',
            helper: isAdmin ? 'Sedang ditindaklanjuti' : 'Sedang diperbaiki',
            icon: Wrench,
            iconClass: 'bg-sky-100 text-sky-700',
            numberClass: 'text-sky-800',
        },
        {
            key: 'selesai',
            label: 'Selesai',
            helper: isAdmin ? 'Sudah ditutup' : 'Sudah selesai',
            icon: CheckCircle,
            iconClass: 'bg-emerald-100 text-emerald-700',
            numberClass: 'text-emerald-700',
        },
    ] as const;

const campusUpdates = [
    {
        title: 'Pemeliharaan Listrik',
        description: 'Gedung Teknik akan mengalami pemadaman pada Sabtu besok.',
        icon: Megaphone,
    },
    {
        title: 'Update Kebijakan',
        description: 'Kategori laporan Lingkungan Kampus mulai aktif hari ini.',
        icon: Info,
    },
];

const userActions = [
    {
        title: 'Buat Laporan',
        description: 'Laporkan fasilitas rusak atau kendala layanan kampus.',
        icon: PlusSquare,
        href: 'create',
        className: 'bg-slate-950 text-white hover:bg-slate-800',
    },
    {
        title: 'Riwayat Saya',
        description: 'Lihat semua laporan yang pernah Anda kirim.',
        icon: ClipboardList,
        href: 'reports',
        className:
            'border border-slate-200 bg-white text-slate-900 hover:border-teal-200 hover:bg-teal-50',
    },
    {
        title: 'Progress Publik',
        description: 'Pantau laporan umum tanpa membuka detail privat.',
        icon: SearchCheck,
        href: '/progress',
        className:
            'border border-slate-200 bg-white text-slate-900 hover:border-teal-200 hover:bg-teal-50',
    },
];

export default function Dashboard({ stats, recentReports, isAdmin }: Props) {
    const { currentTeam, auth } = usePage().props as PageProps;
    const slug = currentTeam?.slug ?? '';
    const userName = auth?.user?.name?.split(' ')[0] ?? 'Pengguna';
    const primaryActionHref = isAdmin
        ? `/${slug}/admin/reports`
        : `/${slug}/reports/create`;
    const reportsHref = isAdmin ? `/${slug}/admin/reports` : `/${slug}/reports`;
    const visibleStatCards = statCards(isAdmin);
    const completionRate =
        stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-8">
                    <section className="animate-sipaska-slide-up grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-teal-700 uppercase">
                                {isAdmin ? 'Ruang Admin' : 'Ruang Mahasiswa'}
                            </p>
                            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                                {isAdmin
                                    ? 'Dashboard Pengelolaan Laporan'
                                    : `Halo, ${userName}`}
                            </h1>
                            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                                {isAdmin
                                    ? 'Pantau laporan fasilitas kampus, cek prioritas, dan koordinasikan tindak lanjut dari satu tempat.'
                                    : 'Buat laporan fasilitas, pantau statusnya, dan cek progress publik tanpa fitur admin yang tidak Anda perlukan.'}
                            </p>
                        </div>

                        <Link
                            href={primaryActionHref}
                            prefetch
                            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-orange-600 sm:w-auto"
                        >
                            <PlusSquare className="size-5" />
                            {isAdmin ? 'Kelola Laporan' : 'Buat Laporan Baru'}
                        </Link>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {visibleStatCards.map((card) => {
                            const Icon = card.icon;
                            const value = stats[card.key];

                            return (
                                <article
                                    key={card.key}
                                    className="sipaska-card p-6"
                                >
                                    <div
                                        className={`flex size-14 items-center justify-center rounded-2xl ${card.iconClass}`}
                                    >
                                        <Icon className="size-6" />
                                    </div>
                                    <p className="mt-6 text-sm font-semibold text-slate-500 uppercase">
                                        {card.label}
                                    </p>
                                    <p
                                        className={`mt-2 text-4xl font-extrabold ${card.numberClass}`}
                                    >
                                        {String(value).padStart(2, '0')}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-slate-600">
                                        {card.helper}
                                    </p>
                                </article>
                            );
                        })}
                    </section>

                    {!isAdmin && (
                        <section className="grid gap-4 lg:grid-cols-3">
                            {userActions.map((action) => {
                                const Icon = action.icon;
                                const href =
                                    action.href === 'create'
                                        ? `/${slug}/reports/create`
                                        : action.href === 'reports'
                                          ? `/${slug}/reports`
                                          : action.href;

                                return (
                                    <Link
                                        key={action.title}
                                        href={href}
                                        prefetch
                                        className={`rounded-lg p-5 shadow-sm transition ${action.className}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
                                                <Icon className="size-5" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-base font-extrabold">
                                                    {action.title}
                                                </span>
                                                <span className="mt-1 block text-sm leading-6 opacity-75">
                                                    {action.description}
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </section>
                    )}

                    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22.5rem]">
                        <div className="min-w-0">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-2xl font-extrabold text-slate-950">
                                    {isAdmin
                                        ? 'Laporan Terbaru Kampus'
                                        : 'Laporan Saya Terbaru'}
                                </h2>
                                <Link
                                    href={reportsHref}
                                    prefetch
                                    className="shrink-0 text-sm font-semibold text-[#001e40] hover:text-[#fd8b00]"
                                >
                                    Lihat Semua
                                </Link>
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                                {recentReports.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                                        <ClipboardList className="mx-auto size-12 text-slate-300" />
                                        <p className="mt-4 font-bold text-slate-700">
                                            Belum ada laporan
                                        </p>
                                        {!isAdmin && (
                                            <Link
                                                href={`/${slug}/reports/create`}
                                                prefetch
                                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                                            >
                                                Buat laporan pertama
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    recentReports.map((report) => {
                                        const status = statusMap[report.status];
                                        const href = isAdmin
                                            ? `/${slug}/admin/reports/${report.id}`
                                            : `/${slug}/reports/${report.id}`;

                                        return (
                                            <Link
                                                key={report.id}
                                                href={href}
                                                prefetch
                                                className="sipaska-card group flex flex-col gap-4 p-5 md:flex-row md:items-center"
                                            >
                                                <div className="flex aspect-[4/3] h-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-700 md:h-28">
                                                    <Wrench className="size-9" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 uppercase">
                                                            {categoryLabels[
                                                                report.category
                                                            ] ??
                                                                report.category}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase ${status.color}`}
                                                        >
                                                            <span
                                                                className={`size-1.5 rounded-full ${status.dot}`}
                                                            />
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-950">
                                                        {report.title}
                                                    </h3>
                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                                                        {report.description ??
                                                            'Detail laporan dapat dilihat untuk meninjau status dan tindak lanjut.'}
                                                    </p>
                                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays className="size-4" />
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
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MessageSquare className="size-4" />
                                                            {isAdmin &&
                                                            report.user
                                                                ? report.user
                                                                      .name
                                                                : 'Status laporan'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end">
                                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-teal-700">
                                                        Detail
                                                        <ArrowRight className="size-4" />
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <aside className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                            <section className="rounded-lg bg-slate-950 p-6 text-white shadow-lg">
                                <h2 className="text-xl font-bold">
                                    {isAdmin
                                        ? 'Fokus Admin'
                                        : 'Informasi Kampus'}
                                </h2>
                                <div className="mt-6 flex flex-col gap-5">
                                    {(isAdmin
                                        ? [
                                              {
                                                  title: 'Tinjau Laporan Baru',
                                                  description:
                                                      'Prioritaskan laporan menunggu agar tindak lanjut tidak tertahan.',
                                                  icon: Eye,
                                              },
                                              {
                                                  title: 'Perbarui Status',
                                                  description:
                                                      'Berikan catatan admin yang jelas untuk setiap perubahan status.',
                                                  icon: Bell,
                                              },
                                          ]
                                        : campusUpdates
                                    ).map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={item.title}
                                                className="flex gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                                            >
                                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/25 text-blue-200">
                                                    <Icon className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm leading-6 text-blue-100">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link
                                    href={
                                        isAdmin ? `/${slug}/admin/reports` : '/'
                                    }
                                    prefetch
                                    className="mt-6 inline-flex w-full justify-center rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#001e40] transition hover:bg-blue-50"
                                >
                                    {isAdmin ? 'Buka Laporan' : 'Selengkapnya'}
                                </Link>
                            </section>

                            <section className="sipaska-card p-6">
                                <h2 className="text-xl font-bold text-slate-950">
                                    {isAdmin
                                        ? 'Kinerja Penyelesaian'
                                        : 'Statistik Laporan Anda'}
                                </h2>
                                <div className="mt-8">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-5xl font-extrabold text-slate-950">
                                                {completionRate}%
                                            </p>
                                            <p className="mt-2 text-sm text-slate-500">
                                                laporan selesai dari total
                                                laporan.
                                            </p>
                                        </div>
                                        <div className="flex size-20 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                            <CheckCircle className="size-9" />
                                        </div>
                                    </div>
                                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-emerald-500"
                                            style={{
                                                width: `${completionRate}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                                    <BarChart3 className="size-5 text-teal-700" />
                                    {isAdmin
                                        ? 'Gunakan angka ini untuk memantau beban tindak lanjut.'
                                        : 'Gunakan riwayat laporan untuk mengecek tindak lanjut terbaru.'}
                                </div>
                            </section>
                        </aside>
                    </section>
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
