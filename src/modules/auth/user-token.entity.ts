import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { UserTokenDto } from '../common/dtos/user-token.dto';
import { TokenTypeEnum } from '../../constants/token-type.enum';

@Entity('users_tokens')
export class UserTokenEntity extends AbstractEntity<UserTokenDto>{
    @Column()
    userEmail: string;

    @Column({unique: true})
    token: string;

    @Column({ type:'enum', enum: TokenTypeEnum })
    type: TokenTypeEnum;

    dtoClass = UserTokenDto;
}
