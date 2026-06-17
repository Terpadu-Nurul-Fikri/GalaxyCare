import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Info, Megaphone, Wrench } from 'lucide-react';
import { AnimateIn } from '@/components/animate-in';
import { PublicLayout } from '@/components/public-layout';

type CampusInformationItem = {
    id: number;
    title: string;
    body: string;
    tone: 'info' | 'maintenance' | 'academic' | 'event';
    published_at: string | null;
    created_at: string;
};

type Props = {
    campusInformation: {
        data: CampusInformationItem[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
};

const toneConfig = {
    info: {
        label: 'Info Umum',
        icon: Info,
        className:
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    },
    maintenance: {
        label: 'Maintenance',
        icon: Wrench,
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
    },
    academic: {
        label: 'Akademik',
        icon: Megaphone,
        className:
            'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-200',
    },
    event: {
        label: 'Kegiatan',
        icon: CalendarDays,
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
    },
};

export default function CampusInformation({ campusInformation }: Props) {
    return (
        <>
            <Head title="Informasi Kampus - SIPASKA" />
            <PublicLayout>
                <section className="border-b border-border bg-card px-4 py-10 sm:px-6 lg:py-14">
                    <div className="mx-auto max-w-6xl">
                        <AnimateIn>
                            <p className="text-sm font-bold text-primary uppercase">
                                Informasi Kampus
                            </p>
                            <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-foreground sm:text-5xl">
                                Pengumuman fasilitas dan kegiatan kampus
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                Pantau informasi terbaru dari admin SIPASKA
                                mengenai maintenance, akademik, dan kegiatan
                                fasilitas kampus.
                            </p>
                        </AnimateIn>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    {campusInformation.data.length === 0 ? (
                        <AnimateIn>
                            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                                <Info className="mx-auto size-10 text-muted-foreground" />
                                <p className="mt-4 font-semibold text-foreground">
                                    Belum ada informasi kampus
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Informasi yang dipublish admin akan tampil
                                    di halaman ini.
                                </p>
                            </div>
                        </AnimateIn>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {campusInformation.data.map((item, index) => {
                                const config = toneConfig[item.tone];
                                const Icon = config.icon;

                                return (
                                    <AnimateIn key={item.id} delay={index * 50}>
                                        <article className="flex min-h-56 flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                                            <div className="flex items-start justify-between gap-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${config.className}`}
                                                >
                                                    <Icon className="size-3.5" />
                                                    {config.label}
                                                </span>
                                                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                                                    {new Date(
                                                        item.published_at ??
                                                            item.created_at,
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
                                            <h2 className="mt-5 text-lg font-extrabold text-foreground">
                                                {item.title}
                                            </h2>
                                            <p className="mt-3 flex-1 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                                {item.body}
                                            </p>
                                        </article>
                                    </AnimateIn>
                                );
                            })}
                        </div>
                    )}

                    {campusInformation.last_page > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-3">
                            {campusInformation.prev_page_url && (
                                <Link
                                    href={campusInformation.prev_page_url}
                                    prefetch
                                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted"
                                >
                                    Sebelumnya
                                </Link>
                            )}
                            <span className="rounded-lg bg-card px-4 py-2 text-sm font-bold text-muted-foreground shadow-sm">
                                {campusInformation.current_page} /{' '}
                                {campusInformation.last_page}
                            </span>
                            {campusInformation.next_page_url && (
                                <Link
                                    href={campusInformation.next_page_url}
                                    prefetch
                                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted"
                                >
                                    Selanjutnya
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            </PublicLayout>
        </>
    );
}
