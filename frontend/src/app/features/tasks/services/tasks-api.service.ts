import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LaravelCollectionResponse,
  LaravelItemResponse,
  Task,
  TaskPayload
} from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private readonly http = inject(HttpClient);
  private readonly tasksUrl = `${environment.apiUrl}/v1/tasks`;

  list(): Observable<LaravelCollectionResponse<Task>> {
    return this.http.get<LaravelCollectionResponse<Task>>(this.tasksUrl);
  }

  getById(id: number): Observable<LaravelItemResponse<Task>> {
    return this.http.get<LaravelItemResponse<Task>>(`${this.tasksUrl}/${id}`);
  }

  create(payload: TaskPayload): Observable<LaravelItemResponse<Task>> {
    return this.http.post<LaravelItemResponse<Task>>(this.tasksUrl, payload);
  }

  update(id: number, payload: Partial<TaskPayload>): Observable<LaravelItemResponse<Task>> {
    return this.http.put<LaravelItemResponse<Task>>(`${this.tasksUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.tasksUrl}/${id}`);
  }
}
