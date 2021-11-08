import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {VoteOptionRepository} from "./vote-option.repository";
import {VoteOptionService} from "./vote-option.service";

@Module({
    imports: [TypeOrmModule.forFeature([VoteOptionRepository])],
    providers: [VoteOptionService],
    exports: [VoteOptionService],
})
export class VoteOptionModule{}
