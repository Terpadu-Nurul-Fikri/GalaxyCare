<?php

namespace Tests\Feature;

use App\Models\AnonymousFeedback;
use App\Models\AnonymousFeedbackReaction;
use App\Models\AnonymousFeedbackReply;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicProgressAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_progress_page_can_be_viewed_without_login(): void
    {
        Report::factory()->selesai()->create([
            'title' => 'Lampu koridor mati',
            'category' => 'listrik',
            'location' => 'Gedung A',
            'description' => 'Identitas pelapor berada di deskripsi internal.',
            'admin_response' => 'Catatan admin internal.',
        ]);

        $response = $this->get(route('progress'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('progress')
                ->has('stats')
                ->has('reports.data', 1)
                ->where('reports.data.0.title', 'Lampu koridor mati')
                ->missing('reports.data.0.user')
                ->missing('reports.data.0.description')
                ->missing('reports.data.0.admin_response')
                ->missing('reports.data.0.photo'));
    }

    public function test_forum_page_can_be_viewed_without_login(): void
    {
        AnonymousFeedback::create([
            'message' => 'Mohon perbaikan fasilitas ruang diskusi kampus.',
            'category' => 'saran',
            'is_public' => true,
        ]);

        $response = $this->get(route('forum'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('forum')
                ->has('feedbacks.data', 1)
                ->where('feedbacks.data.0.category', 'saran'));
    }

    public function test_forum_submission_requires_login(): void
    {
        $response = $this->post(route('forum.store'), [
            'message' => 'Mohon toilet lantai dua dicek kembali.',
            'category' => 'kritik',
            'is_anonymous' => true,
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_choose_anonymous_forum_thread(): void
    {
        $user = User::factory()->create([
            'name' => 'Budi Santoso',
        ]);

        $this
            ->actingAs($user)
            ->post(route('forum.store'), [
                'message' => 'Mohon lampu taman kampus ditambah malam hari.',
                'category' => 'aspirasi',
                'is_anonymous' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas((new AnonymousFeedback)->getTable(), [
            'user_id' => $user->id,
            'message' => 'Mohon lampu taman kampus ditambah malam hari.',
            'is_anonymous' => true,
        ]);

        $this
            ->actingAs($user)
            ->get(route('forum'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('feedbacks.data.0.author.name', 'Anonim'));
    }

    public function test_authenticated_user_can_show_name_on_forum_thread(): void
    {
        $user = User::factory()->create([
            'name' => 'Siti Aminah',
        ]);

        $this
            ->actingAs($user)
            ->post(route('forum.store'), [
                'message' => 'Mohon kursi area tunggu diperbaiki minggu ini.',
                'category' => 'saran',
                'is_anonymous' => false,
            ])
            ->assertRedirect();

        $this
            ->actingAs($user)
            ->get(route('forum'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('feedbacks.data.0.author.name', 'Siti Aminah')
                ->where('feedbacks.data.0.is_anonymous', false));
    }

    public function test_authenticated_user_can_reply_to_forum_thread(): void
    {
        $user = User::factory()->create();
        $feedback = AnonymousFeedback::create([
            'message' => 'Mohon diskusi fasilitas ruang kelas.',
            'category' => 'saran',
            'is_public' => true,
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('forum.replies.store', $feedback), [
                'message' => 'Saya setuju, ruang kelas perlu dicek.',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas((new AnonymousFeedbackReply)->getTable(), [
            'anonymous_feedback_id' => $feedback->id,
            'user_id' => $user->id,
            'message' => 'Saya setuju, ruang kelas perlu dicek.',
        ]);
    }

    public function test_authenticated_user_can_toggle_forum_like(): void
    {
        $user = User::factory()->create();
        $feedback = AnonymousFeedback::create([
            'message' => 'Tambahkan lampu di koridor kampus.',
            'category' => 'aspirasi',
            'is_public' => true,
        ]);

        $this
            ->actingAs($user)
            ->post(route('forum.reactions.toggle', $feedback), [
                'type' => 'like',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas((new AnonymousFeedbackReaction)->getTable(), [
            'anonymous_feedback_id' => $feedback->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);

        $this
            ->actingAs($user)
            ->post(route('forum.reactions.toggle', $feedback), [
                'type' => 'like',
            ])
            ->assertRedirect();

        $this->assertDatabaseMissing((new AnonymousFeedbackReaction)->getTable(), [
            'anonymous_feedback_id' => $feedback->id,
            'user_id' => $user->id,
            'type' => 'like',
        ]);
    }

    public function test_progress_page_can_be_searched_without_login(): void
    {
        Report::factory()->create([
            'title' => 'AC ruang kelas rusak',
            'category' => 'ruang_kelas',
            'location' => 'Gedung B',
        ]);

        Report::factory()->create([
            'title' => 'Koneksi internet lambat',
            'category' => 'internet',
            'location' => 'Laboratorium',
        ]);

        $response = $this->get(route('progress', [
            'search' => 'internet',
        ]));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('progress')
                ->where('filters.search', 'internet')
                ->has('reports.data', 1)
                ->where('reports.data.0.title', 'Koneksi internet lambat'));
    }

    public function test_common_progress_typo_redirects_to_progress_page(): void
    {
        $this->get('/proress')->assertRedirect('/progress');
    }

    public function test_reporting_pages_require_login(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $this->get(route('reports.index', [
            'current_team' => $team,
        ]))->assertRedirect(route('login'));

        $this->get(route('reports.create', [
            'current_team' => $team,
        ]))->assertRedirect(route('login'));

        $this->post(route('reports.store', [
            'current_team' => $team,
        ]))->assertRedirect(route('login'));
    }
}
