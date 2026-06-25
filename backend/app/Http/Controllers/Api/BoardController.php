<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller {
    public function index() { return Board::with('lists.cards.tags', 'lists.cards.members')->get(); }
    public function store(Request $r) { return Board::create($r->validate(['name'=>'required','description'=>'nullable|string'])); }
    public function show(Board $board) { return $board->load('lists.cards.tags', 'lists.cards.members'); }
    public function update(Request $r, Board $board) { $board->update($r->validate(['name'=>'required','description'=>'nullable|string'])); return $board; }
    public function destroy(Board $board) { $board->delete(); return response()->noContent(); }
}