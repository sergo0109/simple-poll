import {Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly authService: AuthService,
    ) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully login' })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        return this.authService.userLogin(userLoginDto);
    }

    @Post('/register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully Registered and login' })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
    ): Promise<LoginPayloadDto> {
        return this.authService.userRegisterAndLogin(userRegisterDto);
    }

    @Post('/forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiNoContentResponse()
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('/reset-password/:forgotPasswordToken')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully reset password' })
    async resetPassword(@Param('forgotPasswordToken') forgotPasswordToken: string, @Body() resetPasswordDto: ResetPasswordDto): Promise<LoginPayloadDto> {
        return this.authService.resetPassword(forgotPasswordToken, resetPasswordDto);
    }

}
