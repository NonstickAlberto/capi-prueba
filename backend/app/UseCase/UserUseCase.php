<?php

namespace App\UseCase;

use App\Models\User;
use App\Repository\UserRepository;
use Illuminate\Database\Eloquent\Collection;

class UserUseCase
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function list(): Collection
    {
        return $this->userRepository->all();
    }

    public function create(array $data): User
    {
        return $this->userRepository->create($data);
    }

    public function update(User $user, array $data): User
    {
        return $this->userRepository->update($user, $data);
    }

    public function delete(User $user): void
    {
        $this->userRepository->delete($user);
    }
}
