import type { AbstractEntity } from '../entities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AbstractDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(entity: AbstractEntity<AbstractDto>) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
