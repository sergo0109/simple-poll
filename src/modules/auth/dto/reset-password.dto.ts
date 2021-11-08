import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../../decorators/validators.decorators';

export class ResetPasswordDto {
    @ApiProperty()
    @IsPassword()
    newPassword: string;
}
