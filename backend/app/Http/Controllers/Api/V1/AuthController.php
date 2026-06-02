<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\UseCase\AuthUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthUseCase $authUseCase)
    {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authUseCase->login($request->validated());

        if (!$result) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 422);
        }

        [$user, $token] = $result;

        return response()->json([
            'message' => 'Authenticated successfully.',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        [$user, $token] = $this->authUseCase->register($request->validated());

        return response()->json([
            'message' => 'User registered successfully.',
            'token' => $token,
            'user' => new UserResource($user),
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authUseCase->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
