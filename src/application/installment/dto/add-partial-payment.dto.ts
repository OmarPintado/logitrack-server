import { IsNumber, Min } from 'class-validator';

export class AddPartialPaymentDto {
    @IsNumber()
    @Min(0.1)
    amount: number;
}
