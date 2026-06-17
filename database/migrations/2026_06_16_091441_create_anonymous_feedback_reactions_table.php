<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('anonymous_feedback_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anonymous_feedback_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 24)->default('like');
            $table->timestamps();

            $table->unique(['anonymous_feedback_id', 'user_id', 'type'], 'anonymous_feedback_reaction_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anonymous_feedback_reactions');
    }
};
