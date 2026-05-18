<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $stats = $this->getPublicStats();

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'stats' => $stats,
        ]);
    }

    public function progress(): Response
    {
        $stats = $this->getPublicStats();

        $reports = [];

        try {
            $reports = Report::select(['id', 'title', 'category', 'location', 'status', 'created_at'])
                ->latest()
                ->paginate(10)
                ->through(fn ($report) => [
                    'id' => $report->id,
                    'title' => $report->title,
                    'category' => $report->category,
                    'location' => $report->location,
                    'status' => $report->status,
                    'created_at' => $report->created_at,
                ]);
        } catch (\Exception $e) {
            // Database not available
        }

        return Inertia::render('progress', [
            'stats' => $stats,
            'reports' => $reports,
        ]);
    }

    /**
     * @return array{total: int, pending: int, diproses: int, selesai: int}
     */
    private function getPublicStats(): array
    {
        try {
            return [
                'total' => Report::count(),
                'pending' => Report::pending()->count(),
                'diproses' => Report::diproses()->count(),
                'selesai' => Report::selesai()->count(),
            ];
        } catch (\Exception $e) {
            return ['total' => 0, 'pending' => 0, 'diproses' => 0, 'selesai' => 0];
        }
    }
}
