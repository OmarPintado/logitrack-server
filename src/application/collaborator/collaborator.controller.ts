import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { ValidRoles } from '../../domain/models/valid-roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { User } from '../../domain/entities';

@Controller('collaborator')
export class CollaboratorController {
    constructor(private readonly collaboratorService: CollaboratorService) {}

    // Obtener colaboradores de un administrador
    @Auth(ValidRoles.admin)
    @Get()
    async getCollaborators(@Request() request) {
        return this.collaboratorService.getCollaborators(request.user.id);
    }

    // Crear un colaborador
    @Auth(ValidRoles.admin)
    @Post()
    async createCollaborator(
      @Body() createCollaboratorDto: CreateCollaboratorDto,
    ) {
        return this.collaboratorService.createCollaborator(createCollaboratorDto);
    }
}
