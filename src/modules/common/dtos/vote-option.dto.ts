import { AbstractDto } from './abstract.dto';
import { VoteOptionEntity } from '../../vote-option/vote-option.entity';
import {ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VoteOptionDto extends AbstractDto {
    @ApiProperty()
    pollId: string;

    @ApiProperty()
    text: string;

    @ApiPropertyOptional()
    votedUserNames?: string[];

    constructor(voteOptionEntity: VoteOptionEntity) {
        super(voteOptionEntity);

        this.pollId = voteOptionEntity.pollId;
        this.text = voteOptionEntity.text;
        this.votedUserNames = voteOptionEntity.users?.map(user => user.userName);
    }
}
