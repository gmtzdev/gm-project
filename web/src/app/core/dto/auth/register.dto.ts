export class RegisterDto {
    name: string = '';
    username: string = '';
    email: string = '';
    password: string = '';

    constructor(partial: Partial<RegisterDto>) {
        Object.assign(this, partial);
    }
}