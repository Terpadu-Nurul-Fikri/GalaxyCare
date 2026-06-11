import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

const categories = [
    { value: 'ruang_kelas', label: 'Ruang Kelas' },
    { value: 'laboratorium', label: 'Laboratorium' },
    { value: 'toilet', label: 'Toilet' },
    { value: 'listrik', label: 'Listrik' },
    { value: 'internet', label: 'Internet & Jaringan' },
    { value: 'parkiran', label: 'Parkiran' },
    { value: 'perpustakaan', label: 'Perpustakaan' },
    { value: 'kantin', label: 'Kantin' },
    { value: 'gedung', label: 'Gedung' },
    { value: 'kebersihan', label: 'Kebersihan' },
    { value: 'keamanan', label: 'Keamanan' },
    { value: 'pelayanan_akademik', label: 'Pelayanan Akademik' },
    { value: 'lainnya', label: 'Lainnya' },
];

const priorities = [
    {
        value: 'low',
        label: 'Rendah',
        activeClass:
            'border-green-300 bg-green-50 text-green-700 ring-2 ring-green-200',
    },
    {
        value: 'medium',
        label: 'Sedang',
        activeClass:
            'border-yellow-300 bg-yellow-50 text-yellow-700 ring-2 ring-yellow-200',
    },
    {
        value: 'high',
        label: 'Tinggi',
        activeClass:
            'border-red-300 bg-red-50 text-red-700 ring-2 ring-red-200',
    },
];

export default function ReportsCreate() {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        photo: null as File | null,
        category: '',
        location: '',
        priority: 'medium',
    });

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('photo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }

    function clearPhoto() {
        setData('photo', null);
        setPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        post(`/${teamSlug}/reports`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    const inputClass =
        'sipaska-focus w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#001e40] placeholder:text-slate-400 transition-all focus:border-[#fd8b00]';

    return (
        <>
            <Head title="Buat Laporan" />
            <div className="min-h-screen bg-[#f7f9fb]">
                {/* Top bar */}
                <div className="border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${teamSlug}/reports`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-[#9a4a00]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                Buat Laporan Baru
                            </h1>
                            <p className="text-sm text-gray-500">
                                Laporkan kerusakan fasilitas kampus yang Anda
                                temukan.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="mx-auto max-w-2xl">
                        <div className="animate-sipaska-slide-up rounded-lg border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="font-semibold text-gray-900">
                                    Detail Laporan
                                </h2>
                                <p className="mt-0.5 text-sm text-gray-500">
                                    Isi informasi selengkap mungkin agar proses
                                    penanganan lebih cepat.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5 p-5">
                                {/* Title */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Judul Laporan{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Contoh: AC Rusak di Ruang 301"
                                        className={inputClass}
                                    />
                                    {errors.title && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Kategori{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">
                                            Pilih kategori...
                                        </option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat.value}
                                                value={cat.value}
                                            >
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label
                                        htmlFor="location"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Lokasi{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        placeholder="Contoh: Gedung A, Lantai 3, Ruang 301"
                                        className={inputClass}
                                    />
                                    {errors.location && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Deskripsi{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jelaskan kerusakan yang Anda temukan secara detail..."
                                        rows={4}
                                        className={inputClass}
                                    />
                                    {errors.description && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Tingkat Urgensi
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {priorities.map((p) => (
                                            <button
                                                key={p.value}
                                                type="button"
                                                onClick={() =>
                                                    setData('priority', p.value)
                                                }
                                                className={`rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${
                                                    data.priority === p.value
                                                        ? p.activeClass
                                                        : 'border-slate-200 text-slate-500 hover:border-orange-200 hover:bg-orange-50'
                                                }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Photo Upload */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Foto{' '}
                                        <span className="font-normal text-gray-400">
                                            (opsional)
                                        </span>
                                    </label>
                                    {preview ? (
                                        <div className="relative overflow-hidden rounded-xl border border-gray-200">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-h-52 w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearPhoto}
                                                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
                                                aria-label="Hapus foto"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition-colors hover:border-orange-300 hover:bg-orange-50"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                                <Upload className="h-5 w-5 text-[#fd8b00]" />
                                            </div>
                                            <p className="mt-3 text-sm font-medium text-gray-700">
                                                Klik untuk upload foto
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                JPG, PNG, WebP - maks. 2MB
                                            </p>
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    {errors.photo && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#fd8b00] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Mengirim...'
                                            : 'Kirim Laporan'}
                                    </button>
                                    <Link
                                        href={`/${teamSlug}/reports`}
                                        className="inline-flex items-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                                    >
                                        Batal
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
