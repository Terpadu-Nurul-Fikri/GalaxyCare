import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    EyeOff,
    Heart,
    LockKeyhole,
    MessageCircle,
    Reply,
    Send,
    Share2,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { AnimateIn } from '@/components/animate-in';
import { CampusInformationPanel } from '@/components/campus-information-panel';
import type { CampusInformationItem } from '@/components/campus-information-panel';
import { PublicLayout } from '@/components/public-layout';
import { login } from '@/routes';

type ReplyItem = {
    id: number;
    message: string;
    created_at: string;
    author: {
        name: string;
    };
};

type Feedback = {
    id: number;
    message: string;
    category: 'kritik' | 'saran' | 'aspirasi';
    admin_reply: string | null;
    created_at: string;
    is_anonymous: boolean;
    author: {
        name: string;
    };
    replies_count: number;
    likes_count: number;
    liked_by_me: boolean;
    replies: ReplyItem[];
};

type Props = {
    feedbacks: {
        data: Feedback[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    campusInformation: CampusInformationItem[];
};

const categoryStyle = {
    kritik: {
        bg: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900/60',
        dot: 'bg-red-400',
    },
    saran: {
        bg: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900/60',
        dot: 'bg-blue-400',
    },
    aspirasi: {
        bg: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/40 dark:text-violet-200 dark:border-violet-900/60',
        dot: 'bg-violet-400',
    },
};

export default function Forum({ feedbacks, campusInformation }: Props) {
    const { auth, flash } = usePage().props as {
        auth?: { user?: unknown };
        flash?: { success?: string };
    };
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        category: 'kritik' as string,
        is_anonymous: true,
    });
    const [showForm, setShowForm] = useState(false);
    const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
    const [sharedThreadId, setSharedThreadId] = useState<number | null>(null);
    const isAuthenticated = Boolean(auth?.user);

    function submit(e: FormEvent): void {
        e.preventDefault();
        post('/forum', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

    function submitReply(e: FormEvent, feedbackId: number): void {
        e.preventDefault();
        const message = replyDrafts[feedbackId]?.trim();

        if (!message) {
            return;
        }

        router.post(
            `/forum/${feedbackId}/replies`,
            { message },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setReplyDrafts((drafts) => ({
                        ...drafts,
                        [feedbackId]: '',
                    })),
            },
        );
    }

    function toggleLike(feedbackId: number): void {
        if (!isAuthenticated) {
            router.visit(login());

            return;
        }

        router.post(
            `/forum/${feedbackId}/reactions`,
            { type: 'like' },
            { preserveScroll: true },
        );
    }

    async function shareThread(feedbackId: number): Promise<void> {
        const url = `${window.location.origin}/forum#thread-${feedbackId}`;

        if (navigator.share) {
            await navigator.share({
                title: 'Forum Aspirasi SIPASKA',
                text: 'Lihat diskusi fasilitas kampus di SIPASKA.',
                url,
            });
        } else {
            await navigator.clipboard.writeText(url);
            setSharedThreadId(feedbackId);
            window.setTimeout(() => setSharedThreadId(null), 1800);
        }
    }

    return (
        <>
            <Head title="Forum Aspirasi - SIPASKA" />
            <PublicLayout>
                <div className="border-b border-border bg-card">
                    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:py-14">
                        <AnimateIn>
                            <div>
                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-accent uppercase">
                                    <MessageCircle className="size-4" />
                                    Forum Chat Publik
                                </span>
                                <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-5xl">
                                    Forum Aspirasi Fasilitas Kampus
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Tamu bisa melihat history diskusi. Peserta
                                    yang sudah login bisa membuat thread,
                                    membalas, memberi like, dan membagikan
                                    diskusi fasilitas kampus dengan nama tampil
                                    atau anonim.
                                </p>
                            </div>
                        </AnimateIn>

                        <AnimateIn delay={120}>
                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={() => setShowForm(!showForm)}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 sm:w-auto lg:w-full"
                                >
                                    <Send className="h-4 w-4" />
                                    Buat Thread
                                </button>
                            ) : (
                                <Link
                                    href={login()}
                                    prefetch
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 sm:w-auto lg:w-full"
                                >
                                    <LockKeyhole className="h-4 w-4" />
                                    Masuk untuk Ikut Diskusi
                                </Link>
                            )}
                        </AnimateIn>
                    </div>
                </div>

                <CampusInformationPanel items={campusInformation} compact />

                <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                    <AnimateIn>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                                    Chat History Forum
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Semua thread publik bisa dibaca tanpa login.
                                </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {feedbacks.data.length} thread
                            </span>
                        </div>
                    </AnimateIn>

                    {flash?.success && (
                        <AnimateIn>
                            <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
                                Berhasil. {flash.success}
                            </div>
                        </AnimateIn>
                    )}

                    {isAuthenticated && showForm && (
                        <AnimateIn>
                            <form
                                onSubmit={submit}
                                className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-muted-foreground/90">
                                        Kategori
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {(
                                            [
                                                'kritik',
                                                'saran',
                                                'aspirasi',
                                            ] as const
                                        ).map((category) => (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'category',
                                                        category,
                                                    )
                                                }
                                                className={`rounded-lg border px-3.5 py-2 text-sm font-bold capitalize transition-all ${
                                                    data.category === category
                                                        ? 'border-[#003366]/20 bg-blue-50 text-[#003366] shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100'
                                                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="mb-2 block text-sm font-medium text-muted-foreground/90">
                                        Identitas pengirim
                                    </p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {[
                                            {
                                                value: true,
                                                title: 'Anonim',
                                                description:
                                                    'Nama Anda tidak tampil di thread.',
                                                icon: EyeOff,
                                            },
                                            {
                                                value: false,
                                                title: 'Tampilkan nama',
                                                description:
                                                    'Nama akun tampil sebagai penulis.',
                                                icon: UserRound,
                                            },
                                        ].map((option) => {
                                            const Icon = option.icon;
                                            const isSelected =
                                                data.is_anonymous ===
                                                option.value;

                                            return (
                                                <button
                                                    key={option.title}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            'is_anonymous',
                                                            option.value,
                                                        )
                                                    }
                                                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                                                        isSelected
                                                            ? 'border-[#003366]/30 bg-blue-50 text-[#003366] shadow-sm dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                                                            isSelected
                                                                ? 'bg-white text-[#003366] dark:bg-blue-900 dark:text-blue-100'
                                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        <Icon className="size-4" />
                                                    </span>
                                                    <span>
                                                        <span className="block text-sm font-extrabold">
                                                            {option.title}
                                                        </span>
                                                        <span className="mt-0.5 block text-xs leading-5 opacity-75">
                                                            {option.description}
                                                        </span>
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.is_anonymous && (
                                        <p className="mt-1.5 text-xs text-red-500 dark:text-red-300">
                                            {errors.is_anonymous}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-medium text-muted-foreground/90"
                                    >
                                        Pesan Thread
                                    </label>
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        rows={4}
                                        placeholder="Mulai diskusi fasilitas kampus... (min. 10 karakter)"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/15 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                    />
                                    {errors.message && (
                                        <p className="mt-1.5 text-xs text-red-500 dark:text-red-300">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Pilihan identitas hanya berlaku untuk
                                        thread yang sedang dikirim.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-lg bg-[#003366] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#001e40] disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Mengirim...'
                                                : 'Kirim Thread'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </AnimateIn>
                    )}

                    <div className="mt-8 grid gap-4">
                        {feedbacks.data.length === 0 ? (
                            <AnimateIn>
                                <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                                    <MessageCircle className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                                    <p className="mt-3 text-slate-500 dark:text-slate-400">
                                        Belum ada thread. Jadilah yang pertama!
                                    </p>
                                </div>
                            </AnimateIn>
                        ) : (
                            feedbacks.data.map((feedback, index) => {
                                const style = categoryStyle[feedback.category];

                                return (
                                    <AnimateIn
                                        key={feedback.id}
                                        delay={index * 50}
                                    >
                                        <article
                                            id={`thread-${feedback.id}`}
                                            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-950 dark:text-white">
                                                            {
                                                                feedback.author
                                                                    .name
                                                            }
                                                        </span>
                                                        <span className="text-xs text-slate-400 dark:text-slate-500">
                                                            {new Date(
                                                                feedback.created_at,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                                {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground/90">
                                                        {feedback.message}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style.bg}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                                                    />
                                                    {feedback.category}
                                                </span>
                                            </div>

                                            {feedback.admin_reply && (
                                                <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/60 dark:bg-blue-950/40">
                                                    <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-200">
                                                        Balasan BSP
                                                    </p>
                                                    <p className="text-sm text-blue-800 dark:text-blue-100">
                                                        {feedback.admin_reply}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleLike(feedback.id)
                                                    }
                                                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                                                        feedback.liked_by_me
                                                            ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200'
                                                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <Heart
                                                        className={`size-4 ${feedback.liked_by_me ? 'fill-current' : ''}`}
                                                    />
                                                    {feedback.likes_count}
                                                </button>
                                                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                                    <Reply className="size-4" />
                                                    {feedback.replies_count}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void shareThread(
                                                            feedback.id,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                                >
                                                    <Share2 className="size-4" />
                                                    {sharedThreadId ===
                                                    feedback.id
                                                        ? 'Tersalin'
                                                        : 'Share'}
                                                </button>
                                            </div>

                                            <div className="mt-4 grid gap-3">
                                                {feedback.replies.map(
                                                    (reply) => (
                                                        <div
                                                            key={reply.id}
                                                            className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70"
                                                        >
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                                                    {
                                                                        reply
                                                                            .author
                                                                            .name
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                                    {new Date(
                                                                        reply.created_at,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground/90">
                                                                {reply.message}
                                                            </p>
                                                        </div>
                                                    ),
                                                )}

                                                {isAuthenticated ? (
                                                    <form
                                                        onSubmit={(event) =>
                                                            submitReply(
                                                                event,
                                                                feedback.id,
                                                            )
                                                        }
                                                        className="flex flex-col gap-2 sm:flex-row"
                                                    >
                                                        <input
                                                            value={
                                                                replyDrafts[
                                                                    feedback.id
                                                                ] ?? ''
                                                            }
                                                            onChange={(event) =>
                                                                setReplyDrafts(
                                                                    (
                                                                        drafts,
                                                                    ) => ({
                                                                        ...drafts,
                                                                        [feedback.id]:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                )
                                                            }
                                                            placeholder="Balas thread ini..."
                                                            className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#003366] px-4 text-sm font-bold text-white hover:bg-[#001e40]"
                                                        >
                                                            <Send className="size-4" />
                                                            Reply
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <Link
                                                        href={login()}
                                                        prefetch
                                                        className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                                    >
                                                        <LockKeyhole className="size-4" />
                                                        Login untuk reply dan
                                                        like
                                                    </Link>
                                                )}
                                            </div>
                                        </article>
                                    </AnimateIn>
                                );
                            })
                        )}
                    </div>

                    {feedbacks.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            {feedbacks.prev_page_url && (
                                <Link
                                    href={feedbacks.prev_page_url}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Sebelumnya
                                </Link>
                            )}
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {feedbacks.current_page} / {feedbacks.last_page}
                            </span>
                            {feedbacks.next_page_url && (
                                <Link
                                    href={feedbacks.next_page_url}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Selanjutnya
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </PublicLayout>
        </>
    );
}
