import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PermissionService } from "../../permission.service";

@ValidatorConstraint({ name: "isUniquePermissionKey", async: true })
@Injectable()
export class IsUniquePermissionKeyConstraint implements ValidatorConstraintInterface {
    constructor(
        private readonly permissionService: PermissionService
    ) {}

    async validate(key: string, args: ValidationArguments): Promise<boolean> {
        const permission = await this.permissionService.findByKey(key);
        if(permission === null || permission === undefined){
            return true;
        }
        return false;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Permission key '${validationArguments?.value}' already exists.`;
    }
}

export function IsUniquePermissionKey(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniquePermissionKeyConstraint,
        });
    }
}