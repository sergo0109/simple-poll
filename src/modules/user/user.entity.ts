import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { UserDto } from '../common/dtos/user.dto';
import { RoleEnum } from '../../constants/role.enum';
import {PollEntity} from "../poll/poll.entity";
import {VoteOptionEntity} from "../vote-option/vote-option.entity";

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto>{
    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    userName: string;

    @Column({ unique: true, nullable: true })
    avatar: string;

    @Column()
    password: string;

    @Column({ type:'enum', enum: RoleEnum })
    role: RoleEnum;

    @OneToMany(
        () => PollEntity,
        (pollEntity) => pollEntity.user,
    )
    polls: PollEntity[];

    @ManyToMany(
        () => VoteOptionEntity,
        (voteOptionEntity) => voteOptionEntity.users,
    )
    voteOptions: VoteOptionEntity[];

    dtoClass = UserDto;
}
