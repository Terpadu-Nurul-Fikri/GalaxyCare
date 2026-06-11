import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { AnimateIn } from '@/components/animate-in';
import { PublicLayout } from '@/components/public-layout';

type Feedback = {
    id: number;
    message: string;
    category: 'kritik' | 'saran' | 'aspirasi';
    admin_reply: string | null;
    created_at: string;
};

type Props = {
    feedbacks: {
        data: Feedback[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
};

const categoryStyle = {
    kritik: {
        bg: 'bg-red-50 text-red-600 border-red-100',
        dot: 'bg-red-400',
    },
    saran: {
        bg: 'bg-blue-50 text-blue-600 border-blue-100',
        dot: 'bg-blue-400',
    },
    aspirasi: {
        bg: 'bg-purple-50 text-purple-600 border-purple-100',
        dot: 'bg-purple-400',
    },
};

export default function Forum({ feedbacks }: Props) {
    const flash = usePage().props.flash as { success?: string } | undefined;
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        category: 'kritik' as string,
    });
    const [showForm, setShowForm] = useState(false);

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/forum', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

    return (
        <>
            <Head title="Forum Anonim - SIPASKA" />
            <PublicLayout>
                <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
                    <AnimateIn>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Forum Anonim
                                </h1>
                                <p className="mt-1 text-gray-500">
                                    Sampaikan kritik, saran, atau aspirasi tanpa
                                    identitas.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowForm(!showForm)}
                                className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                            >
                                <Send className="h-4 w-4" />
                                <span className="hidden sm:inline">Tulis</span>
                            </button>
                        </div>
                    </AnimateIn>

                    {flash?.success && (
                        <AnimateIn>
                            <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
                                Berhasil. {flash.success}
                            </div>
                        </AnimateIn>
                    )}

                    {showForm && (
                        <AnimateIn>
                            <form
                                onSubmit={submit}
                                className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                            >
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Kategori
                                    </label>
                                    <div className="flex gap-2">
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
                                                className={`rounded-lg border px-3.5 py-2 text-sm font-medium capitalize transition-all ${
                                                    data.category === category
                                                        ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                                                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        rows={4}
                                        placeholder="Tulis pesan Anda di sini... (min. 10 karakter)"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    />
                                    {errors.message && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-gray-400">
                                        Dikirim secara anonim
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Mengirim...'
                                                : 'Kirim'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </AnimateIn>
                    )}

                    <div className="mt-8 space-y-3">
                        {feedbacks.data.length === 0 ? (
                            <AnimateIn>
                                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                                    <MessageCircle className="mx-auto h-10 w-10 text-gray-200" />
                                    <p className="mt-3 text-gray-400">
                                        Belum ada pesan. Jadilah yang pertama!
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
                                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="flex-1 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                                    {feedback.message}
                                                </p>
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
                                                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                                                    <p className="mb-1 text-xs font-medium text-blue-600">
                                                        Balasan Admin
                                                    </p>
                                                    <p className="text-sm text-blue-800">
                                                        {feedback.admin_reply}
                                                    </p>
                                                </div>
                                            )}
                                            <p className="mt-3 text-xs text-gray-300">
                                                {new Date(
                                                    feedback.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
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
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
                                >
                                    Sebelumnya
                                </Link>
                            )}
                            <span className="text-sm text-gray-400">
                                {feedbacks.current_page} / {feedbacks.last_page}
                            </span>
                            {feedbacks.next_page_url && (
                                <Link
                                    href={feedbacks.next_page_url}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
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
