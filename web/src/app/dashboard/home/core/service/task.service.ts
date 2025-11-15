import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Task } from '../models/database/Task.model';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Category } from '../../../finances/core/models/database/Category.model';
import { List } from '../models/database/List.model';
import { environment } from '../../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly URL = `${environment.serever}:${environment.port}/productivity/task`;

  constructor(private readonly http: HttpClient) {}

  public getAllTask(): Observable<Task[]> {
    return this.http.get<HttpResponse>(`${this.URL}`).pipe(
      map((response: HttpResponse) => {
        // TODO Implements message toast
        // if (!response.success) {}
        return response.data;
      })
    );
  }

  public saveTask(createTaskDto: CreateTaskDto): Observable<Task> {
    return this.http.post<HttpResponse>(`${this.URL}`, createTaskDto).pipe(
      map((response: HttpResponse) => {
        return response.data;
      })
    );
  }

  public setReady(id: number, ready: boolean): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${this.URL}/setReady/${id}`, {
      ready,
    });
  }

  public getTaskListOfFilter(filter: List | Category): Observable<Task[]> {
    let id = 0;
    let type = '';
    if (filter instanceof List) {
      id = filter.id;
      type = 'List';
    } else {
      id = filter.id;
      type = 'Category';
    }
    return this.http
      .get<HttpResponse>(`${this.URL}/getTaskListOfFilter/${id}`, {
        params: new HttpParams().set('type', type),
      })
      .pipe(
        map((response: HttpResponse) => {
          return response.data;
        })
      );
  }
}
