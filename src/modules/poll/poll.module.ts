import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {VoteOptionModule} from "../vote-option/vote-option.module";
import {PollController} from "./poll.controller";
import {PollService} from "./poll.service";
import {PollRepository} from "./poll.repository";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([PollRepository]),
        forwardRef(() => VoteOptionModule),
        forwardRef(() => UserModule),
    ],
    controllers: [PollController],
    exports: [PollService],
    providers: [PollService],
})
export class PollModule{}
