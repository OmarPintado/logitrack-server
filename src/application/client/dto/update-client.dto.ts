import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClientDto {
    @IsUUID()
    idClient: string;

    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    dni?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;
}
