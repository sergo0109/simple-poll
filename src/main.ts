import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    ClassSerializerInterceptor,
    HttpStatus,
    UnprocessableEntityException,
    ValidationPipe,
} from '@nestjs/common';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { setupSwagger } from './setup-swagger';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';


async function bootstrap(): Promise<void> {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create(AppModule);
    const reflector = app.get(Reflector);

    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
            dismissDefaultMessages: true,
            exceptionFactory: (errors) => new UnprocessableEntityException(errors),
        }),
    );

    const configService = app.select(SharedModule).get(ApiConfigService);

    setupSwagger(app,{ version: '1.0.0' });

    const port = configService.appConfig.port;
    await app.listen(port);
    console.info(`server running on port ${port}`);
}

void bootstrap();


