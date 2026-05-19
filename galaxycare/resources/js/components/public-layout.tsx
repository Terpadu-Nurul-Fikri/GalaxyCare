import { Link, usePage } from '@inertiajs/react';
import { Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { PageLoader } from '@/components/page-loader';
import { useAnimations } from '@/hooks/use-animations';
import { dashboard, login, register } from '@/routes';

export function PublicLayout({ children }: { children: React.ReactNode }) {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';
    const { enabled: animEnabled, toggle: toggleAnim } = useAnimations();
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <PageLoader />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-blue-50 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white shadow-sm">
                            NF
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold leading-tight text-gray-900">SIPASKA</p>
                            <p className="text-[10px] leading-tight text-gray-400">STT Terpadu Nurul Fikri</p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 sm:flex">
                        <Link href="/" className="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600">Beranda</Link>
                        <Link href="/progress" className="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600">Progress</Link>
                        <Link href="/forum" className="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600">Forum</Link>
                        <button onClick={toggleAnim} className="ml-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600" title={animEnabled ? 'Matikan animasi' : 'Nyalakan animasi'}>
                            <Sparkles className={`h-4 w-4 ${animEnabled ? 'text-blue-500' : 'text-gray-300'}`} />
                        </button>
                        <div className="ml-2 flex items-center gap-2">
                            {auth.user ? (
                                <Link href={dashboardUrl} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href={login()} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">Masuk</Link>
                                    <Link href={register()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md">Daftar</Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-lg p-2 text-gray-600 sm:hidden">
                        {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenu && (
                    <div className="border-t border-gray-100 bg-white px-4 py-3 sm:hidden">
                        <div className="flex flex-col gap-1">
                            <Link href="/" className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50" onClick={() => setMobileMenu(false)}>Beranda</Link>
                            <Link href="/progress" className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50" onClick={() => setMobileMenu(false)}>Progress</Link>
                            <Link href="/forum" className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50" onClick={() => setMobileMenu(false)}>Forum</Link>
                            <hr className="my-2 border-gray-100" />
                            {auth.user ? (
                                <Link href={dashboardUrl} className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href={login()} className="rounded-lg px-3 py-2 text-center text-sm text-gray-700 hover:bg-gray-50">Masuk</Link>
                                    <Link href={register()} className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white">Daftar</Link>
                                </>
                            )}
                            <button onClick={toggleAnim} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
                                <Sparkles className={`h-4 w-4 ${animEnabled ? 'text-blue-500' : 'text-gray-300'}`} />
                                {animEnabled ? 'Matikan Animasi' : 'Nyalakan Animasi'}
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-gray-50">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    <div className="grid gap-8 sm:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">NF</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">SIPASKA</p>
                                    <p className="text-xs text-gray-400">Sistem Pengaduan Fasilitas Kampus</p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-gray-500">STT Terpadu Nurul Fikri<br />Jl. Lenteng Agung Raya No.20, Jakarta Selatan</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Navigasi</p>
                            <div className="mt-3 flex flex-col gap-2">
                                <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">Beranda</Link>
                                <Link href="/progress" className="text-sm text-gray-600 hover:text-blue-600">Progress Pengaduan</Link>
                                <Link href="/forum" className="text-sm text-gray-600 hover:text-blue-600">Forum Anonim</Link>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tautan</p>
                            <div className="mt-3 flex flex-col gap-2">
                                <a href="https://nurulfikri.ac.id" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600">Website Kampus</a>
                                <a href="https://akademik.nurulfikri.ac.id" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600">Sistem Akademik</a>
                                <Link href={login()} className="text-sm text-gray-600 hover:text-blue-600">Login Admin</Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
                        © 2026 SIPASKA — STT Terpadu Nurul Fikri. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
