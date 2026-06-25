<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller {
    public function index() { return Member::all(); }
    public function store(Request $r) { return Member::create($r->validate(['name'=>'required','email'=>'required|email|unique:members'])); }
}