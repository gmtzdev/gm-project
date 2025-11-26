import { HttpStatus } from '@nestjs/common';

export class HttpResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;

  constructor(
    success: boolean,
    message: string,
    data: T,
    status: number = HttpStatus.OK,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.status = status;
  }
}
