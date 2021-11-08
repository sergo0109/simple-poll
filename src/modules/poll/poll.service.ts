import {Injectable} from "@nestjs/common";
import {PollRepository} from "./poll.repository";
import {CreatePollDto} from "./dto/create-poll.dto";
import {PollDto} from "../common/dtos/poll.dto";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {VoteDto} from "./dto/vote.dto";
import {UserService} from "../user/user.service";
import {VoteOptionService} from "../vote-option/vote-option.service";
import {PollNotFoundException} from "./exceptions/poll-not-found.exception";
import {WrongPollOwnerException} from "./exceptions/wrong-poll-owner.exception";
import {UpdatePollDto} from "./dto/update-poll-dto";
import {PollEntity} from "./poll.entity";

@Injectable()
export class PollService {
    constructor(
        private readonly pollRepository: PollRepository,
        private readonly voteOptionService: VoteOptionService,
        private readonly userService: UserService,
    ) {}

    @Transactional()
    async create(userId: string, createPollDto: CreatePollDto): Promise<PollDto> {
        const pollEntity = await this.pollRepository.create({
            ...createPollDto,
            userId,
        });

        await this.pollRepository.save(pollEntity);

        pollEntity.voteOptions = await this.voteOptionService.createMany(pollEntity.id, { texts: createPollDto.voteOptionsTexts });

        return pollEntity.toDto();
    }

    async getEntityById(pollId: string): Promise<PollEntity> {
        const pollEntity = await this.pollRepository.findById(pollId);

        if(!pollEntity) {
            throw new PollNotFoundException();
        }

        return pollEntity;
    }

    async getOne(pollId: string): Promise<PollDto> {
        return (await this.getEntityById(pollId)).toDto();
    }

    @Transactional()
    async vote(userId: string, pollId: string, voteDto: VoteDto): Promise<PollDto> {
        const pollEntity = await this.pollRepository.findById(pollId);

        if (!pollEntity) {
            throw new PollNotFoundException();
        }

        const userEntity = await this.userService.getEntityById(userId);

        await this.voteOptionService.addUser(voteDto.voteOptionId, userEntity);

        pollEntity.voteOptions.find((voteOption => voteOption.id === voteDto.voteOptionId))
            .users.push(userEntity);

        return pollEntity.toDto();
    }

    async getAllToVoteOrVotes(userId: string): Promise<PollDto[]> {
        const pollEntities = await this.pollRepository.createQueryBuilder('poll')
            .leftJoinAndSelect('poll.voteOptions', 'voteOption')
            .leftJoinAndSelect(
                'voteOption.users',
                'user',
                'user.id = :userId',
                { userId },
            )
            .getMany();

        return pollEntities.map(pollEntity => pollEntity.toDto());
    }

    @Transactional()
    async update(userId: string, pollId: string, updatePollDto: UpdatePollDto): Promise<PollDto> {
        const pollEntity = await this.getEntityById(pollId);

        if (userId !== pollEntity.userId) {
            throw new WrongPollOwnerException();
        }

        await this.pollRepository.merge(pollEntity, {
            title: updatePollDto.title,
            description: updatePollDto.description,
        })

        if(updatePollDto.voteOptionsTexts) {
            pollEntity.voteOptions = await this.voteOptionService.updatePollVoteOptions(pollId, updatePollDto.voteOptionsTexts);
        }

        return pollEntity.toDto();
    }

    async delete(userId: string, pollId: string): Promise<void> {
        const pollDto = await this.getOne(pollId);
        if (userId !== pollDto.userId) {
            throw new WrongPollOwnerException();
        }
        await this.pollRepository.delete(pollId);
    }
}
