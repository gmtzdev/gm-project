import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpResponse } from './core/models/http/HttpResponse.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('general')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get('hello')
  getHello(): HttpResponse<any> {
    return this.appService.getHello();
  }
}
