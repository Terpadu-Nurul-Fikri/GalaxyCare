import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ClipboardList,
    LayoutGrid,
    PlusCircle,
    Shield,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const currentTeam = page.props.currentTeam;
    const auth = page.props.auth;
    const isAdmin = auth?.user?.role === 'admin';
    const teamSlug = currentTeam?.slug ?? '';
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboardUrl, icon: LayoutGrid },
        ...(isAdmin
            ? [
                  {
                      title: 'Kelola Laporan',
                      href: `/${teamSlug}/admin/reports`,
                      icon: Shield,
                  },
              ]
            : [
                  {
                      title: 'Buat Laporan',
                      href: `/${teamSlug}/reports/create`,
                      icon: PlusCircle,
                  },
                  {
                      title: 'Laporan Saya',
                      href: `/${teamSlug}/reports`,
                      icon: ClipboardList,
                  },
                  {
                      title: 'Notifikasi',
                      href: `/${teamSlug}/notifications`,
                      icon: Bell,
                  },
              ]),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
