import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksApiService } from '../../tasks/services/tasks-api.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private readonly tasksApi = inject(TasksApiService);

  pingApi(): void {
    this.tasksApi.list().subscribe({
      next: () => {},
      error: () => {}
    });
  }
}
