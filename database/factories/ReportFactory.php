<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(3),
            'category' => fake()->randomElement(['ruang_kelas', 'laboratorium', 'toilet', 'listrik', 'internet', 'parkiran', 'perpustakaan', 'kantin', 'gedung', 'kebersihan', 'keamanan', 'pelayanan_akademik', 'lainnya']),
            'location' => 'Gedung '.fake()->randomElement(['A', 'B', 'C', 'D']).', Lantai '.fake()->numberBetween(1, 4).', Ruang '.fake()->numberBetween(101, 410),
            'status' => 'pending',
        ];
    }

    public function diproses(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'diproses',
            'admin_response' => 'Sedang dalam proses perbaikan.',
        ]);
    }

    public function selesai(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'selesai',
            'admin_response' => 'Perbaikan telah selesai dilakukan.',
            'resolved_at' => now(),
        ]);
    }

    public function ditolak(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ditolak',
            'admin_response' => 'Laporan tidak dapat diproses karena informasi kurang lengkap.',
        ]);
    }
}
