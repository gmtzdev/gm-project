import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { IsUniquePermissionKeyConstraint } from './dto/validators/is-unique-permissions-key.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission], 'gmproject')
  ],
  controllers: [PermissionController],
  providers: [PermissionService, IsUniquePermissionKeyConstraint],
})
export class PermissionModule {}
