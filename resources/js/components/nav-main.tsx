import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-5 py-2">
            <SidebarGroupLabel className="sr-only">
                Menu Utama
            </SidebarGroupLabel>
            <SidebarMenu className="gap-3">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="relative h-12 rounded-sm px-5 text-base font-semibold text-blue-100 transition-all hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white data-[active=true]:shadow-sm data-[active=true]:before:absolute data-[active=true]:before:top-1 data-[active=true]:before:bottom-1 data-[active=true]:before:left-0 data-[active=true]:before:w-1 data-[active=true]:before:rounded-full data-[active=true]:before:bg-[#fd8b00] [&>svg]:size-5"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
