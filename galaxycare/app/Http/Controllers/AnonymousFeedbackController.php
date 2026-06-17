<?php

namespace App\Http\Controllers;

use App\Models\AnonymousFeedback;
use App\Models\AnonymousFeedbackReaction;
use App\Models\CampusInformation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnonymousFeedbackController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;
        $feedbackQuery = AnonymousFeedback::where('is_public', true)
            ->with([
                'user:id,name',
                'replies' => fn ($query) => $query
                    ->where('is_public', true)
                    ->with('user:id,name')
                    ->oldest(),
            ])
            ->withCount([
                'replies as replies_count' => fn ($query) => $query->where('is_public', true),
                'reactions as likes_count' => fn ($query) => $query->where('type', 'like'),
            ]);

        if ($userId) {
            $feedbackQuery->withExists([
                'reactions as liked_by_me' => fn ($query) => $query
                    ->where('user_id', $userId)
                    ->where('type', 'like'),
            ]);
        }

        $feedbacks = $feedbackQuery
            ->latest()
            ->paginate(12)
            ->through(fn (AnonymousFeedback $feedback) => [
                'id' => $feedback->id,
                'message' => $feedback->message,
                'category' => $feedback->category,
                'admin_reply' => $feedback->admin_reply,
                'created_at' => $feedback->created_at,
                'is_anonymous' => $feedback->is_anonymous,
                'author' => [
                    'name' => $feedback->is_anonymous
                        ? 'Anonim'
                        : ($feedback->user?->name ?? 'Peserta Forum'),
                ],
                'replies_count' => $feedback->replies_count,
                'likes_count' => $feedback->likes_count,
                'liked_by_me' => (bool) ($feedback->liked_by_me ?? false),
                'replies' => $feedback->replies->map(fn ($reply) => [
                    'id' => $reply->id,
                    'message' => $reply->message,
                    'created_at' => $reply->created_at,
                    'author' => [
                        'name' => $reply->user?->name ?? 'Peserta Forum',
                    ],
                ])->values(),
            ]);

        return Inertia::render('forum', [
            'feedbacks' => $feedbacks,
            'campusInformation' => CampusInformation::where('is_published', true)
                ->latest('published_at')
                ->latest()
                ->take(3)
                ->get(['id', 'title', 'body', 'tone', 'published_at', 'created_at']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:10', 'max:1000'],
            'category' => ['required', 'in:kritik,saran,aspirasi'],
            'is_anonymous' => ['required', 'boolean'],
        ], [
            'message.required' => 'Pesan wajib diisi.',
            'message.min' => 'Pesan minimal 10 karakter.',
            'message.max' => 'Pesan maksimal 1000 karakter.',
            'category.required' => 'Kategori wajib dipilih.',
            'is_anonymous.required' => 'Pilihan identitas wajib dipilih.',
        ]);

        AnonymousFeedback::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Thread forum berhasil dikirim!');
    }

    public function reply(Request $request, AnonymousFeedback $feedback): RedirectResponse
    {
        abort_unless($feedback->is_public, 404);

        $validated = $request->validate([
            'message' => ['required', 'string', 'min:2', 'max:1000'],
        ], [
            'message.required' => 'Balasan wajib diisi.',
            'message.min' => 'Balasan minimal 2 karakter.',
            'message.max' => 'Balasan maksimal 1000 karakter.',
        ]);

        $feedback->replies()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Balasan berhasil dikirim.');
    }

    public function toggleReaction(Request $request, AnonymousFeedback $feedback): RedirectResponse
    {
        abort_unless($feedback->is_public, 404);

        $validated = $request->validate([
            'type' => ['nullable', 'in:like'],
        ]);
        $type = $validated['type'] ?? 'like';

        $reaction = AnonymousFeedbackReaction::where('anonymous_feedback_id', $feedback->id)
            ->where('user_id', $request->user()->id)
            ->where('type', $type)
            ->first();

        if ($reaction) {
            $reaction->delete();

            return back();
        }

        AnonymousFeedbackReaction::create([
            'anonymous_feedback_id' => $feedback->id,
            'user_id' => $request->user()->id,
            'type' => $type,
        ]);

        return back();
    }
}
