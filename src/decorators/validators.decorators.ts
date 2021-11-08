import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { trim, isNumber } from 'lodash';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
    return (object, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isPassword',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string, _args: ValidationArguments): boolean {
                    if(value.length < 8){
                        return false;
                    }
                    return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
                },
                defaultMessage(): string {
                    return 'error.invalidPassword'
                }
            },
        });
    };
}

export function IsFullName(validationOptions?: ValidationOptions): PropertyDecorator {
    return (object, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isFullName',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string, _args: ValidationArguments): boolean {
                    const trimValue = trim(value);
                    if(trimValue){
                        const names = trimValue.split(' ');
                        const regExp = /^[A-Za-z]+$/;
                        if (names.length === 2 && regExp.test(names[0]) && regExp.test(names[1])) {
                            return true;
                        }
                    }
                    return false;
                },
                defaultMessage(): string {
                    return 'error.invalidFullName'
                }
            },
        });
    };
}

export function IsUserName(validationOptions?: ValidationOptions): PropertyDecorator {
    return (object, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isUserName',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string, _args: ValidationArguments): boolean {
                    const trimValue = trim(value);
                    if(trimValue){
                        const regExp = /^[A-Za-z]+$/;
                        if (trimValue.length > 6 && regExp.test(trimValue)) {
                            return true;
                        }
                    }
                    return false;
                },
                defaultMessage(): string {
                    return 'error.invalidUserName';
                }
            },
        });
    };
}

export function IsPrice(validationOptions?: ValidationOptions): PropertyDecorator {
    return (object, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isPrice',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: number, _args: ValidationArguments): boolean {
                    return (isNumber(value) && value >= 0 && Math.floor(value) < 1000 && value.toString().length < 7)
                },
                defaultMessage(): string {
                    return 'error.invalidPrice'
                }
            },
        });
    };
}
