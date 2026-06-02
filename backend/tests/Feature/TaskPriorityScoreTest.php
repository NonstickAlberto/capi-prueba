<?php

use App\Models\Task;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('stores priority_score as 8.0 when complexity is 5 and urgency is 10', function (): void {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/tasks', [
        'title' => 'Task score test',
        'description' => 'Validate observer calculation',
        'complexity' => 5,
        'urgency' => 10,
        'status' => 'pending',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.priority_score', 8);

    $this->assertDatabaseHas('tasks', [
        'title' => 'Task score test',
        'complexity' => 5,
        'urgency' => 10,
        'priority_score' => 8.00,
    ]);

    expect((float) Task::query()->firstOrFail()->priority_score)->toBe(8.0);
});
