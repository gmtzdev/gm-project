import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

// Deocorators
import { Auth } from './decorators/auth.decorator';

// Enums
import { Role } from './enums/roles.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';
import { RegisterResult } from './interfaces/registerResult.interface';
import { LoginResult } from './interfaces/loginResult.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account in the system with the provided credentials'
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User already exists (email or username conflict)' })
  async register(@Body() registerDto: RegisterDto): Promise<HttpResponse<RegisterResult>> {
    const result = await this.authService.register(registerDto);
    return new HttpResponse<RegisterResult>(true, 'User registered successfully', result, HttpStatus.CREATED);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticates a user with email/username and password, returns access token'
  })
  @ApiResponse({ status: 200, description: 'Login successful, returns access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async login(@Body() loginDto: LoginDto): Promise<HttpResponse<LoginResult>> {
    const result = await this.authService.login(loginDto);
    return new HttpResponse<LoginResult>(true, 'Login successful', result, HttpStatus.OK);
  }

  @Post('profile')
  @Auth([Role.User])
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Retrieves the authenticated user\'s profile information'
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async profile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user);
  }
}
