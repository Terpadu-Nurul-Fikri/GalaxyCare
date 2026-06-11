import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    MapPin,
    Tag,
    User,
} from 'lucide-react';
import type { FormEvent } from 'react';

type Report = {
    id: number;
    title: string;
    description: string;
    photo: string | null;
    category: string;
    location: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    priority?: 'low' | 'medium' | 'high';
    admin_response: string | null;
    resolved_at: string | null;
    created_at: string;
    user: { name: string; email: string };
};

type Props = { report: Report };

const statusConfig = {
    pending: {
        label: 'Menunggu',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-400',
    },
    diproses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-400',
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-400',
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-400',
    },
};

const priorityConfig = {
    low: { label: 'Rendah', color: 'bg-green-100 text-green-700' },
    medium: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-700' },
    high: { label: 'Tinggi', color: 'bg-red-100 text-red-700' },
};

const categoryLabels: Record<string, string> = {
    ruang_kelas: 'Ruang Kelas',
    laboratorium: 'Laboratorium',
    toilet: 'Toilet',
    listrik: 'Listrik',
    internet: 'Internet',
    parkiran: 'Parkiran',
    perpustakaan: 'Perpustakaan',
    kantin: 'Kantin',
    gedung: 'Gedung',
    kebersihan: 'Kebersihan',
    keamanan: 'Keamanan',
    pelayanan_akademik: 'Pelayanan Akademik',
    lainnya: 'Lainnya',
    kelas: 'Kelas',
};

export default function AdminReportsShow({ report }: Props) {
    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';
    const cfg = statusConfig[report.status];
    const flash = usePage().props.flash as { success?: string } | undefined;

    const { data, setData, patch, processing, errors } = useForm({
        status: report.status,
        admin_response: report.admin_response ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        patch(`/${teamSlug}/admin/reports/${report.id}`);
    }

    return (
        <>
            <Head title={`Admin - ${report.title}`} />
            <div className="min-h-screen bg-[#f7f9fb]">
                {/* Top bar */}
                <div className="border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${teamSlug}/admin/reports`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-[#9a4a00]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                Laporan #{report.id}
                            </p>
                            <h1 className="mt-0.5 truncate text-lg font-bold text-gray-900">
                                {report.title}
                            </h1>
                        </div>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${cfg.color}`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${cfg.dot}`}
                            />
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 sm:mx-6">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                <div className="p-4 sm:p-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* LEFT: Main Content */}
                        <div className="space-y-5 lg:col-span-2">
                            {/* Photo */}
                            {report.photo && (
                                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <img
                                        src={`/storage/${report.photo}`}
                                        alt={report.title}
                                        className="max-h-80 w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="sipaska-card p-5">
                                <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Deskripsi Laporan
                                </h2>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                    {report.description}
                                </p>
                            </div>

                            {/* Previous admin response (readonly, if any) */}
                            {report.admin_response && (
                                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                    <p className="mb-2 text-xs font-semibold tracking-wide text-blue-600 uppercase">
                                        Respons Sebelumnya
                                    </p>
                                    <p className="text-sm text-blue-800">
                                        {report.admin_response}
                                    </p>
                                </div>
                            )}

                            {/* Admin Action Form */}
                            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 px-5 py-4">
                                    <h2 className="font-semibold text-gray-900">
                                        Tindakan Admin
                                    </h2>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        Perbarui status dan kirim respons ke
                                        pelapor.
                                    </p>
                                </div>
                                <form
                                    onSubmit={submit}
                                    className="space-y-4 p-5"
                                >
                                    {/* Status */}
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Status Laporan
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                            {(
                                                [
                                                    'pending',
                                                    'diproses',
                                                    'selesai',
                                                    'ditolak',
                                                ] as const
                                            ).map((s) => {
                                                const sc = statusConfig[s];
                                                const isSelected =
                                                    data.status === s;

                                                return (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() =>
                                                            setData('status', s)
                                                        }
                                                        className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                                                            isSelected
                                                                ? `${sc.color} border-current ring-2 ring-current/20`
                                                            : 'border-slate-200 text-slate-500 hover:border-orange-200 hover:bg-orange-50 hover:text-[#9a4a00]'
                                                        }`}
                                                    >
                                                        <span className="flex items-center justify-center gap-1.5">
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${isSelected ? sc.dot : 'bg-gray-300'}`}
                                                            />
                                                            {sc.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.status && (
                                            <p className="mt-1.5 text-xs text-red-500">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>

                                    {/* Admin Response */}
                                    <div>
                                        <label
                                            htmlFor="admin_response"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Catatan / Respons{' '}
                                            <span className="font-normal text-gray-400">
                                                (opsional)
                                            </span>
                                        </label>
                                        <textarea
                                            id="admin_response"
                                            value={data.admin_response}
                                            onChange={(e) =>
                                                setData(
                                                    'admin_response',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Berikan catatan atau respons untuk pelapor..."
                                            rows={4}
                                            className="sipaska-focus w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-[#001e40] transition-all placeholder:text-slate-400 focus:border-[#fd8b00]"
                                        />
                                        {errors.admin_response && (
                                            <p className="mt-1.5 text-xs text-red-500">
                                                {errors.admin_response}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#fd8b00] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-orange-600 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Perubahan'}
                                        </button>
                                        <Link
                                            href={`/${teamSlug}/admin/reports`}
                                            className="inline-flex items-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            Kembali
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT: Sidebar */}
                        <div className="space-y-4">
                            {/* Reporter Info */}
                            <div className="sipaska-card p-5">
                                <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Info Pelapor
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                                        {report.user.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {report.user.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {report.user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Info */}
                            <div className="sipaska-card p-5">
                                <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Detail Laporan
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Tag className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Kategori
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {categoryLabels[
                                                    report.category
                                                ] ?? report.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Lokasi
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {report.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Tanggal Lapor
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(
                                                    report.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {report.priority && (
                                        <div className="flex items-start gap-3">
                                            <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Urgensi
                                                </p>
                                                <span
                                                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${priorityConfig[report.priority].color}`}
                                                >
                                                    {
                                                        priorityConfig[
                                                            report.priority
                                                        ].label
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {report.resolved_at && (
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Diselesaikan
                                                </p>
                                                <p className="text-sm font-medium text-green-700">
                                                    {new Date(
                                                        report.resolved_at,
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
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="sipaska-card p-5">
                                <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Status Saat Ini
                                </h3>
                                <span
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${cfg.color}`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${cfg.dot}`}
                                    />
                                    {cfg.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
