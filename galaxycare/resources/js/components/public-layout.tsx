import { Link, usePage } from '@inertiajs/react';
import {
    Check,
    Menu,
    Monitor,
    Moon,
    Settings,
    Sparkles,
    Sun,
    X,
} from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAnimations } from '@/hooks/use-animations';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { dashboard, login, register } from '@/routes';

export function PublicLayout({ children }: { children: React.ReactNode }) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';
    const { enabled: animEnabled, toggle: toggleAnim } = useAnimations();
    const { appearance, updateAppearance } = useAppearance();
    const [mobileMenu, setMobileMenu] = useState(false);
    const appearanceOptions: {
        value: Appearance;
        label: string;
        icon: typeof Sun;
    }[] = [
        { value: 'light', label: 'Light mode', icon: Sun },
        { value: 'dark', label: 'Dark mode', icon: Moon },
        { value: 'system', label: 'Ikuti sistem', icon: Monitor },
    ];

    const renderSettingsMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-[#001e40] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    aria-label="Buka pengaturan tampilan"
                >
                    <Settings className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 rounded-lg border-slate-200 bg-white p-2 text-slate-800 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
                    Tampilan
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onSelect={toggleAnim}
                    className="cursor-pointer rounded-md px-3 py-2.5 text-sm font-semibold"
                >
                    <Sparkles
                        className={`size-4 ${animEnabled ? 'text-blue-500' : 'text-slate-400'}`}
                    />
                    {animEnabled ? 'Matikan animasi' : 'Nyalakan animasi'}
                    {animEnabled && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 dark:bg-slate-800" />
                {appearanceOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onSelect={() => updateAppearance(option.value)}
                            className="cursor-pointer rounded-md px-3 py-2.5 text-sm font-semibold"
                        >
                            <Icon className="size-4" />
                            {option.label}
                            {appearance === option.value && (
                                <Check className="ml-auto size-4" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div className="min-h-screen bg-[#f7f9fb] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <Link
                        href="/"
                        prefetch
                        className="flex min-w-0 items-center gap-3"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700">
                            <AppLogoIcon className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-lg leading-tight font-extrabold text-[#001e40] sm:text-xl dark:text-white">
                                SIPASKA
                            </p>
                            <p className="hidden truncate text-[10px] leading-tight font-semibold text-slate-500 uppercase sm:block dark:text-slate-400">
                                Sistem Pengaduan Fasilitas Kampus
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 md:flex">
                        <Link
                            href="/"
                            prefetch
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001e40] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/progress"
                            prefetch
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001e40] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            Progress
                        </Link>
                        <Link
                            href="/campus-information"
                            prefetch
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001e40] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            Informasi
                        </Link>
                        <Link
                            href="/forum"
                            prefetch
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001e40] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            Forum
                        </Link>
                        <div className="ml-2 flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    prefetch
                                    className="rounded-lg bg-[#003366] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#001e40] hover:shadow-md"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        prefetch
                                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[#001e40] dark:text-slate-300 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        prefetch
                                        className="rounded-lg bg-[#fd8b00] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                            {renderSettingsMenu()}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 shadow-sm dark:border-slate-800 dark:text-slate-200"
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenu ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                        {renderSettingsMenu()}
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenu && (
                    <div className="animate-sipaska-menu border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                prefetch
                                className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenu(false)}
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/progress"
                                prefetch
                                className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenu(false)}
                            >
                                Progress
                            </Link>
                            <Link
                                href="/campus-information"
                                prefetch
                                className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenu(false)}
                            >
                                Informasi
                            </Link>
                            <Link
                                href="/forum"
                                prefetch
                                className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenu(false)}
                            >
                                Forum
                            </Link>
                            <div className="my-2 border-t border-gray-100 dark:border-slate-800" />
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    prefetch
                                    className="rounded-lg bg-[#003366] px-3 py-3 text-center text-sm font-bold text-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        prefetch
                                        className="rounded-lg px-3 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        prefetch
                                        className="rounded-lg bg-[#fd8b00] px-3 py-3 text-center text-sm font-bold text-white"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    <div className="grid gap-8 sm:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700">
                                    <AppLogoIcon className="h-full w-full object-contain" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        SIPASKA
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500">
                                        Dikelola Biro Sarana dan Prasarana
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
                                Biro Sarana dan Prasarana
                                <br />
                                STT Terpadu Nurul Fikri
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                                Navigasi
                            </p>
                            <div className="mt-3 flex flex-col gap-2">
                                <Link
                                    href="/"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Beranda
                                </Link>
                                <Link
                                    href="/progress"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Progress Pengaduan
                                </Link>
                                <Link
                                    href="/campus-information"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Informasi Kampus
                                </Link>
                                <Link
                                    href="/forum"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Forum Aspirasi
                                </Link>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                                Referensi
                            </p>
                            <div className="mt-3 flex flex-col gap-2">
                                <a
                                    href="https://nurulfikri.ac.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Website Kampus
                                </a>
                                <a
                                    href="https://akademik.nurulfikri.ac.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Sistem Akademik
                                </a>
                                <Link
                                    href="/campus-information"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Informasi Kampus
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                        (c) 2026 SIPASKA - Biro Sarana dan Prasarana.
                    </div>
                </div>
            </footer>
        </div>
    );
}
