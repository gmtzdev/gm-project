import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, ArrayUnique, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { IsUniqueRoleKey } from "./validators/is-unique-role-key.validator";

export class CreateRoleDto {
    @ApiProperty({
        description: 'Unique identifier key for the role',
        example: 'admin',
        minLength: 3,
        maxLength: 50
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    @IsUniqueRoleKey()
    key: string;
    
    @ApiProperty({
        description: 'Human-readable name of the role',
        example: 'Administrator',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(3)
    @MaxLength(100)
    name: string;
    
    @ApiProperty({
        description: 'Detailed description of the role',
        example: 'Full access to all system features and settings',
        required: false
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    description?: string;

    @ApiProperty({
        description: 'Indicates if the role is active',
        example: true,
        default: true,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({
        description: 'Array of permission IDs to assign to this role',
        example: [1],
        type: [Number],
        required: false
    })
    @IsOptional()
    @IsArray({ message: 'permissionIds must be an array' })
    @ArrayNotEmpty({ message: 'permissionIds array should not be empty if provided' })
    @ArrayUnique({ message: 'permissionIds must contain unique values' })
    @IsInt({ each: true, message: 'Each permission ID must be an integer' })
    @IsPositive({ each: true, message: 'Each permission ID must be a positive number' })
    @Type(() => Number)
    permissionIds?: number[];
}
