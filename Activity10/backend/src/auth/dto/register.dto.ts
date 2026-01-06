import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}