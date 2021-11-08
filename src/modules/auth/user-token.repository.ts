import { EntityRepository, Repository } from 'typeorm';
import { UserTokenEntity } from './user-token.entity';
import { TokenTypeEnum } from '../../constants/token-type.enum';

@EntityRepository(UserTokenEntity)
export class UserTokenRepository extends Repository<UserTokenEntity> {
    async findByToken(token: string): Promise<UserTokenEntity | null> {
        return this.findOne({ token });
    }

    async findUserForgotTokenByEmail(email: string): Promise<UserTokenEntity | null> {
        return this.createQueryBuilder('userToken')
            .where('userToken.userEmail = :email', { email })
            .andWhere('userToken.type = :type', { type: TokenTypeEnum.FORGOT_PASSWORD })
            .getOne();
    }
}
