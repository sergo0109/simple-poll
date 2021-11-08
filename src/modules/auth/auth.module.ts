import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from '../../shared/services/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenRepository } from './user-token.repository';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: (configService: ApiConfigService) => ({
                secretOrPrivateKey: configService.authConfig.jwtSecret,
                signOptions: {
                    expiresIn: configService.authConfig.jwtExpirationTime,
                },
            }),
            inject: [ApiConfigService],
        }),
        TypeOrmModule.forFeature([ UserTokenRepository ])
    ],
    controllers: [ AuthController ],
    providers: [ AuthService, JwtStrategy, MailService ],
    exports: [ PassportModule.register({ defaultStrategy: 'jwt' }), AuthService ],
})
export class AuthModule {}
