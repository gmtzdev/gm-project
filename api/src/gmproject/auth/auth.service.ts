import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
    ) {}

    public async register(registerDto: RegisterDto) {
        const existingUser = await this.userService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new UnauthorizedException('Email already in use');
        }
        const hashedPassword = await this.hashingService.hashPassword(registerDto.password);
        const newUser = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
        });
        const payload = { id: newUser.id, email: newUser.email};
        const token = await this.jwtService.signAsync(payload);
        return { token };
    }

    public async login(loginDto: LoginDto) { 
        const user = await this.userService.findByEmailWithPassword(loginDto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const isPasswordValid = await this.hashingService.comparePassword(loginDto.password, user.password);
        if(!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        const payload = { userId: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        return { token };
    }

    public async getProfile(user: { id: string; email: string; roles: string[]; }) {
        // Implementation for retrieving user profile goes here
    }
}
