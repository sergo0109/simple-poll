import {Injectable} from "@nestjs/common";
import {VoteOptionRepository} from "./vote-option.repository";
import { CreateVoteOptionsDto} from "./dto/create-vote-options.dto";
import {VoteOptionEntity} from "./vote-option.entity";
import {UserEntity} from "../user/user.entity";
import {Transactional} from "typeorm-transactional-cls-hooked";

@Injectable()
export class VoteOptionService{
    constructor(private readonly voteOptionRepository: VoteOptionRepository) {}

    async createMany(pollId: string, createVoteOptionsDto: CreateVoteOptionsDto): Promise<VoteOptionEntity[]> {
        const voteOptionsEntities = createVoteOptionsDto.texts.map(text => this.voteOptionRepository.create({
            pollId,
            text,
        }))

        await this.voteOptionRepository.save(voteOptionsEntities);

        return voteOptionsEntities;
    }

    async addUser(voteOptionId: string, userEntity: UserEntity): Promise<VoteOptionEntity> {
        const voteOptionEntity = await this.voteOptionRepository.findById(voteOptionId);
        voteOptionEntity.users.push(userEntity);
        await this.voteOptionRepository.save(voteOptionEntity);
        return voteOptionEntity;
    }

    @Transactional()
    async updatePollVoteOptions(pollId: string, voteOptionsTexts: string[]): Promise<VoteOptionEntity[]> {
        await this.voteOptionRepository.createQueryBuilder()
            .delete()
            .where('pollId = :id', { id: pollId })
            .execute();

        return this.createMany(pollId, { texts: voteOptionsTexts });
    }
}
