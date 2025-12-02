import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { RegisterResult } from './interfaces/registerResult.interface';
import { LoginResult } from './interfaces/loginResult.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
    ) {}

    public async register(registerDto: RegisterDto): Promise<RegisterResult> {
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
        const user = await this.userService.findById(newUser.id);
        return { user,  token };
    }

    public async login(loginDto: LoginDto): Promise<LoginResult> { 
        const userwp = await this.userService.findByEmailWithPassword(loginDto.email);
        if (!userwp) throw new UnauthorizedException('Invalid credentials');
        const isPasswordValid = await this.hashingService.comparePassword(loginDto.password, userwp.password);
        if(!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        const user = await this.userService.findById(userwp.id);
        const payload = { id: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        return { user, token };
    }

    public async getProfile(user: { id: string; email: string; roles: string[]; }) {
        // Implementation for retrieving user profile goes here
    }
}
