import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CircleSlash, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAnimations } from '@/hooks/use-animations';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const page = usePage();
    const currentTeam = page.props.currentTeam;
    const isAdmin = auth.user.role === 'admin';
    const userRole = isAdmin ? 'Admin' : 'Mahasiswa';
    const teamSlug = currentTeam?.slug ?? '';
    const [search, setSearch] = useState('');
    const { enabled: animationsEnabled, toggle: toggleAnimations } =
        useAnimations();
    const reportSearchUrl = isAdmin
        ? `/${teamSlug}/admin/reports`
        : `/${teamSlug}/reports`;
    const notificationUrl = isAdmin
        ? `/${teamSlug}/admin/reports`
        : `/${teamSlug}/notifications`;

    function submitSearch(e: FormEvent): void {
        e.preventDefault();

        if (!teamSlug || search.trim() === '') {
            return;
        }

        router.get(
            reportSearchUrl,
            { search: search.trim() },
            { preserveState: true },
        );
    }

    return (
        <header className="flex min-h-20 shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-4 transition-[width,height] ease-linear md:px-8">
            <SidebarTrigger className="md:hidden" />

            <div className="hidden min-w-0 items-center gap-2 xl:flex">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <form
                onSubmit={submitSearch}
                className="relative flex h-12 w-full max-w-[30rem] items-center rounded-full bg-slate-100 px-5 text-slate-500 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-[#fd8b00]/25 md:ml-2"
            >
                <Search className="size-5 shrink-0" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari laporan..."
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-slate-700 outline-none placeholder:text-slate-500"
                />
            </form>

            <div className="ml-auto flex shrink-0 items-center gap-4">
                <button
                    type="button"
                    onClick={toggleAnimations}
                    className="flex size-10 items-center justify-center rounded-full text-[#001e40] transition-colors hover:bg-orange-50 hover:text-[#9a4a00]"
                    aria-label={
                        animationsEnabled
                            ? 'Matikan animasi'
                            : 'Nyalakan animasi'
                    }
                    title={
                        animationsEnabled
                            ? 'Matikan animasi'
                            : 'Nyalakan animasi'
                    }
                >
                    {animationsEnabled ? (
                        <Sparkles className="size-5" />
                    ) : (
                        <CircleSlash className="size-5" />
                    )}
                </button>

                <Link
                    href={notificationUrl}
                    className="relative flex size-10 items-center justify-center rounded-full text-[#001e40] transition-colors hover:bg-slate-100"
                    aria-label={
                        isAdmin ? 'Kelola laporan' : 'Buka notifikasi'
                    }
                >
                    <Bell className="size-5" />
                    {!isAdmin && (
                        <span className="absolute top-2 right-2 size-1.5 rounded-full bg-red-500" />
                    )}
                </Link>

                <div className="flex items-center gap-3">
                    <Avatar className="size-11 rounded-full ring-2 ring-slate-200">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="bg-slate-200 text-sm font-semibold text-[#001e40]">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-bold text-[#001e40]">
                            {auth.user.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            {userRole}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
