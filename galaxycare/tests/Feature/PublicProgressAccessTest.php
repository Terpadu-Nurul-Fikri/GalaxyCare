<?php

namespace Tests\Feature;

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
