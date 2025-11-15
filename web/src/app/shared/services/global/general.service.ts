import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '../../models/http/HttpResponse.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private URL: string = `${environment.serever}:${environment.port}`;

  constructor(private http: HttpClient) {}

  public getNavItems(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/navitem`);
  }
}
