import { IsNumber, IsDate, IsUUID, IsEnum } from 'class-validator';
import { InstallmentStatus } from '../../../domain/models/installment-status.enum';

export class CreateInstallmentDto {
    @IsNumber()
    amount: number;

    @IsDate()
    dueDate: Date;

    @IsEnum(InstallmentStatus)
    status: InstallmentStatus;

    @IsUUID()
    creditId: string;
}
