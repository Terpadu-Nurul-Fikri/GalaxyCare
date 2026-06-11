<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreReportRequest;
use App\Models\Report;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if($request->user()->isAdmin(), 403);

        $reports = $request->user()->reports()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();

                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_if($request->user()->isAdmin(), 403);

        return Inertia::render('reports/create');
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        abort_if($request->user()->isAdmin(), 403);

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('reports', 'public');
        }

        $request->user()->reports()->create($data);

        return redirect()
            ->route('reports.index')
            ->with('success', 'Laporan berhasil dikirim!');
    }

    public function show(Request $request, Team $currentTeam, Report $report): Response
    {
        abort_if($request->user()->isAdmin(), 403);
        abort_unless($report->user_id === $request->user()->id, 403);

        $report->load('user');

        return Inertia::render('reports/show', [
            'report' => $report,
        ]);
    }
}
