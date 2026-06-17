<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anonymous_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->text('message');
            $table->enum('category', ['kritik', 'saran', 'aspirasi'])->default('kritik');
            $table->boolean('is_public')->default(true);
            $table->text('admin_reply')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anonymous_feedbacks');
    }
};
