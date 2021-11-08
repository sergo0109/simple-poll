import { EntityRepository, Repository } from 'typeorm';
import { PollEntity } from './poll.entity';

@EntityRepository(PollEntity)
export class PollRepository extends Repository<PollEntity> {
    async findById(pollId: string): Promise<PollEntity | null> {
        return this.createQueryBuilder('poll')
            .where('poll.id = :pollId', {pollId})
            .leftJoinAndSelect('poll.voteOptions', 'voteOption')
            .leftJoinAndSelect('voteOption.users', 'user')
            .getOne();
    }
}
