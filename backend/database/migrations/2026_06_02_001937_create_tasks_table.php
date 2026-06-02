<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('complexity');
            $table->unsignedTinyInteger('urgency');
            $table->decimal('priority_score', 5, 2);
            $table->timestamps();
        });

        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE tasks ADD CONSTRAINT chk_tasks_complexity CHECK (complexity BETWEEN 1 AND 10)');
            DB::statement('ALTER TABLE tasks ADD CONSTRAINT chk_tasks_urgency CHECK (urgency BETWEEN 1 AND 10)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
