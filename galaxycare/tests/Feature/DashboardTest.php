<?php

namespace Tests\Feature;

use App\Models\AnonymousFeedback;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $user = User::factory()->create();

        $response = $this->get(route('dashboard', [
            'current_team' => $user->currentTeam,
        ]));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $user = User::factory()->create();
        AnonymousFeedback::create([
            'message' => 'Tambahkan tempat duduk di area tunggu mahasiswa.',
            'category' => 'aspirasi',
            'is_public' => true,
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('dashboard', [
                'current_team' => $user->currentTeam,
            ]));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('recentFeedbacks', 1)
                ->where('recentFeedbacks.0.category', 'aspirasi'));
    }
}
