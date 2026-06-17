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
    Send,
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
    recentFeedbacks: Feedback[];
    campusInformation: CampusInformation[];
    isAdmin: boolean;
};

type CampusInformation = {
    id: number;
    title: string;
    body: string;
    tone: 'info' | 'maintenance' | 'academic' | 'event';
    published_at: string | null;
    created_at: string;
};

type Feedback = {
    id: number;
    message: string;
    category: 'kritik' | 'saran' | 'aspirasi';
    admin_reply: string | null;
    created_at: string;
};

type PageProps = {
    currentTeam?: { slug: string };
    auth?: { user?: { name?: string } };
};

const statusMap = {
    pending: {
        label: 'Menunggu Verifikasi',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
        dot: 'bg-amber-500',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
        dot: 'bg-blue-500',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
        dot: 'bg-emerald-600',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200',
        dot: 'bg-rose-600',
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
            iconClass: 'bg-muted text-foreground',
            numberClass: 'text-foreground',
        },
        {
            key: 'pending',
            label: 'Menunggu',
            helper: isAdmin ? 'Perlu verifikasi' : 'Menunggu ditinjau',
            icon: Clock3,
            iconClass:
                'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200',
            numberClass: 'text-amber-700 dark:text-amber-100',
        },
        {
            key: 'diproses',
            label: 'Diproses',
            helper: isAdmin ? 'Sedang ditindaklanjuti' : 'Sedang diperbaiki',
            icon: Wrench,
            iconClass:
                'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200',
            numberClass: 'text-blue-700 dark:text-blue-100',
        },
        {
            key: 'selesai',
            label: 'Selesai',
            helper: isAdmin ? 'Sudah ditutup' : 'Sudah selesai',
            icon: CheckCircle,
            iconClass:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200',
            numberClass: 'text-emerald-700 dark:text-emerald-100',
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

const campusInformationFallback = campusUpdates.map((item) => ({
    id: item.title,
    title: item.title,
    body: item.description,
    icon: item.icon,
}));

const feedbackCategoryStyle = {
    kritik: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200',
    saran: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200',
    aspirasi:
        'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200',
};

const userActions = [
    {
        title: 'Buat Laporan',
        description: 'Laporkan fasilitas rusak atau kendala layanan kampus.',
        icon: PlusSquare,
        href: 'create',
        className:
            'border-primary bg-primary text-primary-foreground hover:opacity-90',
        iconClass: 'bg-white/20 text-white',
    },
    {
        title: 'Riwayat Saya',
        description: 'Lihat semua laporan yang pernah Anda kirim.',
        icon: ClipboardList,
        href: 'reports',
        className:
            'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50',
        iconClass: 'bg-primary/10 text-primary',
    },
    {
        title: 'Progress Publik',
        description: 'Pantau laporan umum tanpa membuka detail privat.',
        icon: SearchCheck,
        href: '/progress',
        className:
            'border-border bg-card text-foreground hover:border-accent/50 hover:bg-muted/50',
        iconClass: 'bg-accent/10 text-accent',
    },
];

const dashboardFillers = (isAdmin: boolean) =>
    [
        {
            title: isAdmin ? 'Alur prioritas hari ini' : 'Langkah berikutnya',
            description: isAdmin
                ? 'Verifikasi laporan baru, beri status yang jelas, lalu tutup laporan selesai agar progress publik tetap akurat.'
                : 'Buat laporan dengan lokasi dan foto yang jelas, lalu pantau statusnya dari riwayat laporan Anda.',
            icon: SearchCheck,
        },
        {
            title: 'Forum tetap aktif',
            description:
                'Diskusi publik membantu menemukan pola masalah fasilitas sebelum menjadi laporan besar.',
            icon: MessageSquare,
        },
    ] as const;

export default function Dashboard({
    stats,
    recentReports,
    recentFeedbacks,
    campusInformation,
    isAdmin,
}: Props) {
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
    const displayedCampusInformation =
        campusInformation.length > 0
            ? campusInformation.map((item) => ({
                  id: item.id,
                  title: item.title,
                  body: item.body,
                  icon: Megaphone,
              }))
            : campusInformationFallback;

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-8">
                    <section className="animate-sipaska-slide-up overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-primary uppercase">
                                    {isAdmin
                                        ? 'Ruang Admin'
                                        : 'Ruang Mahasiswa'}
                                </p>
                                <h1 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
                                    {isAdmin
                                        ? 'Dashboard Pengelolaan Laporan'
                                        : `Halo, ${userName}`}
                                </h1>
                                <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    {isAdmin
                                        ? 'Pantau laporan fasilitas kampus, cek prioritas, dan koordinasikan tindak lanjut dari satu tempat.'
                                        : 'Buat laporan fasilitas, pantau statusnya, dan cek progress publik tanpa fitur admin yang tidak Anda perlukan.'}
                                </p>
                            </div>

                            <Link
                                href={primaryActionHref}
                                prefetch
                                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-sm transition hover:opacity-90 sm:w-auto"
                            >
                                <PlusSquare className="size-5" />
                                {isAdmin
                                    ? 'Kelola Laporan'
                                    : 'Buat Laporan Baru'}
                            </Link>
                        </div>

                        <div className="grid border-t border-border bg-muted/30 sm:grid-cols-3">
                            {[
                                {
                                    label: 'Progress selesai',
                                    value: `${completionRate}%`,
                                    helper: 'dari total laporan',
                                },
                                {
                                    label: 'Masih aktif',
                                    value: stats.pending + stats.diproses,
                                    helper: 'menunggu / diproses',
                                },
                                {
                                    label: isAdmin
                                        ? 'Panel admin'
                                        : 'Aksi cepat',
                                    value: isAdmin ? 'Siap' : 'Cepat',
                                    helper: isAdmin
                                        ? 'kelola prioritas laporan'
                                        : 'lapor dan pantau status',
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="border-b border-border px-5 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
                                >
                                    <p className="text-xs font-bold text-muted-foreground uppercase">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-2xl font-extrabold text-foreground">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                        {item.helper}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                                    <p className="mt-6 text-sm font-semibold text-slate-500 uppercase dark:text-slate-400">
                                        {card.label}
                                    </p>
                                    <p
                                        className={`mt-2 text-4xl font-extrabold ${card.numberClass}`}
                                    >
                                        {String(value).padStart(2, '0')}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
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
                                        className={`rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 ${action.className}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span
                                                className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${action.iconClass}`}
                                            >
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
                                <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                                    {isAdmin
                                        ? 'Laporan Terbaru Kampus'
                                        : 'Laporan Saya Terbaru'}
                                </h2>
                                <Link
                                    href={reportsHref}
                                    prefetch
                                    className="shrink-0 text-sm font-semibold text-[#001e40] hover:text-[#fd8b00] dark:text-blue-200 dark:hover:text-orange-300"
                                >
                                    Lihat Semua
                                </Link>
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                                {recentReports.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                        <ClipboardList className="mx-auto size-12 text-slate-300" />
                                        <p className="mt-4 font-bold text-slate-700 dark:text-slate-200">
                                            Belum ada laporan
                                        </p>
                                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                            Area ini akan terisi riwayat
                                            laporan. Untuk sekarang, gunakan
                                            tombol cepat dan ringkasan forum di
                                            bawah supaya dashboard tetap
                                            informatif.
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
                                    <>
                                        {recentReports.map((report) => {
                                            const status =
                                                statusMap[report.status];
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
                                                    <div className="flex aspect-[4/3] h-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground md:h-28">
                                                        <Wrench className="size-9" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground uppercase">
                                                                {categoryLabels[
                                                                    report
                                                                        .category
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
                                                        <h3 className="mt-3 line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                                                            {report.title}
                                                        </h3>
                                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground/80">
                                                            {report.description ??
                                                                'Detail laporan dapat dilihat untuk meninjau status dan tindak lanjut.'}
                                                        </p>
                                                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                                                                    ? report
                                                                          .user
                                                                          .name
                                                                    : 'Status laporan'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-end">
                                                        <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                                            Detail
                                                            <ArrowRight className="size-4" />
                                                        </span>
                                                    </div>
                                                </Link>
                                            );
                                        })}

                                        <div className="grid gap-4 lg:grid-cols-2">
                                            {dashboardFillers(isAdmin).map(
                                                (item) => {
                                                    const Icon = item.icon;

                                                    return (
                                                        <article
                                                            key={item.title}
                                                            className="rounded-xl border border-border bg-card p-5 shadow-sm"
                                                        >
                                                            <div className="flex gap-4">
                                                                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                                    <Icon className="size-5" />
                                                                </span>
                                                                <div>
                                                                    <h3 className="font-extrabold text-foreground">
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </h3>
                                                                    <p className="mt-1 text-sm leading-6 text-muted-foreground/80">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </article>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <aside className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                            <section className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-white shadow-lg dark:bg-slate-900">
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
                                                  body: 'Prioritaskan laporan menunggu agar tindak lanjut tidak tertahan.',
                                                  icon: Eye,
                                              },
                                              {
                                                  title: 'Perbarui Status',
                                                  body: 'Berikan catatan admin yang jelas untuk setiap perubahan status.',
                                                  icon: Bell,
                                              },
                                          ]
                                        : displayedCampusInformation
                                    ).map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={item.title}
                                                className="flex gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                                            >
                                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-teal-200 dark:bg-slate-950">
                                                    <Icon className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm leading-6 text-slate-300">
                                                        {item.body}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link
                                    href={
                                        isAdmin
                                            ? `/${slug}/admin/reports`
                                            : '/campus-information'
                                    }
                                    prefetch
                                    className="mt-6 inline-flex w-full justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-white dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                                >
                                    {isAdmin ? 'Buka Laporan' : 'Selengkapnya'}
                                </Link>
                            </section>

                            <section className="sipaska-card p-6">
                                <h2 className="text-xl font-bold text-foreground">
                                    {isAdmin
                                        ? 'Kinerja Penyelesaian'
                                        : 'Statistik Laporan Anda'}
                                </h2>
                                <div className="mt-8">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-5xl font-extrabold text-foreground">
                                                {completionRate}%
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                laporan selesai dari total
                                                laporan.
                                            </p>
                                        </div>
                                        <div className="flex size-20 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                            <CheckCircle className="size-9" />
                                        </div>
                                    </div>
                                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-emerald-500"
                                            style={{
                                                width: `${completionRate}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-2 rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground">
                                    <BarChart3 className="size-5 text-primary" />
                                    {isAdmin
                                        ? 'Gunakan angka ini untuk memantau beban tindak lanjut.'
                                        : 'Gunakan riwayat laporan untuk mengecek tindak lanjut terbaru.'}
                                </div>
                            </section>
                        </aside>
                    </section>

                    <section className="grid gap-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                        <div className="min-w-0">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-bold text-primary uppercase">
                                        Forum SIPASKA
                                    </p>
                                    <h2 className="mt-1 text-2xl font-extrabold text-foreground">
                                        Aspirasi Fasilitas Kampus
                                    </h2>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground/80">
                                        Ringkasan kritik, saran, dan aspirasi
                                        terbaru yang bisa dilihat admin maupun
                                        user biasa.
                                    </p>
                                </div>
                                <Link
                                    href="/forum"
                                    prefetch
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                                >
                                    <Send className="size-4" />
                                    Buka Forum
                                </Link>
                            </div>

                            <div className="mt-6 grid gap-3 md:grid-cols-2">
                                {recentFeedbacks.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-border p-8 text-center md:col-span-2">
                                        <MessageSquare className="mx-auto size-10 text-muted" />
                                        <p className="mt-3 text-sm font-semibold text-muted-foreground">
                                            Belum ada aspirasi publik.
                                        </p>
                                    </div>
                                ) : (
                                    recentFeedbacks.map((feedback) => (
                                        <article
                                            key={feedback.id}
                                            className="rounded-xl border border-border bg-muted/30 p-4"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${feedbackCategoryStyle[feedback.category]}`}
                                                >
                                                    {feedback.category}
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {new Date(
                                                        feedback.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/80">
                                                {feedback.message}
                                            </p>
                                            {feedback.admin_reply && (
                                                <p className="mt-3 rounded-lg bg-card p-3 text-xs leading-5 font-medium text-primary">
                                                    Admin:{' '}
                                                    {feedback.admin_reply}
                                                </p>
                                            )}
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
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
