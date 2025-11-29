import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services

// Controllers

// Entity
import { User } from 'src/gmproject/user/entities/user.entity';
import { NavItem } from 'src/gmproject/nav-item/entities/nav-item.entity';
import { Permission } from './permission/entities/permission.entity';
import { Role } from './role/entities/role.entity';

// Modules
import { UserModule } from 'src/gmproject/user/user.module';
import { NavItemModule } from 'src/gmproject/nav-item/nav-item.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, NavItem, Permission, Role], 'gmproject'),
    UserModule,
    NavItemModule,
    AuthModule,
    PermissionModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class GmprojectModule {}