<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['anonymous_feedback_id', 'user_id', 'message', 'is_public'])]
class AnonymousFeedbackReply extends Model
{
    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    public function feedback(): BelongsTo
    {
        return $this->belongsTo(AnonymousFeedback::class, 'anonymous_feedback_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
