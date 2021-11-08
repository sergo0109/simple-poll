import {NotFoundException} from "@nestjs/common";

export class PollNotFoundException extends NotFoundException {
    constructor() {
        super('poll not found');
    }
}
