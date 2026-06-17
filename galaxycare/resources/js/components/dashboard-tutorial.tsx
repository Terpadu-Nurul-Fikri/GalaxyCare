import {
    Bell,
    CheckCircle2,
    ClipboardList,
    LayoutDashboard,
    MessageCircle,
    PlusCircle,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'sipaska.dashboard_tutorial_seen';
const OPEN_EVENT = 'sipaska:open-dashboard-tutorial';

const steps = [
    {
        title: 'Kenali Dashboard SIPASKA',
        description:
            'Di halaman ini Anda bisa melihat ringkasan laporan, status penanganan, dan aktivitas forum fasilitas kampus.',
        icon: LayoutDashboard,
    },
    {
        title: 'Buat Laporan Fasilitas',
        description:
            'Gunakan menu Buat Laporan untuk mengirim kerusakan fasilitas, lokasi, deskripsi, dan foto pendukung.',
        icon: PlusCircle,
    },
    {
        title: 'Pantau Riwayat dan Progress',
        description:
            'Menu Riwayat Laporan menampilkan laporan Anda, sedangkan Progress Publik bisa dilihat semua orang tanpa login.',
        icon: ClipboardList,
    },
    {
        title: 'Ikut Forum Aspirasi',
        description:
            'Forum bisa dibaca publik. Setelah login, Anda bisa membuat thread, reply, like, dan share diskusi.',
        icon: MessageCircle,
    },
    {
        title: 'Notifikasi dan Keamanan',
        description:
            'Cek notifikasi tindak lanjut, lalu kelola password dan 2FA dari menu user di bagian bawah sidebar.',
        icon: ShieldCheck,
    },
];

export function DashboardTutorial() {
    const [open, setOpen] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return !window.localStorage.getItem(STORAGE_KEY);
    });
    const [stepIndex, setStepIndex] = useState(0);
    const step = steps[stepIndex];
    const Icon = step.icon;
    const isLastStep = stepIndex === steps.length - 1;

    useEffect(() => {
        const openTutorial = () => {
            setStepIndex(0);
            setOpen(true);
        };

        window.addEventListener(OPEN_EVENT, openTutorial);

        return () => window.removeEventListener(OPEN_EVENT, openTutorial);
    }, []);

    function closeTutorial(): void {
        window.localStorage.setItem(STORAGE_KEY, 'true');
        setOpen(false);
        setStepIndex(0);
    }

    function nextStep(): void {
        if (isLastStep) {
            closeTutorial();

            return;
        }

        setStepIndex((current) => current + 1);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (nextOpen) {
                    setOpen(true);

                    return;
                }

                closeTutorial();
            }}
        >
            <DialogContent className="max-w-xl border-slate-200 bg-white p-0 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                    <DialogHeader>
                        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#003366] text-white">
                            <Icon className="size-6" />
                        </div>
                        <DialogTitle className="text-2xl font-extrabold">
                            {step.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {step.description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            {
                                icon: CheckCircle2,
                                label: 'Ringkas',
                            },
                            {
                                icon: Bell,
                                label: 'Terpantau',
                            },
                            {
                                icon: MessageCircle,
                                label: 'Kolaboratif',
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                            >
                                <item.icon className="mb-2 size-4 text-teal-700 dark:text-teal-300" />
                                {item.label}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                        {steps.map((item, index) => (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() => setStepIndex(index)}
                                className={`h-2 flex-1 rounded-full transition ${
                                    index <= stepIndex
                                        ? 'bg-[#003366] dark:bg-blue-300'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                                aria-label={`Buka langkah ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <DialogFooter className="border-t border-slate-200 p-6 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={closeTutorial}
                        className="rounded-lg px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        Skip
                    </button>
                    <button
                        type="button"
                        onClick={nextStep}
                        className="rounded-lg bg-[#003366] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#001e40]"
                    >
                        {isLastStep ? 'Selesai' : 'Lanjut'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function openDashboardTutorial(): void {
    window.dispatchEvent(new Event(OPEN_EVENT));
}
