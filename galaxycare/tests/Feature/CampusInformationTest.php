<?php

namespace Tests\Feature;

use App\Models\CampusInformation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CampusInformationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_publish_campus_information(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this
            ->actingAs($admin)
            ->post(route('admin.campus-information.store', [
                'current_team' => $admin->currentTeam,
            ]), [
                'title' => 'Pemeliharaan jaringan kampus',
                'body' => 'Internet kampus akan diperbarui pada Jumat malam.',
                'tone' => 'maintenance',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas((new CampusInformation)->getTable(), [
            'user_id' => $admin->id,
            'title' => 'Pemeliharaan jaringan kampus',
            'tone' => 'maintenance',
            'is_published' => true,
        ]);
    }

    public function test_admin_can_view_campus_information_management_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        CampusInformation::create([
            'user_id' => $admin->id,
            'title' => 'Mati Listrik',
            'body' => 'Akan ada mati listrik di jam 13.00 sampai jam 15.00.',
            'tone' => 'info',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $this
            ->actingAs($admin)
            ->get(route('admin.campus-information.index', [
                'current_team' => $admin->currentTeam,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/campus-information/index')
                ->has('campusInformation', 1)
                ->where('campusInformation.0.title', 'Mati Listrik'));
    }

    public function test_published_campus_information_appears_on_public_home(): void
    {
        CampusInformation::create([
            'title' => 'Kegiatan bersih kampus',
            'body' => 'Mahasiswa dapat mengikuti kegiatan bersih kampus pekan ini.',
            'tone' => 'event',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $this
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->has('campusInformation', 1)
                ->where('campusInformation.0.title', 'Kegiatan bersih kampus'));
    }

    public function test_campus_information_page_can_be_viewed_publicly(): void
    {
        CampusInformation::create([
            'title' => 'Pemeliharaan area parkir',
            'body' => 'Area parkir belakang ditutup sementara untuk pengecatan marka.',
            'tone' => 'maintenance',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $this
            ->get(route('campus-information'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('campus-information')
                ->has('campusInformation.data', 1)
                ->where('campusInformation.data.0.title', 'Pemeliharaan area parkir'));
    }

    public function test_published_campus_information_appears_on_dashboard(): void
    {
        $user = User::factory()->create();

        CampusInformation::create([
            'title' => 'Perpustakaan buka lebih lama',
            'body' => 'Perpustakaan buka sampai pukul 19.00 selama pekan UAS.',
            'tone' => 'academic',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $this
            ->actingAs($user)
            ->get(route('dashboard', [
                'current_team' => $user->currentTeam,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('campusInformation', 1)
                ->where('campusInformation.0.title', 'Perpustakaan buka lebih lama'));
    }
}
