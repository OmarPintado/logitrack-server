import { Body, Controller, Post } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../../domain/models/valid-roles.enum';

@Controller('credit')
export class CreditController {
    constructor(private readonly creditService: CreditService) {}

    @Auth(ValidRoles.admin, ValidRoles.collaborator)
    @Post()
    async create(@Body() createCreditDto: CreateCreditDto) {
        return await this.creditService.create(createCreditDto);
    }
}
