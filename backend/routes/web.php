<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'php' => phpversion(),
        'env' => app()->environment()
    ]);
});
