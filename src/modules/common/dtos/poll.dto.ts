import { AbstractDto } from './abstract.dto';
import { PollEntity } from '../../poll/poll.entity';
import { VoteOptionDto } from './vote-option.dto';
import {ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PollDto extends AbstractDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiPropertyOptional()
    voteOptions?: VoteOptionDto[];

    constructor(pollEntity: PollEntity) {
        super(pollEntity);

        this.userId = pollEntity.userId;
        this.title = pollEntity.title;
        this.description = pollEntity.description;
        this.voteOptions = pollEntity.voteOptions?.map(voteOptionEntity => voteOptionEntity.toDto());
    }
}
