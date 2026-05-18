import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { MessageCircle, Send } from 'lucide-react';
import { type FormEvent, useState } from 'react';

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

const catStyle = {
    kritik: 'bg-red-50 text-red-700 border-red-200',
    saran: 'bg-blue-50 text-blue-700 border-blue-200',
    aspirasi: 'bg-purple-50 text-purple-700 border-purple-200',
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
            <div className="min-h-screen bg-gray-50">
                {/* Nav */}
                <nav className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                                NF
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                                SIPASKA
                            </span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/progress"
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                            >
                                Progress
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="mx-auto max-w-2xl px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Forum Anonim
                            </h1>
                            <p className="mt-1 text-gray-600">
                                Sampaikan kritik, saran, atau aspirasi secara
                                anonim.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Send className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Tulis Pesan
                            </span>
                        </button>
                    </div>

                    {/* Flash */}
                    {flash?.success && (
                        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* Form */}
                    {showForm && (
                        <form
                            onSubmit={submit}
                            className="mt-6 rounded-xl border bg-white p-5 shadow-sm"
                        >
                            <div className="mb-4">
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Kategori
                                </label>
                                <div className="flex gap-2">
                                    {(
                                        ['kritik', 'saran', 'aspirasi'] as const
                                    ).map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() =>
                                                setData('category', cat)
                                            }
                                            className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                                                data.category === cat
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="message"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
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
                                    placeholder="Tulis kritik, saran, atau aspirasi Anda di sini... (min. 10 karakter)"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.message && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">
                                    Pesan dikirim secara anonim
                                </p>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Feedbacks */}
                    <div className="mt-6 space-y-3">
                        {feedbacks.data.length === 0 ? (
                            <div className="rounded-lg border bg-white p-12 text-center">
                                <MessageCircle className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-3 text-gray-500">
                                    Belum ada pesan. Jadilah yang pertama!
                                </p>
                            </div>
                        ) : (
                            feedbacks.data.map((f) => (
                                <div
                                    key={f.id}
                                    className="rounded-xl border bg-white p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="flex-1 text-sm whitespace-pre-wrap text-gray-800">
                                            {f.message}
                                        </p>
                                        <span
                                            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${catStyle[f.category]}`}
                                        >
                                            {f.category}
                                        </span>
                                    </div>
                                    {f.admin_reply && (
                                        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                                            <p className="mb-1 text-xs font-medium text-blue-700">
                                                Balasan Admin:
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                {f.admin_reply}
                                            </p>
                                        </div>
                                    )}
                                    <p className="mt-2 text-xs text-gray-400">
                                        {new Date(
                                            f.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {feedbacks.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-3">
                            {feedbacks.prev_page_url && (
                                <Link
                                    href={feedbacks.prev_page_url}
                                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Sebelumnya
                                </Link>
                            )}
                            <span className="text-sm text-gray-500">
                                {feedbacks.current_page} / {feedbacks.last_page}
                            </span>
                            {feedbacks.next_page_url && (
                                <Link
                                    href={feedbacks.next_page_url}
                                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Selanjutnya
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
