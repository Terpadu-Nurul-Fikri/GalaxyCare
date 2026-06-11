<?php

namespace Tests\Feature\Reports;

use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
