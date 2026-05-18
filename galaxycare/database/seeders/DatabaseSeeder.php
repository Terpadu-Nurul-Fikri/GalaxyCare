<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin
        $admin = User::factory()->create([
            'name' => 'Admin SIPASKA',
            'email' => 'admin@student.nurulfikri.ac.id',
            'role' => 'admin',
        ]);

        // Create Student
        $student = User::factory()->create([
            'name' => 'Ahmad Fauzi',
            'email' => 'ahmad.fauzi@student.nurulfikri.ac.id',
            'role' => 'student',
        ]);

        // Create another student
        $student2 = User::factory()->create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti.nurhaliza@student.nurulfikri.ac.id',
            'role' => 'student',
        ]);

        // Create sample reports
        $pendingReports = Report::factory(3)->create([
            'user_id' => $student->id,
        ]);

        $diprosesReports = Report::factory(2)->diproses()->create([
            'user_id' => $student->id,
        ]);

        $selesaiReports = Report::factory(2)->selesai()->create([
            'user_id' => $student->id,
        ]);

        Report::factory(1)->ditolak()->create([
            'user_id' => $student->id,
        ]);

        // Reports from second student
        Report::factory(2)->create([
            'user_id' => $student2->id,
        ]);

        Report::factory(1)->diproses()->create([
            'user_id' => $student2->id,
        ]);

        // Create notifications for processed reports
        foreach ($diprosesReports as $report) {
            Notification::create([
                'user_id' => $student->id,
                'report_id' => $report->id,
                'title' => 'Status Laporan Diperbarui',
                'message' => "Laporan \"{$report->title}\" sedang diproses oleh tim maintenance kampus.",
            ]);
        }

        foreach ($selesaiReports as $report) {
            Notification::create([
                'user_id' => $student->id,
                'report_id' => $report->id,
                'title' => 'Laporan Selesai',
                'message' => "Laporan \"{$report->title}\" telah selesai diperbaiki. Terima kasih atas laporannya.",
                'is_read' => true,
            ]);
        }
    }
}
