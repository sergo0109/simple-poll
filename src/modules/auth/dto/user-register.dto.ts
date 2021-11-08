import { UserLoginDto } from './user-login.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsFullName, IsUserName } from '../../../decorators/validators.decorators';

export class UserRegisterDto extends UserLoginDto {
    @ApiProperty()
    @IsFullName()
    fullName: string;

    @ApiProperty()
    @IsUserName()
    userName: string;
}
