import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Gerardo Martínez',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Nombre de usuario único',
        example: 'gerardo',
        minLength: 3,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    username: string;
    
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'gerardo.martinez@example.com',
        minLength: 5,
        maxLength: 100
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'SecureP@ssw0rd',
        minLength: 8
    })
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
