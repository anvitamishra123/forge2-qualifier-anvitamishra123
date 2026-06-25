<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\BoardList;
use App\Models\Board;
use Illuminate\Http\Request;

class ListController extends Controller {
    public function index(Board $board) { return $board->lists()->with('cards')->orderBy('position')->get(); }
    public function store(Request $r, Board $board) {
        $data = $r->validate(['name'=>'required','position'=>'nullable|integer']);
        $data['board_id'] = $board->id;
        return BoardList::create($data);
    }
    public function update(Request $r, BoardList $list) { $list->update($r->validate(['name'=>'required','position'=>'nullable|integer'])); return $list; }
    public function destroy(BoardList $list) { $list->delete(); return response()->noContent(); }
}