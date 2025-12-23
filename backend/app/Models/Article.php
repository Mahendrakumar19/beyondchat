<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'url',
        'content_original',
        'content_updated',
        'source',
        'published_at'
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];
}
