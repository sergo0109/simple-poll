import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilsProvider } from '../../providers/utils.provider';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserUnauthenticatedException } from './exception/user-unauthenticated.exception';
import { RoleEnum } from '../../constants/role.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../../shared/services/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuid } from 'uuid';
import { UserTokenRepository } from './user-token.repository';
import { ForgotPasswordTokenNotFoundException } from './exception/forgot-password-token-not-found.exception';
import { TokenTypeEnum } from '../../constants/token-type.enum';

@Injectable()
export class AuthService {
    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ApiConfigService,
        public readonly userService: UserService,
        public readonly mailService: MailService,
        private readonly userTokenRepository: UserTokenRepository,
    ) {}

    async createToken(userId: string): Promise<TokenPayloadDto> {
        return new TokenPayloadDto({
            expiresIn: this.configService.authConfig.jwtExpirationTime,
            accessToken: await this.jwtService.signAsync({ id: userId }),
        });
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const userEntity = await this.userService.getEntityByEmail(userLoginDto.email);
        const isPasswordValid = await UtilsProvider.validateHash(
            userLoginDto.password,
            userEntity.password,
        );

        if (!isPasswordValid) {
            const description = 'password is an invalid'
            throw new UserUnauthenticatedException(description);
        }

        return userEntity;
    }

    async userLogin(userInfo: UserLoginDto | UserEntity): Promise<LoginPayloadDto> {
        let userEntity: UserEntity;
        if(userInfo instanceof UserEntity) {
            userEntity = userInfo;
        } else {
            userEntity = await this.validateUser(userInfo);
        }
        const token = await this.createToken(userEntity.id);
        const user = userEntity.toDto();
        return { user, token };
    }

    async userRegisterAndLogin(userRegisterDto: UserRegisterDto): Promise<LoginPayloadDto> {
        const userEntity = await this.userService.create({ ...userRegisterDto, role: RoleEnum.CUSTOMER });
        return this.userLogin(userEntity);
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const userEntity = await this.userService.getEntityByEmail(forgotPasswordDto.email);
        const token = uuid();
        const userTokenEntity =  this.userTokenRepository.create({
            userEmail: userEntity.email,
            token,
            type: TokenTypeEnum.FORGOT_PASSWORD,
        });

        await this.userTokenRepository.save(userTokenEntity);

        const url = new URL('localhost:3000/auth/reset-password');
        url.searchParams.append('forgotPasswordToken', token);

        await this.mailService.send({
            to: userEntity.email,
            from: 'noreply@simplepollapp.am',
            subject: 'forgot password',
            html:`
                <h3> Hello ${userEntity.fullName}!</h3>
                <p>Please use this <a href="${(url.toString())}">link</a> to reset your password.</p>
            `,
        })
    }

    async resetPassword(forgotPasswordToken: string, resetPasswordDto: ResetPasswordDto): Promise<LoginPayloadDto> {
        const userTokenEntity = await this.userTokenRepository.findByToken(forgotPasswordToken);

        if (!userTokenEntity) {
            throw new ForgotPasswordTokenNotFoundException();
        }

        const userEntity = await this.userService.resetPassword(userTokenEntity.userEmail, resetPasswordDto.newPassword);

        return this.userLogin(userEntity);
    }
}
