import {Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique} from 'typeorm';
import { VoteOptionEntity } from '../vote-option/vote-option.entity';
import { UserEntity } from '../user/user.entity';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { PollDto } from '../common/dtos/poll.dto';

@Entity('polls')
@Unique(['userId', 'title', 'description'])
export class PollEntity extends AbstractEntity<PollDto> {
    @Column()
    userId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(
        () => UserEntity,
        (userEntity) => userEntity.polls,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @OneToMany(() => VoteOptionEntity, (voteOptionEntity) => voteOptionEntity.poll)
    voteOptions: VoteOptionEntity[];

    dtoClass = PollDto;
}
