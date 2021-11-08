import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, Unique} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {AbstractEntity} from "../common/entities/abstract.entity";
import {VoteOptionDto} from "../common/dtos/vote-option.dto";
import {PollEntity} from "../poll/poll.entity";

@Entity('vote_options')
@Unique(['pollId', 'text'])
export class VoteOptionEntity extends AbstractEntity<VoteOptionDto> {
    @Column()
    text: string;

    @Column()
    pollId: string;

    @ManyToOne(
        () => PollEntity,
        (pollEntity) => pollEntity.voteOptions,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'poll_id' })
    poll: PollEntity;

    @ManyToMany(
        () => UserEntity,
        userEntity => userEntity.voteOptions,
    )
    @JoinTable({ name: 'vote_options_users'})
    users: UserEntity[];

    dtoClass = VoteOptionDto;
}
