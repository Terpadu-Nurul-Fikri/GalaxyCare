<?php

namespace Tests\Feature\Reports;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReportAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_students_can_view_their_own_reports(): void
    {
        $student = User::factory()->create();
        $report = Report::factory()->for($student)->create();

        $response = $this
            ->actingAs($student)
            ->get(route('reports.show', [
                'current_team' => $student->currentTeam,
                'report' => $report,
            ]));

        $response->assertOk();
    }

    public function test_students_cannot_view_another_students_report(): void
    {
        $student = User::factory()->create();
        $otherStudent = User::factory()->create();
        $report = Report::factory()->for($otherStudent)->create();

        $response = $this
            ->actingAs($student)
            ->get(route('reports.show', [
                'current_team' => $student->currentTeam,
                'report' => $report,
            ]));

        $response->assertForbidden();
    }

    public function test_admins_manage_reports_through_admin_routes(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $report = Report::factory()->create();

        $studentRouteResponse = $this
            ->actingAs($admin)
            ->get(route('reports.show', [
                'current_team' => $admin->currentTeam,
                'report' => $report,
            ]));

        $adminRouteResponse = $this
            ->actingAs($admin)
            ->get(route('admin.reports.show', [
                'current_team' => $admin->currentTeam,
                'report' => $report,
            ]));

        $studentRouteResponse->assertForbidden();
        $adminRouteResponse->assertOk();
    }

    public function test_students_can_create_report_with_photo(): void
    {
        Storage::fake('public');

        $student = User::factory()->create();

        $response = $this
            ->actingAs($student)
            ->post(route('reports.store', [
                'current_team' => $student->currentTeam,
            ]), [
                'title' => 'AC ruang kelas bocor',
                'description' => 'Air menetes dari AC dan membasahi meja kelas.',
                'category' => 'ruang_kelas',
                'location' => 'Gedung A lantai 3',
                'priority' => 'medium',
                'photo' => UploadedFile::fake()->create('ac-rusak.jpg', 128, 'image/jpeg'),
            ]);

        $response->assertRedirect(route('reports.index', [
            'current_team' => $student->currentTeam,
        ]));
        $response
            ->assertInertiaFlash('toast.type', 'success')
            ->assertInertiaFlash('toast.message', 'Laporan berhasil dikirim.');

        $report = Report::where('title', 'AC ruang kelas bocor')->firstOrFail();

        $this->assertNotNull($report->photo);
        Storage::disk('public')->assertExists($report->photo);
    }

    public function test_deleting_report_removes_photo_file(): void
    {
        Storage::fake('public');

        $student = User::factory()->create();
        $photoPath = UploadedFile::fake()
            ->create('lampu-rusak.jpg', 128, 'image/jpeg')
            ->store('reports', 'public');
        $report = Report::factory()->for($student)->create([
            'photo' => $photoPath,
        ]);

        $this
            ->actingAs($student)
            ->delete(route('reports.destroy', [
                'current_team' => $student->currentTeam,
                'report' => $report,
            ]))
            ->assertRedirect(route('reports.index', [
                'current_team' => $student->currentTeam,
            ]))
            ->assertInertiaFlash('toast.type', 'success')
            ->assertInertiaFlash('toast.message', 'Laporan berhasil dihapus.');

        Storage::disk('public')->assertMissing($photoPath);
        $this->assertDatabaseMissing((new Report)->getTable(), [
            'id' => $report->id,
        ]);
    }

    public function test_admin_deleting_report_removes_photo_file(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => 'admin']);
        $photoPath = UploadedFile::fake()
            ->create('toilet-rusak.jpg', 128, 'image/jpeg')
            ->store('reports', 'public');
        $report = Report::factory()->create([
            'photo' => $photoPath,
        ]);

        $this
            ->actingAs($admin)
            ->delete(route('admin.reports.destroy', [
                'current_team' => $admin->currentTeam,
                'report' => $report,
            ]))
            ->assertRedirect(route('admin.reports.index', [
                'current_team' => $admin->currentTeam,
            ]))
            ->assertInertiaFlash('toast.type', 'success')
            ->assertInertiaFlash('toast.message', 'Laporan berhasil dihapus oleh admin.');

        Storage::disk('public')->assertMissing($photoPath);
        $this->assertDatabaseMissing((new Report)->getTable(), [
            'id' => $report->id,
        ]);
    }
}
