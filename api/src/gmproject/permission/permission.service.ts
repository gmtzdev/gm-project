import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionService {

  constructor(
    @InjectRepository(Permission, 'gmproject')
    private readonly permissionRepository: Repository<Permission>
  ){}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    const result = await this.permissionRepository.find();
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }

  findByKey(key: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({ where: { key } });
  }


  findByUserId(id: number) {
    return this.permissionRepository
      .createQueryBuilder('permission')
      .innerJoin('permission.users', 'user', 'user.id = :userId', { userId: id })
      .getMany();
  }
}
