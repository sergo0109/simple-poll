import { EntityRepository, Repository } from 'typeorm';
import {UserEntity} from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    async findById(userId: string): Promise<UserEntity | null> {
        return this.findOne({ id: userId });
    }

    async findByEmail(email: string): Promise<UserEntity| null> {
        return this.findOne({ email });
    }
}
