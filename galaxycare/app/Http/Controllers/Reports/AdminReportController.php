<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\UpdateReportStatusRequest;
use App\Models\Notification;
use App\Models\Report;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Report::with('user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $reports = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => Report::count(),
            'pending' => Report::pending()->count(),
            'diproses' => Report::diproses()->count(),
            'selesai' => Report::selesai()->count(),
            'ditolak' => Report::ditolak()->count(),
        ];

        return Inertia::render('admin/reports/index', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function show(Team $currentTeam, Report $report): Response
    {
        $report->load('user');

        return Inertia::render('admin/reports/show', [
            'report' => $report,
        ]);
    }

    public function update(UpdateReportStatusRequest $request, Team $currentTeam, Report $report): RedirectResponse
    {
        $data = $request->validated();

        if ($data['status'] === 'selesai') {
            $data['resolved_at'] = now();
        }

        $report->update($data);

        $statusLabels = [
            'pending' => 'Pending',
            'diproses' => 'Sedang Diproses',
            'selesai' => 'Selesai',
            'ditolak' => 'Ditolak',
        ];

        Notification::create([
            'user_id' => $report->user_id,
            'report_id' => $report->id,
            'title' => 'Status Laporan Diperbarui',
            'message' => "Laporan \"{$report->title}\" telah diubah statusnya menjadi {$statusLabels[$data['status']]}."
                .($data['admin_response'] ? " Catatan: {$data['admin_response']}" : ''),
        ]);

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }

    public function destroy(Team $currentTeam, Report $report): RedirectResponse
    {
        $photo = $report->photo;

        $report->delete();

        if ($photo) {
            Storage::disk('public')->delete($photo);
        }

        return redirect()
            ->route('admin.reports.index', ['current_team' => $currentTeam])
            ->with('success', 'Laporan berhasil dihapus oleh admin.');
    }
}
