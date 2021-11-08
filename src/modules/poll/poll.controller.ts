import {Body, Controller, HttpCode, HttpStatus, Post, Get, Put, Delete} from '@nestjs/common';
import {ApiNoContentResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import { PollService } from './poll.service';
import {Auth, UUIDParam} from '../../decorators/http.decorators';
import { RoleEnum } from '../../constants/role.enum';
import { PollDto } from '../common/dtos/poll.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import {VoteDto} from "./dto/vote.dto";
import {UpdatePollDto} from "./dto/update-poll-dto";

@Controller('polls')
@ApiTags('polls')
export class PollController {
    constructor(private readonly pollService: PollService) {}

    @Post('/:pollId')
    @Auth(RoleEnum.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: PollDto,
        description: 'add vote options',
    })
    async vote(@AuthUser() customer: UserEntity, @UUIDParam('pollId') pollId: string, @Body() voteDto: VoteDto): Promise<PollDto> {
        return  this.pollService.vote(customer.id, pollId, voteDto);
    }

    @Post()
    @Auth(RoleEnum.CUSTOMER)
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({
        type: PollDto,
        description: 'Poll creation',
    })
    async create(@AuthUser() customer: UserEntity, @Body() createPollDto: CreatePollDto): Promise<PollDto> {
        return  this.pollService.create(customer.id, createPollDto);
    }

    @Get('/:id')
    async getOne(@UUIDParam('id') pollId: string): Promise<PollDto> {
        return this.pollService.getOne(pollId);
    }

    @Get()
    @Auth(RoleEnum.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: PollDto,
        description: 'all polls to vote or voted by user',
    })
    async getAllToVote(@AuthUser() customer: UserEntity): Promise<PollDto[]> {
        return this.pollService.getAllToVoteOrVotes(customer.id);
    }

    @Put('/:pollId')
    @Auth(RoleEnum.CUSTOMER)
    @ApiOkResponse({
        type: PollDto,
        description: 'Poll update',
    })
    async update(@AuthUser() customer: UserEntity, @UUIDParam('pollId') pollId: string, @Body() updatePollDto: UpdatePollDto): Promise<PollDto> {
        return this.pollService.update(customer.id, pollId, updatePollDto);
    }

    @Delete('/:pollId')
    @Auth(RoleEnum.CUSTOMER)
    @ApiNoContentResponse()
    async delete(@AuthUser() customer: UserEntity, @UUIDParam('pollId') pollId: string): Promise<void> {
        return  this.pollService.delete(customer.id, pollId);
    }
}
