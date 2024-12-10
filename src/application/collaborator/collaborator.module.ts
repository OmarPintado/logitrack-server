import { Module } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CollaboratorController } from './collaborator.controller';
import { Collaborator, User } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [CollaboratorController],
    imports: [AuthModule, TypeOrmModule.forFeature([User, Collaborator])],
    providers: [CollaboratorService],
})
export class CollaboratorModule {}
