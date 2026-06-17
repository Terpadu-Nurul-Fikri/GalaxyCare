import { CalendarDays, Info, Megaphone, Wrench } from 'lucide-react';

export type CampusInformationItem = {
    id: number;
    title: string;
    body: string;
    tone: 'info' | 'maintenance' | 'academic' | 'event';
    published_at: string | null;
    created_at: string;
};

type Props = {
    items: CampusInformationItem[];
    compact?: boolean;
};

const toneConfig = {
    info: {
        label: 'Info',
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

export function CampusInformationPanel({ items, compact = false }: Props) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="border-y border-border bg-card px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-primary uppercase">
                        Informasi Kampus
                    </p>
                    <h2 className="text-2xl font-extrabold text-foreground">
                        Pengumuman terbaru
                    </h2>
                </div>
                <div
                    className={`mt-5 grid gap-3 ${compact ? 'md:grid-cols-3' : 'lg:grid-cols-3'}`}
                >
                    {items.map((item) => {
                        const config = toneConfig[item.tone];
                        const Icon = config.icon;

                        return (
                            <article
                                key={item.id}
                                className="rounded-xl border border-border bg-background p-4 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${config.className}`}
                                    >
                                        <Icon className="size-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold text-muted-foreground uppercase">
                                            {config.label}
                                        </span>
                                        <h3 className="mt-1 line-clamp-1 font-extrabold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                            {item.body}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
