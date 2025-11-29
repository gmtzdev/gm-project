import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';
import { Permission } from './entities/permission.entity';


@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new permission',
    description: 'Creates a new permission in the system with a unique key'
  })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Permission key already exists' })
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<HttpResponse<Permission>> {
    const permission = await this.permissionService.create(createPermissionDto);
    return new HttpResponse<Permission>(true, 'Permission created successfully', permission, 201);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all permissions',
    description: 'Retrieves a list of all permissions in the system'
  })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No permissions found' })
  async findAll(): Promise<HttpResponse<Permission[]>> {
    const permissions = await this.permissionService.findAll();
    if(permissions.length <= 0){
      return new HttpResponse<Permission[]>(false, 'No permissions found', [], 404);
    }
    return new HttpResponse<Permission[]>(true, 'Permissions retrieved successfully', permissions, 201);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get permission by ID',
    description: 'Retrieves a specific permission by its ID'
  })
  @ApiResponse({ status: 200, description: 'Permission retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update permission',
    description: 'Updates an existing permission by its ID'
  })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 409, description: 'Permission key already exists' })
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete permission',
    description: 'Removes a permission from the system by its ID'
  })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
