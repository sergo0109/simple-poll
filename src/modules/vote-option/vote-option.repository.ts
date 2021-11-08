import { EntityRepository, Repository } from 'typeorm';
import {VoteOptionEntity} from "./vote-option.entity";

@EntityRepository(VoteOptionEntity)
export class VoteOptionRepository extends Repository<VoteOptionEntity> {
    async findById(voteOptionId: string): Promise<VoteOptionEntity | null> {
        return this.createQueryBuilder('voteOption')
            .where('voteOption.id = :id', {id: voteOptionId})
            .leftJoinAndSelect('voteOption.users', 'user')
            .getOne()
    }
}
