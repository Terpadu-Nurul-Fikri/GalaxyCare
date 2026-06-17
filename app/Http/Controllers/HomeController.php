<?php

namespace App\Http\Controllers;

use App\Models\CampusInformation;
use App\Models\Report;
use Illuminate\Http\Request;
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
            'campusInformation' => $this->getCampusInformation(),
        ]);
    }

    public function progress(Request $request): Response
    {
        $stats = $this->getPublicStats();
        $search = $request->string('search')->trim()->limit(80)->toString();

        $reports = [
            'data' => [],
            'current_page' => 1,
            'last_page' => 1,
            'next_page_url' => null,
            'prev_page_url' => null,
        ];

        try {
            $reports = Report::select(['id', 'title', 'category', 'location', 'status', 'created_at'])
                ->when($search !== '', function ($query) use ($search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('title', 'like', "%{$search}%")
                            ->orWhere('category', 'like', "%{$search}%")
                            ->orWhere('location', 'like', "%{$search}%")
                            ->orWhere('status', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString()
                ->through(fn ($report) => [
                    'id' => $report->id,
                    'title' => $report->title,
                    'category' => $report->category,
                    'location' => $report->location,
                    'status' => $report->status,
                    'created_at' => $report->created_at,
                ]);
        } catch (\Throwable $e) {
            report($e);
        }

        return Inertia::render('progress', [
            'stats' => $stats,
            'reports' => $reports,
            'filters' => [
                'search' => $search,
            ],
            'campusInformation' => $this->getCampusInformation(),
        ]);
    }

    public function campusInformation(): Response
    {
        $campusInformation = CampusInformation::where('is_published', true)
            ->latest('published_at')
            ->latest()
            ->paginate(9)
            ->through(fn (CampusInformation $information) => [
                'id' => $information->id,
                'title' => $information->title,
                'body' => $information->body,
                'tone' => $information->tone,
                'published_at' => $information->published_at,
                'created_at' => $information->created_at,
            ]);

        return Inertia::render('campus-information', [
            'campusInformation' => $campusInformation,
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

    private function getCampusInformation()
    {
        return CampusInformation::where('is_published', true)
            ->latest('published_at')
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'body', 'tone', 'published_at', 'created_at']);
    }
}
