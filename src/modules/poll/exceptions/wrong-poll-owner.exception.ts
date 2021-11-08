import { BadRequestException } from '@nestjs/common';

export class WrongPollOwnerException extends BadRequestException {
    constructor() {
        super('wrong poll owner');
    }
}
