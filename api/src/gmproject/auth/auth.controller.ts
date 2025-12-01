import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

// Deocorators
import { Auth } from './decorators/auth.decorator';

// Enums
import { Role } from './enums/roles.enum';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';
import { RegisterResult } from './interfaces/registerResult.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') 
  async register(@Body() registerDto: RegisterDto): Promise<HttpResponse<RegisterResult>> {
    const result = await this.authService.register(registerDto);
    return new HttpResponse<RegisterResult>(true, 'User registered successfully', result, HttpStatus.CREATED);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('profile')
  @Auth([Role.User])
  async profile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user);
  }
}
