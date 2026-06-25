<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller {
    public function index() { return Tag::all(); }
    public function store(Request $r) { return Tag::create($r->validate(['name'=>'required','color'=>'nullable|string'])); }
    public function destroy(Tag $tag) { $tag->delete(); return response()->noContent(); }
}