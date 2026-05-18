<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('title');

            $table->text('description');

            $table->string('photo')->nullable();

            $table->enum('category', [
                'kelas',
                'laboratorium',
                'toilet',
                'listrik',
                'internet',
                'parkiran',
                'lainnya',
            ]);

            $table->string('location');

            $table->enum('status', [
                'pending',
                'diproses',
                'selesai',
                'ditolak',
            ])->default('pending');

            $table->text('admin_response')->nullable();

            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
