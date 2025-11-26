import { Injectable } from '@nestjs/common';
import { HttpResponse } from './core/models/http/HttpResponse.model';

@Injectable()
export class AppService {

  getHello(): HttpResponse<any> {
    return new HttpResponse<any>(true, 'Hello World!', {});
  }

}
