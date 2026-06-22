import { Head, Link, router, usePage, usePoll } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Notification = {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    report: { id: number; title: string; status: string } | null;
};

type PaginatedNotifications = {
    data: Notification[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

type Props = {
    notifications: PaginatedNotifications;
};

export default function NotificationsIndex({ notifications }: Props) {
    usePoll(10000, {
        only: ['notifications', 'unreadNotificationsCount'],
    });

    const { currentTeam } = usePage().props as {
        currentTeam?: { slug: string };
    };
    const teamSlug = currentTeam?.slug ?? '';

    function markAsRead(id: number) {
        router.patch(
            `/${teamSlug}/notifications/${id}/read`,
            {},
            { preserveScroll: true },
        );
    }

    function markAllAsRead() {
        router.post(
            `/${teamSlug}/notifications/read-all`,
            {},
            { preserveScroll: true },
        );
    }

    const hasUnread = notifications.data.some((n) => !n.is_read);

    return (
        <>
            <Head title="Notifikasi" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Notifikasi
                        </h1>
                        <p className="text-muted-foreground">
                            Update terbaru tentang laporan Anda.
                        </p>
                    </div>
                    {hasUnread && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Tandai Semua Dibaca
                        </Button>
                    )}
                </div>

                {notifications.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">
                                Belum ada notifikasi
                            </p>
                            <p className="text-muted-foreground">
                                Anda akan mendapat notifikasi saat ada update
                                pada laporan Anda.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {notifications.data.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`transition-colors ${!notification.is_read ? 'border-primary/30 bg-primary/5' : ''}`}
                            >
                                <CardContent className="flex items-start gap-4 p-4">
                                    <div
                                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!notification.is_read ? 'bg-primary' : 'bg-transparent'}`}
                                    />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">
                                                {notification.title}
                                            </p>
                                            {!notification.is_read && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    Baru
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-3 pt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    notification.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                            {notification.report && (
                                                <Link
                                                    href={`/${teamSlug}/reports/${notification.report.id}`}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Lihat Laporan
                                                </Link>
                                            )}
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id,
                                                        )
                                                    }
                                                    className="text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    Tandai dibaca
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {notifications.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                {notifications.prev_page_url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={notifications.prev_page_url}
                                        >
                                            Sebelumnya
                                        </Link>
                                    </Button>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    Halaman {notifications.current_page} dari{' '}
                                    {notifications.last_page}
                                </span>
                                {notifications.next_page_url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={notifications.next_page_url}
                                        >
                                            Selanjutnya
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
