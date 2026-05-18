<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

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
            'unreadNotifications' => $unreadNotifications,
            'isAdmin' => false,
        ]);
    }
}
