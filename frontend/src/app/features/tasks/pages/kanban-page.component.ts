import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksApiService } from '../services/tasks-api.service';
import { Task, TaskPayload, TaskStatus } from '../models/task.model';

type KanbanColumn = {
  key: TaskStatus;
  title: string;
};

type TaskFormModel = {
  title: string;
  description: string;
  complexity: number;
  urgency: number;
};

const EMPTY_FORM: TaskFormModel = {
  title: '',
  description: '',
  complexity: 1,
  urgency: 1
};

@Component({
  selector: 'app-kanban-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kanban-page.component.html',
  styleUrl: './kanban-page.component.scss'
})
export class KanbanPageComponent {
  private readonly tasksApi = inject(TasksApiService);
  private readonly storageKey = 'kanban-task-status-map';

  readonly columns: KanbanColumn[] = [
    { key: 'pending', title: 'Pendiente' },
    { key: 'in_progress', title: 'En progreso' },
    { key: 'completed', title: 'Completado' }
  ];

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly taskStatusMap = signal<Record<number, TaskStatus>>({});
  readonly draggingTaskId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly deletingTaskId = signal<number | null>(null);
  readonly editingTaskId = signal<number | null>(null);
  readonly formError = signal<string | null>(null);
  readonly formModel = signal<TaskFormModel>({ ...EMPTY_FORM });

  readonly pendingTasks = computed(() => this.tasksByStatus('pending'));
  readonly inProgressTasks = computed(() => this.tasksByStatus('in_progress'));
  readonly completedTasks = computed(() => this.tasksByStatus('completed'));

  constructor() {
    this.taskStatusMap.set(this.readStatusMap());
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.tasksApi.list().subscribe({
      next: (response) => {
        this.tasks.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las tareas.');
        this.loading.set(false);
      }
    });
  }

  moveTask(taskId: number, status: TaskStatus): void {
    this.taskStatusMap.update((current) => {
      const updated = { ...current, [taskId]: status };
      this.writeStatusMap(updated);
      return updated;
    });
  }

  moveLeft(taskId: number): void {
    const current = this.getTaskStatus(taskId);
    if (current === 'in_progress') this.moveTask(taskId, 'pending');
    if (current === 'completed') this.moveTask(taskId, 'in_progress');
  }

  moveRight(taskId: number): void {
    const current = this.getTaskStatus(taskId);
    if (current === 'pending') this.moveTask(taskId, 'in_progress');
    if (current === 'in_progress') this.moveTask(taskId, 'completed');
  }

  startCreate(): void {
    this.editingTaskId.set(null);
    this.formError.set(null);
    this.formModel.set({ ...EMPTY_FORM });
  }

  startEdit(task: Task): void {
    this.editingTaskId.set(task.id);
    this.formError.set(null);
    this.formModel.set({
      title: task.title,
      description: task.description ?? '',
      complexity: task.complexity,
      urgency: task.urgency
    });
  }

  cancelEdit(): void {
    this.editingTaskId.set(null);
    this.formError.set(null);
    this.formModel.set({ ...EMPTY_FORM });
  }

  saveTask(): void {
    const form = this.formModel();
    const payload: TaskPayload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      complexity: Number(form.complexity),
      urgency: Number(form.urgency)
    };

    const validationError = this.validatePayload(payload);
    if (validationError) {
      this.formError.set(validationError);
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    const editingId = this.editingTaskId();
    const request = editingId === null
      ? this.tasksApi.create(payload)
      : this.tasksApi.update(editingId, payload);

    request.subscribe({
      next: (response) => {
        const task = response.data;
        if (editingId === null) {
          this.tasks.update((current) => [task, ...current]);
          this.moveTask(task.id, 'pending');
        } else {
          this.tasks.update((current) =>
            current.map((item) => (item.id === task.id ? task : item))
          );
        }
        this.saving.set(false);
        this.cancelEdit();
      },
      error: () => {
        this.saving.set(false);
        this.formError.set('No se pudo guardar la tarea.');
      }
    });
  }

  deleteTask(taskId: number): void {
    this.deletingTaskId.set(taskId);
    this.tasksApi.delete(taskId).subscribe({
      next: () => {
        this.tasks.update((current) => current.filter((task) => task.id !== taskId));
        this.taskStatusMap.update((current) => {
          const updated = { ...current };
          delete updated[taskId];
          this.writeStatusMap(updated);
          return updated;
        });
        if (this.editingTaskId() === taskId) {
          this.cancelEdit();
        }
        this.deletingTaskId.set(null);
      },
      error: () => {
        this.deletingTaskId.set(null);
        this.error.set('No se pudo eliminar la tarea.');
      }
    });
  }

  onDragStart(taskId: number): void {
    this.draggingTaskId.set(taskId);
  }

  onDragEnd(): void {
    this.draggingTaskId.set(null);
  }

  onDropColumn(status: TaskStatus): void {
    const taskId = this.draggingTaskId();
    if (taskId === null) return;
    this.moveTask(taskId, status);
    this.draggingTaskId.set(null);
  }

  getTaskStatus(taskId: number): TaskStatus {
    return this.taskStatusMap()[taskId] ?? 'pending';
  }

  updateForm<K extends keyof TaskFormModel>(field: K, value: TaskFormModel[K]): void {
    this.formModel.update((current) => ({ ...current, [field]: value }));
  }

  columnTasks(status: TaskStatus): Task[] {
    if (status === 'pending') return this.pendingTasks();
    if (status === 'in_progress') return this.inProgressTasks();
    return this.completedTasks();
  }

  private tasksByStatus(status: TaskStatus): Task[] {
    return this.tasks().filter((task) => this.getTaskStatus(task.id) === status);
  }

  private readStatusMap(): Record<number, TaskStatus> {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Record<number, TaskStatus>;
    } catch {
      return {};
    }
  }

  private writeStatusMap(map: Record<number, TaskStatus>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(map));
  }

  private validatePayload(payload: TaskPayload): string | null {
    if (!payload.title) return 'El titulo es obligatorio.';
    if (payload.complexity < 1 || payload.complexity > 10) return 'La complejidad debe estar entre 1 y 10.';
    if (payload.urgency < 1 || payload.urgency > 10) return 'La urgencia debe estar entre 1 y 10.';
    return null;
  }
}
