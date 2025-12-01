import { User } from "src/gmproject/user/entities/user.entity";

export interface RegisterResult {
    user: User;
    token: string;
}