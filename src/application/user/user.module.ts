import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities';
import { S3Service } from '../../infrastructure/shared/s3.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  imports:[AuthModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, S3Service],
})
export class UserModule {}
