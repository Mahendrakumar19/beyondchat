<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'php' => phpversion(),
        'app' => config('app.name'),
        'env' => app()->environment()
    ]);
});
