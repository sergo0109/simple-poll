import { AbstractDto } from './abstract.dto';
import { UserEntity } from '../../user/user.entity';
import { RoleEnum } from '../../../constants/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StorageProvider } from '../../../providers/storage.provider';

export class UserDto extends AbstractDto {
    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    userName: string;

    @ApiPropertyOptional()
    avatar?: string

    @ApiProperty({
        type: 'enum',
        enum: RoleEnum,
        enumName: 'RoleEnum',
    })
    role: RoleEnum;

    constructor(userEntity: UserEntity) {
        super(userEntity);

        this.fullName = userEntity.fullName;
        this.email = userEntity.email;
        this.userName = userEntity.userName;
        this.role = userEntity.role;
        this.avatar = userEntity.avatar ? StorageProvider.AVATARS_DIR_PATH + userEntity.avatar : undefined;
    }
}
