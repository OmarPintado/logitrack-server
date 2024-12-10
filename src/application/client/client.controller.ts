import { Body, Controller, Patch, Post, Request, Get } from '@nestjs/common';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { ValidRoles } from '../../domain/models/valid-roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Auth(ValidRoles.admin, ValidRoles.collaborator)
    @Post()
    async createClient(@Body() createClientDto: CreateClientDto) {
        return await this.clientService.create(createClientDto);
    }

    @Auth(ValidRoles.admin, ValidRoles.collaborator)
    @Patch(':id')
    async updateClient(@Body() updateClientDto: UpdateClientDto) {
        return await this.clientService.update(updateClientDto);
    }

    @Auth(ValidRoles.admin, ValidRoles.collaborator)
    @Get()
    async getClients(@Request() request) {
        const user = request.user;
        return this.clientService.getClients(user);
    }
}
