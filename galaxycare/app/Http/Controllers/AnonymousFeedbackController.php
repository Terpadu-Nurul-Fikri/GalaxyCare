<?php

namespace App\Http\Controllers;

use App\Models\AnonymousFeedback;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnonymousFeedbackController extends Controller
{
    public function index(): Response
    {
        $feedbacks = AnonymousFeedback::where('is_public', true)
            ->latest()
            ->paginate(20);

        return Inertia::render('forum', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:10', 'max:1000'],
            'category' => ['required', 'in:kritik,saran,aspirasi'],
        ], [
            'message.required' => 'Pesan wajib diisi.',
            'message.min' => 'Pesan minimal 10 karakter.',
            'message.max' => 'Pesan maksimal 1000 karakter.',
            'category.required' => 'Kategori wajib dipilih.',
        ]);

        AnonymousFeedback::create($validated);

        return back()->with('success', 'Pesan anonim berhasil dikirim!');
    }
}
