<?php

namespace App\UseCase;

use App\Models\User;
use App\Repository\AuthRepository;

class AuthUseCase
{
    public function __construct(private readonly AuthRepository $authRepository)
    {
    }

    public function register(array $data): array
    {
        $user = $this->authRepository->register($data);
        $token = $this->authRepository->createToken($user, $data['device_name'] ?? null);

        return [$user, $token];
    }

    public function login(array $data): ?array
    {
        $user = $this->authRepository->validateCredentials($data['email'], $data['password']);

        if (!$user) {
            return null;
        }

        $token = $this->authRepository->createToken($user, $data['device_name'] ?? null);

        return [$user, $token];
    }

    public function logout(User $user): void
    {
        $this->authRepository->revokeCurrentToken($user);
    }
}
