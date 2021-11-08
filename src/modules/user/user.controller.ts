import {Body, Controller, Delete, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../decorators/http.decorators';
import { RoleEnum } from '../../constants/role.enum';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from './user.entity';
import {UpdateUserDto } from './dto/update-user-dto';
import { UserDto } from '../common/dtos/user.dto';
import { IFile } from '../common/interfaces/IFile';
import { ApiFile } from '../../decorators/swagger.decorators';
import { StorageProvider } from '../../providers/storage.provider';
import {ApiConsumes, ApiNoContentResponse} from '@nestjs/swagger';

@Controller('users')
export class UserController{
    constructor(public readonly userService: UserService) {}

    @Put()
    @UseInterceptors(FileInterceptor('avatar', StorageProvider.uploadFileOptions))
    @Auth(RoleEnum.CUSTOMER)
    @ApiConsumes('multipart/form-data')
    @ApiFile([{ name: 'avatar' }], { okResponseData: {
            type: UserDto,
            description: 'update user',
    }})
    async update(
        @AuthUser() customer: UserEntity,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile() avatar?: IFile,
    ): Promise<UserDto> {
        updateUserDto.avatar = avatar?.filename;
        return  this.userService.update(customer.id, updateUserDto);
    }

    @Delete()
    @Auth(RoleEnum.CUSTOMER)
    @ApiNoContentResponse()
    async delete(@AuthUser() customer: UserEntity): Promise<void> {
        return  this.userService.delete(customer.id);
    }
}
