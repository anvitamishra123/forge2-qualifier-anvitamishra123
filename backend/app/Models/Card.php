<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Card extends Model {
    protected $fillable = ['board_list_id', 'title', 'description', 'position', 'due_date'];
    public function tags() { return $this->belongsToMany(Tag::class); }
    public function members() { return $this->belongsToMany(Member::class); }
}