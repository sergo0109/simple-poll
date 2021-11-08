import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { contextMiddleware } from './middelwares/contex.middelware';
import { PollModule } from './modules/poll/poll.module';
import { VoteOptionModule } from './modules/vote-option/vote-option.module';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
    imports: [
        AuthModule,
        UserModule,
        PollModule,
        VoteOptionModule,
        SharedModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ApiConfigService) =>
                configService.typeOrmConfig,
            inject: [ApiConfigService],
        }),
        MailerModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ApiConfigService) =>
                configService.mailConfig,
            inject: [ApiConfigService],
        }),
    ]})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
