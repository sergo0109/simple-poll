import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { HttpModule } from '@nestjs/axios';


const providers = [
    ApiConfigService,
];

@Global()
@Module({
    providers,
    imports: [
        HttpModule,
    ],
    exports: [...providers, HttpModule],
})
export class SharedModule {}
