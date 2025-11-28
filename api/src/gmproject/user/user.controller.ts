import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(@Body() createUserDto: CreateUserDto): Promise<HttpResponse<User>> {
    const newUserSaved = await this.userService.create(createUserDto);
    return new HttpResponse<User>(true, 'User created successfully', newUserSaved, HttpStatus.CREATED);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No users found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll(): Promise<HttpResponse<User[]>> {
    const users = await this.userService.findAll();
    if(users.length === 0){
      return new HttpResponse(false, 'No users found', [], HttpStatus.NOT_FOUND);
    }
    return new HttpResponse(true, 'Users retrieved successfully', users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findOne(@Param('id') id: string): Promise<HttpResponse<User | null>> {
    const user = await this.userService.findOne(+id);
    if(!user){
      return new HttpResponse(false, 'User not found', null, HttpStatus.NOT_FOUND);
    }
    return new HttpResponse(true, 'User retrieved successfully', user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.userService.update(+id, updateUserDto);
    if(!updated){
      return new HttpResponse(false, 'User not found', null, HttpStatus.NOT_FOUND);
    }
    return new HttpResponse(true, 'User updated successfully', updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'User could not be deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async remove(@Param('id') id: string) {
    const deleted = await this.userService.remove(+id);
    if(deleted === null){
      return new HttpResponse(false, 'User not found', null, HttpStatus.NOT_FOUND);
    }
    if(!deleted){
      return new HttpResponse(false, 'User could not be deleted', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new HttpResponse(true, 'User deleted successfully', null);
  }
}
