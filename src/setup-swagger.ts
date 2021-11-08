import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
    app: INestApplication,
    options: { version: string },
): void {
    const documentBuilder = new DocumentBuilder()
        .setTitle('API')
        .setVersion(options.version)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);
    SwaggerModule.setup('documentation', app, document);

    console.info(
        'Swagger documentation is running. You can access it bt /documentation url',
    );
}
