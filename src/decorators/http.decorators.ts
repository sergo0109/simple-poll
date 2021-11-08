import {
    applyDecorators,
    Param,
    ParseUUIDPipe,
    PipeTransform,
    SetMetadata,
    Type,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { RoleEnum } from '../constants/role.enum';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guars/auth.guard';
import { RolesGuard } from '../guars/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user.interceptor';

export function Auth(...roles: RoleEnum[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, RolesGuard),
        ApiBearerAuth(),
        UseInterceptors(AuthUserInterceptor),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function UUIDParam(property: string, ...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator {
    return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
