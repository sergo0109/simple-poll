import { UserRegisterDto } from '../../auth/dto/user-register.dto';
import { RoleEnum } from '../../../constants/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {IsEnum} from 'class-validator';

export class CreateDto extends UserRegisterDto {
    @ApiProperty({
        type: 'enum',
        enum: RoleEnum,
        enumName: 'RoleEnum',
    })
    @IsEnum(RoleEnum)
    role: RoleEnum;
}
