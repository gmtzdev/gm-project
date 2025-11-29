import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';
import { Role } from './entities/role.entity';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new role',
    description: 'Creates a new role in the system with a unique key and optionally assigns permissions'
  })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Role key already exists' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<HttpResponse<Role>> {
    const role = await this.roleService.create(createRoleDto);
    return new HttpResponse<Role>(true, 'Role created successfully', role, 201);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all roles',
    description: 'Retrieves a list of all roles in the system'
  })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No roles found' })
  async findAll(): Promise<HttpResponse<Role []>> {
    const roles = await this.roleService.findAll();
    if(roles.length <= 0){
      return new HttpResponse<Role[]>(false, 'No roles found', [], 404);
    }
    return new HttpResponse<Role[]>(true, 'Roles retrieved successfully', roles, 200);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get role by ID',
    description: 'Retrieves a specific role by its ID including its permissions'
  })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update role',
    description: 'Updates an existing role by its ID including permissions'
  })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Role key already exists' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete role',
    description: 'Removes a role from the system by its ID'
  })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
