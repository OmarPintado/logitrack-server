import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { Client, Credit, Installment, User } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [CreditController],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Credit, Installment, Client, User]),
    ],
    providers: [CreditService],
})
export class CreditModule {}
