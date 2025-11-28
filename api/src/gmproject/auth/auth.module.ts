import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

// Constants
import { JWT_CONSTANTS } from './constants/jwt.constants';
import { UserModule } from '../user/user.module';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [
    HashingModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: '1d' },
      // Implements RS256 algorithm for better security
      // Implements refresh tokens
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
