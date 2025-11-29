import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { RoleService } from "../../role.service";


@ValidatorConstraint({ name: "isUniquePermissionKey", async: true })
@Injectable()
export class IsUniqueRoleKeyConstraint implements ValidatorConstraintInterface {
    constructor(
        private readonly roleService: RoleService
    ) {}

    async validate(key: string, args: ValidationArguments): Promise<boolean> {
        const role = await this.roleService.findByKey(key);
        if(role === null || role === undefined){
            return true;
        }
        return false;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Permission key '${validationArguments?.value}' already exists.`;
    }
}

export function IsUniqueRoleKey(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueRoleKeyConstraint,
        });
    }
}