import { Module } from '@nestjs/common';
import { AuthModule } from './application/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditModule } from './application/credit/credit.module';
import { InstallmentModule } from './application/installment/installment.module';
import { CollaboratorModule } from './application/collaborator/collaborator.module';
import { ClientModule } from './application/client/client.module';
import { UserModule } from './application/user/user.module';
import * as entities from './domain/entities';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            synchronize: true,
            ssl: {
                rejectUnauthorized:
                    process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            },
            entities: Object.values(entities),
        }),

        /*Application Modules*/
        AuthModule,
        CreditModule,
        InstallmentModule,
        CollaboratorModule,
        ClientModule,
        UserModule,
    ],
})
export class AppModule {}
