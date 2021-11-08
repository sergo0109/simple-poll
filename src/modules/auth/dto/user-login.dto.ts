import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsPassword } from '../../../decorators/validators.decorators';

export class UserLoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsPassword()
    password: string;
}
