import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { IsUniquePermissionKey } from "./validators/is-unique-permissions-key.validator";

export class CreatePermissionDto {
    @ApiProperty({
        description: 'Unique identifier key for the permission',
        example: 'user.create',
        minLength: 3,
        maxLength: 50
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    @IsUniquePermissionKey()
    key: string;
    
    @ApiProperty({
        description: 'Human-readable name of the permission',
        example: 'Create User',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;
    
    @ApiProperty({
        description: 'Detailed description of what the permission allows',
        example: 'Allows creating new users in the system',
        required: false
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    description?: string;
    
    @ApiProperty({
        description: 'Module or category to which the permission belongs',
        example: 'users',
        required: false
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    module?: string;

    @ApiProperty({
        description: 'Indicates if the permission is active',
        example: true,
        default: true,
        required: false
    })
    @IsBoolean()
    isActive?: boolean;
}
