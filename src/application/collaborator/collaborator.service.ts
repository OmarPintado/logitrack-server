import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collaborator, User } from '../../domain/entities';
import { Repository } from 'typeorm';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';

@Injectable()
export class CollaboratorService {
    constructor(
      @InjectRepository(Collaborator)
      private readonly collaboratorRepository: Repository<Collaborator>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

    // Obtener los colaboradores de un administrador
    async getCollaborators(userId: string): Promise<Collaborator[]> {
        const admin = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['collaborators'],
        });

        if (!admin) {
            throw new NotFoundException(`Administrador con ID ${userId} no encontrado`);
        }

        return admin.collaborators;
    }

    // Crear un colaborador
    async createCollaborator(createCollaboratorDto: CreateCollaboratorDto): Promise<Collaborator> {
        const admin = await this.userRepository.findOne({
            where: { id: createCollaboratorDto.admin },
        });

        if (!admin) {
            throw new NotFoundException(`Administrador con ID ${createCollaboratorDto.admin} no encontrado`);
        }

        const collaborator = this.collaboratorRepository.create({
            ...createCollaboratorDto,
            admin,
        });

        return this.collaboratorRepository.save(collaborator);
    }
}
