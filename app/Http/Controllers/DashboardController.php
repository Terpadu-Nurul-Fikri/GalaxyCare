<?php

namespace App\Http\Controllers;

use App\Models\AnonymousFeedback;
use App\Models\CampusInformation;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $recentFeedbacks = AnonymousFeedback::where('is_public', true)
            ->withCount([
                'replies as replies_count' => fn ($query) => $query->where('is_public', true),
                'reactions as likes_count' => fn ($query) => $query->where('type', 'like'),
            ])
            ->latest()
            ->take(4)
            ->get(['id', 'message', 'category', 'admin_reply', 'created_at']);
        $campusInformation = CampusInformation::where('is_published', true)
            ->latest('published_at')
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'body', 'tone', 'published_at', 'created_at']);

        if ($user->isAdmin()) {
            $stats = [
                'total' => Report::count(),
                'pending' => Report::pending()->count(),
                'diproses' => Report::diproses()->count(),
                'selesai' => Report::selesai()->count(),
            ];

            $recentReports = Report::with('user')
                ->latest()
                ->take(5)
                ->get();

            return Inertia::render('dashboard', [
                'stats' => $stats,
                'recentReports' => $recentReports,
                'recentFeedbacks' => $recentFeedbacks,
                'campusInformation' => $campusInformation,
                'isAdmin' => true,
            ]);
        }

        $stats = [
            'total' => $user->reports()->count(),
            'pending' => $user->reports()->pending()->count(),
            'diproses' => $user->reports()->diproses()->count(),
            'selesai' => $user->reports()->selesai()->count(),
        ];

        $recentReports = $user->reports()
            ->latest()
            ->take(5)
            ->get();

        $unreadNotifications = $user->notifications()
            ->where('is_read', false)
            ->count();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'recentFeedbacks' => $recentFeedbacks,
            'campusInformation' => $campusInformation,
            'unreadNotifications' => $unreadNotifications,
            'isAdmin' => false,
        ]);
    }
}
