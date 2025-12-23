<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        return Article::orderBy('published_at', 'desc')->paginate(10);
    }

    public function latest()
    {
        $article = Article::orderBy('published_at', 'desc')->first();
        if (!$article) return response()->json(['message' => 'No article found'], 404);
        return $article;
    }

    public function show($id)
    {
        return Article::findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'slug' => 'nullable|string',
            'url' => 'nullable|url',
            'content_original' => 'nullable|string',
            'content_updated' => 'nullable|string',
            'source' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = \Str::slug($data['title']);
        }

        $article = Article::create($data);
        return response()->json($article, 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $data = $request->only([
            'title','slug','url','content_original','content_updated','source','published_at'
        ]);
        $article->update($data);
        return $article;
    }

    public function destroy($id)
    {
        Article::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
