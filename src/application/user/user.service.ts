import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities';
import { Repository } from 'typeorm';
import { BcryptAdapter } from '../../infrastructure/adapters/bcrypt.adapter';
import { S3Service } from '../../infrastructure/shared/s3.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly s3Service: S3Service,
    ) {}

    async updateUser(idUser: string, updateUserDto: UpdateUserDto, file?: Express.Multer.File) {
        try {
            const existingUser = await this.findOne(idUser);

            if (file) {
                if (existingUser.url_profile) {
                    const fileKey = existingUser.url_profile.split('/').pop();
                    await this.s3Service.deleteFile(fileKey);
                }
                updateUserDto.url_profile = await this.s3Service.uploadFile(file);
            }

            await this.userRepository.update(idUser, updateUserDto);

            return await this.findOne(idUser);

        } catch (error) {
            throw new BadRequestException(`${error.message}`);
        }
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}
