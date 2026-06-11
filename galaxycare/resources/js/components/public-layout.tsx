import { Link, usePage } from '@inertiajs/react';
import { GraduationCap, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useAnimations } from '@/hooks/use-animations';
import { dashboard, login, register } from '@/routes';

export function PublicLayout({ children }: { children: React.ReactNode }) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';
    const { enabled: animEnabled, toggle: toggleAnim } = useAnimations();
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-[#f7f9fb]">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link
                        href="/"
                        prefetch
                        className="flex items-center gap-2.5"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003366] text-white shadow-sm">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xl leading-tight font-extrabold text-[#001e40]">
                                SIPASKA
                            </p>
                            <p className="text-[10px] leading-tight font-semibold text-slate-500 uppercase">
                                Facility System
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 sm:flex">
                        <Link
                            href="/"
                            prefetch
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001e40]"
                        >
                            Beranda
                        </Link>
                        <Link
                            href="/progress"
                            prefetch
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001e40]"
                        >
                            Progress
                        </Link>
                        <Link
                            href="/forum"
                            prefetch
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001e40]"
                        >
                            Forum
                        </Link>
                        <button
                            onClick={toggleAnim}
                            className="ml-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#001e40]"
                            title={
                                animEnabled
                                    ? 'Matikan animasi'
                                    : 'Nyalakan animasi'
                            }
                        >
                            <Sparkles
                                className={`h-4 w-4 ${animEnabled ? 'text-blue-500' : 'text-gray-300'}`}
                            />
                        </button>
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
                                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[#001e40]"
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
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className="rounded-lg p-2 text-slate-600 sm:hidden"
                    >
                        {mobileMenu ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenu && (
                    <div className="border-t border-gray-100 bg-white px-4 py-3 sm:hidden">
                        <div className="flex flex-col gap-1">
                            <Link
                                href="/"
                                prefetch
                                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                onClick={() => setMobileMenu(false)}
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/progress"
                                prefetch
                                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                onClick={() => setMobileMenu(false)}
                            >
                                Progress
                            </Link>
                            <Link
                                href="/forum"
                                prefetch
                                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                onClick={() => setMobileMenu(false)}
                            >
                                Forum
                            </Link>
                            <hr className="my-2 border-gray-100" />
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    prefetch
                                    className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        prefetch
                                        className="rounded-lg px-3 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        prefetch
                                        className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={toggleAnim}
                                className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
                            >
                                <Sparkles
                                    className={`h-4 w-4 ${animEnabled ? 'text-blue-500' : 'text-gray-300'}`}
                                />
                                {animEnabled
                                    ? 'Matikan Animasi'
                                    : 'Nyalakan Animasi'}
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    <div className="grid gap-8 sm:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#003366] text-white">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        SIPASKA
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Sistem Pengaduan Fasilitas Kampus
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-gray-500">
                                STT Terpadu Nurul Fikri
                                <br />
                                Jl. Lenteng Agung Raya No.20, Jakarta Selatan
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Navigasi
                            </p>
                            <div className="mt-3 flex flex-col gap-2">
                                <Link
                                    href="/"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Beranda
                                </Link>
                                <Link
                                    href="/progress"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Progress Pengaduan
                                </Link>
                                <Link
                                    href="/forum"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Forum Anonim
                                </Link>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Referensi
                            </p>
                            <div className="mt-3 flex flex-col gap-2">
                                <a
                                    href="https://nurulfikri.ac.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Website Kampus
                                </a>
                                <a
                                    href="https://akademik.nurulfikri.ac.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Sistem Akademik
                                </a>
                                <Link
                                    href="/forum"
                                    prefetch
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Forum Aspirasi
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
                        (c) 2026 SIPASKA - STT Terpadu Nurul Fikri. All rights
                        reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
