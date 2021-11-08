import { AbstractDto } from './abstract.dto';
import { UserTokenEntity } from '../../auth/user-token.entity';
import { TokenTypeEnum } from '../../../constants/token-type.enum';

export class UserTokenDto extends AbstractDto {
    userEmail: string;
    token: string;
    type: TokenTypeEnum;

    constructor(userTokenEntity: UserTokenEntity) {
        super(userTokenEntity);

        this.userEmail = userTokenEntity.userEmail;
        this.token = userTokenEntity.token;
        this.type = userTokenEntity.type;
    }
}
