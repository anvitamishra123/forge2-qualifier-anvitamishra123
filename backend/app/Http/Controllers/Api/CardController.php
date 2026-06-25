<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\BoardList;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(BoardList $boardList)
    {
        return $boardList->cards()->with('tags', 'members')->get();
    }

    public function store(Request $request, BoardList $boardList)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'position' => 'nullable|integer',
            'due_date' => 'nullable|date',
        ]);

        $data['board_list_id'] = $boardList->id;
        $data['position'] = $data['position'] ?? 0;

        $card = Card::create($data);

        return response()->json($card->load('tags', 'members'), 201);
    }

    public function update(Request $request, Card $card)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'position' => 'nullable|integer',
            'due_date' => 'nullable|date',
        ]);

        $card->update($data);

        return response()->json($card->load('tags', 'members'));
    }

    public function destroy(Card $card)
    {
        $card->delete();

        return response()->json([
            'message' => 'Card deleted successfully'
        ]);
    }

    public function move(Request $request, Card $card)
    {
        $data = $request->validate([
            'list_id' => 'required|exists:board_lists,id',
            'position' => 'nullable|integer',
        ]);

        $card->update([
            'board_list_id' => $data['list_id'],
            'position' => $data['position'] ?? 0,
        ]);

        return response()->json($card->load('tags', 'members'));
    }

    public function syncTags(Request $request, Card $card)
    {
        $data = $request->validate([
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'integer|exists:tags,id',
        ]);

        $card->tags()->sync($data['tag_ids'] ?? []);

        return response()->json($card->load('tags', 'members'));
    }

    public function syncMembers(Request $request, Card $card)
    {
        $data = $request->validate([
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'integer|exists:members,id',
        ]);

        $card->members()->sync($data['member_ids'] ?? []);

        return response()->json($card->load('tags', 'members'));
    }
}