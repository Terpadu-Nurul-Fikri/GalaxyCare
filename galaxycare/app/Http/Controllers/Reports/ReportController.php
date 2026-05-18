<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\StoreReportRequest;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = $request->user()
            ->reports()
            ->latest()
            ->paginate(10);

        return Inertia::render('reports/index', [
            'reports' => $reports,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('reports/create');
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('reports', 'public');
        }

        $request->user()->reports()->create($data);

        return redirect()
            ->route('reports.index')
            ->with('success', 'Laporan berhasil dikirim!');
    }

    public function show(Report $report): Response
    {
        $report->load('user');

        return Inertia::render('reports/show', [
            'report' => $report,
        ]);
    }
}
