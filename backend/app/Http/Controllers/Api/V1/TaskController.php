<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\UseCase\TaskUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function __construct(private readonly TaskUseCase $taskUseCase)
    {
    }

    public function index(): AnonymousResourceCollection
    {
        return TaskResource::collection($this->taskUseCase->list());
    }

    public function store(StoreTaskRequest $request): TaskResource
    {
        return new TaskResource($this->taskUseCase->create($request->validated()));
    }

    public function show(Task $task): TaskResource
    {
        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        return new TaskResource($this->taskUseCase->update($task, $request->validated()));
    }

    public function destroy(Task $task): JsonResponse
    {
        $this->taskUseCase->delete($task);

        return response()->json([], 204);
    }
}
