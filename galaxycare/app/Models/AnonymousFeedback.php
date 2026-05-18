<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['message', 'category', 'is_public', 'admin_reply'])]
class AnonymousFeedback extends Model
{
    protected $table = 'anonymous_feedbacks';

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }
}
