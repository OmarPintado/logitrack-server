import { IsString, IsUUID } from 'class-validator';

export class CreateCollaboratorDto {
  @IsUUID()
  admin: string

  @IsString()
  fullName: string;

  @IsString()
  dni: string;

  @IsString()
  phone?: string;

  @IsString()
  address?: string;
}
