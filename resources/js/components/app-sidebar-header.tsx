import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
            { preserveState: false },
        );
    }

    return (
        <header className="flex min-h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-[#f7f9fb]/90 px-4 transition-[width,height] ease-linear backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-950/90">
            <SidebarTrigger className="md:hidden" />

            <div className="hidden min-w-0 items-center gap-2 xl:flex">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <form
                onSubmit={submitSearch}
                className="relative flex h-11 w-full max-w-[30rem] items-center rounded-lg border border-slate-200 bg-white px-4 text-slate-500 shadow-sm transition-colors focus-within:border-[#fd8b00]/40 focus-within:ring-2 focus-within:ring-[#fd8b00]/20 md:ml-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            >
                <Search className="size-5 shrink-0" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari laporan..."
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-slate-700 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
            </form>

            <div className="ml-auto flex shrink-0 items-center gap-3">
                <Link
                    href={notificationUrl}
                    className="relative flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#001e40] shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
                    <Avatar className="size-10 rounded-full ring-2 ring-slate-200 dark:ring-slate-800">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="bg-slate-200 text-sm font-semibold text-[#001e40] dark:bg-slate-800 dark:text-slate-100">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-bold text-[#001e40] dark:text-white">
                            {auth.user.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {userRole}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
