import { Min, IsNumber, IsDate, IsUUID } from 'class-validator';

export class CreateCreditDto {
    @IsNumber()
    amount: number;

    @IsNumber()
    interestRate: number;

    @IsDate()
    dueDate: Date;

    @IsUUID()
    collaboratorId: string;

    @IsUUID()
    clientId: string;

    @IsNumber()
    @Min(1)
    numInstallments: number;
}
