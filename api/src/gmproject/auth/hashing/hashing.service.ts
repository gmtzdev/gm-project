import { Injectable } from "@nestjs/common";

import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
    private readonly saltOrRounds = 10;

    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltOrRounds);
    }

    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}