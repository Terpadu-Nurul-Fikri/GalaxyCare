<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE reports MODIFY COLUMN category ENUM('ruang_kelas','laboratorium','toilet','listrik','internet','parkiran','perpustakaan','kantin','gedung','kebersihan','keamanan','pelayanan_akademik','lainnya') DEFAULT 'lainnya'");
        }

        Schema::table('reports', function (Blueprint $table) {
            $table->string('priority', 20)->default('medium')->after('status');
        });
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE reports MODIFY COLUMN category ENUM('kelas','laboratorium','toilet','listrik','internet','parkiran','lainnya') DEFAULT 'lainnya'");
        }

        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn('priority');
        });
    }
};
