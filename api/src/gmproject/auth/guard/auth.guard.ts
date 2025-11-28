import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JWT_CONSTANTS } from "../constants/jwt.constants"; 
import { RequestWithUser } from "../interfaces/requestWithUser.interface";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService
    ) {}

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('Unauthorized, invalid token');
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: JWT_CONSTANTS.secret });
            request.user = payload;
        }catch(error){
            throw new UnauthorizedException('Unauthorized, invalid token');
        }
        return true;
    }
}