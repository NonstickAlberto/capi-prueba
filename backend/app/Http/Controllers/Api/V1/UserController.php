<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\UseCase\UserUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function __construct(private readonly UserUseCase $userUseCase)
    {
    }

    public function index(): AnonymousResourceCollection
    {
        return UserResource::collection($this->userUseCase->list());
    }

    public function store(StoreUserRequest $request): UserResource
    {
        return new UserResource($this->userUseCase->create($request->validated()));
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        return new UserResource($this->userUseCase->update($user, $request->validated()));
    }

    public function destroy(User $user): JsonResponse
    {
        $this->userUseCase->delete($user);

        return response()->json([], 204);
    }
}
