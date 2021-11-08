import { BadRequestException } from '@nestjs/common';

export class UserCreationException extends BadRequestException {
    constructor(err) {
        super('error.canNotCreatUser',err);
    }
}
