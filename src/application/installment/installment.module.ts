import { Module } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import { InstallmentController } from './installment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installment, PartialPayment } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [InstallmentController],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Installment, PartialPayment]),
    ],
    providers: [InstallmentService],
})
export class InstallmentModule {}
