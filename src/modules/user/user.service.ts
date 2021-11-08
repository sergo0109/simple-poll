import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UserCreationException } from './exception/user-creation.exception';
import { UtilsProvider } from '../../providers/utils.provider';
import { UpdateUserDto } from './dto/update-user-dto';
import { UserDto } from '../common/dtos/user.dto';


@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    @Transactional()
    async create(createDto: CreateDto): Promise<UserEntity> {
        createDto.password = UtilsProvider.generateHash(createDto.password);
        const userEntity = await this.userRepository.create(createDto);
        try {
            await this.userRepository.save(userEntity);
            return userEntity;
        } catch (err) {
            throw new UserCreationException(err);
        }
    }

    @Transactional()
    async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const userEntity = await this.getEntityById(userId)
        this.userRepository.merge(userEntity, updateUserDto);

        await this.userRepository.save(userEntity);

        return userEntity.toDto();
    }


    async getEntityById(userId: string): Promise<UserEntity> {
        const userEntity = await this.userRepository.findById(userId);
        if (!userEntity) {
            throw new UserNotFoundException();
        }
        return userEntity;
    }

    async getEntityByEmail(email: string): Promise<UserEntity> {
        const userEntity = await this.userRepository.findByEmail(email);
        if (!userEntity) {
            throw new UserNotFoundException();
        }
        return userEntity;
    }

    async resetPassword(email: string, password: string): Promise<UserEntity> {
        const userEntity = await this.getEntityByEmail(email);

        await this.userRepository.merge(userEntity,{ password: UtilsProvider.generateHash(password) });

        return userEntity;
    }

    async delete(userId: string): Promise<void> {
        await this.userRepository.delete(userId);
    }
}
