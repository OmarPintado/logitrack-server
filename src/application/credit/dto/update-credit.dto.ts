import { IsOptional, IsNumber, IsDate } from 'class-validator';

export class UpdateCreditDto {
    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsNumber()
    interestRate?: number;

    @IsOptional()
    @IsDate()
    dueDate?: Date;
}
