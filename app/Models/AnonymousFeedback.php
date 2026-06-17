<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'message', 'category', 'is_public', 'is_anonymous', 'admin_reply'])]
class AnonymousFeedback extends Model
{
    protected $table = 'anonymous_feedbacks';

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'is_anonymous' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replies(): HasMany
    {
        return $this->hasMany(AnonymousFeedbackReply::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(AnonymousFeedbackReaction::class);
    }
}
