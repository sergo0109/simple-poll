import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateVoteOptionsDto {
    @ApiProperty()
    @IsArray()
    texts: string[];
}
