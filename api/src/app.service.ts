import { Injectable } from '@nestjs/common';
import { HttpResponse } from './core/models/http/HttpResponse.model';

@Injectable()
export class AppService {
  getUsers(): string[] {
    return ['lalo', 'laura'];
  }
  getHello(): HttpResponse {
    return new HttpResponse(true, 'Hello World!', {});
  }
}
