import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CalendarClock,
    Megaphone,
    Newspaper,
    Radio,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';

type InformationTone = 'info' | 'maintenance' | 'academic' | 'event';

type CampusInformation = {
    id: number;
    title: string;
    body: string;
    tone: InformationTone;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    user?: { name: string } | null;
};

type Props = {
    campusInformation: CampusInformation[];
};

const informationToneLabels: Record<InformationTone, string> = {
    info: 'Info Umum',
    maintenance: 'Maintenance',
    academic: 'Akademik',
    event: 'Kegiatan',
};

const toneStyles: Record<InformationTone, string> = {
    info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-200',
    maintenance:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200',
    academic:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200',
    event: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200',
};

export default function AdminCampusInformationIndex({
    campusInformation,
}: Props) {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const latestInformation = campusInformation[0];

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        body: string;
        tone: InformationTone;
    }>({
        title: '',
        body: '',
        tone: 'info',
    });

    function submitInformation(e: FormEvent) {
        e.preventDefault();

        post(`/${teamSlug}/admin/campus-information`, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                reset();
                router.reload({
                    only: ['campusInformation'],
                });
            },
        });
    }

    function deleteInformation(information: CampusInformation) {
        if (!confirm('Hapus informasi kampus ini?')) {
            return;
        }

        router.delete(
            `/${teamSlug}/admin/campus-information/${information.id}`,
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    router.reload({
                        only: ['campusInformation'],
                    });
                },
            },
        );
    }

    return (
        <>
            <Head title="Informasi Kampus" />
            <div className="min-h-screen bg-background text-foreground">
                <section className="border-b border-border bg-card px-6 py-8 shadow-sm">
                    <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary uppercase">
                                <Megaphone className="size-4" />
                                Panel Admin
                            </div>
                            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Informasi Kampus
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                Publikasikan pengumuman resmi untuk halaman
                                depan, progress, forum, dan dashboard user.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:min-w-72">
                            <div className="rounded-xl border border-border bg-background p-4">
                                <p className="text-2xl font-extrabold text-foreground">
                                    {campusInformation.length}
                                </p>
                                <p className="text-xs font-bold text-muted-foreground uppercase">
                                    Info Published
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-4">
                                <p className="line-clamp-1 text-sm font-extrabold text-foreground">
                                    {latestInformation
                                        ? informationToneLabels[
                                              latestInformation.tone
                                          ]
                                        : 'Belum Ada'}
                                </p>
                                <p className="mt-1 text-xs font-bold text-muted-foreground uppercase">
                                    Info Terbaru
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="mx-auto grid max-w-7xl gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Radio className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-foreground">
                                    Publikasikan info untuk mahasiswa
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    Gunakan judul singkat dan isi yang langsung
                                    menjelaskan jadwal, lokasi, atau instruksi
                                    penting.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={submitInformation}
                            className="mt-6 grid gap-4"
                        >
                            <div>
                                <label
                                    htmlFor="information-title"
                                    className="text-sm font-bold text-foreground"
                                >
                                    Judul Informasi
                                </label>
                                <input
                                    id="information-title"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                    maxLength={120}
                                    placeholder="Contoh: Mati Listrik"
                                    className="sipaska-focus mt-2 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500 dark:text-red-300">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="information-body"
                                    className="text-sm font-bold text-foreground"
                                >
                                    Isi Informasi
                                </label>
                                <textarea
                                    id="information-body"
                                    value={data.body}
                                    onChange={(event) =>
                                        setData('body', event.target.value)
                                    }
                                    maxLength={600}
                                    rows={7}
                                    placeholder="Tulis informasi yang akan tampil ke mahasiswa..."
                                    className="sipaska-focus mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground"
                                />
                                <div className="mt-1 flex justify-between gap-3 text-xs">
                                    {errors.body ? (
                                        <p className="text-red-500 dark:text-red-300">
                                            {errors.body}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            Maksimal 600 karakter.
                                        </p>
                                    )}
                                    <span className="font-semibold text-muted-foreground">
                                        {data.body.length}/600
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                <select
                                    value={data.tone}
                                    onChange={(event) =>
                                        setData(
                                            'tone',
                                            event.target
                                                .value as InformationTone,
                                        )
                                    }
                                    className="sipaska-focus h-11 rounded-lg border border-input bg-background px-4 text-sm font-semibold text-foreground"
                                >
                                    {Object.entries(informationToneLabels).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#fd8b00] px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Megaphone className="size-4" />
                                    {processing
                                        ? 'Mempublish...'
                                        : 'Publish Info'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold text-primary uppercase">
                                    Info terbaru
                                </p>
                                <h2 className="text-xl font-extrabold text-foreground">
                                    Daftar informasi yang tampil
                                </h2>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-muted-foreground">
                                <CalendarClock className="size-4" />
                                Urut dari terbaru
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3">
                            {campusInformation.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Newspaper className="size-7" />
                                    </div>
                                    <h3 className="mt-4 font-extrabold text-foreground">
                                        Belum ada informasi kampus
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                                        Setelah admin mempublish informasi,
                                        kontennya akan muncul di halaman depan,
                                        progress, forum, dan dashboard user.
                                    </p>
                                </div>
                            ) : (
                                campusInformation.map((item) => (
                                    <article
                                        key={item.id}
                                        className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/30"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${toneStyles[item.tone]}`}
                                                >
                                                    {
                                                        informationToneLabels[
                                                            item.tone
                                                        ]
                                                    }
                                                </span>
                                                <h3 className="mt-3 text-base font-extrabold text-foreground">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    {item.body}
                                                </p>
                                                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                                                    Dipublish oleh{' '}
                                                    {item.user?.name ?? 'Admin'}{' '}
                                                    pada{' '}
                                                    {new Date(
                                                        item.published_at ??
                                                            item.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteInformation(item)
                                                }
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 text-sm font-bold text-destructive transition hover:bg-destructive hover:text-destructive-foreground sm:w-auto"
                                            >
                                                <Trash2 className="size-4" />
                                                Hapus
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
