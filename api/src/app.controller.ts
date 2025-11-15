import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpResponse } from './core/models/http/HttpResponse.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('users')
  getUsers(): string[] {
    return this.appService.getUsers();
  }

  @Get()
  getHello(): HttpResponse {
    console.log('Pasa por aquí')
    return this.appService.getHello();
  }
}
