import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services

// Controllers

// Entity
import { User } from 'src/gmproject/user/entities/user.entity';
import { NavItem } from 'src/gmproject/nav-item/entities/nav-item.entity';

// Modules
import { UserModule } from 'src/gmproject/user/user.module';
import { NavItemModule } from 'src/gmproject/nav-item/nav-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, NavItem], 'gmproject'),
    UserModule,
    NavItemModule,
  ],
  controllers: [],
  providers: [],
})
export class GmprojectModule {}