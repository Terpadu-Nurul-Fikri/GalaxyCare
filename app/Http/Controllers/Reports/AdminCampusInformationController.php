<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\CampusInformation;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCampusInformationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/campus-information/index', [
            'campusInformation' => CampusInformation::with('user:id,name')
                ->latest('published_at')
                ->latest()
                ->get(['id', 'user_id', 'title', 'body', 'tone', 'is_published', 'published_at', 'created_at']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'body' => ['required', 'string', 'max:600'],
            'tone' => ['required', 'in:info,maintenance,academic,event'],
        ], [
            'title.required' => 'Judul informasi wajib diisi.',
            'title.max' => 'Judul informasi maksimal 120 karakter.',
            'body.required' => 'Isi informasi wajib diisi.',
            'body.max' => 'Isi informasi maksimal 600 karakter.',
            'tone.required' => 'Jenis informasi wajib dipilih.',
        ]);

        CampusInformation::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'is_published' => true,
            'published_at' => now(),
        ]);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Informasi kampus berhasil dipublikasikan.')]);

        return back();
    }

    public function destroy(Team $currentTeam, CampusInformation $information): RedirectResponse
    {
        $information->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Informasi kampus berhasil dihapus.')]);

        return back();
    }
}
