import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { IsUniqueRoleKeyConstraint } from './dto/validators/is-unique-role-key.validator';

@Module({
  imports: [
      TypeOrmModule.forFeature([Role], 'gmproject')
    ],
  controllers: [RoleController],
  providers: [RoleService, IsUniqueRoleKeyConstraint],
})
export class RoleModule {}
