<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\ListController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\MemberController;

Route::apiResource('boards', BoardController::class);
Route::get('boards/{board}/lists', [ListController::class, 'index']);
Route::post('boards/{board}/lists', [ListController::class, 'store']);
Route::put('lists/{list}', [ListController::class, 'update']);
Route::delete('lists/{list}', [ListController::class, 'destroy']);
Route::get('lists/{list}/cards', [CardController::class, 'index']);
Route::post('lists/{list}/cards', [CardController::class, 'store']);
Route::put('cards/{card}', [CardController::class, 'update']);
Route::delete('cards/{card}', [CardController::class, 'destroy']);
Route::post('cards/{card}/tags', [CardController::class, 'syncTags']);
Route::post('cards/{card}/members', [CardController::class, 'syncMembers']);
Route::apiResource('tags', TagController::class)->only(['index','store','destroy']);
Route::apiResource('members', MemberController::class)->only(['index','store']);