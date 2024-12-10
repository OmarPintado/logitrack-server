import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import { ValidRoles } from '../../domain/models/valid-roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { Installment } from '../../domain/entities';
import { AddPartialPaymentDto } from './dto/add-partial-payment.dto';

@Controller('installment')
export class InstallmentController {
    constructor(private readonly installmentService: InstallmentService) {}

    // Endpoint para actualizar estados
    @Patch('update-statuses')
    async updateStatuses(): Promise<void> {
        return this.installmentService.updateInstallmentStatuses();
    }

    @Auth(ValidRoles.admin, ValidRoles.collaborator)
    @Patch(':id/partial-payment')
    async addPartialPayment(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() addPartialPaymentDto: AddPartialPaymentDto,
    ): Promise<Installment> {
        const { amount } = addPartialPaymentDto;
        return this.installmentService.addPartialPayment(id, amount);
    }
}
