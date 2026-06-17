import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CircleHelp,
    ClipboardList,
    LayoutGrid,
    Megaphone,
    MessageCircle,
    PlusCircle,
    Shield,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { openDashboardTutorial } from '@/components/dashboard-tutorial';
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
        { title: 'Forum', href: '/forum', icon: MessageCircle },
        ...(isAdmin
            ? [
                  {
                      title: 'Kelola Laporan',
                      href: `/${teamSlug}/admin/reports`,
                      icon: Shield,
                  },
                  {
                      title: 'Informasi Kampus',
                      href: `/${teamSlug}/admin/campus-information`,
                      icon: Megaphone,
                  },
              ]
            : [
                  {
                      title: 'Buat Laporan',
                      href: `/${teamSlug}/reports/create`,
                      icon: PlusCircle,
                  },
                  {
                      title: 'Riwayat Laporan',
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
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-[#12385f] bg-[#001e40] text-white"
        >
            <SidebarHeader className="gap-8 px-7 py-8">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-14 p-0 hover:bg-transparent data-[active=true]:bg-transparent"
                        >
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter className="gap-5 border-t border-white/10 px-7 py-6">
                <div className="flex flex-col gap-3 group-data-[collapsible=icon]:hidden">
                    <button
                        type="button"
                        onClick={openDashboardTutorial}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                        <CircleHelp className="size-5" />
                        Tutorial Dashboard
                    </button>
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
