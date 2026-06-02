<?php

namespace App\UseCase;

use App\Models\Task;
use App\Repository\TaskRepository;
use Illuminate\Database\Eloquent\Collection;

class TaskUseCase
{
    public function __construct(private readonly TaskRepository $taskRepository)
    {
    }

    public function list(): Collection
    {
        return $this->taskRepository->all();
    }

    public function create(array $data): Task
    {
        return $this->taskRepository->create($data);
    }

    public function update(Task $task, array $data): Task
    {
        return $this->taskRepository->update($task, $data);
    }

    public function delete(Task $task): void
    {
        $this->taskRepository->delete($task);
    }
}
