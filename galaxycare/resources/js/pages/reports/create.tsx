import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

    function submit(e: FormEvent) {
        e.preventDefault();
        post(`/${teamSlug}/reports`, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title="Buat Laporan" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${teamSlug}/reports`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Buat Laporan Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Laporkan kerusakan fasilitas kampus yang Anda
                            temukan.
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Detail Laporan</CardTitle>
                        <CardDescription>
                            Isi informasi selengkap mungkin agar proses
                            penanganan lebih cepat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Laporan</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Contoh: AC Rusak di Ruang 301"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                >
                                    <option value="">Pilih kategori...</option>
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
                                    <p className="text-sm text-destructive">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    placeholder="Contoh: Gedung A, Lantai 3, Ruang 301"
                                />
                                {errors.location && (
                                    <p className="text-sm text-destructive">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Jelaskan kerusakan yang Anda temukan secara detail..."
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Priority */}
                            <div className="space-y-2">
                                <Label htmlFor="priority">
                                    Tingkat Urgensi
                                </Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        {
                                            value: 'low',
                                            label: 'Rendah',
                                            color: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400',
                                        },
                                        {
                                            value: 'medium',
                                            label: 'Sedang',
                                            color: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                                        },
                                        {
                                            value: 'high',
                                            label: 'Tinggi',
                                            color: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400',
                                        },
                                    ].map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() =>
                                                setData('priority', p.value)
                                            }
                                            className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                                                data.priority === p.value
                                                    ? p.color +
                                                      ' ring-2 ring-current ring-offset-1'
                                                    : 'border-muted bg-background text-muted-foreground hover:border-foreground/20'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.priority && (
                                    <p className="text-sm text-destructive">
                                        {errors.priority}
                                    </p>
                                )}
                            </div>

                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <Label>Foto (Opsional)</Label>
                                <div
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' &&
                                        fileInputRef.current?.click()
                                    }
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Upload foto"
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-h-48 rounded-md object-cover"
                                        />
                                    ) : (
                                        <>
                                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Klik untuk upload foto
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                JPG, PNG, WebP (maks. 2MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                {errors.photo && (
                                    <p className="text-sm text-destructive">
                                        {errors.photo}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Mengirim...'
                                        : 'Kirim Laporan'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/${teamSlug}/reports`}>
                                        Batal
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
