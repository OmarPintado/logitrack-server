import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client, Credit, User } from '../../domain/entities';

@Module({
    controllers: [ClientController],
    imports: [AuthModule, TypeOrmModule.forFeature([Client, Credit, User])],
    providers: [ClientService],
})
export class ClientModule {}
