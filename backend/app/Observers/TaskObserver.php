<?php

namespace App\Observers;

use App\Models\Task;

class TaskObserver
{
    public function creating(Task $task): void
    {
        $this->setPriorityScore($task);
    }

    public function updating(Task $task): void
    {
        $this->setPriorityScore($task);
    }

    private function setPriorityScore(Task $task): void
    {
        $complexity = (int) ($task->complexity ?? $task->getOriginal('complexity'));
        $urgency = (int) ($task->urgency ?? $task->getOriginal('urgency'));

        $task->priority_score = round(($complexity * 0.4) + ($urgency * 0.6), 2);
    }
}
